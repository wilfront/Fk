import ProductDetailClient from './ProductDetailClient';

export default async function Page({ params }) {
  // Em Next 16, `params` pode ser uma Promise — aguardamos antes de acessar.
  const resolved = await params;
  const id = resolved?.id;
  return <ProductDetailClient id={id} />;
}
