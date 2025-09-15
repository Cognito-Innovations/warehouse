export async function uploadToCloudinary(file: File): Promise<string | null> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "ALLOWED_PRESET");

  try {
    const response = await fetch("https://api.cloudinary.com/v1_1/de9unppfa/image/upload", {
      method: "POST",
      body: formData,
    });

    const data = await response.json(); 
    return data.secure_url || null;
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    return null;
  }
}