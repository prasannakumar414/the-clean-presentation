"use client";

import Link from "next/link";
import { Download, Eye, FilePenLine, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { getThemeConfig } from "@/lib/themes";
import type { Project } from "@/lib/types";

type ProjectCardProps = {
  project: Project;
  pageCount: number;
  onDelete: (projectId: string) => void;
  onDownload: (projectId: string) => void;
};

export function ProjectCard({
  project,
  pageCount,
  onDelete,
  onDownload,
}: ProjectCardProps) {
  const theme = getThemeConfig(project.theme);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <CardTitle className="line-clamp-1">{project.title}</CardTitle>
          <Badge variant="secondary">{pageCount} pages</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground">
          Last updated{" "}
          {project.updatedAt ? new Date(project.updatedAt).toLocaleString() : "just now"}
        </p>
        <div className={`h-24 rounded-lg border ${theme.slideClassName}`} />
      </CardContent>
      <CardFooter className="flex flex-wrap gap-2">
        <Button asChild size="sm" variant="outline">
          <Link href={`/project/${project.id}`}>
            <Eye className="mr-1 h-4 w-4" />
            View
          </Link>
        </Button>
        <Button asChild size="sm" variant="outline">
          <Link href={`/project/${project.id}/edit`}>
            <FilePenLine className="mr-1 h-4 w-4" />
            Edit
          </Link>
        </Button>
        <Button size="sm" onClick={() => onDownload(project.id)}>
          <Download className="mr-1 h-4 w-4" />
          PDF
        </Button>
        <Button size="sm" variant="destructive" onClick={() => onDelete(project.id)}>
          <Trash2 className="mr-1 h-4 w-4" />
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
}
