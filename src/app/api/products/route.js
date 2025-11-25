// src/app/api/products/route.js
import { NextResponse } from 'next/server';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase'; 

const PRODUCTS_COLLECTION = 'produtos';

// ----------------------------------------------------
// GET (Listar Todos os Produtos) - CORRIGIDO
// ----------------------------------------------------
export async function GET(request) {
  console.log('🔎 [API GET] Listando produtos com possíveis filtros...');

  try {
    const url = new URL(request.url);
    const params = url.searchParams;

    const categoria = params.get('categoria');
    const priceMin = params.has('priceMin') ? parseFloat(params.get('priceMin')) : null;
    const priceMax = params.has('priceMax') ? parseFloat(params.get('priceMax')) : null;
    const sort = params.get('sort') || 'relevance';

    const productsCollectionRef = collection(db, PRODUCTS_COLLECTION);
    const querySnapshot = await getDocs(productsCollectionRef);

    let products = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // Filtrar por categoria (slug)
    if (categoria) {
      products = products.filter(p => String(p.categoria || '').toLowerCase() === String(categoria).toLowerCase());
    }

    // Garantir que preço seja número e filtrar por range
    products = products.map(p => ({ ...p, preco: typeof p.preco === 'number' ? p.preco : parseFloat(p.preco || 0) }));

    if (priceMin !== null) {
      products = products.filter(p => p.preco >= priceMin);
    }
    if (priceMax !== null) {
      products = products.filter(p => p.preco <= priceMax);
    }

    // Ordenação
    if (sort === 'price-asc') {
      products.sort((a, b) => a.preco - b.preco);
    } else if (sort === 'price-desc') {
      products.sort((a, b) => b.preco - a.preco);
    } // 'relevance' mantém a ordem retornada pelo Firestore

    console.log(`✅ [API GET] Produtos retornados: ${products.length} (categoria=${categoria}, priceMin=${priceMin}, priceMax=${priceMax}, sort=${sort})`);

    return NextResponse.json(products, { status: 200 });

  } catch (error) {
    console.error('❌ ERRO ao listar produtos:', error);
    return NextResponse.json({ message: 'Falha ao carregar produtos.' }, { status: 500 });
  }
}

// ----------------------------------------------------
// POST (Criar Novo Produto) - Mantido (usado para salvar)
// ----------------------------------------------------
export async function POST(request) {
  const data = await request.json();
  const precoNumerico = parseFloat(data.preco);

  console.log('➕ [API POST] Tentando criar novo produto:', data.nome);

  // Validação básica
  if (!data.nome || !data.imagem || isNaN(precoNumerico)) {
    return NextResponse.json({ message: 'Dados do produto incompletos ou inválidos.' }, { status: 400 });
  }

  try {
    const productsCollectionRef = collection(db, PRODUCTS_COLLECTION);
    
    // Adiciona o documento ao Firestore
    const docRef = await addDoc(productsCollectionRef, {
      ...data,
      preco: precoNumerico, // Garante que o preço é um número
      createdAt: new Date(),
    });

    console.log(`✅ [API POST] Produto criado com ID: ${docRef.id}`);
    
    return NextResponse.json(
        { message: 'Produto criado com sucesso', id: docRef.id }, 
        { status: 201 }
    );

  } catch (error) {
    console.error('❌ ERRO CRÍTICO ao criar produto:', error.message, 'Detalhes:', error);
    return NextResponse.json(
        { message: 'Erro ao criar produto no banco de dados' }, 
        { status: 500 }
    );
  }
}