import { Metadata } from "next";
import ClientPage from "./ClientPage";

export const metadata: Metadata = {
  title: "Create Your Bowl | Vellari",
  description: "Craft your perfect premium roasted makhana bowl with custom flavours, crunch levels, and toppings.",
  alternates: {
    canonical: "/create-your-bowl",
  },
};

export default function CreateYourBowlPage() {
  return <ClientPage />;
}
