export type PageType = "title" | "content";

export type ProjectTheme =
  | "light"
  | "dark"
  | "ocean"
  | "sunset"
  | "minimal";

export interface Project {
  id: string;
  title: string;
  theme: ProjectTheme;
  createdAt?: number;
  updatedAt?: number;
}

export interface PresentationPage {
  id: string;
  type: PageType;
  title: string;
  imageUrl?: string;
  content?: string;
  order: number;
}

export interface CreateProjectInput {
  title: string;
  theme: ProjectTheme;
}
