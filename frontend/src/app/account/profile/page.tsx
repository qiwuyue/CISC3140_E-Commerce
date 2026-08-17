"use client";

import { SubmitEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { createClient } from "@/lib/supabase/client";

import {
  profileSchema,
  type ProfileInput,
} from "@ecommerce/shared";



const initialForm: ProfileInput = {
  firstName: "",
  lastName: "",
  phone: "",

  addressLine1: "",
  addressLine2: "",

  city: "",
  state: "",
  postalCode: "",
  country: "US",
};
//form error
type ProfileField = keyof ProfileInput;



export default function AccountPage() {
  const router = useRouter();
  const [errors, setErrors] = useState<Partial<Record<ProfileField, string>>>({});
  const [form, setForm] = useState<ProfileInput>(initialForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    async function loadProfile() {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
          router.push("/login?redirect=/account");
          return;
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/profile`,
          {
            headers: {
              Authorization: `Bearer ${session.access_token}`,
            },
          }
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || "Failed to load profile");
        }

        const profile = result.data;

        setForm({
          firstName: profile.firstName ?? "",
          lastName: profile.lastName ?? "",
          phone: profile.phone ?? "",

          addressLine1: profile.addressLine1 ?? "",
          addressLine2: profile.addressLine2 ?? "",
          city: profile.city ?? "",
          state: profile.state ?? "",
          postalCode: profile.postalCode ?? "",
          country: profile.country ?? "US",
        });
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Failed to load profile";

        toast.error(message);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [router]);

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const { name, value } = event.target;

    const field = name as ProfileField;

    setForm((current) => ({
      ...current,
      [field]: value,
    }));


    setErrors((current) => ({
      ...current,
      [field]: undefined,
    }));
  }

  async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    const validation = profileSchema.safeParse(form);

    if (!validation.success) {
      const fieldErrors: Partial<
        Record<ProfileField, string>
      > = {};

      for (const issue of validation.error.issues) {
        const field = issue.path[0] as ProfileField;

        if (field && !fieldErrors[field]) {
          fieldErrors[field] = issue.message;
        }
      }


      setErrors(fieldErrors);
      toast.error("Please check your information");

      return;
    }

    setErrors({});

    try {
      setSaving(true);

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push("/login?redirect=/account/profile");
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/profile`,
        {
          method: "PATCH",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },

          body: JSON.stringify(validation.data),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error || "Failed to update profile"
        );
      }

      setForm(validation.data);

      toast.success("Profile updated");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update profile"
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="mx-auto max-w-4xl px-6 py-12">
        <p className="text-gray-500">Loading profile...</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">My Account</h1>

        <p className="mt-2 text-gray-500">
          Manage your personal information and default shipping address.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-8 rounded-xl border bg-white p-6 shadow-sm"
      >
        {/* Personal Information */}
        <section>
          <h2 className="mb-4 text-xl font-semibold">
            Personal Information
          </h2>

          <div className="grid gap-4 md:grid-cols-2">
            <Field
              label="First Name"
              name="firstName"
              value={form.firstName}
              error={errors.firstName}
              onChange={handleChange}
            />

            <Field
              label="Last Name"
              name="lastName"
              value={form.lastName}
              error={errors.lastName}
              onChange={handleChange}
            />

            <Field
              label="Phone"
              name="phone"
              type="tel"
              value={form.phone}
              error={errors.phone}
              onChange={handleChange}
            />
          </div>
        </section>

        <hr />

        {/* Shipping Address */}
        <section>
          <h2 className="mb-4 text-xl font-semibold">
            Default Shipping Address
          </h2>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <Field
                label="Address Line 1"
                name="addressLine1"
                value={form.addressLine1}
                error={errors.addressLine1}

                onChange={handleChange}
              />
            </div>

            <div className="md:col-span-2">
              <Field
                label="Address Line 2"
                name="addressLine2"
                value={form.addressLine2}
                error={errors.addressLine2}
                onChange={handleChange}
              />
            </div>

            <Field
              label="City"
              name="city"
              value={form.city}
              error={errors.city}
              onChange={handleChange}
            />

            <Field
              label="State"
              name="state"
              value={form.state}
              error={errors.state}
              onChange={handleChange}
            />

            <Field
              label="Postal Code"
              name="postalCode"
              value={form.postalCode}
              error={errors.postalCode}
              onChange={handleChange}
            />

            <Field
              label="Country"
              name="country"
              value={form.country}
              error={errors.country}
              onChange={handleChange}
            />
          </div>
        </section>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-black px-6 py-3 font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </main>
  );
}

type FieldProps = {
  label: string;
  name: ProfileField;
  value: string;
  type?: string;
  error?: string;
  onChange: (
    event: React.ChangeEvent<HTMLInputElement>
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
        aria-describedby={error ? `${name}-error` : undefined}
        className={`w-full rounded-lg border px-3 py-2.5 outline-none transition ${error
            ? "border-red-500 focus:border-red-500"
            : "focus:border-black"
          }`}
      />

      {error && (
        <p
          id={`${name}-error`}
          className="mt-1 text-sm text-red-600"
        >
          {error}
        </p>
      )}
    </label>
  );
}