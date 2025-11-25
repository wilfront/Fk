import { CartProvider } from '@/context/CartContext';
import "./globals.css";

export const metadata = {
  title: "Gustavo Canecas",
  description: "Canecas personalizadas e temáticas",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}