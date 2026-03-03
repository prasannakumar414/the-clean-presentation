import { EditProjectPageClient } from "@/components/pages/edit-project-page-client";

type EditProjectPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateStaticParams() {
  return [];
}

export default async function EditProjectPage({ params }: EditProjectPageProps) {
  const { id } = await params;
  return <EditProjectPageClient projectId={id} />;
}
