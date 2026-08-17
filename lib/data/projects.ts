export interface Project {
  id: string;
  number: string | null;
  title: string;
  description: string | null;
  category: string | null;
  image: string | null;
  document: string | null;
  status: "available" | "document-missing";
}