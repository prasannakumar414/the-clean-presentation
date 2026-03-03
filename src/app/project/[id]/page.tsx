import { ViewProjectPageClient } from "@/components/pages/view-project-page-client";

type ProjectViewPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateStaticParams() {
  return [];
}

export default async function ProjectViewPage({ params }: ProjectViewPageProps) {
  const { id } = await params;
  return <ViewProjectPageClient projectId={id} />;
}
