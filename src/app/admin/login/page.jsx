"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import "../../admin/login/admin-login.css";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const router = useRouter();

  async function handleLogin(e) {
    e.preventDefault();
    setErro("");
    console.log("📤 Tentando fazer login com:", email);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });

      console.log("📥 Status da resposta:", res.status);
      const data = await res.json();
      console.log("📥 Dados da resposta:", data);

      if (res.ok && data.token) {
        console.log("✅ Login OK - Salvando token");
        localStorage.setItem("adminToken", data.token);
        console.log("✅ Token salvo no localStorage");
        
        console.log("🔄 Redirecionando para /admin...");
        await router.push("/admin");
        console.log("✅ Router.push executado");
      } else {
        console.log("❌ Login falhou:", data.error);
        setErro(data.error || "Erro ao fazer login");
      }
    } catch (err) {
      console.error("❌ ERRO NA REQUISIÇÃO:", err);
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