import { NextResponse } from "next/server";
import { AdminApp } from "@/lib/firebaseAdmin";

const FIREBASE_API_KEY = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

export async function POST(req) {
  const { email, senha } = await req.json();

  try {
    // 1. Autenticação via REST
    const firebaseAuthUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${FIREBASE_API_KEY}`;

    const authRes = await fetch(firebaseAuthUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        password: senha,
        returnSecureToken: true,
      }),
    });

    const authData = await authRes.json();

    if (!authRes.ok) {
      return NextResponse.json({ error: "Email ou senha inválidos" }, { status: 401 });
    }

    const uid = authData.localId;

    // 2. Verificação de admin
    if (email === process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
      const token = await AdminApp.auth().createCustomToken(uid);

      const res = NextResponse.json({ ok: true, token });

      res.cookies.set("adminToken", token, {
        path: "/",
        httpOnly: true,
        maxAge: 60 * 60,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
      });

      return res;
    }

    return NextResponse.json({ error: "Usuário não autorizado" }, { status: 403 });
  } catch (err) {
    return NextResponse.json({ error: "Erro de servidor. Tente novamente." }, { status: 500 });
  }
}
