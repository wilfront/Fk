'use client';
import React, { useEffect, useState } from 'react';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import styles from './ProductDetail.module.css';

export default function ProductDetailClient({ id }) {
  const [produto, setProduto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const [quantidade, setQuantidade] = useState(1);
  const [pagamento, setPagamento] = useState('cartao');
  const { addToCart } = useCart();
  const [selectedImage, setSelectedImage] = useState(null);
  const [showParcels, setShowParcels] = useState(false);
  const [cep, setCep] = useState('');
  const [shippingOptions, setShippingOptions] = useState(null);
  const [calculatingShipping, setCalculatingShipping] = useState(false);

  useEffect(() => {
    async function fetchProduto() {
      try {
        const res = await fetch(`/api/products/${encodeURIComponent(id)}`);
        if (!res.ok) {
          const text = await res.text().catch(() => null);
          const message = text || `Erro ao buscar produto (status ${res.status})`;
          console.error('API GET /api/products/[id] respondeu com erro:', res.status, text);
          setError(message);
          setProduto(null);
          return;
        }

        const data = await res.json();
        if (data?.message) {
          setError(data.message);
          setProduto(null);
        } else {
          setProduto(data);
          setSelectedImage(data.imagem || null);
        }
      } catch (err) {
        console.error('Erro ao buscar produto:', err);
        setError('Erro ao carregar produto');
      } finally {
        setLoading(false);
      }
    }

    if (id) fetchProduto();
  }, [id]);

  function handleAdicionar() {
    if (!produto) return;
    const qty = Math.max(1, parseInt(quantidade, 10) || 1);
    addToCart(produto, qty);
    // feedback simples
    alert(`${qty}x ${produto.nome} adicionado(s) ao carrinho. Forma de pagamento: ${pagamento}`);
  }

  if (loading) return <div style={{ padding: 20 }}>Carregando produto...</div>;
  if (error) return (
    <div style={{ padding: 20 }}>
      <p>{error}</p>
      <div style={{ marginTop: 12 }}>
        <button onClick={() => router.back()} style={{ marginRight: 8 }}>Voltar</button>
        <button onClick={() => router.push('/')} >Ir para a loja</button>
      </div>
    </div>
  );
  if (!produto) return <div style={{ padding: 20 }}>Produto não encontrado</div>;

  // If there are multiple images in produto.imagens prefer them; otherwise use single imagem
  const thumbs = produto.imagens?.length ? produto.imagens : (produto.imagem ? [produto.imagem] : []);

  return (
    <div className={styles.wrapper}>
      <div className={styles.productDetail}>
        <div className={styles.thumbs}>
          {thumbs.length ? (
            thumbs.map((src, idx) => (
              <img
                key={idx}
                src={src}
                alt={`thumb-${idx}`}
                className={`${styles.thumb} ${selectedImage === src ? styles.thumbActive : ''}`}
                onClick={() => setSelectedImage(src)}
              />
            ))
          ) : (
            <img src={produto.imagem} alt="thumb" className={styles.thumb} onClick={() => setSelectedImage(produto.imagem)} />
          )}
        </div>

        <div className={styles.gallery}>
          <img src={selectedImage || produto.imagem} alt={produto.nome} className={styles.mainImage} />
        </div>

        <aside className={styles.aside}>
          <div className={styles.buyPanel}>
            <h1 className={styles.title}>{produto.nome}</h1>
            {produto.sku && <div className={styles.sku}>(Cód: {produto.sku})</div>}

            {/* rating */}
            <div className={styles.rating} aria-hidden>
              <div className={styles.stars}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg key={i} className={i < Math.round(produto.avaliacao || produto.rating || 0) ? styles.starFilled : styles.star} width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" fill={i < Math.round(produto.avaliacao || produto.rating || 0) ? '#fbbf24' : '#e5e7eb'} />
                  </svg>
                ))}
              </div>
              <div style={{ marginLeft: 8, color: '#0ea5a4', fontWeight: 700 }}>{produto.avaliacoesCount ?? produto.reviews ?? 0} Avaliações</div>
            </div>

            <div className={styles.priceBlock}>
              <div className={styles.price}>R$ {produto.preco?.toFixed(2)}</div>
              {produto.precoAntigo && <div className={styles.oldPrice}>R$ {produto.precoAntigo.toFixed(2)}</div>}
              {produto.desconto && <div className={styles.priceNote}>{produto.desconto}</div>}
            </div>

            <p className={styles.description}>{produto.descricao}</p>
            {/* Frete */}
            <div className={styles.shippingBox}>
              <label htmlFor="cep">Calcular frete</label>
              <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                <input id="cep" placeholder="CEP (somente números)" value={cep} onChange={(e) => setCep(e.target.value.replace(/\D/g, ''))} style={{ padding: '8px', borderRadius: 8, border: '1px solid #e6e7eb', width: 140 }} />
                <button type="button" onClick={async () => {
                  // cálculo simples simulado de frete
                  setCalculatingShipping(true);
                  await new Promise(r => setTimeout(r, 600));
                  const base = 9.9;
                  const price = produto.preco || 0;
                  const cepNum = parseInt(cep.slice(-3) || '0', 10);
                  const factor = 1 + ((cepNum % 50) / 100);
                  const pac = (base + price * 0.02) * factor;
                  const sedex = (base * 1.8 + price * 0.03) * factor;
                  setShippingOptions([
                    { id: 'pac', name: 'PAC', days: 7, price: pac },
                    { id: 'sedex', name: 'SEDEX', days: 3, price: sedex }
                  ]);
                  setCalculatingShipping(false);
                }} className={styles.calcBtn}>Calcular</button>
              </div>

              {calculatingShipping && <div style={{ marginTop: 8 }}>Calculando...</div>}
              {shippingOptions && (
                <div style={{ marginTop: 10 }}>
                  {shippingOptions.map(opt => (
                    <div key={opt.id} className={styles.methodRow} style={{ padding: '6px 0' }}>
                      <div className={styles.methodLabel}>{opt.name} · {opt.days} dias</div>
                      <div className={styles.methodAmount}>R$ {opt.price.toFixed(2)}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className={styles.qtyControls}>
              <label style={{display:'flex', flexDirection:'column', gap:6}}>
                Quantidade:
                <div className={styles.qtyControlRow}>
                  <button
                    type="button"
                    aria-label="Diminuir quantidade"
                    onClick={() => setQuantidade((q) => Math.max(1, (parseInt(q,10) || 1) - 1))}
                    className={styles.qtyBtn}
                  >−</button>

                  <input
                    type="number"
                    min="1"
                    value={quantidade}
                    onChange={(e) => setQuantidade(e.target.value.replace(/[^0-9]/g, ''))}
                    className={styles.qtyInput}
                    aria-label="Quantidade do produto"
                  />

                  <button
                    type="button"
                    aria-label="Aumentar quantidade"
                    onClick={() => setQuantidade((q) => (parseInt(q,10) || 1) + 1)}
                    className={styles.qtyBtn}
                  >+</button>
                </div>
              </label>
            </div>

            {/* removed payment method buttons as requested */}

            <div className={styles.paymentBox}>
              <div className={styles.paymentTop}>
                <div className={styles.topIcons}>
                  <img src="/payment-icons/visa.svg" alt="visa" />
                  <img src="/payment-icons/mastercard.svg" alt="mastercard" />
                  <img src="/payment-icons/hipercard.svg" alt="hipercard" />
                  <img src="/payment-icons/elo.svg" alt="elo" />
                </div>
                <button type="button" className={styles.parcelDropdown} onClick={() => setShowParcels((s) => !s)} aria-expanded={showParcels}>
                  Parcelas {showParcels ? '▴' : '▾'}
                </button>
              </div>

              {showParcels && (
                <ul className={styles.parcelList}>
                  <li className={styles.parcelItem}><span className="left">1x de R$ {produto.preco?.toFixed(2)} sem juros</span><span className="right">R$ {produto.preco?.toFixed(2)}</span></li>
                  <li className={styles.parcelItem}><span className="left">2x de R$ {(produto.preco ? (produto.preco / 2).toFixed(2) : '0.00')} sem juros</span><span className="right">R$ {(produto.preco ? (produto.preco / 2).toFixed(2) : '0.00')}</span></li>
                </ul>
              )}

              <hr className={styles.sep} />

              {/* PIX and Boleto rows */}
              <div className={styles.methodRow}>
                <div className={styles.methodLabel}><img src="/payment-icons/pix.svg" alt="pix"/> Pix</div>
                <div className={styles.methodAmount}>R$ {(produto.preco ? (produto.preco * 0.9).toFixed(2) : '0.00')}</div>
              </div>

              <div className={styles.methodRow}>
                <div className={styles.methodLabel}><img src="/payment-icons/boleto.svg" alt="boleto"/> Boleto Bancário</div>
                <div className={styles.methodAmount}>R$ {produto.preco?.toFixed(2)}</div>
              </div>
            </div>

            <button className={styles.btnAdd} onClick={handleAdicionar}>Adicionar ao carrinho</button>
          </div>
        </aside>
      </div>
    </div>
  );
}
