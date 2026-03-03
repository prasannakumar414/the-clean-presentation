import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  writeBatch,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type {
  CreateProjectInput,
  PageType,
  PresentationPage,
  Project,
  ProjectTheme,
} from "@/lib/types";

const projectsCollection = collection(db, "projects");

function pagesCollection(projectId: string) {
  return collection(db, "projects", projectId, "pages");
}

function normalizeProject(id: string, raw: Record<string, unknown>): Project {
  const createdAt = (raw.createdAt as { seconds?: number } | undefined)?.seconds;
  const updatedAt = (raw.updatedAt as { seconds?: number } | undefined)?.seconds;
  return {
    id,
    title: (raw.title as string) ?? "Untitled Project",
    theme: (raw.theme as ProjectTheme) ?? "light",
    createdAt: createdAt ? createdAt * 1000 : undefined,
    updatedAt: updatedAt ? updatedAt * 1000 : undefined,
  };
}

function normalizePage(
  id: string,
  raw: Record<string, unknown>,
): PresentationPage {
  return {
    id,
    type: ((raw.type as PageType) ?? "content") as PageType,
    title: (raw.title as string) ?? "",
    imageUrl: (raw.imageUrl as string | undefined) ?? "",
    content: (raw.content as string | undefined) ?? "",
    order: (raw.order as number) ?? 0,
  };
}

export async function createProject(input: CreateProjectInput): Promise<string> {
  const docRef = await addDoc(projectsCollection, {
    title: input.title,
    theme: input.theme,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  await createPage(docRef.id, "title");
  return docRef.id;
}

export async function updateProject(
  projectId: string,
  updates: Partial<Pick<Project, "title" | "theme">>,
) {
  const projectDoc = doc(db, "projects", projectId);
  await updateDoc(projectDoc, {
    ...updates,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteProject(projectId: string) {
  const pageDocs = await getDocs(query(pagesCollection(projectId), orderBy("order")));
  const batch = writeBatch(db);
  pageDocs.docs.forEach((pageDoc) => batch.delete(pageDoc.ref));
  batch.delete(doc(db, "projects", projectId));
  await batch.commit();
}

export async function createPage(projectId: string, type: PageType): Promise<string> {
  const pagesQuery = query(
    pagesCollection(projectId),
    orderBy("order", "desc"),
    limit(1),
  );
  const highestPageSnapshot = await getDocs(pagesQuery);
  const highestOrder = highestPageSnapshot.empty
    ? -1
    : (highestPageSnapshot.docs[0].data().order as number);

  const newPage = await addDoc(pagesCollection(projectId), {
    type,
    title: type === "title" ? "Title Page" : "New Slide",
    imageUrl: "",
    content: "",
    order: highestOrder + 1,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  await updateProject(projectId, {});
  return newPage.id;
}

export async function updatePage(
  projectId: string,
  pageId: string,
  updates: Partial<Pick<PresentationPage, "title" | "content" | "imageUrl">>,
) {
  const pageDoc = doc(db, "projects", projectId, "pages", pageId);
  await updateDoc(pageDoc, {
    ...updates,
    updatedAt: serverTimestamp(),
  });
  await updateProject(projectId, {});
}

export async function deletePage(projectId: string, pageId: string) {
  await deleteDoc(doc(db, "projects", projectId, "pages", pageId));
  await updateProject(projectId, {});
}

export async function movePage(
  projectId: string,
  pageId: string,
  direction: "up" | "down",
) {
  const pageDocs = await getDocs(query(pagesCollection(projectId), orderBy("order")));
  const pages = pageDocs.docs.map((docItem) => normalizePage(docItem.id, docItem.data()));
  const currentIndex = pages.findIndex((page) => page.id === pageId);
  if (currentIndex === -1) return;
  const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
  if (targetIndex < 0 || targetIndex >= pages.length) return;

  const reordered = [...pages];
  const [moved] = reordered.splice(currentIndex, 1);
  reordered.splice(targetIndex, 0, moved);

  const batch = writeBatch(db);
  reordered.forEach((page, index) => {
    const pageRef = doc(db, "projects", projectId, "pages", page.id);
    batch.update(pageRef, { order: index, updatedAt: serverTimestamp() });
  });
  await batch.commit();
  await updateProject(projectId, {});
}

export async function getProjectPages(projectId: string): Promise<PresentationPage[]> {
  const snapshot = await getDocs(query(pagesCollection(projectId), orderBy("order")));
  return snapshot.docs.map((pageDoc) => normalizePage(pageDoc.id, pageDoc.data()));
}

export function watchProjects(
  callback: (projects: Project[]) => void,
  onError: (error: Error) => void,
) {
  return onSnapshot(
    query(projectsCollection, orderBy("updatedAt", "desc")),
    (snapshot) => {
      const projects = snapshot.docs.map((projectDoc) =>
        normalizeProject(projectDoc.id, projectDoc.data()),
      );
      callback(projects);
    },
    onError,
  );
}

export function watchProject(
  projectId: string,
  callback: (project: Project | null) => void,
  onError: (error: Error) => void,
) {
  return onSnapshot(
    doc(db, "projects", projectId),
    (snapshot) => {
      if (!snapshot.exists()) {
        callback(null);
        return;
      }
      callback(normalizeProject(snapshot.id, snapshot.data()));
    },
    onError,
  );
}

export function watchPages(
  projectId: string,
  callback: (pages: PresentationPage[]) => void,
  onError: (error: Error) => void,
) {
  return onSnapshot(
    query(pagesCollection(projectId), orderBy("order", "asc")),
    (snapshot) => {
      const pages = snapshot.docs.map((pageDoc) =>
        normalizePage(pageDoc.id, pageDoc.data()),
      );
      callback(pages);
    },
    onError,
  );
}
