"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";

type Props = {
  orderId: string;
};

export default function PaymentForm({
  orderId,
}: Props) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();

  const [paying, setPaying] = useState(false);
  const [paymentError, setPaymentError] =
    useState<string | null>(null);

  async function handlePayment(
    event: React.SyntheticEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    try {
      setPaying(true);
      setPaymentError(null);

      const result = await stripe.confirmPayment({
        elements,

        confirmParams: {
          return_url:
            `${window.location.origin}/account/orders/${orderId}`,
        },

        redirect: "if_required",
      });

      if (result.error) {
        setPaymentError(
          result.error.message || "Payment failed"
        );
        return;
      }

      if (
        result.paymentIntent?.status === "succeeded"
      ) {
        toast.success("Payment successful");

        router.push(
          `/account/orders/${orderId}`
        );
      }
    } finally {
      setPaying(false);
    }
  }

  return (
    <form onSubmit={handlePayment}>
      <PaymentElement />

      {paymentError && (
        <p className="mt-3 text-sm text-red-600">
          {paymentError}
        </p>
      )}

      <button
        type="submit"
        disabled={!stripe || !elements || paying}
        className="mt-6 w-full rounded-lg bg-black px-5 py-3 font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
      >
        {paying
          ? "Processing Payment..."
          : "Pay Now"}
      </button>
    </form>
  );
}