"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ContentPageEditor } from "@/components/editor/content-page-editor";
import { TitlePageEditor } from "@/components/editor/title-page-editor";
import { SlideRenderer } from "@/components/presentation/slide-renderer";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { updatePage } from "@/lib/firestore";
import { getThemeConfig } from "@/lib/themes";
import type { PresentationPage, Project } from "@/lib/types";
import { useProject } from "@/hooks/use-project";

type EditPageClientProps = {
  projectId: string;
  pageId: string;
};

export function EditPageClient({ projectId, pageId }: EditPageClientProps) {
  const { project, pages, loading } = useProject(projectId);
  const page = useMemo(() => pages.find((entry) => entry.id === pageId), [pages, pageId]);

  if (loading) {
    return (
      <main className="mx-auto max-w-6xl space-y-4 px-6 py-8">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-80 w-full" />
      </main>
    );
  }

  if (!project || !page) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-10">
        <p className="text-sm text-muted-foreground">Page not found.</p>
      </main>
    );
  }

  const theme = getThemeConfig(project.theme);
  return (
    <main className={`min-h-screen px-6 py-8 ${theme.appClassName}`}>
      <section className="mx-auto max-w-7xl space-y-6">
        <div className="flex items-center justify-between gap-3">
          <Button asChild variant="outline">
            <Link href={`/project/${project.id}/edit`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to project
            </Link>
          </Button>
          <Button asChild>
            <Link href={`/project/${project.id}/edit`}>Save and Back</Link>
          </Button>
        </div>

        <EditPageForm key={page.id} project={project} page={page} />
      </section>
    </main>
  );
}

type EditPageFormProps = {
  project: Project;
  page: PresentationPage;
};

function EditPageForm({ project, page }: EditPageFormProps) {
  const [title, setTitle] = useState(page.title ?? "");
  const [imageUrl, setImageUrl] = useState(page.imageUrl ?? "");
  const [content, setContent] = useState(page.content ?? "");

  useEffect(() => {
    const handle = setTimeout(() => {
      void updatePage(project.id, page.id, { title, imageUrl, content });
    }, 600);
    return () => clearTimeout(handle);
  }, [project.id, page.id, title, imageUrl, content]);

  const previewPage = { ...page, title, imageUrl, content };

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <article className="rounded-xl border bg-background p-5">
        <h1 className="mb-4 text-xl font-semibold">
          {page.type === "title" ? "Edit Title Page" : "Edit Content Page"}
        </h1>
        {page.type === "title" ? (
          <TitlePageEditor title={title} onTitleChange={setTitle} />
        ) : (
          <ContentPageEditor
            title={title}
            imageUrl={imageUrl}
            content={content}
            onTitleChange={setTitle}
            onImageUrlChange={setImageUrl}
            onContentChange={setContent}
          />
        )}
      </article>

      <article className="space-y-3">
        <h2 className="text-lg font-medium">Live Preview</h2>
        <SlideRenderer project={project} page={previewPage} />
      </article>
    </div>
  );
}
