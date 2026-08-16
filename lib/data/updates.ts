export interface UpdateItem {
  id: string;
  date: string;
  category: string;
  title: string;
  description: string;
  featured?: boolean;
}

export const updates: UpdateItem[] = [
  {
    id: "robotica",
    date: "2026",
    category: "EVENT",
    title: "ROBOTICA",
    description:
      "The Robotics Club's flagship technical event bringing together students, robotics enthusiasts and innovators.",
    featured: true,
  },
  {
    id: "projects",
    date: "ARCHIVE",
    category: "PROJECTS",
    title: "PROJECT ARCHIVE",
    description:
      "Explore robotics projects developed by club members across autonomous systems, mobile robotics and embedded engineering.",
  },
  {
    id: "club",
    date: "GCET",
    category: "CLUB",
    title: "ROBOTICS CLUB",
    description:
      "A student-driven environment for learning, building and experimenting with robotics and emerging technologies.",
  },
];

export default updates;
