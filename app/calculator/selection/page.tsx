import type { Metadata } from "next";
import ProcareCalculatorPage from "../../components/procare-calculator-page";

export const metadata: Metadata = {
  title: "Procare kalkulyatori | Model tanlash",
  description: "Procare kalkulyatorida qurilma ro'yxati va model tanlash sahifasi."
};

export default function CalculatorSelectionPage() {
  return <ProcareCalculatorPage variant="selection" />;
}
