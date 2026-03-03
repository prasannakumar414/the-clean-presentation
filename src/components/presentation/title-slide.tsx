import { getThemeConfig } from "@/lib/themes";
import type { PresentationPage, Project } from "@/lib/types";

type TitleSlideProps = {
  project: Project;
  page: PresentationPage;
  className?: string;
};

export function TitleSlide({ project, page, className }: TitleSlideProps) {
  const theme = getThemeConfig(project.theme);
  return (
    <section
      className={`flex h-full min-h-[420px] w-full items-center justify-center rounded-xl border p-10 shadow-sm ${theme.slideClassName} ${className ?? ""}`}
    >
      <h1 className="text-center text-4xl font-bold tracking-tight md:text-6xl">
        {page.title || "Untitled Title Slide"}
      </h1>
    </section>
  );
}
