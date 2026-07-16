import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  name: z.string().min(2, "Please enter your name"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().optional(),
  organization: z.string().optional(),
  subject: z.string().optional(),
  message: z.string().min(10, "Please share a few more details"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid submission" },
        { status: 400 }
      );
    }

    const submission = await prisma.contactSubmission.create({ data: parsed.data });

    // Form submissions are delivered to FAIITA's official inboxes. Set
    // CONTACT_TO_EMAIL (comma-separated) in the environment to override.
    const recipients = process.env.CONTACT_TO_EMAIL
      ? process.env.CONTACT_TO_EMAIL.split(",").map((e) => e.trim())
      : ["secretary@faiita.co.in", "president@faiita.co.in", "ishaan.walia.148@gmail.com"];

    if (process.env.RESEND_API_KEY) {
      try {
        const { Resend } = await import("resend");
        const resend = new Resend(process.env.RESEND_API_KEY);
        const email = {
          // Until faiita.co.in is verified in Resend, only the resend.dev
          // sender works (and delivers solely to the Resend account owner).
          // After DNS verification, set CONTACT_FROM_EMAIL to e.g.
          // "FAIITA Website <forms@faiita.co.in>" for delivery to all inboxes.
          from: process.env.CONTACT_FROM_EMAIL ?? "FAIITA Website <onboarding@resend.dev>",
          replyTo: parsed.data.email,
          subject: `New contact form submission: ${parsed.data.subject || "General enquiry"}`,
          text: [
            `Name: ${parsed.data.name}`,
            `Email: ${parsed.data.email}`,
            `Phone: ${parsed.data.phone ?? "—"}`,
            `Organization: ${parsed.data.organization ?? "—"}`,
            "",
            parsed.data.message,
          ].join("\n"),
        };

        // Resend returns errors instead of throwing. A combined send fails
        // entirely if ANY recipient is disallowed (e.g. Resend test mode only
        // permits the account owner's address until the domain is verified),
        // so fall back to per-recipient sends to reach whoever is deliverable.
        const { error } = await resend.emails.send({ ...email, to: recipients });
        if (error) {
          console.error("Contact email (combined) failed:", error);
          for (const to of recipients) {
            const single = await resend.emails.send({ ...email, to });
            if (single.error) console.error(`Contact email to ${to} failed:`, single.error);
          }
        }
      } catch (emailError) {
        // Don't fail the request if email delivery fails — the submission is already saved.
        console.error("Contact email failed to send:", emailError);
      }
    }

    return NextResponse.json({ id: submission.id }, { status: 201 });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
