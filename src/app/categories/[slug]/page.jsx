import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, FolderOpen } from "lucide-react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getCategories, getCategoryBySlug, getProductsByCategory } from "@/lib/data";
import { CategoryView } from "./category-view";
export async function generateMetadata({
  params
}) {
  const {
    slug
  } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) {
    return {
      title: "Category not found"
    };
  }
  return {
    title: category.name,
    description: category.description || `Browse ${category.name} products at LUMI Computer.`
  };
}
export default async function CategoryDetailPage({
  params
}) {
  const {
    slug
  } = await params;
  const [category, products, categories] = await Promise.all([getCategoryBySlug(slug), getProductsByCategory(slug), getCategories()]);
  if (!category) {
    notFound();
  }
  const otherCategories = categories.filter(c => c.slug !== slug);
  return <div className="container-page py-8 md:py-10">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/categories">Categories</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{category.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Category header with banner */}
      <div className="mt-6 overflow-hidden rounded-xl border border-border bg-card">
        <div className="grid gap-6 p-6 md:grid-cols-[1fr_2fr] md:items-center md:p-8">
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-muted md:aspect-square">
            <Image src={category.image || ""} alt={category.name} fill priority sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
          </div>
          <div>
            <Badge variant="secondary" className="mb-3 gap-1.5">
              <FolderOpen className="h-3.5 w-3.5" /> Category
            </Badge>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {category.name}
            </h1>
            {category.description && <p className="mt-3 max-w-xl text-muted-foreground">
                {category.description}
              </p>}
            <div className="mt-5 flex flex-wrap gap-3">
              <Button asChild variant="outline" size="sm">
                <Link href="/products">
                  Browse all products <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="ghost" size="sm">
                <Link href="/categories">All categories</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 lg:grid lg:grid-cols-[240px_1fr] lg:gap-8">
        {/* Sidebar — other categories */}
        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Other categories
            </h2>
            <nav className="mt-3 flex flex-col gap-1">
              <Link href="/categories" className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground">
                ← All categories
              </Link>
              {otherCategories.map(c => <Link key={c.id} href={`/categories/${c.slug}`} className="flex items-center justify-between rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground">
                  <span>{c.name}</span>
                  <ArrowRight className="h-3.5 w-3.5 opacity-0 transition-opacity hover:opacity-100" />
                </Link>)}
            </nav>
          </div>
        </aside>

        {/* Main column */}
        <div>
          <CategoryView products={products} />
        </div>
      </div>
    </div>;
}
