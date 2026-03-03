import ReactMarkdown from "react-markdown";
import { getThemeConfig } from "@/lib/themes";
import type { PresentationPage, Project } from "@/lib/types";

type ContentSlideProps = {
  project: Project;
  page: PresentationPage;
  className?: string;
};

export function ContentSlide({ project, page, className }: ContentSlideProps) {
  const theme = getThemeConfig(project.theme);
  const hasImage = Boolean(page.imageUrl?.trim());

  return (
    <section
      className={`grid min-h-[420px] w-full gap-6 rounded-xl border p-8 shadow-sm ${
        hasImage ? "md:grid-cols-2" : "md:grid-cols-1"
      } ${theme.slideClassName} ${className ?? ""}`}
    >
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold md:text-4xl">
          {page.title || "Untitled Slide"}
        </h2>
        <article className="prose prose-slate max-w-none dark:prose-invert">
          <ReactMarkdown>{page.content || "_No content yet._"}</ReactMarkdown>
        </article>
      </div>
      {hasImage ? (
        <div className="flex items-center justify-center overflow-hidden rounded-lg border bg-black/5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={page.imageUrl}
            alt={page.title || "Slide image"}
            className="h-full max-h-[420px] w-full object-contain"
          />
        </div>
      ) : null}
    </section>
  );
}
