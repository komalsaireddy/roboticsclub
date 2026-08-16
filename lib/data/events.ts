export interface EventItem {
  id: string;
  number: string | null;
  title: string;
  type: string | null;
  description: string | null;
  image: string | null;
  rules: string | null;
  date: string | null;
  chapter: string | null;
  featured: boolean;
}