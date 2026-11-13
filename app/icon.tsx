import { ImageResponse } from "next/og";
import { IconeMarque } from "@/lib/icone";

const TAILLES = [48, 192, 512];

export function generateImageMetadata() {
  return TAILLES.map((t) => ({ id: String(t), size: { width: t, height: t }, contentType: "image/png" }));
}

export default async function Icon({ id }: { id: Promise<string> }) {
  const taille = Number(await id) || 48;
  return new ImageResponse(<IconeMarque taille={taille} />, { width: taille, height: taille });
}
