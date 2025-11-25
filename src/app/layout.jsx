import { CartProvider } from "@/context/CartContext";
import Header from '../components/Header/page';
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
          <Header />
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
