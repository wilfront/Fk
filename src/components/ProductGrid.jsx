'use client';
import { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import styles from './ProductCard.module.css';

export default function ProductGrid({ categoria, priceRange = null, sort = 'relevance' }) {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProdutos() {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (categoria) params.set('categoria', categoria);
        if (priceRange && typeof priceRange.min === 'number') params.set('priceMin', priceRange.min);
        if (priceRange && typeof priceRange.max === 'number') params.set('priceMax', priceRange.max);
        if (sort) params.set('sort', sort);

        const url = `/api/products?${params.toString()}`;
        const res = await fetch(url);
        const data = await res.json();
        setProdutos(data);
      } catch (err) {
        console.error('Erro ao buscar produtos:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchProdutos();
  // note: use primitives in dependency array so its length/order remain constant
  }, [categoria, priceRange?.min, priceRange?.max, sort]);

  if (loading) return <div className="loading">Carregando produtos...</div>;
  if (produtos.length === 0) return <div className="no-products">Nenhum produto encontrado</div>;

  return (
    <div>
      <div className={styles.gridHeader}>
        {/* O select de ordenação agora está no CategoryLayout; deixamos apenas espaço para compatibilidade visual */}
      </div>

      <div className="products-grid">
        {produtos.map((produto) => (
          <ProductCard key={produto.id} produto={produto} />
        ))}
      </div>
    </div>
  );
}