'use client';
import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (err) {
        console.error('Erro ao carregar carrinho:', err);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // agora aceita quantidade opcional (padrão 1)
  function addToCart(produto, quantidade = 1) {
    const qty = Number(quantidade) || 1;
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === produto.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === produto.id
            ? { ...item, quantidade: item.quantidade + qty }
            : item
        );
      } else {
        return [...prevCart, { ...produto, quantidade: qty }];
      }
    });
  }

  function removeFromCart(produtoId) {
    setCart(prevCart => prevCart.filter(item => item.id !== produtoId));
  }

  function incrementQuantidade(produtoId) {
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === produtoId
          ? { ...item, quantidade: item.quantidade + 1 }
          : item
      )
    );
  }

  function decrementQuantidade(produtoId) {
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === produtoId
          ? { ...item, quantidade: Math.max(1, item.quantidade - 1) }
          : item
      )
    );
  }

  const total = cart.reduce((sum, item) => sum + (item.preco * item.quantidade), 0);
  const totalItems = cart.reduce((sum, item) => sum + item.quantidade, 0);

  function clearCart() {
    setCart([]);
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        incrementQuantidade,
        decrementQuantidade,
        total,
        totalItems,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart deve ser usado dentro de CartProvider');
  }
  return context;
}