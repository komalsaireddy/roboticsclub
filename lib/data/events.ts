export interface EventItem {
  id: string;
  number: string;
  title: string;
  type: string;
  description: string;
  image: string | null;
  rules: string | null;
  date: string | null;
  chapter: string | null;
  featured: boolean;
}

export const events: EventItem[] = [
  {
    id: "robotica-chapter-1",
    number: "01",
    title: "ROBOTICA CHAPTER 1",
    type: "Flagship Robotics Event",
    description:
      "Robotica 1.0 was held on March 25, 2023, showcasing innovative robotics projects from various teams through drone racing, line-following challenges, and an ideathon.",
    image: "/images/events/Robotica poster-(2023-24).png",
    rules: null,
    date: "25 March 2023",
    chapter: "Chapter 1",
    featured: true,
  },

  {
    id: "robotica-chapter-2",
    number: "02",
    title: "ROBOTICA CHAPTER 2",
    type: "Flagship Robotics Event",
    description:
      "Robotica Chapter-2 brought robotics enthusiasts and innovators together with new events and increased participation.",
    image: null,
    rules: null,
    date: "21–22 November 2024",
    chapter: "Chapter 2",
    featured: true,
  },

  {
    id: "sky-dash",
    number: "03",
    title: "SKY DASH",
    type: "Drone Competition",
    description:
      "Participants built and raced drones through a challenging obstacle course, testing their flying skills and technical expertise.",
    image: "/images/events/DroneRace.jpg",
    rules: "/documents/events/SkyDashRules.pdf",
    date: null,
    chapter: "Robotica",
    featured: false,
  },

  {
    id: "goal-rush",
    number: "04",
    title: "GOAL RUSH",
    type: "Robotics Competition",
    description:
      "Goal Rush is a high-speed robotics event where teams race their robots through an obstacle-filled course, testing navigation, agility, and programming skills.",
    image: "/images/events/soccer.jpg",
    rules: "/documents/events/GoalRushRules.pdf",
    date: null,
    chapter: "Robotica",
    featured: false,
  },

  {
    id: "full-throttle",
    number: "05",
    title: "FULL THROTTLE",
    type: "RC Robotics Competition",
    description:
      "Teams competed head-to-head with their robots to determine the fastest and most efficient design.",
    image: "/images/events/race.png",
    rules: "/documents/events/FullThrottleRules.pdf",
    date: null,
    chapter: "Robotica",
    featured: false,
  },

  {
    id: "circuit-chase",
    number: "06",
    title: "CIRCUIT CHASE",
    type: "Line Following Competition",
    description:
      "Teams designed robots that could autonomously follow a path marked on the ground, showcasing their programming and engineering skills.",
    image: "/images/events/Cicuit Chase.png",
    rules: "/documents/events/Line Follow Robo Competition Rules.pdf",
    date: null,
    chapter: "Robotica",
    featured: false,
  },

  {
    id: "ideathon",
    number: "07",
    title: "IDEATHON",
    type: "Innovation Competition",
    description:
      "Participants pitched innovative ideas for robotics projects, competing for the best concept, judged by industry experts.",
    image: "/images/events/ideathon.jpg",
    rules: "/documents/events/Ideathon.pdf",
    date: null,
    chapter: "Robotica",
    featured: false,
  },
];

export default events;
