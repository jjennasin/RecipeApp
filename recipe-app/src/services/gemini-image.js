// src/services/gemini-image.js
const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.error("FATAL: GEMINI_API_KEY environment variable is not set.");
}

// Using Imagen REST predict endpoint
const IMAGE_MODEL_NAME = "imagen-4.0-generate-001";
const IMAGE_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${IMAGE_MODEL_NAME}:predict`;

const MAX_RETRIES = 3;

export async function generateImage(prompt) {
  // TEST LOG: confirm env var is available to Node server
  console.log(
    "gemini-image.js: GEMINI_API_KEY exists:",
    !!process.env.GEMINI_API_KEY
  );

  if (!apiKey || !prompt?.trim()) {
    console.warn("generateImage: missing apiKey or prompt");
    return null;
  }

  const payload = {
    instances: [{ prompt }],
    parameters: {
      sampleCount: 1,
      aspectRatio: "1:1",
    },
  };

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const res = await fetch(IMAGE_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify(payload),
      });

      const text = await res.text();

      // TEST LOG: status + first part of body (safe snippet)
      console.log("Imagen HTTP:", res.status, "body head:", text?.slice(0, 180));

      if (!res.ok) {
        throw new Error(`Imagen failed (${res.status})`);
      }

      let json;
      try {
        json = JSON.parse(text);
      } catch {
        console.error("Imagen returned non-JSON:", text);
        return null;
      }

      // Try common response fields
      const b64 =
        json?.predictions?.[0]?.bytesBase64Encoded ||
        json?.predictions?.[0]?.imageBytes ||
        json?.generatedImages?.[0]?.image?.imageBytes;

      if (!b64) {
        console.error("No base64 image field found. Full response:", json);
        return null;
      }

      // Use png as default for Imagen responses
      return `data:image/png;base64,${b64}`;
    } catch (err) {
      if (attempt === MAX_RETRIES - 1) {
        console.error("Image generation failed after max retries.", err);
        return null;
      }
      const delay = Math.pow(2, attempt) * 1000 + Math.random() * 500;
      console.warn(
        `generateImage attempt ${attempt + 1} failed: ${err.message}. Retrying in ${Math.round(
          delay
        )}ms`
      );
      await new Promise((r) => setTimeout(r, delay));
    }
  }

  return null;
}
