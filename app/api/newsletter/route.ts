import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const schema = z.object({ email: z.string().email() });

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Please enter a valid email" }, { status: 400 });
    }

    const existing = await prisma.newsletterSubscriber.findUnique({
      where: { email: parsed.data.email },
    });

    if (!existing) {
      await prisma.newsletterSubscriber.create({ data: { email: parsed.data.email } });

      // Notify FAIITA's official inboxes of new subscribers, same recipients
      // as the contact form. Set CONTACT_TO_EMAIL (comma-separated) to override.
      const recipients = process.env.CONTACT_TO_EMAIL
        ? process.env.CONTACT_TO_EMAIL.split(",").map((e) => e.trim())
        : ["secretary@faiita.co.in", "president@faiita.co.in", "ishaan.walia.148@gmail.com"];

      if (process.env.RESEND_API_KEY) {
        try {
          const { Resend } = await import("resend");
          const resend = new Resend(process.env.RESEND_API_KEY);
          const email = {
            from: process.env.CONTACT_FROM_EMAIL ?? "FAIITA Website <onboarding@resend.dev>",
            subject: "New newsletter subscriber",
            text: `A new visitor subscribed to the FAIITA newsletter: ${parsed.data.email}`,
          };

          const { error } = await resend.emails.send({ ...email, to: recipients });
          if (error) {
            console.error("Newsletter notification (combined) failed:", error);
            for (const to of recipients) {
              const single = await resend.emails.send({ ...email, to });
              if (single.error) console.error(`Newsletter notification to ${to} failed:`, single.error);
            }
          }
        } catch (emailError) {
          // Don't fail the request if email delivery fails — the subscriber is already saved.
          console.error("Newsletter notification failed to send:", emailError);
        }
      }
    }

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("Newsletter subscribe error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
