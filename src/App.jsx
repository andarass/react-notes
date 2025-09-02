import { useState, useEffect } from 'react'
import { auth, db } from "./firebase";
import { collection, addDoc, query, where, deleteDoc, doc, onSnapshot, updateDoc, } from "firebase/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth";
import AuthForm from "./AuthForm";
import './App.css'

function App() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [user, setUser] = useState(null);
  const [editingNote, setEditingNote] = useState(null);

  // cek user login / logout
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsubscribe();
  }, []);

  // realtime listener untuk notes
  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, "notes"), where("uid", "==", user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNotes(notesData);
    });

    return () => unsubscribe();
  }, [user]);

  if (!user) {
    return <AuthForm onLogin={() => {}} />;
  }

  // tambah atau update catatan
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    if (editingNote) {
      // 🔹 UPDATE note
      const noteRef = doc(db, "notes", editingNote.id);
      await updateDoc(noteRef, {
        title,
        content,
      });
      setEditingNote(null);
    } else {
      // 🔹 ADD note
      await addDoc(collection(db, "notes"), {
        title,
        content,
        uid: user.uid,
        createdAt: Date.now(),
      });
    }

    setTitle("");
    setContent("");
  };

  // hapus catatan
  const deleteNote = async (id) => {
    await deleteDoc(doc(db, "notes", id));
  };

  // mulai edit catatan
  const startEdit = (note) => {
    setEditingNote(note);
    setTitle(note.title);
    setContent(note.content);
  };

  return (
    <div className="page">
      <h1>Welcome to React Notes <br/>{user.displayName}✨</h1>
      <p>You can freely make your own notes here. Let's be more productive today!</p>
      <div className="container">
        {/* form tambah/edit */}
        <form onSubmit={handleSubmit} className="card">
          <input
            type="text"
            placeholder="Judul catatan"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            placeholder="Isi catatan..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <button type="submit">
            {editingNote ? "Update Catatan" : "Tambah Catatan"}
          </button>
          {editingNote && (
            <button
              type="button"
              onClick={() => {
                setEditingNote(null);
                setTitle("");
                setContent("");
              }}
            >
              Batal
            </button>
          )}
        </form>

        {/* list notes */}
        <div className="notes-list">
          {notes.length === 0 ? (
            <p className="empty">Belum ada catatan.</p>
          ) : (
            notes.map((note) => (
              <div key={note.id} className="note-item">
                <h3>{note.title}</h3>
                <p>{note.content}</p>
                <button onClick={() => startEdit(note)}>Edit</button>
                <button onClick={() => deleteNote(note.id)}>Hapus</button>
              </div>
            ))
          )}
        </div>
      </div>
      <button className="logout" onClick={() => signOut(auth)}>Logout</button>
    </div>
  );
}

export default App;