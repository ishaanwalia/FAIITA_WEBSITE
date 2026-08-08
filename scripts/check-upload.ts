/**
 * Self-check for the upload route's magic-byte sniffing. Run: npm run admin:upload-check
 *
 * There is no test runner in this project and this does not justify adding
 * one, but a security check (does the route trust bytes or a client-claimed
 * header?) is exactly the kind of thing that must not be "probably fine".
 */

import assert from "node:assert/strict";
import { sniffImageType } from "../lib/admin/image-sniff";

const bytes = (...b: number[]) => new Blob([new Uint8Array(b)]);

async function main() {
  assert.equal(await sniffImageType(bytes(0xff, 0xd8, 0xff, 0xe0)), "image/jpeg");
  assert.equal(
    await sniffImageType(bytes(0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0, 0, 0, 0)),
    "image/png"
  );
  assert.equal(await sniffImageType(bytes(0x47, 0x49, 0x46, 0x38, 0x39, 0x61)), "image/gif");
  assert.equal(
    await sniffImageType(
      new Blob([new TextEncoder().encode("RIFF"), new Uint8Array([0, 0, 0, 0]), new TextEncoder().encode("WEBP")])
    ),
    "image/webp"
  );
  assert.equal(
    await sniffImageType(
      new Blob([new Uint8Array([0, 0, 0, 0]), new TextEncoder().encode("ftyp"), new TextEncoder().encode("avif")])
    ),
    "image/avif"
  );

  // The actual attack this guards against: an HTML/script payload wearing a
  // spoofed image Content-Type. The route must refuse it on bytes alone.
  assert.equal(
    await sniffImageType(new Blob([new TextEncoder().encode("<script>alert(1)</script>")])),
    null,
    "HTML payload must not sniff as any image type"
  );
  assert.equal(await sniffImageType(bytes(0, 0, 0, 0)), null, "garbage bytes must not sniff as an image type");

  console.log("check-upload: ok");
}

main();
