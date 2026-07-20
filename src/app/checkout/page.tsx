import { Metadata } from "next";
import ClientPage from "./ClientPage";

export const metadata: Metadata = {
  title: "Checkout | Vellari",
  description: "Complete your order for premium roasted makhana.",
  alternates: {
    canonical: "/checkout",
  },
};

export default function CheckoutPage() {
  return <ClientPage />;
}
