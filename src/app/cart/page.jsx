"use client";
import React, { useState } from 'react';
import styles from './cart.module.css';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CartPage() {
  const { cart, total, totalItems, incrementQuantidade, decrementQuantidade, removeFromCart, clearCart } = useCart();
  const [cep, setCep] = useState('');
  const [shippingOptions, setShippingOptions] = useState(null);
  const [coupon, setCoupon] = useState('');
  const [discount, setDiscount] = useState(0);
  const router = useRouter();

  function applyCoupon() {
    // demo: cashback 10% para cupom PIX10
    if (coupon.trim().toUpperCase() === 'PIX10') {
      setDiscount(0.10);
    } else {
      setDiscount(0);
    }
  }

  async function calcFrete() {
    // simula cálculo simples
    await new Promise(r => setTimeout(r, 400));
    const base = 9.9;
    const price = total || 0;
    const cepNum = parseInt(cep.slice(-3) || '0', 10);
    const factor = 1 + ((cepNum % 50) / 100);
    const pac = (base + price * 0.02) * factor;
    const sedex = (base * 1.8 + price * 0.03) * factor;
    setShippingOptions([{ id: 'pac', name: 'PAC', days: 7, price: pac }, { id: 'sedex', name: 'SEDEX', days: 3, price: sedex }]);
  }

  const discountedTotal = total * (1 - discount);
  const shipping = shippingOptions?.[0]?.price ?? 0;
  const grandTotal = discountedTotal + shipping;

  return (
    <div className={styles.cartPage}>
      <h1>Meu Carrinho</h1>

      <table className={styles.cartTable}>
        <thead className={styles.cartHead}>
          <tr>
            <th>Produto</th>
            <th style={{width:140}}>Quantidade</th>
            <th style={{width:160}}>Preço</th>
            <th style={{width:120}}>Excluir</th>
          </tr>
        </thead>
        <tbody>
          {cart.length === 0 && (
            <tr className={styles.cartRow}><td colSpan={4} style={{padding:24}}>Seu carrinho está vazio. <Link href="/">Continuar comprando</Link></td></tr>
          )}

          {cart.map(item => (
            <tr key={item.id} className={styles.cartRow}>
              <td>
                <div className={styles.productCell}>
                  <img src={item.imagem} alt={item.nome} className={styles.productThumb} />
                  <div className={styles.productMeta}>
                    <div>{item.nome}</div>
                    {item.sku && <div className={styles.sku}>Cód: {item.sku}</div>}
                  </div>
                </div>
              </td>

              <td>
                <div className={styles.qtyControls}>
                  <button className={styles.qtyBtn} onClick={() => decrementQuantidade(item.id)} aria-label="Diminuir">−</button>
                  <div className={styles.qtyDisplay}>{item.quantidade}</div>
                  <button className={styles.qtyBtn} onClick={() => incrementQuantidade(item.id)} aria-label="Aumentar">+</button>
                </div>
              </td>

              <td>
                <div className={styles.price}>R$ {(item.preco * item.quantidade).toFixed(2)}</div>
              </td>

              <td>
                <button className={styles.removeBtn} onClick={() => removeFromCart(item.id)} title="Remover">🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className={styles.cartFooter}>
        <div className={styles.leftCol}>
          <div style={{marginTop:10}}>
            <h3>Calcule o frete:</h3>
            <div className={styles.calcRow}>
              <input className={styles.calcInput} placeholder="CEP" value={cep} onChange={(e)=> setCep(e.target.value.replace(/\D/g,''))} />
              <button className={styles.calcBtn} onClick={calcFrete}>Calcular</button>
            </div>
            {shippingOptions && (
              <div style={{marginTop:12}}>
                {shippingOptions.map(s => (
                  <div key={s.id} style={{padding:'6px 0'}}>{s.name} · {s.days} dias — R$ {s.price.toFixed(2)}</div>
                ))}
              </div>
            )}

            <div style={{marginTop:20}}>
              <h3>Cupom de desconto:</h3>
              <div style={{display:'flex', gap:8, marginTop:8}}>
                <input className={styles.calcInput} placeholder="Código do cupom" value={coupon} onChange={(e)=> setCoupon(e.target.value)} />
                <button className={styles.calcBtn} onClick={applyCoupon}>Usar cupom</button>
              </div>
              {discount > 0 && <div style={{marginTop:8, color:'#16a34a'}}>Cupom aplicado: {(discount*100).toFixed(0)}% off</div>}
            </div>
          </div>
        </div>

        <aside className={styles.rightCol}>
          <div className={styles.summaryRow}><div>Subtotal:</div><div>R$ {total.toFixed(2)}</div></div>
          <div className={styles.summaryRow}><div>Desconto:</div><div>- R$ {(total - discountedTotal).toFixed(2)}</div></div>
          <div className={styles.summaryRow}><div>Frete:</div><div>R$ {shipping.toFixed(2)}</div></div>
          <hr />
          <div className={styles.summaryRow}><div className={styles.summaryTotal}>Total:</div><div className={styles.summaryTotal}>R$ {grandTotal.toFixed(2)}</div></div>

          <div className={styles.checkoutBtns}>
            <Link href="/" className={styles.btnSecondary}>Continuar comprando</Link>
            <button className={styles.btnPrimary} onClick={() => router.push('/checkout')}>Finalizar compra</button>
          </div>
        </aside>
      </div>
    </div>
  );
}
