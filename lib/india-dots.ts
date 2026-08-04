/**
 * India as a dot matrix — the federation's own shape, used as a rendering
 * primitive by the cinematic loader and the About mega-menu map.
 *
 * Generated once from `public/india-map.svg` by rasterising it to a 300×300
 * canvas and sampling pixel alpha every 4px. That SVG is 208 KB and has to be
 * parsed at runtime; this is **737 characters**, so anywhere the shape is
 * needed decoratively should use this instead of the SVG.
 *
 * Encoding: rows of run-length x-ranges in grid units (0–74), `y:a-b,c;y:…`.
 * Regenerate by re-running the sampler against the SVG if the map ever changes.
 */

const RAW =
  "4:19-22;5:18-23;6:17-25;7:18-26,28-32;8:19-32;9:19-31;10:19-30;11:19-29;12:19-29;13:19-30;14:20-30;15:22-28;16:21-29;17:21-29;18:21-30;19:20-32;20:20-33;21:18-32;22:18-32;23:18-31,61-64;24:16-33,60-65;25:16-34,58-67;26:12,14-36,49,57-66;27:11-41,49,57-65;28:11-41,49-50,56-63;29:12-46,49-62;30:12-48,51-62;31:13-49,52-62;32:13-48,57-61;33:14-48,57-61;34:9-10,12-49,57-61;35:8-49,55-59;36:9-49,55,58-59;37:10-49,58;38:11-50,58;39:10-15,17-50;40:11-15,17-46;41:12-15,17-45;42:17-45;43:17-45;44:17-43;45:17-41;46:18-41;47:18-40;48:18-38;49:18-37;50:18-36;51:18-36;52:19-33;53:19-32;54:20-31;55:20-31;56:21-31;57:21-32;58:21-32,58;59:22-32,58;60:22-31,58,60;61:23-31;62:23-31;63:24-31;64:24-31;65:24-29;66:25-29;67:25-27;68:26-27;69:59;71:60";

/** Grid is 0–74 on both axes (300px sampled every 4px). */
const GRID_MAX = 74;

export type Dot = {
  /** Normalised 0–1 within the map's bounding box. */
  nx: number;
  ny: number;
};

function decode(): Dot[] {
  const dots: Dot[] = [];
  for (const row of RAW.split(";")) {
    const [yPart, runsPart] = row.split(":");
    const y = Number(yPart);
    for (const run of runsPart.split(",")) {
      const [a, b] = run.split("-");
      const from = Number(a);
      const to = b === undefined ? from : Number(b);
      for (let x = from; x <= to; x++) dots.push({ nx: x / GRID_MAX, ny: y / GRID_MAX });
    }
  }
  return dots;
}

export const INDIA_DOTS: Dot[] = decode();

/**
 * 26 well-spread anchor points, one per covered state, chosen by
 * farthest-point sampling so they're guaranteed to sit inside the landmass and
 * never cluster. Deterministic — same input, same output every render.
 *
 * ponytail: geometric spread, not real state centroids. Good enough while
 * these are decorative; swap in the centroids from IndiaMap.tsx if a hub ever
 * needs to be clickable-per-state.
 */
function pickHubs(count: number): Dot[] {
  if (!INDIA_DOTS.length) return [];
  const picked: Dot[] = [INDIA_DOTS[Math.floor(INDIA_DOTS.length / 3)]];
  while (picked.length < count) {
    let best: Dot | null = null;
    let bestDist = -1;
    for (const p of INDIA_DOTS) {
      let nearest = Infinity;
      for (const q of picked) {
        const d = (p.nx - q.nx) ** 2 + (p.ny - q.ny) ** 2;
        if (d < nearest) nearest = d;
      }
      if (nearest > bestDist) {
        bestDist = nearest;
        best = p;
      }
    }
    if (!best) break;
    picked.push(best);
  }
  return picked;
}

export const INDIA_HUBS: Dot[] = pickHubs(26);
