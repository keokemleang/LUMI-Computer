import { getCategories } from "@/lib/data";
import { db } from "@/lib/db";
import { CategoriesView } from "./categories-view";
export const metadata = {
  title: "Categories"
};
export default async function AdminCategoriesPage() {
  const [categories, counts] = await Promise.all([getCategories(), db.product.groupBy({
    by: ["categoryId"],
    _count: {
      _all: true
    }
  })]);
  const countMap = {};
  for (const c of counts) countMap[c.categoryId] = c._count._all;
  return <CategoriesView categories={categories} countMap={countMap} />;
}
