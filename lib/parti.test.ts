import { describe, it, expect } from "vitest";
import { CANDIDATS } from "./data";
import { siglePartiDe } from "./parti";

describe("sigle d'étiquette politique", () => {
  it("utilise les sigles usuels", () => {
    expect(siglePartiDe("Rassemblement national")).toBe("RN");
    expect(siglePartiDe("La France insoumise")).toBe("LFI");
    expect(siglePartiDe("Parti socialiste")).toBe("PS");
  });

  it("dérive un sigle des initiales ou du mot unique pour une étiquette non listée", () => {
    expect(siglePartiDe("À nous maintenant")).toBe("ANM");
    expect(siglePartiDe("Solution démocratique")).toBe("SD");
    expect(siglePartiDe("Horizons")).toBe("HORIZONS");
    expect(siglePartiDe("Debout !")).toBe("DEBOUT");
    expect(siglePartiDe("Les Écologistes")).toBe("ÉCOLOGISTES");
  });

  it("ne produit pas de badge quand l'étiquette n'est pas précisée", () => {
    expect(siglePartiDe("Étiquette non précisée")).toBeNull();
    expect(siglePartiDe("")).toBeNull();
  });

  it("donne un sigle à toutes les étiquettes précisées des candidats", () => {
    for (const c of CANDIDATS) {
      if (!/non précisée/i.test(c.parti)) expect(siglePartiDe(c.parti), c.parti).not.toBeNull();
    }
  });
});
