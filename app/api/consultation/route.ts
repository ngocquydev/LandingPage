import { z } from "zod";
import { getDb } from "../../../db";
import { consultationRequests } from "../../../db/schema";
import { estimateFor, isContact } from "../../../lib/offers";

const requestSchema = z.object({
  id: z.string().uuid(),
  name: z.string().trim().min(2).max(80),
  contact: z.string().trim().min(3).max(120).refine(isContact),
  message: z.string().trim().min(10).max(1200),
  plan: z.enum(["landing", "business", "shop"]).nullable(),
  extras: z.array(z.enum(["language", "copy", "analytics"])).max(3),
  consent: z.literal(true),
}).strict();

const maxBodyBytes = 12_000;

function reply(status: number, data: { id: string } | { error: string }) {
  return Response.json(data, { status, headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: Request) {
  const fetchSite = request.headers.get("sec-fetch-site");
  const origin = request.headers.get("origin");
  if (fetchSite ? fetchSite !== "same-origin" : origin && origin !== new URL(request.url).origin) {
    return reply(403, { error: "Yêu cầu cần được gửi từ trang NextWeb." });
  }
  if (request.headers.get("content-type")?.split(";")[0].trim() !== "application/json") {
    return reply(415, { error: "Định dạng yêu cầu chưa hợp lệ." });
  }
  if (!request.body || Number(request.headers.get("content-length")) > maxBodyBytes) {
    return reply(413, { error: "Yêu cầu vượt quá độ dài cho phép." });
  }

  let body: unknown;
  try {
    const reader = request.body.getReader();
    const decoder = new TextDecoder();
    let bytes = 0;
    let text = "";
    for (;;) {
      const { value, done } = await reader.read();
      if (done) break;
      bytes += value.byteLength;
      if (bytes > maxBodyBytes) {
        await reader.cancel();
        return reply(413, { error: "Yêu cầu vượt quá độ dài cho phép." });
      }
      text += decoder.decode(value, { stream: true });
    }
    body = JSON.parse(text + decoder.decode());
  } catch {
    return reply(400, { error: "Dữ liệu biểu mẫu chưa hợp lệ." });
  }

  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) {
    return reply(422, { error: "Kiểm tra họ tên, thông tin liên hệ, mô tả và lựa chọn đồng ý." });
  }

  const { id, name, contact, message, plan, extras } = parsed.data;
  const selectedExtras = plan ? [...new Set(extras)] : [];
  try {
    await getDb().insert(consultationRequests).values({
      id, name, contact, message, plan,
      extras: JSON.stringify(selectedExtras),
      estimate: plan ? estimateFor(plan, selectedExtras) : null,
      createdAt: Date.now(),
    }).onConflictDoNothing();
  } catch {
    return reply(503, { error: "Yêu cầu chưa được lưu. Bạn có thể thử gửi lại." });
  }
  return reply(201, { id });
}
