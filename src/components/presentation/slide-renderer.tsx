import { ContentSlide } from "@/components/presentation/content-slide";
import { TitleSlide } from "@/components/presentation/title-slide";
import type { PresentationPage, Project } from "@/lib/types";

type SlideRendererProps = {
  project: Project;
  page: PresentationPage;
  className?: string;
};

export function SlideRenderer({ project, page, className }: SlideRendererProps) {
  if (page.type === "title") {
    return <TitleSlide project={project} page={page} className={className} />;
  }

  return <ContentSlide project={project} page={page} className={className} />;
}
