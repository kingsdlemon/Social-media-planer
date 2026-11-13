"use client";

import { useState, type FormEvent } from "react";
import { Area, Consent, Field, primaryBtn, submitNetlify, Success } from "./shared";
import { mailto, site } from "@/lib/site";

/** Kontaktformular – sendet an Netlify Forms (Formular „kontakt“). */
export function KontaktForm() {
  const [d, setD] = useState({ name: "", email: "", betreff: "", nachricht: "" });
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const set = (k: keyof typeof d, v: string) => setD((x) => ({ ...x, [k]: v }));

  const onSubmit = async (ev: FormEvent) => {
    ev.preventDefault();
    const e: Record<string, string> = {};
    if (d.name.trim().length < 2) e.name = "Bitte geben Sie Ihren Namen an.";
    if (!/^\S+@\S+\.\S+$/.test(d.email)) e.email = "Bitte geben Sie eine gültige E-Mail-Adresse an.";
    if (d.nachricht.trim().length < 5) e.nachricht = "Bitte schreiben Sie uns eine Nachricht.";
    if (!consent) e.consent = "Bitte stimmen Sie der Speicherung zu.";
    setErrors(e);
    if (Object.keys(e).length) return;
    setState("sending");
    try {
      await submitNetlify("kontakt", { ...d, datenschutz: "ja" });
      setState("done");
    } catch {
      setState("error");
    }
  };

  if (state === "done") return <Success title="Nachricht gesendet.">Danke! Wir melden uns so bald wie möglich bei Ihnen.</Success>;

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Name" name="name" autoComplete="name" required value={d.name} onChange={(e) => set("name", e.target.value)} error={errors.name} />
        <Field label="E-Mail" name="email" type="email" autoComplete="email" required value={d.email} onChange={(e) => set("email", e.target.value)} error={errors.email} />
      </div>
      <Field label="Betreff (optional)" name="betreff" value={d.betreff} onChange={(e) => set("betreff", e.target.value)} />
      <div>
        <Area label="Nachricht" name="nachricht" required value={d.nachricht} onChange={(e) => set("nachricht", e.target.value)} />
        {errors.nachricht && <p className="mt-1.5 text-sm text-[#e30000]">{errors.nachricht}</p>}
      </div>
      <Consent checked={consent} onChange={() => setConsent((c) => !c)} error={errors.consent} />
      {state === "error" && (
        <p role="alert" className="rounded-2xl bg-[#fff2f2] p-4 text-base text-[#b00000] dark:bg-[#3a0d0d] dark:text-[#ff8a8a]">
          Das Senden hat leider nicht geklappt. Schreiben Sie uns gern direkt an{" "}
          <a href={mailto()} className="underline">{site.email}</a>.
        </p>
      )}
      <button type="submit" className={primaryBtn} disabled={state === "sending"}>
        {state === "sending" ? "Wird gesendet …" : "Nachricht senden"}
      </button>
    </form>
  );
}
