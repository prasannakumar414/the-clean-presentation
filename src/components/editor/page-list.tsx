import Link from "next/link";
import { ArrowDown, ArrowUp, Pencil, Trash2 } from "lucide-react";
import { SlideRenderer } from "@/components/presentation/slide-renderer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { PresentationPage, Project } from "@/lib/types";

type PageListProps = {
  project: Project;
  pages: PresentationPage[];
  onDelete: (pageId: string) => void;
  onMove: (pageId: string, direction: "up" | "down") => void;
};

export function PageList({ project, pages, onDelete, onMove }: PageListProps) {
  return (
    <div className="grid gap-4">
      {pages.map((page, index) => (
        <article key={page.id} className="rounded-xl border bg-card p-4">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Badge variant="secondary">#{index + 1}</Badge>
              <Badge>{page.type === "title" ? "Title Page" : "Content Page"}</Badge>
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="icon"
                variant="outline"
                onClick={() => onMove(page.id, "up")}
                disabled={index === 0}
              >
                <ArrowUp className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="outline"
                onClick={() => onMove(page.id, "down")}
                disabled={index === pages.length - 1}
              >
                <ArrowDown className="h-4 w-4" />
              </Button>
              <Button asChild size="sm" variant="outline">
                <Link href={`/project/${project.id}/page/${page.id}`}>
                  <Pencil className="mr-1 h-4 w-4" />
                  Edit
                </Link>
              </Button>
              <Button size="sm" variant="destructive" onClick={() => onDelete(page.id)}>
                <Trash2 className="mr-1 h-4 w-4" />
                Delete
              </Button>
            </div>
          </div>
          <div className="overflow-hidden rounded-lg">
            <SlideRenderer project={project} page={page} className="min-h-[240px]" />
          </div>
        </article>
      ))}
    </div>
  );
}
