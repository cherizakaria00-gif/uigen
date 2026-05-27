import Replicate from "replicate";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.text();
    if (!body) return NextResponse.json({ error: "Empty request body" }, { status: 400 });

    const { prompt } = JSON.parse(body);

    if (!prompt?.trim()) {
      return NextResponse.json({ error: "Prompt required" }, { status: 400 });
    }

    if (!process.env.REPLICATE_API_KEY) {
      return NextResponse.json({ error: "REPLICATE_API_KEY not configured" }, { status: 500 });
    }

    const replicate = new Replicate({ auth: process.env.REPLICATE_API_KEY });

    const output = await replicate.run("black-forest-labs/flux-schnell", {
      input: {
        prompt,
        num_outputs: 1,
        aspect_ratio: "1:1",
        output_format: "webp",
        output_quality: 80,
      },
    });

    const items = Array.isArray(output) ? output : [output];
    const urls: string[] = [];

    for (const item of items) {
      if (typeof item === "string") {
        urls.push(item);
      } else if (item instanceof URL) {
        urls.push(item.href);
      } else if (item && typeof (item as any).url === "function") {
        const u = await (item as any).url();
        urls.push(u instanceof URL ? u.href : String(u));
      } else if (item && typeof (item as any).toString === "function") {
        urls.push((item as any).toString());
      }
    }

    if (urls.length === 0) {
      return NextResponse.json({ error: "No image returned from Replicate" }, { status: 500 });
    }

    return NextResponse.json({ urls });
  } catch (err: any) {
    console.error("[generate-image]", err);
    return NextResponse.json({ error: err.message || "Unknown error" }, { status: 500 });
  }
}

export const maxDuration = 60;
