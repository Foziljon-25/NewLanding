import type { Metadata } from "next";
import ProcareCalculatorPage from "../components/procare-calculator-page";

export const metadata: Metadata = {
  title: "Procare kalkulyatori | Narx hisoblash",
  description: "Procare servis xizmatlari uchun qurilma, model va muammo bo'yicha narxni hisoblash."
};

export default function CalculatorPage() {
  return <ProcareCalculatorPage />;
}
