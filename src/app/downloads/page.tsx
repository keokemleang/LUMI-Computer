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
import { getDownloads } from "@/lib/data";
import { DownloadsView } from "./downloads-view";

export const metadata: Metadata = {
  title: "Downloads",
  description:
    "Source code, PCB files, datasheets, manuals, and libraries for KBSCircuit projects and courses.",
};

// Pass only the serializable subset the view needs.
type DownloadLite = {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  fileType: string;
  fileSize: string;
  fileUrl: string;
  thumbnail: string | null;
  downloads: number;
};

export default async function DownloadsPage() {
  const all = await getDownloads();
  const downloads: DownloadLite[] = all.map((d) => ({
    id: d.id,
    slug: d.slug,
    title: d.title,
    description: d.description,
    category: d.category,
    fileType: d.fileType,
    fileSize: d.fileSize,
    fileUrl: d.fileUrl,
    thumbnail: d.thumbnail,
    downloads: d.downloads,
  }));

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
            <BreadcrumbPage>Downloads</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <header className="mt-6 flex flex-col gap-3">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Downloads</h1>
        <p className="max-w-2xl text-muted-foreground">
          Source code, PCB files, datasheets, manuals, and libraries.
        </p>
      </header>

      <div className="mt-8">
        <DownloadsView downloads={downloads} />
      </div>
    </div>
  );
}
