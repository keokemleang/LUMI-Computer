"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Search, Package } from "lucide-react";
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Button } from "@/components/ui/button";
export function SearchDialog() {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [results, setResults] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();
  React.useEffect(() => {
    const down = e => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(o => !o);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);
  React.useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);
    const t = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(data.results || []);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 200);
    return () => clearTimeout(t);
  }, [query]);
  return <>
      <Button variant="ghost" size="icon" aria-label="Search" onClick={() => setOpen(true)}>
        <Search className="h-[1.15rem] w-[1.15rem]" />
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search products, brands, SKUs..." value={query} onValueChange={setQuery} />
        <CommandList>
          {loading && <div className="p-4 text-sm text-muted-foreground">Searching...</div>}
          <CommandEmpty>
            {query ? "No results found." : "Type to search the catalog."}
          </CommandEmpty>
          {results.length > 0 && <CommandGroup heading="Products">
              {results.map(hit => <CommandItem key={hit.href} value={`${hit.title} ${hit.desc}`} onSelect={() => {
            router.push(hit.href);
            setOpen(false);
          }} className="cursor-pointer">
                  <Package className="h-4 w-4 text-primary" />
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{hit.title}</span>
                    <span className="text-xs text-muted-foreground line-clamp-1">{hit.desc}</span>
                  </div>
                </CommandItem>)}
            </CommandGroup>}
        </CommandList>
      </CommandDialog>
    </>;
}
