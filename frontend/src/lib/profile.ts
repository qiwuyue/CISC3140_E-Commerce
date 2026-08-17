//supabase trigger for new register user id connect to profile table.

export async function initProfile(accessToken: string) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/profile/init`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to initialize profile");
  }

  return response.json();
}