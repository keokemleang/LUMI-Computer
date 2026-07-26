import { getAdminProducts, getCategories } from "@/lib/data";
import { ProductsView } from "./products-view";
export const metadata = {
  title: "Products"
};
export default async function AdminProductsPage() {
  const [products, categories] = await Promise.all([getAdminProducts(), getCategories()]);
  const lite = products.map(p => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    shortDesc: p.shortDesc,
    sku: p.sku,
    price: p.price,
    compareAt: p.compareAt,
    stock: p.stock,
    images: p.images,
    featured: p.featured,
    rating: p.rating,
    reviewCount: p.reviewCount,
    createdAt: p.createdAt.toISOString(),
    category: {
      id: p.category.id,
      name: p.category.name,
      slug: p.category.slug
    }
  }));
  const catLite = categories.map(c => ({
    id: c.id,
    name: c.name,
    slug: c.slug
  }));
  return <ProductsView products={lite} categories={catLite} />;
}
