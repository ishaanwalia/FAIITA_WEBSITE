import { del } from "@vercel/blob";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { hasExpired } from "@/lib/popups";

/**
 * Nightly cleanup: a poster whose run has ended is deleted outright — the row
 * and both uploaded pictures.
 *
 * This is the one place in the CMS that throws away an editor's upload, which
 * is exactly what was asked for: a festival poster is meant to disappear, and
 * leaving two multi-megabyte blobs behind for every greeting the federation
 * ever posts is how a storage bill grows without anyone noticing.
 *
 * Scheduled from vercel.json. Vercel sends `Authorization: Bearer $CRON_SECRET`
 * on cron invocations; without that variable set the route refuses everyone,
 * which is the right way round for an endpoint that deletes things.
 */

export const dynamic = "force-dynamic";

export async function GET(request: Request): Promise<Response> {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  const posters = await prisma.popup.findMany();
  const expired = posters.filter((poster) => hasExpired(poster));
  if (expired.length === 0) return Response.json({ deleted: 0 });

  // Only what we uploaded. An editor can paste a path that already lives under
  // /public, and del() would throw on a URL that was never a blob.
  const blobs = expired
    .flatMap((poster) => [poster.imagePortrait, poster.imageLandscape])
    .filter((url) => url.includes(".public.blob.vercel-storage.com"));
  if (blobs.length > 0) await del(blobs);

  await prisma.popup.deleteMany({ where: { id: { in: expired.map((poster) => poster.id) } } });
  revalidatePath("/");

  return Response.json({ deleted: expired.length, blobs: blobs.length });
}
