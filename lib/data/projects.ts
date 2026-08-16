export interface Project {
  id: string;
  number: string;
  title: string;
  description: string;
  category: string;
  image: string | null;
  document: string | null;
  status: "available" | "document-missing";
}

export const projects: Project[] = [
  {
    id: "drone-project",
    number: "01",
    title: "Drone Project",
    description:
      "A robotics club drone project developed as part of the club's hands-on experimentation with aerial robotic systems.",
    category: "Aerial Robotics",
    image: null,
    document: "/documents/projects/Report for Robotics.pdf",
    status: "available",
  },

  {
    id: "greet-robot",
    number: "02",
    title: "Greet Robot",
    description:
      "A humanoid robot capable of performing basic tasks and interacting with humans.",
    category: "Humanoid Robotics",
    image: "/images/projects/GreetRobot.png",
    document: "/documents/projects/Greet Robot Documentation.pdf",
    status: "document-missing",
  },

  {
    id: "snake-robot",
    number: "03",
    title: "Snake Robot",
    description:
      "A flexible, multi-jointed robot that moves like a snake to navigate tight or tricky spaces.",
    category: "Mobile Robotics",
    image: null,
    document: "/documents/projects/Snake Bot Document.pdf",
    status: "document-missing",
  },

  {
    id: "spider-robot",
    number: "04",
    title: "Spider Robot",
    description:
      "A multi-legged robot designed to walk over uneven surfaces.",
    category: "Legged Robotics",
    image: null,
    document: "/documents/projects/Spyder robot Documentation.pdf",
    status: "document-missing",
  },

  {
    id: "automatic-braking-vehicle",
    number: "05",
    title: "Automatic Braking Vehicle",
    description:
      "A vehicle designed to detect situations requiring intervention and stop itself automatically.",
    category: "Autonomous Vehicles",
    image: "/images/projects/Automatic braking Vehicle.png",
    document: "/documents/projects/automatic breaking system.pdf",
    status: "document-missing",
  },

  {
    id: "obstacle-avoiding-vehicle",
    number: "06",
    title: "Obstacle Avoiding Robotic Vehicle",
    description:
      "A robotic vehicle designed to detect obstacles and navigate around them.",
    category: "Autonomous Navigation",
    image: "/images/projects/Obstacle Detector.jpeg",
    document: "/documents/projects/Obstacle Avoiding Robotic Vehicle.pdf",
    status: "available",
  },
];

export default projects;



