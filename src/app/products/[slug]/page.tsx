import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ChevronRight,
  Package,
  FileDown,
  GraduationCap,
  FolderGit2,
  Cpu,
  Truck,
  ShieldCheck,
  MessageSquare,
} from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductCard } from "@/components/product-card";
import { StarRating } from "@/components/star-rating";
import {
  getProductBySlug,
  getRelatedProducts,
  getReviews,
} from "@/lib/data";
import { Gallery } from "./gallery";
import { AddToCart } from "./add-to-cart";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) {
    return { title: "Product not found" };
  }
  return {
    title: product.name,
    description: product.shortDesc,
    openGraph: {
      title: product.name,
      description: product.shortDesc,
      images: product.images.slice(0, 1).map((img) => ({ url: img })),
      type: "website",
    },
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const [related, reviews] = await Promise.all([
    getRelatedProducts(product.slug, product.categoryId),
    getReviews("product", product.id),
  ]);

  const discount = product.compareAt
    ? Math.round(
        ((product.compareAt - product.price) / product.compareAt) * 100
      )
    : 0;

  const inStock = product.stock > 0;
  const lowStock = product.stock > 0 && product.stock < 10;
  const compatibilityList = product.compatibility
    ? product.compatibility
        .split(",")
        .map((c) => c.trim())
        .filter(Boolean)
    : [];

  const stockBadge = inStock ? (
    lowStock ? (
      <Badge className="bg-warning text-warning-foreground">
        Low stock — only {product.stock} left
      </Badge>
    ) : (
      <Badge className="bg-success text-success-foreground">In stock</Badge>
    )
  ) : (
    <Badge variant="destructive">Out of stock</Badge>
  );

  return (
    <div className="container-page py-6 md:py-10">
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
              <Link href="/products">Products</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href={`/categories/${product.category.slug}`}>
                {product.category.name}
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{product.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="mt-6 grid gap-8 lg:grid-cols-2 lg:gap-12">
        {/* Gallery */}
        <Gallery images={product.images} alt={product.name} />

        {/* Info */}
        <div className="flex flex-col">
          <Link
            href={`/categories/${product.category.slug}`}
            className="text-sm font-medium text-primary hover:underline"
          >
            {product.category.name}
          </Link>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            {product.name}
          </h1>

          <div className="mt-3 flex flex-wrap items-center gap-3">
            <StarRating
              rating={product.rating}
              size="md"
              showValue
              count={product.reviewCount}
            />
            <a
              href="#reviews"
              className="text-sm text-muted-foreground hover:text-primary hover:underline"
            >
              Read reviews
            </a>
          </div>

          {/* Price */}
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <span className="text-3xl font-bold">
              ${product.price.toFixed(2)}
            </span>
            {product.compareAt && (
              <span className="text-lg text-muted-foreground line-through">
                ${product.compareAt.toFixed(2)}
              </span>
            )}
            {discount > 0 && (
              <Badge variant="destructive">Save {discount}%</Badge>
            )}
          </div>

          <p className="mt-4 text-muted-foreground">{product.shortDesc}</p>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            {stockBadge}
            <span className="text-xs text-muted-foreground">
              SKU: <span className="font-mono">{product.sku}</span>
            </span>
          </div>

          {/* Compatibility */}
          {compatibilityList.length > 0 && (
            <div className="mt-5">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Cpu className="h-4 w-4 text-primary" />
                Compatible with
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {compatibilityList.map((c) => (
                  <Badge key={c} variant="secondary">
                    {c}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <Separator className="my-6" />

          {/* Add to cart */}
          <AddToCart
            slug={product.slug}
            name={product.name}
            price={product.price}
            image={product.images[0]}
            stock={product.stock}
          />

          {/* Trust icons */}
          <div className="mt-6 grid grid-cols-3 gap-2 text-center text-xs text-muted-foreground">
            <div className="flex flex-col items-center gap-1 rounded-md border border-border p-3">
              <Truck className="h-5 w-5 text-primary" />
              Fast worldwide shipping
            </div>
            <div className="flex flex-col items-center gap-1 rounded-md border border-border p-3">
              <ShieldCheck className="h-5 w-5 text-primary" />
              Quality tested
            </div>
            <div className="flex flex-col items-center gap-1 rounded-md border border-border p-3">
              <Package className="h-5 w-5 text-primary" />
              Easy returns
            </div>
          </div>

          {/* Related course / project */}
          {(product.relatedCourse || product.relatedProject) && (
            <div className="mt-6 space-y-2">
              {product.relatedCourse && (
                <Link
                  href={`/courses/${product.relatedCourse}`}
                  className="flex items-center justify-between rounded-lg border border-border bg-muted/30 p-3 transition-colors hover:bg-accent"
                >
                  <span className="flex items-center gap-2 text-sm font-medium">
                    <GraduationCap className="h-4 w-4 text-primary" />
                    Learn with a related course
                  </span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </Link>
              )}
              {product.relatedProject && (
                <Link
                  href={`/projects/${product.relatedProject}`}
                  className="flex items-center justify-between rounded-lg border border-border bg-muted/30 p-3 transition-colors hover:bg-accent"
                >
                  <span className="flex items-center gap-2 text-sm font-medium">
                    <FolderGit2 className="h-4 w-4 text-primary" />
                    Build a related project
                  </span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </Link>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-12">
        <Tabs defaultValue="description" className="w-full">
          <TabsList className="w-full justify-start overflow-x-auto sm:w-auto">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="specs">Specifications</TabsTrigger>
            <TabsTrigger value="downloads">Downloads</TabsTrigger>
            <TabsTrigger value="reviews">
              Reviews ({reviews.length})
            </TabsTrigger>
          </TabsList>

          {/* Description */}
          <TabsContent value="description" className="mt-6">
            <Card className="p-6">
              <h2 className="mb-3 text-lg font-semibold">
                Product description
              </h2>
              <p className="whitespace-pre-line leading-relaxed text-muted-foreground">
                {product.description}
              </p>
            </Card>
          </TabsContent>

          {/* Specifications */}
          <TabsContent value="specs" className="mt-6">
            <Card className="p-6">
              {product.specs.length > 0 ? (
                <>
                  <h2 className="mb-4 text-lg font-semibold">
                    Technical specifications
                  </h2>
                  <Table>
                    <TableBody>
                      {product.specs.map((s, i) => (
                        <TableRow key={i}>
                          <TableCell className="w-1/3 font-medium text-foreground">
                            {s.label}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {s.value}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No specifications listed for this product.
                </p>
              )}
            </Card>
          </TabsContent>

          {/* Downloads */}
          <TabsContent value="downloads" className="mt-6">
            <Card className="p-6">
              {product.datasheetUrl ? (
                <a
                  href={product.datasheetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between rounded-lg border border-border bg-muted/30 p-4 transition-colors hover:bg-accent"
                >
                  <span className="flex items-center gap-3">
                    <span className="grid h-10 w-10 place-items-center rounded-md bg-primary/10 text-primary">
                      <FileDown className="h-5 w-5" />
                    </span>
                    <span>
                      <span className="block text-sm font-medium">
                        Datasheet
                      </span>
                      <span className="block text-xs text-muted-foreground">
                        Official product datasheet (PDF)
                      </span>
                    </span>
                  </span>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </a>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No downloads available for this product.
                </p>
              )}
            </Card>
          </TabsContent>

          {/* Reviews */}
          <TabsContent value="reviews" className="mt-6" id="reviews">
            <Card className="p-6">
              {reviews.length > 0 ? (
                <>
                  <div className="mb-6 flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-semibold">
                        Customer reviews
                      </h2>
                      <div className="mt-1 flex items-center gap-2">
                        <StarRating
                          rating={product.rating}
                          size="md"
                          showValue
                        />
                        <span className="text-sm text-muted-foreground">
                          based on {product.reviewCount} review
                          {product.reviewCount === 1 ? "" : "s"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-6">
                    {reviews.map((r) => (
                      <div
                        key={r.id}
                        className="border-b border-border pb-6 last:border-0 last:pb-0"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="grid h-9 w-9 place-items-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                              {r.author.charAt(0).toUpperCase()}
                            </span>
                            <span className="font-medium">{r.author}</span>
                          </div>
                          <StarRating rating={r.rating} />
                        </div>
                        <p className="mt-3 text-sm text-muted-foreground">
                          {r.comment}
                        </p>
                        <p className="mt-2 text-xs text-muted-foreground">
                          {new Date(r.createdAt).toLocaleDateString(undefined, {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <MessageSquare className="h-10 w-10 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-semibold">
                    No reviews yet
                  </h3>
                  <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                    Be the first to share your experience with this product.
                  </p>
                </div>
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Related products */}
      {related.length > 0 && (
        <section className="mt-16">
          <div className="flex items-end justify-between gap-4">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-primary">
                You might also like
              </div>
              <h2 className="mt-1 text-2xl font-bold tracking-tight">
                Related products
              </h2>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link href={`/categories/${product.category.slug}`}>
                More in {product.category.name}
              </Link>
            </Button>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
