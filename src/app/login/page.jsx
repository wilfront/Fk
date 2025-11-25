"use client";

import { useState, useEffect } from "react";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { app } from "@/lib/firebase";
import { useRouter, useSearchParams } from "next/navigation";
import "./login.css";

export default function UserLoginPage() {
  const [modo, setModo] = useState("login");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmaSenha, setConfirmaSenha] = useState("");
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const auth = getAuth(app);

  // Lê o parâmetro "modo" da URL
  useEffect(() => {
    const modoUrl = searchParams.get("modo");
    if (modoUrl === "cadastro" || modoUrl === "reset") {
      setModo(modoUrl);
    }
  }, [searchParams]);

  async function handleSubmit(e) {
    e.preventDefault();
    setErro("");
    setSucesso("");

    try {
      if (modo === "login") {
        await signInWithEmailAndPassword(auth, email, senha);
        router.push("/");
      } else if (modo === "cadastro") {
        if (senha !== confirmaSenha) {
          setErro("As senhas não coincidem.");
          return;
        }
        await createUserWithEmailAndPassword(auth, email, senha);
        setSucesso("Cadastro realizado com sucesso! Faça login.");
        setModo("login");
        setEmail("");
        setSenha("");
        setConfirmaSenha("");
      } else if (modo === "reset") {
        await sendPasswordResetEmail(auth, email);
        setSucesso("Email de redefinição de senha enviado!");
        setEmail("");
      }
    } catch (error) {
      setErro(error.message);
    }
  }

  return (
    <div className="login-container">
      <h1>
        {modo === "login" && "Entrar"}
        {modo === "cadastro" && "Cadastro de Usuário"}
        {modo === "reset" && "Recuperar Senha"}
      </h1>

      <form className="login-form" onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Seu email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        {modo !== "reset" && (
          <input
            type="password"
            placeholder="Sua senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />
        )}

        {modo === "cadastro" && (
          <input
            type="password"
            placeholder="Confirme a senha"
            value={confirmaSenha}
            onChange={(e) => setConfirmaSenha(e.target.value)}
            required
          />
        )}

        {erro && <p className="erro">{erro}</p>}
        {sucesso && <p className="sucesso">{sucesso}</p>}

        <button type="submit">
          {modo === "login" && "Entrar"}
          {modo === "cadastro" && "Cadastrar"}
          {modo === "reset" && "Enviar email"}
        </button>
      </form>

      <div className="login-links">
        {modo === "login" && (
          <>
            <p onClick={() => setModo("cadastro")}>
              Não possui conta? Cadastre-se
            </p>
            <p onClick={() => setModo("reset")}>Esqueceu a senha?</p>
          </>
        )}

        {(modo === "cadastro" || modo === "reset") && (
          <p onClick={() => setModo("login")}>Voltar ao login</p>
        )}
      </div>
    </div>
  );
}
