"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus } from "lucide-react";
import { PageList } from "@/components/editor/page-list";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { createPage, deletePage, movePage, updateProject } from "@/lib/firestore";
import { getThemeConfig, THEME_OPTIONS } from "@/lib/themes";
import type { PageType, ProjectTheme } from "@/lib/types";
import { useProject } from "@/hooks/use-project";

type EditProjectPageClientProps = {
  projectId: string;
};

export function EditProjectPageClient({ projectId }: EditProjectPageClientProps) {
  const router = useRouter();
  const { project, pages, loading } = useProject(projectId);
  const [titleDraft, setTitleDraft] = useState("");
  const [savingMeta, setSavingMeta] = useState(false);

  const handleSaveMeta = async (nextTheme?: ProjectTheme) => {
    if (!project) return;
    setSavingMeta(true);
    try {
      await updateProject(project.id, {
        title: titleDraft.trim() || project.title || "Untitled Project",
        theme: nextTheme ?? project.theme,
      });
      setTitleDraft("");
    } finally {
      setSavingMeta(false);
    }
  };

  const handleAddPage = async (type: PageType) => {
    if (!project) return;
    const pageId = await createPage(project.id, type);
    router.push(`/project/${project.id}/page/${pageId}`);
  };

  if (loading) {
    return (
      <main className="mx-auto max-w-6xl space-y-4 px-6 py-8">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-72 w-full" />
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
        <div className="flex items-center justify-between gap-3">
          <Button asChild variant="outline">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to projects
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href={`/project/${project.id}`}>Preview</Link>
          </Button>
        </div>

        <article className="rounded-xl border bg-background p-5">
          <h1 className="mb-4 text-2xl font-semibold">Edit Project</h1>
          <div className="grid gap-4 md:grid-cols-[1fr_220px_auto] md:items-end">
            <div className="space-y-2">
              <Label htmlFor="project-title">Project Title</Label>
              <Input
                id="project-title"
                value={titleDraft || project.title}
                onChange={(event) => setTitleDraft(event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Theme</Label>
              <Select
                value={project.theme}
                onValueChange={(value) => handleSaveMeta(value as ProjectTheme)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {THEME_OPTIONS.map((option) => (
                    <SelectItem key={option.id} value={option.id}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={() => handleSaveMeta()} disabled={savingMeta}>
              Save
            </Button>
          </div>
        </article>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-semibold">Pages</h2>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => handleAddPage("title")}>
              <Plus className="mr-1 h-4 w-4" />
              Add Title Page
            </Button>
            <Button onClick={() => handleAddPage("content")}>
              <Plus className="mr-1 h-4 w-4" />
              Add Content Page
            </Button>
          </div>
        </div>

        {pages.length ? (
          <PageList
            project={project}
            pages={pages}
            onDelete={(pageId) => deletePage(project.id, pageId)}
            onMove={(pageId, direction) => movePage(project.id, pageId, direction)}
          />
        ) : (
          <div className="rounded-xl border border-dashed bg-background p-8 text-center text-sm text-muted-foreground">
            No pages yet. Add a title or content page to get started.
          </div>
        )}
      </section>
    </main>
  );
}
