import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Robotics Club GCET",
    short_name: "Robotics GCET",
    description: "Official Website & Engineering Hub of the Robotics Club of Geetanjali College of Engineering and Technology.",
    start_url: "/",
    display: "standalone",
    background_color: "#030303",
    theme_color: "#030303",
    icons: [
      {
        src: "/robotics-club-logo.jpg",
        sizes: "192x192",
        type: "image/jpeg",
      },
      {
        src: "/robotics-club-logo.jpg",
        sizes: "512x512",
        type: "image/jpeg",
      },
    ],
  };
}
