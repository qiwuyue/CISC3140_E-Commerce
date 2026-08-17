"use client";

import { useEffect, useState } from "react";
import type {
    ChangeEvent,
    SyntheticEvent,
} from "react";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { createClient } from "@/lib/supabase/client";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

import {
    checkoutSchema,
    type CheckoutInput,
} from "@ecommerce/shared";
import PaymentForm from "@/components/checkout/paymentForm";

type CheckoutField = keyof CheckoutInput;

type CartProduct = {
    id: string;
    name: string;
    price: string;
    quantity: number;
};

type CartItem = {
    id: string;
    quantity: number;
    product: CartProduct;
};

type Cart = {
    id: string;
    items: CartItem[];
};

const initialForm: CheckoutInput = {
    shippingName: "",
    shippingAddress1: "",
    shippingAddress2: "",
    shippingCity: "",
    shippingState: "",
    shippingPostalCode: "",
    shippingCountry: "US",
    shippingPhone: "",
};



export default function CheckoutPage() {
    const router = useRouter();
    const supabase = createClient();

    const [form, setForm] =
        useState<CheckoutInput>(initialForm);

    const [cart, setCart] =
        useState<Cart | null>(null);

    const [errors, setErrors] = useState<
        Partial<Record<CheckoutField, string>>
    >({});

    const [loading, setLoading] = useState(true);
    const [placingOrder, setPlacingOrder] =
        useState(false);

    const stripePromise = loadStripe(
        process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
    );
    const [clientSecret, setClientSecret] = useState<string | null>(null);
    const [orderId, setOrderId] = useState<string | null>(null);

    useEffect(() => {
        async function loadCheckout() {
            try {
                const {
                    data: { session },
                } = await supabase.auth.getSession();

                if (!session) {
                    router.push("/login?redirect=/checkout");
                    return;
                }

                const token = session.access_token;


                const [profileResponse, cartResponse] =
                    await Promise.all([
                        fetch(
                            `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/profile`,
                            {
                                headers: {
                                    Authorization: `Bearer ${token}`,
                                },
                            }
                        ),

                        fetch(
                            `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/cart`,
                            {
                                headers: {
                                    Authorization: `Bearer ${token}`,
                                },
                            }
                        ),
                    ]);

                const profileResult =
                    await profileResponse.json();

                const cartResult =
                    await cartResponse.json();

                if (!profileResponse.ok) {
                    throw new Error(
                        profileResult.error ||
                        "Failed to load profile"
                    );
                }

                if (!cartResponse.ok) {
                    throw new Error(
                        cartResult.error ||
                        "Failed to load cart"
                    );
                }

                const profile = profileResult.data;
                const loadedCart = cartResult.data;

                if (
                    !loadedCart ||
                    loadedCart.items.length === 0
                ) {
                    toast.error("Your cart is empty");
                    router.push("/cart");
                    return;
                }

                setCart(loadedCart);

                setForm({
                    shippingName: [
                        profile.firstName,
                        profile.lastName,
                    ]
                        .filter(Boolean)
                        .join(" "),

                    shippingAddress1:
                        profile.addressLine1 ?? "",

                    shippingAddress2:
                        profile.addressLine2 ?? "",

                    shippingCity:
                        profile.city ?? "",

                    shippingState:
                        profile.state ?? "",

                    shippingPostalCode:
                        profile.postalCode ?? "",

                    shippingCountry:
                        profile.country ?? "US",

                    shippingPhone:
                        profile.phone ?? "",
                });
            } catch (error) {
                toast.error(
                    error instanceof Error
                        ? error.message
                        : "Failed to load checkout"
                );
            } finally {
                setLoading(false);
            }
        }

        loadCheckout();
    }, [router]);

    function handleChange(
        event: ChangeEvent<HTMLInputElement>
    ) {
        const { name, value } = event.target;

        const field = name as CheckoutField;

        setForm((current) => ({
            ...current,
            [field]: value,
        }));

        // clear prompt error
        setErrors((current) => ({
            ...current,
            [field]: undefined,
        }));
    }

    async function handleSubmit(
        event: SyntheticEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        // Zod validation
        const validation =
            checkoutSchema.safeParse(form);

        if (!validation.success) {
            const fieldErrors: Partial<
                Record<CheckoutField, string>
            > = {};

            for (const issue of validation.error.issues) {
                const field =
                    issue.path[0] as CheckoutField;

                if (
                    field &&
                    !fieldErrors[field]
                ) {
                    fieldErrors[field] = issue.message;
                }
            }

            setErrors(fieldErrors);

            toast.error(
                "Please fix the highlighted fields"
            );

            return;
        }

        try {
            setPlacingOrder(true);

            const {
                data: { session },
            } = await supabase.auth.getSession();

            if (!session) {
                router.push(
                    "/login?redirect=/checkout"
                );
                return;
            }

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/checkout`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json",
                        Authorization:
                            `Bearer ${session.access_token}`,
                    },

                    body: JSON.stringify(
                        validation.data
                    ),
                }
            );

            const result = await response.json();

            if (!response.ok) {
                throw new Error(
                    result.error ||
                    "Failed to place order"
                );
            }

            setClientSecret(result.data.clientSecret);
            setOrderId(result.data.orderId);

            toast.success("Order created. Complete your payment.");

        } catch (error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Failed to place order"
            );
        } finally {
            setPlacingOrder(false);
        }
    }

    if (loading) {
        return (
            <main className="mx-auto max-w-6xl px-6 py-12">
                <p className="text-gray-500">
                    Loading checkout...
                </p>
            </main>
        );
    }

    if (!cart) {
        return null;
    }

    const subtotal = cart.items.reduce(
        (total, item) =>
            total +
            Number(item.product.price) *
            item.quantity,
        0
    );

    const shipping = 0;
    const tax = 0;

    const total =
        subtotal + shipping + tax;

    return (
        <main className="mx-auto max-w-6xl px-6 py-12">
            <div className="mb-8">
                <h1 className="text-3xl font-bold">
                    Checkout
                </h1>

                <p className="mt-2 text-gray-500">
                    Review your shipping information and order.
                </p>
            </div>

            <div
                className="grid gap-8 lg:grid-cols-[1fr_380px]"
            >
                {/* LEFT */}
                <form
                    id="shipping-form"
                    onSubmit={handleSubmit}
                    className="rounded-xl border bg-white p-6 shadow-sm"
                >
                    <section className="rounded-xl border bg-white p-6 shadow-sm">
                        <h2 className="mb-6 text-xl font-semibold">
                            Shipping Information
                        </h2>

                        <div className="grid gap-5 md:grid-cols-2">
                            <div className="md:col-span-2">
                                <Field
                                    label="Full Name"
                                    name="shippingName"
                                    value={form.shippingName}
                                    error={errors.shippingName}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="md:col-span-2">
                                <Field
                                    label="Address Line 1"
                                    name="shippingAddress1"
                                    value={form.shippingAddress1}
                                    error={
                                        errors.shippingAddress1
                                    }
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="md:col-span-2">
                                <Field
                                    label="Address Line 2"
                                    name="shippingAddress2"
                                    value={form.shippingAddress2}
                                    error={
                                        errors.shippingAddress2
                                    }
                                    onChange={handleChange}
                                />
                            </div>

                            <Field
                                label="City"
                                name="shippingCity"
                                value={form.shippingCity}
                                error={errors.shippingCity}
                                onChange={handleChange}
                            />

                            <Field
                                label="State"
                                name="shippingState"
                                value={form.shippingState}
                                error={errors.shippingState}
                                onChange={handleChange}
                            />

                            <Field
                                label="Postal Code"
                                name="shippingPostalCode"
                                value={
                                    form.shippingPostalCode
                                }
                                error={
                                    errors.shippingPostalCode
                                }
                                onChange={handleChange}
                            />

                            <Field
                                label="Country"
                                name="shippingCountry"
                                value={
                                    form.shippingCountry
                                }
                                error={
                                    errors.shippingCountry
                                }
                                onChange={handleChange}
                            />

                            <div className="md:col-span-2">
                                <Field
                                    label="Phone"
                                    name="shippingPhone"
                                    type="tel"
                                    value={form.shippingPhone}
                                    error={
                                        errors.shippingPhone
                                    }
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                    </section>
                </form>
                {clientSecret && orderId && (
                    <section className="mt-6 rounded-xl border bg-white p-6 shadow-sm">
                        <h2 className="mb-5 text-xl font-semibold">
                            Payment
                        </h2>

                        <Elements
                            stripe={stripePromise}
                            options={{
                                clientSecret,
                            }}
                        >
                            <PaymentForm orderId={orderId} />
                        </Elements>
                    </section>
                )}
                {/* RIGHT */}
                <aside className="h-fit rounded-xl border bg-white p-6 shadow-sm lg:sticky lg:top-6">
                    <h2 className="mb-5 text-xl font-semibold">
                        Order Summary
                    </h2>

                    <div className="space-y-4">
                        {cart.items.map((item) => (
                            <div
                                key={item.id}
                                className="flex justify-between gap-4 border-b pb-4"
                            >
                                <div>
                                    <p className="font-medium">
                                        {item.product.name}
                                    </p>

                                    <p className="mt-1 text-sm text-gray-500">
                                        Qty: {item.quantity}
                                    </p>
                                </div>

                                <p className="font-medium">
                                    $
                                    {(
                                        Number(
                                            item.product.price
                                        ) * item.quantity
                                    ).toFixed(2)}
                                </p>
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 space-y-3">
                        <SummaryRow
                            label="Subtotal"
                            value={subtotal}
                        />

                        <SummaryRow
                            label="Shipping"
                            value={shipping}
                        />

                        <SummaryRow
                            label="Tax"
                            value={tax}
                        />

                        <div className="border-t pt-4">
                            <SummaryRow
                                label="Total"
                                value={total}
                                strong
                            />
                        </div>
                    </div>

                    {!clientSecret && (
                        <button
                            type="submit"
                            form="shipping-form"
                            disabled={placingOrder}
                            className="mt-6 w-full rounded-lg bg-black px-5 py-3 font-medium text-white disabled:opacity-50"
                        >
                            {placingOrder
                                ? "Preparing Payment..."
                                : "Continue to Payment"}
                        </button>
                    )}
                    <button
                        type="button"
                        onClick={() =>
                            router.push("/cart")
                        }
                        className="mt-3 w-full rounded-lg border px-5 py-3 font-medium transition hover:bg-gray-50"
                    >
                        Back to Cart
                    </button>
                </aside>
            </div>
        </main>
    );
}

type FieldProps = {
    label: string;
    name: CheckoutField;
    value: string;
    type?: string;
    error?: string;

    onChange: (
        event: ChangeEvent<HTMLInputElement>
    ) => void;
};

function Field({
    label,
    name,
    value,
    type = "text",
    error,
    onChange,
}: FieldProps) {
    return (
        <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-gray-700">
                {label}
            </span>

            <input
                name={name}
                type={type}
                value={value}
                onChange={onChange}
                aria-invalid={Boolean(error)}
                className={`w-full rounded-lg border px-3 py-2.5 outline-none transition ${error
                    ? "border-red-500 focus:border-red-500"
                    : "focus:border-black"
                    }`}
            />

            {error && (
                <p className="mt-1 text-sm text-red-600">
                    {error}
                </p>
            )}
        </label>
    );
}

type SummaryRowProps = {
    label: string;
    value: number;
    strong?: boolean;
};

function SummaryRow({
    label,
    value,
    strong = false,
}: SummaryRowProps) {
    return (
        <div
            className={`flex justify-between ${strong
                ? "text-lg font-semibold"
                : "text-sm"
                }`}
        >
            <span>{label}</span>

            <span>${value.toFixed(2)}</span>
        </div>
    );
}