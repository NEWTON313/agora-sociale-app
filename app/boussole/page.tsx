import { redirect } from "next/navigation";

/** La boussole est la deuxième étape du parcours unique : /simulateur. */
export default function BoussolePage() {
  redirect("/simulateur");
}
