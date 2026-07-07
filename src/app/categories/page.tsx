import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, FolderOpen } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getCategories } from "@/lib/data";

export const metadata: Metadata = {
  title: "Browse Categories",
  description:
    "Browse all product categories at KBSCircuit — from Arduino and ESP32 to sensors, displays, and tools.",
};

export default async function CategoriesPage() {
  const categories = await getCategories();

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
            <BreadcrumbPage>Categories</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <header className="mt-6 max-w-2xl">
        <Badge variant="secondary" className="mb-3 gap-1.5">
          <FolderOpen className="h-3.5 w-3.5" /> Catalog
        </Badge>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Browse Categories
        </h1>
        <p className="mt-2 text-muted-foreground">
          Find exactly what you need by category — microcontrollers, sensors,
          displays, tools, and complete project kits for every build.
        </p>
      </header>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {categories.map((cat) => (
          <Link key={cat.id} href={`/categories/${cat.slug}`} className="group">
            <Card className="flex h-full flex-col overflow-hidden p-0 transition-shadow hover:shadow-md">
              <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                <Image
                  src={cat.image || ""}
                  alt={cat.name}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                {cat.featured && (
                  <Badge className="absolute left-2 top-2">Featured</Badge>
                )}
              </div>
              <div className="flex flex-1 flex-col p-4">
                <h3 className="font-semibold group-hover:text-primary">
                  {cat.name}
                </h3>
                {cat.description && (
                  <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                    {cat.description}
                  </p>
                )}
                <span className="mt-3 flex items-center gap-1 text-sm font-medium text-primary">
                  Explore
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
