"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

type FormValues = {
  name: string;
  email: string;
  phone: string;
  organization: string;
  subject: string;
  message: string;
  // Honeypot: real users never see or fill this field. Any bot that fills
  // every field it finds trips it, and the server silently drops the
  // submission without letting the bot know it failed.
  company_url: string;
};

export function ContactForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>();
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const onSubmit = async (values: FormValues) => {
    setStatus("idle");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error("Failed");
      setStatus("success");
      reset();
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center rounded-2xl border border-federal-green/20 bg-federal-green/5 p-12 text-center"
      >
        <CheckCircle2 className="h-10 w-10 text-federal-green" />
        <h3 className="mt-4 font-display text-lg font-bold text-navy-800">Message sent successfully</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Thank you for reaching out. Our team will get back to you shortly.
        </p>
        <Button variant="outlineDark" className="mt-6" onClick={() => setStatus("idle")}>
          Send another message
        </Button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <input
        {...register("company_url")}
        type="text"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute left-[-9999px] h-0 w-0 opacity-0"
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="name" label="Full Name" error={errors.name?.message}>
          <input
            id="name"
            {...register("name", { required: "Please enter your name" })}
            className="input-field"
            placeholder="Your name"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "name-error" : undefined}
          />
        </Field>
        <Field id="email" label="Email Address" error={errors.email?.message}>
          <input
            id="email"
            type="email"
            {...register("email", { required: "Please enter your email" })}
            className="input-field"
            placeholder="you@example.com"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
          />
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="phone" label="Phone (optional)">
          <input id="phone" {...register("phone")} className="input-field" placeholder="+91 00000 00000" />
        </Field>
        <Field id="organization" label="Organization (optional)">
          <input
            id="organization"
            {...register("organization")}
            className="input-field"
            placeholder="Your association / company"
          />
        </Field>
      </div>

      <Field id="subject" label="Subject (optional)">
        <input id="subject" {...register("subject")} className="input-field" placeholder="What is this regarding?" />
      </Field>

      <Field id="message" label="Message" error={errors.message?.message}>
        <textarea
          id="message"
          {...register("message", { required: "Please share a few details", minLength: { value: 10, message: "Please share a few more details" } })}
          rows={5}
          className="input-field resize-none"
          placeholder="Tell us how we can help..."
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? "message-error" : undefined}
        />
      </Field>

      {status === "error" && (
        <p role="alert" aria-live="assertive" className="text-sm text-destructive">
          Something went wrong. Please try again in a moment.
        </p>
      )}

      <Button type="submit" variant="accent" size="lg" disabled={isSubmitting} className="w-full sm:w-auto">
        {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        {isSubmitting ? "Sending..." : "Send Message"}
      </Button>

      <style jsx global>{`
        .input-field {
          width: 100%;
          border-radius: 0.85rem;
          border: 1px solid hsl(var(--border));
          background: hsl(var(--card));
          padding: 0.7rem 1rem;
          font-size: 1rem;
          color: hsl(var(--foreground));
          transition: border-color 0.2s ease;
        }
        .input-field:focus {
          outline: none;
          border-color: #123a61;
        }
      `}</style>
    </form>
  );
}

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block" htmlFor={id}>
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-navy-700/70">{label}</span>
      {children}
      {error && (
        <span id={`${id}-error`} role="alert" className="mt-1 block text-xs text-destructive">
          {error}
        </span>
      )}
    </label>
  );
}
