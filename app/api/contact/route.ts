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

    // Optional: email the secretary via Resend if configured.
    if (process.env.RESEND_API_KEY && process.env.CONTACT_TO_EMAIL) {
      try {
        const { Resend } = await import("resend");
        const resend = new Resend(process.env.RESEND_API_KEY);
        await resend.emails.send({
          from: "FAIITA Website <onboarding@resend.dev>",
          to: process.env.CONTACT_TO_EMAIL,
          replyTo: parsed.data.email,
          subject: `New contact form submission: ${parsed.data.subject ?? "General enquiry"}`,
          text: [
            `Name: ${parsed.data.name}`,
            `Email: ${parsed.data.email}`,
            `Phone: ${parsed.data.phone ?? "—"}`,
            `Organization: ${parsed.data.organization ?? "—"}`,
            "",
            parsed.data.message,
          ].join("\n"),
        });
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
