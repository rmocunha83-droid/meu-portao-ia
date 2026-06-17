import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";

const http = httpRouter();

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
const SUPPORTED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  });
}

function textField(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

function fileName(file: Blob) {
  const possibleName = "name" in file ? String(file.name || "") : "";
  return possibleName || "fachada.png";
}

function buildPrompt(styles: string, description: string) {
  const selectedStyles = styles || "moderno, seguro, elegante";
  const extraDetails = description
    ? `The homeowner asked for these details: ${description}.`
    : "No extra homeowner details were provided.";

  return [
    "Edit the uploaded residential facade photo into a realistic after-renovation concept for a new front gate.",
    "Keep the exact same house, camera angle, street context, roofline, wall layout, openings, scale, perspective, and overall architecture.",
    `Replace the existing gate or garage door with a new gate inspired by these styles: ${selectedStyles}.`,
    extraDetails,
    "The gate is the main transformation: make it attractive, buildable, secure, and coherent with a Brazilian home facade.",
    "If the walls look old, stained, or tired, subtly improve them with a clean painted finish while preserving their original color family and texture.",
    "Add tasteful warm exterior lighting only where it feels natural, such as discreet sconces or soft architectural light near the gate.",
    "Improve exposure, contrast, color, and curb appeal like a polished real-estate renovation photo, but keep the before/after comparison believable.",
    "Do not change the house into a different property. Do not add text, logos, watermarks, people, cars, fantasy materials, or impossible luxury elements.",
  ].join(" ");
}

http.route({
  path: "/generate-gate-simulation",
  method: "OPTIONS",
  handler: httpAction(async () => new Response(null, { status: 204, headers: corsHeaders })),
});

http.route({
  path: "/generate-gate-simulation",
  method: "POST",
  handler: httpAction(async (_ctx, req) => {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return jsonResponse({
        error: "A chave OPENAI_API_KEY ainda não está configurada no backend.",
      }, 500);
    }

    let formData: FormData;
    try {
      formData = await req.formData();
    } catch {
      return jsonResponse({ error: "Não foi possível ler a foto enviada." }, 400);
    }

    const uploaded = formData.get("facade");
    if (!(uploaded instanceof Blob)) {
      return jsonResponse({ error: "Envie uma foto da fachada para gerar a simulação." }, 400);
    }

    if (!SUPPORTED_TYPES.has(uploaded.type)) {
      return jsonResponse({ error: "Use uma imagem JPG, PNG ou WebP." }, 400);
    }

    if (uploaded.size > MAX_IMAGE_BYTES) {
      return jsonResponse({ error: "A foto precisa ter até 10 MB." }, 400);
    }

    const styles = textField(formData.get("styles"));
    const description = textField(formData.get("description"));
    const prompt = buildPrompt(styles, description);

    const openAiForm = new FormData();
    openAiForm.append("model", "gpt-image-1");
    openAiForm.append("image", uploaded, fileName(uploaded));
    openAiForm.append("prompt", prompt);
    openAiForm.append("n", "3");
    openAiForm.append("size", "1024x1024");
    openAiForm.append("quality", "medium");

    const response = await fetch("https://api.openai.com/v1/images/edits", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      body: openAiForm,
    });

    const payload = await response.json().catch(() => null);
    if (!response.ok) {
      const message =
        payload?.error?.message ||
        "A OpenAI não conseguiu gerar a simulação agora.";
      return jsonResponse({ error: message }, response.status);
    }

    const images = Array.isArray(payload?.data)
      ? payload.data
          .map((item: { b64_json?: string; revised_prompt?: string }) => ({
            url: item.b64_json ? `data:image/png;base64,${item.b64_json}` : null,
            revisedPrompt: item.revised_prompt || null,
          }))
          .filter((item: { url: string | null }) => Boolean(item.url))
      : [];

    if (images.length === 0) {
      return jsonResponse({ error: "A geração terminou sem retornar imagens." }, 502);
    }

    return jsonResponse({ images });
  }),
});

export default http;
