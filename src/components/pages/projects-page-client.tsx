"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { downloadProjectPdf } from "@/components/pdf-export";
import { CreateProjectDialog } from "@/components/projects/create-project-dialog";
import { ProjectCard } from "@/components/projects/project-card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { getProjectPages, deleteProject } from "@/lib/firestore";
import { useProjects } from "@/hooks/use-projects";

export function ProjectsPageClient() {
  const router = useRouter();
  const { projects, loading, error } = useProjects();
  const [busyProjectId, setBusyProjectId] = useState<string | null>(null);
  const [pageCounts, setPageCounts] = useState<Record<string, number>>({});

  const sorted = useMemo(() => projects, [projects]);

  useEffect(() => {
    let cancelled = false;

    async function loadCounts() {
      const entries = await Promise.all(
        projects.map(async (project) => {
          const pages = await getProjectPages(project.id);
          return [project.id, pages.length] as const;
        }),
      );

      if (!cancelled) {
        setPageCounts(Object.fromEntries(entries));
      }
    }

    if (projects.length) {
      void loadCounts();
    } else {
      setPageCounts({});
    }

    return () => {
      cancelled = true;
    };
  }, [projects]);

  const handleDelete = async (projectId: string) => {
    if (!window.confirm("Delete this project and all its slides?")) return;
    setBusyProjectId(projectId);
    try {
      await deleteProject(projectId);
    } finally {
      setBusyProjectId(null);
    }
  };

  const handleDownload = async (projectId: string) => {
    const project = projects.find((item) => item.id === projectId);
    if (!project) return;
    setBusyProjectId(projectId);
    try {
      const pages = await getProjectPages(projectId);
      setPageCounts((prev) => ({ ...prev, [projectId]: pages.length }));
      await downloadProjectPdf(project, pages);
    } finally {
      setBusyProjectId(null);
    }
  };

  return (
    <main className="min-h-screen bg-muted/30 px-6 py-10">
      <section className="mx-auto max-w-6xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Projects</h1>
            <p className="text-sm text-muted-foreground">
              Build page-based presentations from markdown and images.
            </p>
          </div>
          <CreateProjectDialog onCreated={(newId) => router.push(`/project/${newId}/edit`)} />
        </div>

        {error ? (
          <Alert variant="destructive">
            <AlertTitle>Unable to load projects</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : null}

        {loading ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <Skeleton className="h-64" />
            <Skeleton className="h-64" />
            <Skeleton className="h-64" />
          </div>
        ) : null}

        {!loading && sorted.length === 0 ? (
          <div className="rounded-xl border border-dashed bg-background p-10 text-center">
            <h2 className="text-xl font-medium">No projects yet</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Create your first project to start building slides.
            </p>
          </div>
        ) : null}

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {sorted.map((project) => (
            <div
              key={project.id}
              className={busyProjectId === project.id ? "pointer-events-none opacity-70" : ""}
            >
              <ProjectCard
                project={project}
                pageCount={pageCounts[project.id] ?? 0}
                onDelete={handleDelete}
                onDownload={handleDownload}
              />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
