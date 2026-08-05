"use client";

import { useActionState, useId, useState } from "react";
import { useFormStatus } from "react-dom";
import Image from "next/image";
import { saveResource, type FormState } from "@/app/admin/(dash)/[resource]/actions";
import type { Field, Resource } from "@/lib/admin/resources";

const INPUT =
  "w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/25 focus:border-saffron-500 focus:outline-none focus:ring-1 focus:ring-saffron-500";

type Props = {
  resource: Resource;
  /** "" when creating */
  id: string;
  values: Record<string, string | boolean>;
  relations: Record<string, [string, string][]>;
  filter: string;
};

export function ResourceForm({ resource, id, values, relations, filter }: Props) {
  const [state, action] = useActionState<FormState, FormData>(saveResource, {});

  return (
    <form action={action} className="mt-8 max-w-2xl space-y-6">
      <input type="hidden" name="__resource" value={resource.key} />
      <input type="hidden" name="__id" value={id} />
      <input type="hidden" name="__filter" value={filter} />

      {resource.fields.map((field) => (
        <FieldRow
          key={field.name}
          field={field}
          value={values[field.name]}
          options={relations[field.name]}
        />
      ))}

      {state.error && (
        <p role="alert" className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {state.error}
        </p>
      )}

      <SaveButton />
    </form>
  );
}

function SaveButton() {
  const { pending } = useFormStatus();
  return (
    <div className="flex items-center gap-4 border-t border-white/10 pt-6">
      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-saffron-500 px-6 py-2.5 text-sm font-semibold text-navy-900 hover:bg-saffron-400 disabled:opacity-50"
      >
        {pending ? "Saving…" : "Save"}
      </button>
      <p className="text-xs text-white/35">
        {pending ? "Publishing to the live site…" : "Saved changes appear on the site within about a second."}
      </p>
    </div>
  );
}

function FieldRow({
  field,
  value,
  options,
}: {
  field: Field;
  value: string | boolean | undefined;
  options?: [string, string][];
}) {
  const id = useId();
  const help = field.help ? `${id}-help` : undefined;

  if (field.type === "boolean") {
    return (
      <div className="flex items-start gap-3">
        <input
          id={id}
          name={field.name}
          type="checkbox"
          defaultChecked={value === true}
          aria-describedby={help}
          className="mt-0.5 h-4 w-4 rounded border-white/20 bg-white/10 accent-saffron-500"
        />
        <div>
          <label htmlFor={id} className="text-sm text-white">
            {field.label}
          </label>
          {field.help && (
            <p id={help} className="mt-0.5 text-xs text-white/35">
              {field.help}
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-white">
        {field.label}
        {field.required && <span className="ml-1 text-saffron-400">*</span>}
      </label>
      {field.help && (
        <p id={help} className="mt-1 text-xs text-white/35">
          {field.help}
        </p>
      )}

      <div className="mt-2">
        {field.type === "image" ? (
          <ImageInput id={id} field={field} value={String(value ?? "")} describedBy={help} />
        ) : field.type === "select" ? (
          <select id={id} name={field.name} defaultValue={String(value ?? "")} aria-describedby={help} className={INPUT}>
            <option value="">—</option>
            {field.options?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        ) : field.type === "relation" ? (
          <select id={id} name={field.name} defaultValue={String(value ?? "")} aria-describedby={help} className={INPUT}>
            <option value="">—</option>
            {options?.map(([optionId, label]) => (
              <option key={optionId} value={optionId}>
                {label}
              </option>
            ))}
          </select>
        ) : field.type === "textarea" || field.type === "lines" ? (
          <textarea
            id={id}
            name={field.name}
            defaultValue={String(value ?? "")}
            rows={field.type === "lines" ? 5 : 8}
            aria-describedby={help}
            className={`${INPUT} leading-relaxed`}
          />
        ) : (
          <input
            id={id}
            name={field.name}
            type={field.type === "date" ? "date" : field.type === "number" ? "number" : "text"}
            step={field.type === "number" ? "any" : undefined}
            defaultValue={String(value ?? "")}
            aria-describedby={help}
            className={INPUT}
          />
        )}
      </div>
    </div>
  );
}

/** Longest edge of a stored photograph. The gallery never renders larger. */
const MAX_EDGE = 2000;

/**
 * Re-encode a picture to WebP before uploading it (plan 5.9).
 *
 * A canvas does this on the editor's machine, so a 5 MB photograph off a phone
 * leaves as a few hundred KB and never crosses the connection at full size. If
 * anything here fails — an animated GIF, a browser without WebP encoding — the
 * original file is uploaded untouched, which still works.
 */
async function toWebp(file: File): Promise<File> {
  if (file.type === "image/gif") return file;

  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);

    const context = canvas.getContext("2d");
    if (!context) return file;
    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/webp", 0.82),
    );
    if (!blob || blob.type !== "image/webp") return file;

    return new File([blob], `${file.name.replace(/\.[^.]+$/, "")}.webp`, { type: "image/webp" });
  } catch {
    return file;
  }
}

/**
 * A URL box you can also put a file into. The database only ever stores the
 * URL, so pasting a path that is already under /public keeps working.
 */
function ImageInput({
  id,
  field,
  value,
  describedBy,
}: {
  id: string;
  field: Field;
  value: string;
  describedBy?: string;
}) {
  const [url, setUrl] = useState(value);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function upload(file: File) {
    setBusy(true);
    setError("");
    try {
      const body = new FormData();
      body.append("file", await toWebp(file));
      const response = await fetch("/api/admin/upload", { method: "POST", body });
      const result = (await response.json()) as { url?: string; error?: string };
      if (!response.ok || !result.url) throw new Error(result.error ?? "Upload failed.");
      setUrl(result.url);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Upload failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-2">
      <input
        id={id}
        name={field.name}
        type="text"
        value={url}
        onChange={(event) => setUrl(event.target.value)}
        placeholder="/images/example.webp or https://…"
        aria-describedby={describedBy}
        className={INPUT}
      />

      <div className="flex items-center gap-3">
        <label className="cursor-pointer rounded-full border border-white/15 px-4 py-1.5 text-xs text-white/60 hover:text-white">
          {busy ? "Uploading…" : "Upload a picture"}
          <input
            type="file"
            accept="image/*"
            className="sr-only"
            disabled={busy}
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) void upload(file);
              event.target.value = "";
            }}
          />
        </label>
        {url && (
          <span className="relative h-10 w-16 overflow-hidden rounded-lg border border-white/10 bg-white/5">
            <Image src={url} alt="" fill sizes="64px" className="object-cover" unoptimized />
          </span>
        )}
      </div>

      {error && (
        <p role="alert" className="text-xs text-red-300">
          {error}
        </p>
      )}
    </div>
  );
}
