import { updatePassword } from "@/app/account/action";

type SecurityPageProps = {
    searchParams: Promise<{
        error?: string;
        success?: string;
    }>;
};

export default async function SecurityPage({
    searchParams,
}: SecurityPageProps) {
    const messages = await searchParams;

    return (



        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">
                Change password
            </h2>

            <p className="mt-2 text-sm text-slate-500">
                Enter your current password before choosing a new one.
            </p>

            {messages.error && (
                <p className="mt-5 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
                    {messages.error}
                </p>
            )}

            {messages.success && (
                <p className="mt-5 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
                    {messages.success}
                </p>
            )}

            <form
                action={updatePassword}
                noValidate
                className="mt-6 max-w-md space-y-5"
            >
                <div>
                    <label
                        htmlFor="currentPassword"
                        className="mb-2 block text-sm font-medium text-slate-700"
                    >
                        Current password
                    </label>

                    <input
                        id="currentPassword"
                        name="currentPassword"
                        type="password"
                        autoComplete="current-password"
                        className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    />
                </div>

                <div>
                    <label
                        htmlFor="newPassword"
                        className="mb-2 block text-sm font-medium text-slate-700"
                    >
                        New password
                    </label>

                    <input
                        id="newPassword"
                        name="newPassword"
                        type="password"
                        autoComplete="new-password"
                        className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    />
                </div>

                <div>
                    <label
                        htmlFor="confirmPassword"
                        className="mb-2 block text-sm font-medium text-slate-700"
                    >
                        Confirm new password
                    </label>

                    <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        autoComplete="new-password"
                        className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    />
                </div>

                <button
                    type="submit"
                    className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
                >
                    Update password
                </button>
            </form>
        </section>)
}