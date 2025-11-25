// src/app/api/products/[id]/route.js
import { NextResponse } from 'next/server';
import { doc, deleteDoc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase'; // Importa a instância do Firestore

// Função para obter o ID do URL (ex: /api/products/123 -> id = 123)
function getProductId(request) {
  // A URL da requisição (request.url) será algo como http://localhost:3000/api/products/123
  // Tentamos extrair o ID da parte final da URL.
  const urlParts = request.url.split('/');
  return urlParts.pop(); // Retorna o último segmento (o ID)
}

// ----------------------------------------------------
// DELETE (Excluir Produto)
// ----------------------------------------------------
export async function DELETE(request) {
  const id = getProductId(request);
  console.log(`🗑️ [API DELETE] Tentando deletar produto com ID: ${id}`);
  
  if (!id) {
    console.error('❌ [API DELETE] ID do produto não fornecido.');
    return NextResponse.json({ message: 'ID do produto não fornecido' }, { status: 400 });
  }

  try {
    // 1. Cria a referência ao documento na coleção 'produtos'
    const docRef = doc(db, 'produtos', id);
    
    // 2. Tenta deletar o documento
    await deleteDoc(docRef);

    console.log(`✅ [API DELETE] Produto deletado com sucesso! ID: ${id}`);
    
    // Retorna uma resposta de sucesso sem conteúdo
    return NextResponse.json({ message: 'Produto excluído com sucesso' }, { status: 200 });
    
  } catch (error) {
    // 🚨 ESTE LOG É O MAIS IMPORTANTE
    console.error(`❌ ERRO CRÍTICO ao deletar produto (${id}):`, error.message, 'Detalhes:', error); 
    
    // Verifique o console do backend para ver se é um erro de permissão do Firebase.
    return NextResponse.json({ message: 'Erro ao deletar produto no banco de dados' }, { status: 500 });
  }
}

// ----------------------------------------------------
// PUT (Atualizar Produto) - Implementação adicional para edição
// ----------------------------------------------------
export async function PUT(request) {
  const id = getProductId(request);
  const data = await request.json();
  const precoNumerico = parseFloat(data.preco);

  console.log(`✏️ [API PUT] Tentando atualizar produto com ID: ${id}`);

  if (!id) {
    return NextResponse.json({ message: 'ID do produto não fornecido para atualização' }, { status: 400 });
  }

  try {
    const docRef = doc(db, 'produtos', id);
    
    // Verifica se o documento existe antes de tentar atualizar (opcional, mas recomendado)
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      return NextResponse.json({ message: 'Produto não encontrado' }, { status: 404 });
    }

    // Atualiza o documento
    await updateDoc(docRef, {
      ...data,
      preco: precoNumerico,
      updatedAt: new Date(),
    });

    console.log(`✅ [API PUT] Produto atualizado com sucesso! ID: ${id}`);
    return NextResponse.json({ message: 'Produto atualizado com sucesso' }, { status: 200 });

  } catch (error) {
    console.error(`❌ ERRO CRÍTICO ao atualizar produto (${id}):`, error.message, 'Detalhes:', error);
    return NextResponse.json({ message: 'Erro ao atualizar produto no banco de dados' }, { status: 500 });
  }
}
// ----------------------------------------------------
// GET (Buscar Produto Único) - Implementação adicional
// ----------------------------------------------------
export async function GET(request) {
  const id = getProductId(request);
  console.log(`🔎 [API GET ID] Tentando buscar produto único com ID: ${id}`);

  if (!id) {
    return NextResponse.json({ message: 'ID do produto não fornecido' }, { status: 400 });
  }

  try {
    const docRef = doc(db, 'produtos', id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log(`✅ [API GET ID] Produto encontrado. ID: ${id}`);
      return NextResponse.json({ id: docSnap.id, ...docSnap.data() }, { status: 200 });
    } else {
      console.log(`⚠️ [API GET ID] Produto não encontrado. ID: ${id}`);
      return NextResponse.json({ message: 'Produto não encontrado' }, { status: 404 });
    }
  } catch (error) {
    console.error(`❌ ERRO CRÍTICO ao buscar produto único (${id}):`, error.message, 'Detalhes:', error);
    return NextResponse.json({ message: 'Erro ao buscar produto único' }, { status: 500 });
  }
}