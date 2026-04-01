import { PHOTOS } from "@/app/exercises/intercept/page";
import PhotoModalClient from "./PhotoModalClient";

export function generateStaticParams() {
  return PHOTOS.map((p) => ({ id: p.id }));
}

export default PhotoModalClient;
