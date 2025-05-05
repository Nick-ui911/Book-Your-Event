export const BASE_URL =
  typeof window !== "undefined" && window.location.hostname === "localhost"
    ? "http://localhost:3000/api"
    : "https://book-your-event.vercel.app/api";
