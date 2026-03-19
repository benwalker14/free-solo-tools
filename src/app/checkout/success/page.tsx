import type { Metadata } from "next";
import { Suspense } from "react";
import CheckoutSuccessContent from "./CheckoutSuccessContent";

export const metadata: Metadata = {
  title: "Welcome to Pro",
  robots: { index: false },
};

export default function CheckoutSuccessPage() {
  return (
    <Suspense>
      <CheckoutSuccessContent />
    </Suspense>
  );
}
