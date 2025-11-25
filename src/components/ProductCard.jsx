"use client";
import { useRouter } from 'next/navigation';
import styles from './ProductCard.module.css';

export default function ProductCard({ produto }) {
  const router = useRouter();

  function handleComprar() {
    if (!produto?.id) return;
    router.push(`/produto/${produto.id}`);
  }

  const preco = typeof produto?.preco === 'number' ? produto.preco : parseFloat(produto?.preco || 0);
  const pixPrice = (preco * 0.9).toFixed(2); // exemplo: 10% desconto no pix
  const oldPrice = preco.toFixed(2);
  const installmentsCount = 2;
  const installmentValue = (preco / installmentsCount).toFixed(2);

  return (
    <div className={styles.card}>
      <div className={styles.imageWrap}>
        <img
          src={produto?.imagem || `https://placehold.co/400x400/cccccc/333333?text=Sem+Imagem`}
          alt={produto?.nome}
          className={styles.productImage}
          onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/400x400/cccccc/333333?text=Sem+Imagem'; }}
        />
      </div>

      <div className={styles.title}>{produto?.nome}</div>

      <div className={styles.stars} aria-hidden>
        {'★★★★★'}
      </div>

      <div className={styles.priceBlock}>
        <span className={styles.pixPrice}>R$ {pixPrice} <small style={{fontSize:12, color:'#666'}}>no pix</small></span>
        <div className={styles.priceNote}>com 10% de desconto</div>
        <div className={styles.oldPrice}>R$ {oldPrice}</div>
        <div className={styles.installments}>até {installmentsCount}x de R$ {installmentValue} sem juros</div>
      </div>

      <div className={styles.buyRow}>
        <button className={styles.btnComprar} onClick={handleComprar}>Comprar</button>
        <a
          className={styles.btnWhats}
          href={`https://api.whatsapp.com/send?text=Tenho%20dúvidas%20sobre%20o%20produto%20${encodeURIComponent(produto?.nome || '')}`}
          target="_blank"
          rel="noreferrer"
          title="Dúvidas pelo whatsapp"
        >
          <span className={styles.whatsIcon} aria-hidden dangerouslySetInnerHTML={{__html: `
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20.52 3.48A11.94 11.94 0 0 0 12 0C5.373 0 .001 5.373.001 12a11.94 11.94 0 0 0 3.48 8.52L0 24l3.6-1A12 12 0 0 0 12 24c6.627 0 12-5.373 12-12 0-3.2-1.25-6.2-3.48-8.52z" fill="#25D366"/>
              <path d="M17.59 14.37c-.28-.14-1.66-.82-1.92-.92-.26-.1-.44-.14-.62.14s-.71.92-.87 1.11c-.16.2-.32.22-.6.08-.28-.14-1.18-.43-2.25-1.38-.83-.74-1.39-1.65-1.55-1.93-.16-.28-.02-.43.12-.57.12-.12.28-.32.42-.48.14-.16.18-.28.28-.46.09-.18.04-.34-.02-.48-.06-.14-.62-1.49-.85-2.04-.22-.53-.45-.46-.62-.47-.16-.02-.35-.02-.53-.02-.18 0-.48.07-.73.34-.24.26-.93.91-.93 2.22 0 1.31.95 2.58 1.08 2.76.12.18 1.86 2.92 4.52 3.99 1.92.77 2.86.84 3.09.72.23-.12 1.32-.54 1.51-1.06.18-.52.18-.97.13-1.06-.06-.09-.23-.14-.5-.28z" fill="#fff"/>
            </svg>
          `}} />
          <span>Dúvidas pelo whatsapp</span>
        </a>
      </div>

      <div className={styles.metaSmall}>Disponível para todo o Brasil</div>
    </div>
  );
}