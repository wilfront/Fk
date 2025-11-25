import { CartProvider } from "@/context/CartContext";
import Header from "@/components/Header"; // ajuste o caminho conforme onde está seu Header.jsx
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
          <Header />   {/* Header aparece em todas as páginas */}
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
