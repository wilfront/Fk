"use client";
import { useState } from "react";

export default function CadastrarCliente() {
  const [form, setForm] = useState({ nome: "", email: "", senha: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("/api/auth/cadastrar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });

    const data = await res.json();

    if (data.ok) {
      alert("Conta criada com sucesso!");
      window.location.href = "/login";
    } else {
      alert("Erro: " + data.error);
    }
  };

  return (
    <div className="login-container">
      <h1>Criar conta</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Seu nome"
          value={form.nome}
          onChange={(e) => setForm({ ...form, nome: e.target.value })}
          required
        />

        <input
          type="email"
          placeholder="Seu email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />

        <input
          type="password"
          placeholder="Crie uma senha"
          value={form.senha}
          onChange={(e) => setForm({ ...form, senha: e.target.value })}
          required
        />

        <button type="submit">Cadastrar</button>
      </form>
    </div>
  );
}
