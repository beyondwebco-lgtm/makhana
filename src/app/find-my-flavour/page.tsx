import { Metadata } from "next";
import ClientPage from "./ClientPage";

export const metadata: Metadata = {
  title: "Find My Flavour | Vellari",
  description: "Take our interactive quiz and let our AI engine match you with your perfect premium makhana flavour.",
  alternates: {
    canonical: "/find-my-flavour",
  },
};

export default function FindMyFlavourPage() {
  return <ClientPage />;
}
