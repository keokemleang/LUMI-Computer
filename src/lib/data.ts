import { db } from "@/lib/db";

// Parsed types for JSON fields stored as strings in SQLite
export interface Spec {
  label: string;
  value: string;
}

export interface ProductWithCategory {
  id: string;
  slug: string;
  name: string;
  shortDesc: string;
  description: string;
  price: number;
  compareAt: number | null;
  sku: string;
  stock: number;
  images: string[];
  videoUrl: string | null;
  categoryId: string;
  category: { id: string; slug: string; name: string };
  compatibility: string | null;
  specs: Spec[];
  datasheetUrl: string | null;
  featured: boolean;
  rating: number;
  reviewCount: number;
  relatedCourse: string | null;
  relatedProject: string | null;
  createdAt: Date;
}

function parseProduct(p: any): ProductWithCategory {
  return {
    ...p,
    images: JSON.parse(p.images || "[]"),
    specs: JSON.parse(p.specs || "[]"),
  };
}

export async function getCategories() {
  return db.category.findMany({ orderBy: { name: "asc" } });
}

export async function getFeaturedCategories() {
  return db.category.findMany({ where: { featured: true }, orderBy: { name: "asc" } });
}

export async function getCategoryBySlug(slug: string) {
  return db.category.findUnique({ where: { slug } });
}

export async function getProducts() {
  const products = await db.product.findMany({
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });
  return products.map(parseProduct);
}

export async function getFeaturedProducts() {
  const products = await db.product.findMany({
    where: { featured: true },
    include: { category: true },
    orderBy: { rating: "desc" },
  });
  return products.map(parseProduct);
}

export async function getProductsByCategory(slug: string) {
  const products = await db.product.findMany({
    where: { category: { slug } },
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });
  return products.map(parseProduct);
}

export async function getProductBySlug(slug: string) {
  const p = await db.product.findUnique({
    where: { slug },
    include: { category: true },
  });
  if (!p) return null;
  return parseProduct(p);
}

export async function getRelatedProducts(slug: string, categoryId: string) {
  const products = await db.product.findMany({
    where: { category: { id: categoryId }, slug: { not: slug } },
    include: { category: true },
    take: 4,
  });
  return products.map(parseProduct);
}

export interface ProjectParsed {
  id: string;
  slug: string;
  title: string;
  overview: string;
  description: string;
  difficulty: string;
  estimatedTime: string;
  images: string[];
  videoUrl: string | null;
  requiredComponents: string[];
  circuitDiagram: string | null;
  sourceCodeUrl: string | null;
  pcbFilesUrl: string | null;
  docsUrl: string | null;
  slidesUrl: string | null;
  kitProductId: string | null;
  category: string | null;
  featured: boolean;
  rating: number;
  reviewCount: number;
  tags: string[];
  createdAt: Date;
}

function parseProject(p: any): ProjectParsed {
  return {
    ...p,
    images: JSON.parse(p.images || "[]"),
    requiredComponents: JSON.parse(p.requiredComponents || "[]"),
    tags: JSON.parse(p.tags || "[]"),
  };
}

export async function getProjects() {
  const projects = await db.project.findMany({ orderBy: { createdAt: "desc" } });
  return projects.map(parseProject);
}

export async function getFeaturedProjects() {
  const projects = await db.project.findMany({ where: { featured: true }, orderBy: { rating: "desc" } });
  return projects.map(parseProject);
}

export async function getProjectBySlug(slug: string) {
  const p = await db.project.findUnique({ where: { slug } });
  if (!p) return null;
  return parseProject(p);
}

export interface CourseParsed {
  id: string;
  slug: string;
  title: string;
  description: string;
  overview: string;
  thumbnail: string;
  instructor: string;
  instructorBio: string | null;
  difficulty: string;
  duration: string;
  lessonsCount: number;
  lessons: { title: string; duration: string }[];
  requirements: string[];
  projectsIncluded: string[];
  componentsRequired: string[];
  price: number;
  videoUrl: string | null;
  downloadsUrl: string | null;
  featured: boolean;
  rating: number;
  reviewCount: number;
  createdAt: Date;
}

function parseCourse(c: any): CourseParsed {
  return {
    ...c,
    lessons: JSON.parse(c.lessons || "[]"),
    requirements: JSON.parse(c.requirements || "[]"),
    projectsIncluded: JSON.parse(c.projectsIncluded || "[]"),
    componentsRequired: JSON.parse(c.componentsRequired || "[]"),
  };
}

export async function getCourses() {
  const courses = await db.course.findMany({ orderBy: { createdAt: "desc" } });
  return courses.map(parseCourse);
}

export async function getFeaturedCourses() {
  const courses = await db.course.findMany({ where: { featured: true }, orderBy: { rating: "desc" } });
  return courses.map(parseCourse);
}

export async function getCourseBySlug(slug: string) {
  const c = await db.course.findUnique({ where: { slug } });
  if (!c) return null;
  return parseCourse(c);
}

export async function getDownloads() {
  return db.download.findMany({ orderBy: { createdAt: "desc" } });
}

export async function getBlogPosts() {
  return db.blogPost.findMany({ where: { published: true }, orderBy: { createdAt: "desc" } });
}

export async function getBlogPostBySlug(slug: string) {
  return db.blogPost.findUnique({ where: { slug } });
}

export async function getReviews(type: "product" | "project" | "course", id: string) {
  const where =
    type === "product" ? { productId: id } : type === "project" ? { projectId: id } : { courseId: id };
  return db.review.findMany({ where, orderBy: { createdAt: "desc" } });
}

export async function getOrders() {
  return db.order.findMany({ orderBy: { createdAt: "desc" } });
}

export async function getDashboardStats() {
  const [products, projects, courses, orders, customers, downloads, blogPosts] = await Promise.all([
    db.product.count(),
    db.project.count(),
    db.course.count(),
    db.order.count(),
    db.user.count(),
    db.download.count(),
    db.blogPost.count(),
  ]);
  const ordersData = await db.order.findMany();
  const revenue = ordersData.reduce((sum, o) => sum + o.total, 0);
  return { products, projects, courses, orders, customers, downloads, blogPosts, revenue };
}

export async function getAdminProducts() {
  const products = await db.product.findMany({
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });
  return products.map(parseProduct);
}

export async function getAdminOrders() {
  return db.order.findMany({ orderBy: { createdAt: "desc" } });
}

export async function getAdminCustomers() {
  return db.user.findMany({ orderBy: { createdAt: "desc" } });
}

export function parseJson<T>(value: string | null, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}
