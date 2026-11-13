"use client";

import Link from "next/link";
import type { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from "react";

/** Sendet ein Formular an Netlify Forms (Felder sind in public/__forms.html registriert). */
export async function submitNetlify(formName: string, data: Record<string, string>) {
  const body = new URLSearchParams({ "form-name": formName, ...data }).toString();
  const res = await fetch("/__forms.html", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  if (!res.ok) throw new Error(`Status ${res.status}`);
}

const fieldBase =
  "mt-2 block w-full rounded-2xl border border-line bg-paper px-4 py-3.5 text-lg text-ink outline-none transition-[border-color,box-shadow] " +
  "placeholder:text-ink-soft/60 focus:border-brand focus:shadow-[0_0_0_4px_rgba(0,113,227,0.15)] " +
  "aria-[invalid=true]:border-[#e30000] dark:border-white/15 dark:bg-night dark:text-white";

export function Field({
  label,
  hint,
  error,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { label: string; hint?: string; error?: string }) {
  const id = props.id ?? props.name;
  return (
    <div>
      <label htmlFor={id} className="text-base font-medium">
        {label}
        {props.required && <span className="text-ink-soft"> *</span>}
      </label>
      <input id={id} aria-invalid={error ? true : undefined} aria-describedby={error ? `${id}-err` : undefined} className={fieldBase} {...props} />
      {hint && !error && <p className="mt-1.5 text-sm text-ink-soft">{hint}</p>}
      {error && (
        <p id={`${id}-err`} className="mt-1.5 text-sm text-[#e30000]">
          {error}
        </p>
      )}
    </div>
  );
}

export function Area({ label, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }) {
  const id = props.id ?? props.name;
  return (
    <div>
      <label htmlFor={id} className="text-base font-medium">
        {label}
        {props.required && <span className="text-ink-soft"> *</span>}
      </label>
      <textarea id={id} rows={5} className={fieldBase} {...props} />
    </div>
  );
}

/** Auswahl-Chip (Checkbox oder Radio im Apple-Look) */
export function Chip({ type = "checkbox", name, value, checked, onChange, children }: {
  type?: "checkbox" | "radio";
  name: string;
  value: string;
  checked: boolean;
  onChange: () => void;
  children: ReactNode;
}) {
  return (
    <label
      className={`inline-flex min-h-11 cursor-pointer items-center rounded-full px-5 text-base transition-colors select-none has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-brand ${
        checked ? "bg-brand text-white" : "bg-paper text-ink ring-1 ring-line hover:ring-ink/40 dark:bg-night dark:text-white dark:ring-white/20"
      }`}
    >
      <input type={type} name={name} value={value} checked={checked} onChange={onChange} className="sr-only" />
      {children}
    </label>
  );
}

export function Consent({ checked, onChange, error }: { checked: boolean; onChange: () => void; error?: string }) {
  return (
    <div>
      <label className="flex items-start gap-3 text-base">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          aria-invalid={error ? true : undefined}
          className="mt-1 size-5 shrink-0 accent-[#0071e3]"
        />
        <span>
          Ich bin einverstanden, dass meine Angaben zur Bearbeitung meiner Anfrage gespeichert werden. Mehr in der{" "}
          <Link href="/datenschutz/" className="link">
            Datenschutzerklärung
          </Link>
          .
        </span>
      </label>
      {error && <p className="mt-1.5 text-sm text-[#e30000]">{error}</p>}
    </div>
  );
}

export const primaryBtn =
  "inline-flex min-h-12 items-center justify-center rounded-full bg-brand px-7 text-[1.05rem] font-medium text-white transition-[background-color,scale] hover:bg-[#0077ed] active:scale-[0.97] disabled:opacity-50";
export const secondaryBtn =
  "inline-flex min-h-12 items-center justify-center rounded-full px-5 text-[1.05rem] text-brand-dark hover:underline dark:text-[#2997ff]";

export function Success({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div role="status" className="py-10 text-center">
      <span className="mx-auto grid size-16 place-items-center rounded-full bg-[#34c759] text-white">
        <svg aria-hidden="true" viewBox="0 0 24 24" className="size-8" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12.5l4.5 4.5L19 7.5" />
        </svg>
      </span>
      <h3 className="mt-6 text-3xl">{title}</h3>
      <p className="mx-auto mt-3 max-w-md text-lg text-ink-soft dark:text-white/70">{children}</p>
    </div>
  );
}
