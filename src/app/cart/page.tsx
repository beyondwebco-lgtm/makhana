import { Metadata } from "next";
import ClientPage from "./ClientPage";

export const metadata: Metadata = {
  title: "Shopping Bag | Vellari",
  description: "Review your custom makhana bowls and premium roasted flavours in your secure cart.",
  alternates: {
    canonical: "/cart",
  },
};

export default function CartPage() {
  return <ClientPage />;
}
