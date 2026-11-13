/**
 * Sources citées par le site : nom lisible du média et domaine servant à juger de l'indépendance de deux sources.
 */

const MEDIAS: Record<string, string> = {
  "franceinfo.fr": "franceinfo",
  "lcp.fr": "LCP",
  "lejdd.fr": "Le JDD",
  "france24.com": "France 24",
  "wikipedia.org": "Wikipédia",
  "melenchon2027.fr": "Programme officiel (melenchon2027.fr)",
};

/**
 * Domaine principal d'une adresse (« france3-regions.franceinfo.fr » et « www.franceinfo.fr » → « franceinfo.fr ») :
 * deux pages du même domaine principal ne comptent pas comme deux sources indépendantes.
 */
export function domainePrincipal(url: string): string {
  try {
    return new URL(url).hostname.split(".").slice(-2).join(".");
  } catch {
    return "(lien invalide)";
  }
}

/** Nom affiché d'une source : le média s'il est connu, sinon son domaine. */
export function nomMedia(url: string): string {
  const domaine = domainePrincipal(url);
  return MEDIAS[domaine] ?? domaine;
}
