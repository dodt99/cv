import PhotoModalClient from "./PhotoModalClient";

export function generateStaticParams() {
  return ["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((id) => ({ id }));
}

export default PhotoModalClient;
