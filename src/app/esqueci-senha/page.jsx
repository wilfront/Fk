"use client";
import { useState } from "react";

export default function ResetSenha() {
  const [email, setEmail] = useState("");

  const handleReset = async (e) => {
    e.preventDefault();

    const res = await fetch("/api/auth/reset", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email })
    });

    const data = await res.json();

    if (data.ok) {
      alert("Email de recuperação enviado!");
    } else {
      alert("Erro: " + data.error);
    }
  };

  return (
    <div className="login-container">
      <h1>Recuperar senha</h1>

      <form onSubmit={handleReset}>
        <input
          type="email"
          placeholder="Digite seu email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <button type="submit">Enviar link</button>
      </form>
    </div>
  );
}
