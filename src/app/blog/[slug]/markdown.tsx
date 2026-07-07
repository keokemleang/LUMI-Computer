"use client";

import * as React from "react";
import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";

interface MarkdownProps {
  content: string;
  className?: string;
}

/**
 * Lightweight markdown renderer for blog post bodies.
 * Uses semantic color tokens only — no @tailwindcss/typography plugin.
 */
export function Markdown({ content, className }: MarkdownProps) {
  return (
    <div
      className={cn(
        "text-base text-foreground [&>*:first-child]:mt-0 [&>*:last-child]:mb-0",
        className
      )}
    >
      <ReactMarkdown
        components={{
          h1: ({ node, ...props }) => (
            <h1
              className="mt-8 mb-3 text-2xl font-bold tracking-tight sm:text-3xl"
              {...props}
            />
          ),
          h2: ({ node, ...props }) => (
            <h2
              className="mt-6 mb-2 text-xl font-semibold tracking-tight"
              {...props}
            />
          ),
          h3: ({ node, ...props }) => (
            <h3 className="mt-5 mb-2 text-lg font-semibold" {...props} />
          ),
          h4: ({ node, ...props }) => (
            <h4 className="mt-4 mb-2 text-base font-semibold" {...props} />
          ),
          p: ({ node, ...props }) => (
            <p
              className="mb-4 leading-relaxed text-muted-foreground"
              {...props}
            />
          ),
          ul: ({ node, ...props }) => (
            <ul className="mb-4 list-disc space-y-1 pl-6 text-muted-foreground" {...props} />
          ),
          ol: ({ node, ...props }) => (
            <ol className="mb-4 list-decimal space-y-1 pl-6 text-muted-foreground" {...props} />
          ),
          li: ({ node, ...props }) => <li className="leading-relaxed" {...props} />,
          a: ({ node, ...props }) => (
            <a
              className="font-medium text-primary underline underline-offset-2 hover:text-primary/80"
              target="_blank"
              rel="noreferrer"
              {...props}
            />
          ),
          strong: ({ node, ...props }) => (
            <strong className="font-semibold text-foreground" {...props} />
          ),
          blockquote: ({ node, ...props }) => (
            <blockquote
              className="my-4 border-l-4 border-primary/40 bg-muted/40 px-4 py-2 text-muted-foreground italic"
              {...props}
            />
          ),
          code: ({ node, className: codeClassName, children, ...props }) => {
            // Inline vs block: react-markdown passes `inline` via prop in v8,
            // but in v9 the block code is rendered as <pre><code>. We detect
            // inline by absence of a language- class.
            const isInline = !codeClassName?.includes("language-");
            if (isInline) {
              return (
                <code
                  className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm text-foreground"
                  {...props}
                >
                  {children}
                </code>
              );
            }
            return (
              <code className={cn("font-mono text-sm", codeClassName)} {...props}>
                {children}
              </code>
            );
          },
          pre: ({ node, ...props }) => (
            <pre
              className="mb-4 overflow-x-auto rounded-lg bg-muted p-4 text-sm leading-relaxed text-foreground"
              {...props}
            />
          ),
          hr: ({ node, ...props }) => (
            <hr className="my-6 border-border" {...props} />
          ),
          table: ({ node, ...props }) => (
            <div className="mb-4 overflow-x-auto">
              <table
                className="w-full border-collapse text-sm text-foreground"
                {...props}
              />
            </div>
          ),
          th: ({ node, ...props }) => (
            <th
              className="border border-border bg-muted px-3 py-2 text-left font-semibold"
              {...props}
            />
          ),
          td: ({ node, ...props }) => (
            <td className="border border-border px-3 py-2 text-muted-foreground" {...props} />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
