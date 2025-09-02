// src/AuthForm.jsx
import { useState } from "react";
import { auth, db } from "./firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "firebase/auth";

export default function AuthForm({ onLogin }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isRegister) {
        // Register user baru
        const userCred = await createUserWithEmailAndPassword(auth, email, password);

        // Simpan displayName ke profile auth
        await updateProfile(userCred.user, { displayName: name });
      } else {
        // Login user
        await signInWithEmailAndPassword(auth, email, password);
      }
      onLogin(); // callback kalau sukses
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="auth-form">
      <h2>{isRegister ? "Register" : "Login"}</h2>
      <form onSubmit={handleSubmit}>
        {isRegister && (
          <>
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <br />
          </>
        )}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <br />
        <input
          type="password"
          placeholder="Password (min 6 char)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <br />
        <button type="submit">{isRegister ? "Register" : "Login"}</button>
      </form>
      <p>
        {isRegister ? "Sudah punya akun?" : "Belum punya akun?"}{" "}
        <button onClick={() => setIsRegister(!isRegister)}>
          {isRegister ? "Login di sini" : "Register di sini"}
        </button>
      </p>
    </div>
  );
}
