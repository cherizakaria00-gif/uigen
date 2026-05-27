import { tool } from "ai";
import { z } from "zod";
import Replicate from "replicate";

export function buildGenerateImageTool() {
  return tool({
    description:
      "Generate a real image using AI (FLUX) from a text prompt. Use this whenever a website or component needs images — product photos, hero images, illustrations, avatars, backgrounds, etc. Returns a URL you can use directly in an <img> src or CSS background.",
    parameters: z.object({
      prompt: z
        .string()
        .describe(
          "Detailed description of the image to generate. Be specific about style, colors, composition, and subject."
        ),
      aspect_ratio: z
        .enum(["1:1", "16:9", "9:16", "4:3", "3:4", "2:3", "3:2"])
        .optional()
        .default("1:1")
        .describe("Aspect ratio of the generated image"),
    }),
    execute: async ({ prompt, aspect_ratio }) => {
      if (!process.env.REPLICATE_API_KEY) {
        return {
          error: "REPLICATE_API_KEY not configured",
          url: `https://placehold.co/800x600/e2e8f0/94a3b8?text=${encodeURIComponent(prompt.slice(0, 30))}`,
        };
      }

      try {
        const replicate = new Replicate({ auth: process.env.REPLICATE_API_KEY });

        const output = await replicate.run("black-forest-labs/flux-schnell", {
          input: {
            prompt,
            num_outputs: 1,
            aspect_ratio: aspect_ratio ?? "1:1",
            output_format: "webp",
            output_quality: 80,
          },
        });

        const items = Array.isArray(output) ? output : [output];
        const first = items[0];
        let url: string;
        if (typeof first === "string") {
          url = first;
        } else if (first && typeof (first as any).url === "function") {
          url = ((await (first as any).url()) as URL).href;
        } else {
          url = String(first);
        }

        return { url, prompt };
      } catch (err: any) {
        return {
          error: err.message,
          url: `https://placehold.co/800x600/e2e8f0/94a3b8?text=${encodeURIComponent(prompt.slice(0, 30))}`,
        };
      }
    },
  });
}
