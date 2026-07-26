import { db } from "@/lib/db";

function parseProduct(p) {
  return {
    ...p,
    images: JSON.parse(p.images || "[]"),
    specs: JSON.parse(p.specs || "[]")
  };
}
export async function getCategories() {
  return db.category.findMany({
    orderBy: {
      name: "asc"
    }
  });
}
export async function getFeaturedCategories() {
  return db.category.findMany({
    where: {
      featured: true
    },
    orderBy: {
      name: "asc"
    }
  });
}
export async function getCategoryBySlug(slug) {
  return db.category.findUnique({
    where: {
      slug
    }
  });
}
export async function getProducts() {
  const products = await db.product.findMany({
    include: {
      category: true
    },
    orderBy: {
      createdAt: "desc"
    }
  });
  return products.map(parseProduct);
}
export async function getFeaturedProducts() {
  const products = await db.product.findMany({
    where: {
      featured: true
    },
    include: {
      category: true
    },
    orderBy: {
      rating: "desc"
    }
  });
  return products.map(parseProduct);
}
export async function getProductsByCategory(slug) {
  const products = await db.product.findMany({
    where: {
      category: {
        slug
      }
    },
    include: {
      category: true
    },
    orderBy: {
      createdAt: "desc"
    }
  });
  return products.map(parseProduct);
}
export async function getProductBySlug(slug) {
  const p = await db.product.findUnique({
    where: {
      slug
    },
    include: {
      category: true
    }
  });
  if (!p) return null;
  return parseProduct(p);
}
export async function getRelatedProducts(slug, categoryId) {
  const products = await db.product.findMany({
    where: {
      category: {
        id: categoryId
      },
      slug: {
        not: slug
      }
    },
    include: {
      category: true
    },
    take: 4
  });
  return products.map(parseProduct);
}
export async function getReviews(productId) {
  return db.review.findMany({
    where: {
      productId
    },
    orderBy: {
      createdAt: "desc"
    }
  });
}
/** Orders belonging to a single customer — for account pages. Never call
 * without an email or it'll return every customer's orders. */
export async function getOrders(userEmail) {
  return db.order.findMany({
    where: {
      userEmail
    },
    orderBy: {
      createdAt: "desc"
    }
  });
}
export async function getDashboardStats() {
  const [products, orders, customers] = await Promise.all([db.product.count(), db.order.count(), db.user.count()]);
  const ordersData = await db.order.findMany();
  const revenue = ordersData.reduce((sum, o) => sum + o.total, 0);
  const lowStock = await db.product.count({
    where: {
      stock: {
        lte: 5
      }
    }
  });
  return {
    products,
    orders,
    customers,
    revenue,
    lowStock
  };
}
export async function getAdminProducts() {
  const products = await db.product.findMany({
    include: {
      category: true
    },
    orderBy: {
      createdAt: "desc"
    }
  });
  return products.map(parseProduct);
}
export async function getAdminOrders() {
  return db.order.findMany({
    orderBy: {
      createdAt: "desc"
    }
  });
}
export async function getAdminCustomers() {
  return db.user.findMany({
    orderBy: {
      createdAt: "desc"
    }
  });
}
export function parseJson(value, fallback) {
  if (!value) return fallback;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}
