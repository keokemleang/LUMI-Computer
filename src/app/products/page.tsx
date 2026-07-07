import type { Metadata } from "next";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { getCategories, getProducts } from "@/lib/data";
import { ProductsView } from "./products-view";

export const metadata: Metadata = {
  title: "All Products",
  description:
    "Browse the full catalog of electronic components, modules, dev boards, and project kits at KBSCircuit.",
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const sp = await searchParams;
  const initialCategory = sp.category;

  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories(),
  ]);

  const activeCategory = initialCategory
    ? categories.find((c) => c.slug === initialCategory)
    : undefined;

  return (
    <div className="container-page py-8 md:py-10">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Products</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <header className="mt-6 flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          {activeCategory ? activeCategory.name : "All Products"}
        </h1>
        <p className="max-w-2xl text-muted-foreground">
          {activeCategory?.description ||
            "Components, modules, and kits for your next electronics build. Filter by category, sort by price or rating, and find exactly what you need."}
        </p>
      </header>

      <div className="mt-8">
        <ProductsView
          products={products}
          categories={categories.map((c) => ({
            id: c.id,
            slug: c.slug,
            name: c.name,
          }))}
          initialCategory={initialCategory}
        />
      </div>
    </div>
  );
}
