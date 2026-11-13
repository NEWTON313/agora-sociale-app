import { describe, expect, it } from "vitest";
import { formatIndice, formatPourcentage, formatScore } from "./format";

describe("formatScore", () => {
  it("utilise la virgule décimale et un signe explicite", () => {
    expect(formatScore(0.7)).toBe("+0,7");
    expect(formatScore(-0.5)).toBe("−0,5");
    expect(formatScore(2)).toBe("+2,0");
  });

  it("n'affiche pas de signe pour zéro, y compris après arrondi", () => {
    expect(formatScore(0)).toBe("0,0");
    expect(formatScore(-0.04)).toBe("0,0");
    expect(formatScore(0.04)).toBe("0,0");
  });
});

describe("formatIndice", () => {
  it("ramène l'indice sur une échelle de −100 à +100, sans unité", () => {
    expect(formatIndice(0.546)).toBe("+55");
    expect(formatIndice(-0.2)).toBe("−20");
    expect(formatIndice(0)).toBe("0");
  });
});

describe("formatPourcentage", () => {
  it("arrondit à l'entier, avec signe et espace insécable avant %", () => {
    expect(formatPourcentage(0.75)).toBe("+75 %");
    expect(formatPourcentage(-1 / 3)).toBe("−33 %");
    expect(formatPourcentage(0)).toBe("0 %");
  });
});
