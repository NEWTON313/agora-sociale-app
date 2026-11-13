/**
 * Mise en forme des nombres affichés, au format français (virgule décimale, signe explicite).
 */

/** Score à une décimale avec signe : « +0,7 », « −0,5 », « 0,0 ». */
export function formatScore(n: number): string {
  const arrondi = Math.round(n * 10) / 10;
  const abs = Math.abs(arrondi).toLocaleString("fr-FR", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  return arrondi > 0 ? `+${abs}` : arrondi < 0 ? `−${abs}` : abs;
}

/** Indice de −1 à +1 ramené sur une échelle de −100 à +100, avec signe : « +55 », « −20 », « 0 ». */
export function formatIndice(n: number): string {
  const p = Math.round(n * 100);
  return `${p > 0 ? "+" : p < 0 ? "−" : ""}${Math.abs(p)}`;
}

/** Proximité de −1 à +1 en pourcentage entier avec signe et espace insécable : « +75 % », « −33 % », « 0 % ». */
export function formatPourcentage(n: number): string {
  const p = Math.round(n * 100);
  return `${p > 0 ? "+" : p < 0 ? "−" : ""}${Math.abs(p)} %`;
}
