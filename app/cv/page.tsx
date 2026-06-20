import type { Metadata } from "next";
import CvContent from "./CvContent";

export const metadata: Metadata = {
  title: "CV — Dinh Tien Do",
  description:
    "Front-end Developer with 5 years of experience in React, Next.js, and real-time systems.",
};

export default function CvPage() {
  return (
    <div className="min-h-screen bg-white">
      <CvContent />
    </div>
  );
}
