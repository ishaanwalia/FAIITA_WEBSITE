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
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Full Name" error={errors.name?.message}>
          <input
            {...register("name", { required: "Please enter your name" })}
            className="input-field"
            placeholder="Your name"
          />
        </Field>
        <Field label="Email Address" error={errors.email?.message}>
          <input
            type="email"
            {...register("email", { required: "Please enter your email" })}
            className="input-field"
            placeholder="you@example.com"
          />
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Phone (optional)">
          <input {...register("phone")} className="input-field" placeholder="+91 00000 00000" />
        </Field>
        <Field label="Organization (optional)">
          <input {...register("organization")} className="input-field" placeholder="Your association / company" />
        </Field>
      </div>

      <Field label="Subject (optional)">
        <input {...register("subject")} className="input-field" placeholder="What is this regarding?" />
      </Field>

      <Field label="Message" error={errors.message?.message}>
        <textarea
          {...register("message", { required: "Please share a few details", minLength: { value: 10, message: "Please share a few more details" } })}
          rows={5}
          className="input-field resize-none"
          placeholder="Tell us how we can help..."
        />
      </Field>

      {status === "error" && (
        <p className="text-sm text-destructive">Something went wrong. Please try again in a moment.</p>
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
          font-size: 0.875rem;
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

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-navy-700/70">{label}</span>
      {children}
      {error && <span className="mt-1 block text-xs text-destructive">{error}</span>}
    </label>
  );
}
