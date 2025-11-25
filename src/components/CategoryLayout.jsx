"use client";
import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import ProductGrid from '@/components/ProductGrid';
import styles from './CategoryLayout.module.css';

const DEPARTMENTS = [
  { label: 'Personalize', slug: 'personalize' },
  { label: 'Dia das Crianças', slug: 'dia-das-criancas' },
  { label: 'Dia dos Professores', slug: 'dia-dos-professores' },
  { label: 'Datas Comemorativas', slug: 'datas-comemorativas' },
  { label: 'Canecas Temáticas', slug: 'canecas-tematicas' },
  { label: 'Pronta Entrega', slug: 'pronta-entrega' },
];

export default function CategoryLayout({ title, subtitle, categoria }) {
  const router = useRouter();
  const pathname = usePathname();
  const [priceRange, setPriceRange] = useState(null); // {min, max}
  const [sort, setSort] = useState('relevance');

  function handleDepartmentClick(slug) {
    // navega para a rota da categoria selecionada
    router.push(`/${slug}`);
  }

  function applyPrice(min, max) {
    setPriceRange({ min, max });
  }

  return (
    <div className="page-container">
      <div className="header-section">
        <h1 className="page-title">{title}</h1>
        {subtitle && <p className="page-subtitle">{subtitle}</p>}
      </div>

      <div className={styles.layout}>
        <aside className={styles.sidebar} aria-label="Filtros">
          <div className={styles.filterSection}>
            <div className={styles.filterTitle}>Filtrar por Departamento</div>
            <ul className={styles.filterList}>
              {DEPARTMENTS.map(d => {
                const isActive = pathname === `/${d.slug}` || pathname === `/${d.slug}/`;
                return (
                  <li key={d.slug} className={styles.filterItem}>
                    <button
                      onClick={() => handleDepartmentClick(d.slug)}
                      className={`${styles.linkLike} ${isActive ? styles.active : ''}`}>
                      {d.label}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className={styles.filterSection}>
            <div className={styles.filterTitle}>Filtrar por Preço</div>
            <ul className={styles.filterList}>
              <li className={styles.filterItem}><button onClick={() => applyPrice(25,49.99)} className={styles.linkLike}>de R$ 25,00 até R$ 49,99</button></li>
              <li className={styles.filterItem}><button onClick={() => applyPrice(50,69.99)} className={styles.linkLike}>de R$ 50,00 até R$ 69,99</button></li>
              <li className={styles.filterItem}><button onClick={() => applyPrice(70,99.99)} className={styles.linkLike}>de R$ 70,00 até R$ 99,99</button></li>
              <li className={styles.filterItem}><button onClick={() => setPriceRange(null)} className={styles.linkLike}>Limpar preço</button></li>
            </ul>
          </div>

          <div className={styles.filterSection}>
            <div className={styles.filterTitle}>Filtrar por Avaliação</div>
            <div className={styles.ratingsRow}>
              <div>★★★★★</div>
              <div style={{color:'#999', fontSize:13}}> (7)</div>
            </div>
            <div style={{marginTop:8}}>
              <img src="/img4.jpg" alt="Envio para todo o Brasil" className={styles.banner} />
            </div>
          </div>
        </aside>

        <main className={styles.mainContent}>
          <div style={{display:'flex', justifyContent:'flex-end', marginBottom:12}}>
            <select aria-label="Ordenar por" value={sort} onChange={(e) => setSort(e.target.value)} className={styles.sortSelect}>
              <option value="relevance">Relevância</option>
              <option value="price-asc">Preço: menor</option>
              <option value="price-desc">Preço: maior</option>
            </select>
          </div>

          <div className={styles.productsGridWrapper}>
            <ProductGrid categoria={categoria} priceRange={priceRange} sort={sort} />
          </div>
        </main>
      </div>
    </div>
  );
}
