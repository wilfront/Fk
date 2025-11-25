// src/app/api/admin/login/route.jsx (VERSÃO FINAL)

import { NextResponse } from "next/server";
// Assumindo que você está usando a importação nomeada para resolver o erro anterior.
import { AdminApp } from "@/lib/firebaseAdmin"; 

// 🚨 Corrigindo a variável de ambiente
const FIREBASE_API_KEY = process.env.NEXT_PUBLIC_FIREBASE_API_KEY; 

export async function POST(req) {
  const { email, senha } = await req.json();
  
  console.log("🔍 API LOGIN CHAMADA - Email:", email);

  try {
    // 1. AUTENTICAÇÃO VIA API REST (VALIDA SENHA)
    const firebaseAuthUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${FIREBASE_API_KEY}`;
    
    const authRes = await fetch(firebaseAuthUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: email,
        password: senha, 
        returnSecureToken: true,
      }),
    });

    const authData = await authRes.json();

    if (!authRes.ok) {
      console.error("❌ ERRO NA AUTENTICAÇÃO FIREBASE:", authData.error?.message || 'Erro desconhecido');
      // 🚨 MUDANÇA: RETORNA DIRETAMENTE se a autenticação falhar
      return NextResponse.json({ error: "Email ou senha inválidos" }, { status: 401 }); 
    }

    const uid = authData.localId; 

    // 2. VERIFICAÇÃO DE ADMIN
    if (email === process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
      console.log("✅ Email é ADMIN autorizado");
      
      // 3. CRIAÇÃO DO TOKEN CUSTOMIZADO
      // 💡 MUDANÇA: Usando a instância importada (AdminApp)
      const token = await AdminApp.auth().createCustomToken(uid); 
      console.log("✅ Token customizado criado:", token.substring(0, 20) + "...");

      const res = NextResponse.json({ 
        ok: true,
        token: token
      });

      res.cookies.set({
        name: "adminToken",
        value: token,
        path: "/",
        httpOnly: true,
        maxAge: 60 * 60,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
      });

      console.log("✅ RESPOSTA ENVIADA COM SUCESSO");
      return res; // <-- Retorno sucesso (200)
      
    } else {
      console.log("❌ Email NÃO é admin.");
      return NextResponse.json({ error: "Usuário não autorizado" }, { status: 403 }); // <-- Retorno não autorizado (403)
    }
    
  } catch (err) {
    // 🚨 MUDANÇA: Este catch deve apenas lidar com erros de rede/servidor inesperados
    console.error("❌ ERRO INESPERADO NA API:", err.message);
    return NextResponse.json({ error: "Erro de servidor. Tente novamente." }, { status: 500 }); // <-- Retorno erro (500)
  }
}