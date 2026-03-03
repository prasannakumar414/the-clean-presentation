"use client";

import { useEffect, useState } from "react";
import { watchPages, watchProject } from "@/lib/firestore";
import type { PresentationPage, Project } from "@/lib/types";

export function useProject(projectId: string) {
  const [project, setProject] = useState<Project | null>(null);
  const [pages, setPages] = useState<PresentationPage[]>([]);
  const [projectLoaded, setProjectLoaded] = useState(false);
  const [pagesLoaded, setPagesLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!projectId) return;

    const unsubscribeProject = watchProject(
      projectId,
      (nextProject) => {
        setProject(nextProject);
        setProjectLoaded(true);
      },
      (err) => {
        setError(err.message);
        setProjectLoaded(true);
        setPagesLoaded(true);
      },
    );

    const unsubscribePages = watchPages(
      projectId,
      (nextPages) => {
        setPages(nextPages);
        setPagesLoaded(true);
      },
      (err) => {
        setError(err.message);
        setProjectLoaded(true);
        setPagesLoaded(true);
      },
    );

    return () => {
      unsubscribeProject();
      unsubscribePages();
    };
  }, [projectId]);

  const loading = Boolean(projectId) && (!projectLoaded || !pagesLoaded);
  return { project, pages, loading, error };
}
