import { Metadata } from "next";
import ClientPage from "./ClientPage";

export const metadata: Metadata = {
  title: "Order Success | Vellari",
  description: "Thank you for your order from Vellari. Your premium roasted makhana is on its way.",
  alternates: {
    canonical: "/order-success",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function OrderSuccessPage() {
  return <ClientPage />;
}
