import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

/**
 * Withdrawal of newsletter consent — DPDP Sec. 6(4).
 *
 * The Act requires that withdrawing consent be **as easy as giving it**. Giving
 * it here is typing an address into a box and pressing a button. Before this
 * route the only documented way out was emailing `secretary@faiita.co.in` and
 * waiting for a person — which is plainly not the same thing, and was the
 * clearest unmet requirement on this site.
 *
 * The subscribe route already anticipated this: it undeletes a soft-deleted
 * row on resubscribe, with a comment referring to "a future unsubscribe". This
 * is that unsubscribe. Nothing about the schema had to change.
 *
 * ponytail: mirrors the subscribe form exactly — one email field, one button.
 * A tokenised link per subscriber would be better for links inside a mailing,
 * and `NewsletterSubscriber.id` is already an unguessable cuid that could serve
 * as the token with no migration. Worth adding the day FAIITA sends the
 * newsletter from the site rather than exporting the list and mailing it
 * elsewhere.
 */

const schema = z.object({
  email: z.string().email(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Please enter a valid email" }, { status: 400 });
    }

    const email = parsed.data.email.trim().toLowerCase();

    const existing = await prisma.newsletterSubscriber.findUnique({ where: { email } });

    if (existing && !existing.deletedAt) {
      await prisma.newsletterSubscriber.update({
        where: { id: existing.id },
        data: { deletedAt: new Date() },
      });
    }

    // The SAME answer whether or not that address was on the list, and whether
    // or not it was already removed.
    //
    // Otherwise this route becomes a membership oracle: anyone could type an
    // address and learn from the response whether that person subscribes to
    // FAIITA. That is a disclosure about a third party, made by the very
    // endpoint built to protect people — so the response says what happened to
    // the list from the requester's point of view and nothing about its
    // contents.
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Newsletter unsubscribe error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
