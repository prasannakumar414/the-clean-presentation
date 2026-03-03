"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ChevronLeft, ChevronRight, Download } from "lucide-react";
import { downloadProjectPdf } from "@/components/pdf-export";
import { SlideRenderer } from "@/components/presentation/slide-renderer";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getThemeConfig } from "@/lib/themes";
import { useProject } from "@/hooks/use-project";

type ViewProjectPageClientProps = {
  projectId: string;
};

export function ViewProjectPageClient({ projectId }: ViewProjectPageClientProps) {
  const { project, pages, loading } = useProject(projectId);
  const [activeIndex, setActiveIndex] = useState(0);

  const sortedPages = useMemo(() => [...pages].sort((a, b) => a.order - b.order), [pages]);
  const activePage = sortedPages[activeIndex];

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!sortedPages.length) return;
      if (event.key === "ArrowRight") {
        setActiveIndex((current) => Math.min(current + 1, sortedPages.length - 1));
      }
      if (event.key === "ArrowLeft") {
        setActiveIndex((current) => Math.max(current - 1, 0));
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [sortedPages.length]);

  if (loading) {
    return (
      <main className="mx-auto max-w-6xl space-y-4 px-6 py-8">
        <Skeleton className="h-10 w-52" />
        <Skeleton className="h-[520px] w-full" />
      </main>
    );
  }

  if (!project) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-10">
        <p className="text-sm text-muted-foreground">Project not found.</p>
      </main>
    );
  }

  const theme = getThemeConfig(project.theme);

  return (
    <main className={`min-h-screen px-6 py-8 ${theme.appClassName}`}>
      <section className="mx-auto max-w-6xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Button asChild variant="outline">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to projects
            </Link>
          </Button>
          <div className="flex gap-2">
            <Button asChild variant="outline">
              <Link href={`/project/${project.id}/edit`}>Edit project</Link>
            </Button>
            <Button onClick={() => downloadProjectPdf(project, sortedPages)}>
              <Download className="mr-2 h-4 w-4" />
              Download PDF
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3">
          <h1 className="text-2xl font-semibold">{project.title}</h1>
          <p className="text-sm text-muted-foreground">
            Slide {Math.min(activeIndex + 1, sortedPages.length)} of {sortedPages.length || 0}
          </p>
        </div>

        {activePage ? (
          <div className="space-y-4">
            <SlideRenderer project={project} page={activePage} className="min-h-[520px]" />
            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => setActiveIndex((index) => Math.max(index - 1, 0))}
                disabled={activeIndex === 0}
              >
                <ChevronLeft className="mr-1 h-4 w-4" />
                Previous
              </Button>
              <Button
                onClick={() =>
                  setActiveIndex((index) => Math.min(index + 1, sortedPages.length - 1))
                }
                disabled={activeIndex === sortedPages.length - 1}
              >
                Next
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-dashed bg-background p-8 text-center text-sm text-muted-foreground">
            This project has no pages yet.
          </div>
        )}
      </section>
    </main>
  );
}
