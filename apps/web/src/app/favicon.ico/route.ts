import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // Read the custom favicon file (/logo.jpg) directly from public directory
    const logoPath = path.resolve(process.cwd(), "public/logo.jpg");
    if (fs.existsSync(logoPath)) {
      const fileBuffer = fs.readFileSync(logoPath);
      return new Response(fileBuffer, {
        headers: {
          "Content-Type": "image/jpeg",
          "Cache-Control": "public, max-age=3600, must-revalidate",
        },
      });
    }
  } catch (error) {
    console.error("Failed to read favicon file:", error);
  }

  // Fallback default SVG favicon
  const svgFallback = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32">
      <circle cx="16" cy="16" r="16" fill="#2563eb"/>
      <text x="16" y="21" font-size="14" font-family="Arial, sans-serif" font-weight="bold" fill="white" text-anchor="middle">&lt;/&gt;</text>
    </svg>
  `.trim();

  return new Response(svgFallback, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=3600, must-revalidate",
    },
  });
}
