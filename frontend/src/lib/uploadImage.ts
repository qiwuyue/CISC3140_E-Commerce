export async function uploadProductImage(
  productId: string,
  image: File,
  accessToken: string
) {
  const formData = new FormData();

  formData.append("image", image);

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/admin/products/${productId}/image`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: formData,
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.error || "Failed to upload product image."
    );
  }

  return result;
}