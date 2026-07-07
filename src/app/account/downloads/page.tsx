import Link from "next/link";
import {
  Download,
  FileCode2,
  CircuitBoard,
  FileText,
  BookOpen,
  Presentation,
  Library,
  Cpu,
  ExternalLink,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getDownloads } from "@/lib/data";
import { cn } from "@/lib/utils";

const categoryMeta: Record<
  string,
  { icon: LucideIcon; tone: string }
> = {
  "Source Code": { icon: FileCode2, tone: "bg-primary/10 text-primary" },
  PCB: { icon: CircuitBoard, tone: "bg-success/15 text-success" },
  Datasheet: { icon: FileText, tone: "bg-info/15 text-info" },
  Manual: { icon: BookOpen, tone: "bg-warning/15 text-warning" },
  Slides: { icon: Presentation, tone: "bg-danger/15 text-danger" },
  Library: { icon: Library, tone: "bg-primary/10 text-primary" },
  Firmware: { icon: Cpu, tone: "bg-success/15 text-success" },
};

const fallbackMeta = {
  icon: FileText,
  tone: "bg-muted text-muted-foreground",
};

export default async function MyDownloadsPage() {
  const all = await getDownloads();
  const downloads = all.slice(0, 6);

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold tracking-tight sm:text-2xl">My Downloads</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Files and resources you have access to from your purchases and
            enrollments.
          </p>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link href="/downloads">
            Browse all
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </header>

      {downloads.length === 0 ? (
        <Card className="p-0">
          <CardContent className="flex flex-col items-center justify-center px-6 py-16 text-center">
            <span className="grid h-16 w-16 place-items-center rounded-full bg-muted text-muted-foreground">
              <Download className="h-8 w-8" />
            </span>
            <h3 className="mt-4 text-lg font-semibold">No downloads yet</h3>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              Browse our downloads library for source code, datasheets, and
              more.
            </p>
            <Button asChild className="mt-5">
              <Link href="/downloads">Browse downloads</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="gap-0 p-0">
          <CardHeader className="border-b">
            <CardTitle>
              {downloads.length} available {downloads.length === 1 ? "file" : "files"}
            </CardTitle>
          </CardHeader>
          <CardContent className="px-0">
            {/* Mobile: card list */}
            <div className="divide-y divide-border sm:hidden">
              {downloads.map((d) => {
                const meta = categoryMeta[d.category] ?? fallbackMeta;
                const Icon = meta.icon;
                return (
                  <div key={d.id} className="flex items-start gap-3 px-4 py-3">
                    <span
                      className={cn(
                        "grid h-9 w-9 shrink-0 place-items-center rounded-md",
                        meta.tone
                      )}
                    >
                      <Icon className="h-4 w-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="line-clamp-1 font-medium">{d.title}</div>
                      <div className="mt-1 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
                        <Badge variant="secondary" className="text-[10px]">{d.category}</Badge>
                        <span className="font-mono uppercase">{d.fileType}</span>
                        <span>· {d.fileSize}</span>
                      </div>
                    </div>
                    <Button asChild size="sm" className="shrink-0">
                      <a href={d.fileUrl} target="_blank" rel="noreferrer" download>
                        <Download className="h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                );
              })}
            </div>

            {/* Desktop: table */}
            <div className="hidden sm:block">
              <div className="scroll-area-thin overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="pl-6">File</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Size</TableHead>
                      <TableHead className="pr-6 text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {downloads.map((d) => {
                      const meta = categoryMeta[d.category] ?? fallbackMeta;
                      const Icon = meta.icon;
                      return (
                        <TableRow key={d.id}>
                          <TableCell className="pl-6">
                            <div className="flex items-center gap-3">
                              <span
                                className={cn(
                                  "grid h-9 w-9 shrink-0 place-items-center rounded-md",
                                  meta.tone
                                )}
                              >
                                <Icon className="h-4 w-4" />
                              </span>
                              <div className="min-w-0">
                                <div className="line-clamp-1 font-medium">
                                  {d.title}
                                </div>
                                <div className="line-clamp-1 text-xs text-muted-foreground">
                                  {d.fileType.toUpperCase()} file
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary">{d.category}</Badge>
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            <span className="font-mono text-xs uppercase">
                              {d.fileType}
                            </span>
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {d.fileSize}
                          </TableCell>
                          <TableCell className="pr-6 text-right">
                            <Button asChild size="sm">
                              <a
                                href={d.fileUrl}
                                target="_blank"
                                rel="noreferrer"
                                download
                              >
                                <Download className="h-4 w-4" />
                                Download
                                <ExternalLink className="h-3 w-3 opacity-80" />
                              </a>
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
