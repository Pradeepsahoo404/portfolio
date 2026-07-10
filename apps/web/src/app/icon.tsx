import { ImageResponse } from "next/og";


// Image metadata
export const size = {
  width: 32,
  height: 32,
};
export const contentType = "image/png";

// Image generation
export default async function Icon() {
  try {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api/v1";
    const workspaceSlug = process.env.NEXT_PUBLIC_WORKSPACE_SLUG || "pradeep-sahoo-studio";
    
    // Fetch bootstrap data directly
    const res = await fetch(`${apiBaseUrl}/public/${workspaceSlug}/bootstrap`);
    if (res.ok) {
      const json = await res.json();
      const logoUrl = json?.data?.site?.logo || json?.data?.workspace?.logo;

      if (logoUrl) {
        const response = await fetch(logoUrl);
        if (response.ok) {
          const arrayBuffer = await response.arrayBuffer();
          return new Response(arrayBuffer, {
            headers: {
              "Content-Type": response.headers.get("Content-Type") || contentType,
              "Cache-Control": "public, max-age=3600, must-revalidate",
            },
          });
        }
      }
    }
  } catch (error) {
    console.error("Failed to fetch dynamic favicon, using fallback:", error);
  }

  // Fallback default dynamic icon (</> inside blue circle)
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 20,
          background: "#2563eb",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          borderRadius: "50%",
          fontWeight: "bold",
        }}
      >
        &lt;/&gt;
      </div>
    ),
    {
      ...size,
    }
  );
}
