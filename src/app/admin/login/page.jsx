"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import "./admin-login.css"; // ajuste o caminho conforme sua estrutura

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const router = useRouter();

  async function handleLogin(e) {
    e.preventDefault();
    setErro("");

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });

      const data = await res.json();

      if (res.ok && data.token) {
        localStorage.setItem("adminToken", data.token);
        router.push("/admin");
      } else {
        setErro(data.error || "Erro ao fazer login");
      }
    } catch (err) {
      setErro("Ocorreu um erro. Tente novamente.");
    }
  }

  return (
    <div className="admin-login-container">
      <h1>Login do Admin</h1>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={e => setSenha(e.target.value)}
          required
        />
        {erro && <p className="erro">{erro}</p>}
        <button type="submit">Entrar</button>
      </form>
    </div>
  );
}
