import { EditPageClient } from "@/components/pages/edit-page-client";

type EditSinglePageProps = {
  params: Promise<{ id: string; pageId: string }>;
};

export async function generateStaticParams() {
  return [];
}

export default async function EditSinglePage({ params }: EditSinglePageProps) {
  const { id, pageId } = await params;
  return <EditPageClient projectId={id} pageId={pageId} />;
}
