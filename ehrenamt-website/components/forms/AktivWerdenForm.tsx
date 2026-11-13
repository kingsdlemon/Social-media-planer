"use client";

import { useRef, useState, type FormEvent } from "react";
import { Area, Chip, Consent, Field, primaryBtn, secondaryBtn, submitNetlify, Success } from "./shared";
import { mailto, site } from "@/lib/site";

const bereiche = ["Museen & Shops", "Archive & Sammlungen", "Musik & Theater", "Parks & Denkmäler", "Bildung & Lesen", "Büro & Verein", "Noch offen"];
const zeiten = ["Wenige Stunden im Monat", "Etwa einmal pro Woche", "Mehrmals pro Woche", "Gelegentlich / spontan"];
const steps = ["Über Sie", "Interessen", "Kontakt"];

type Data = { name: string; alter: string; ort: string; interessen: string[]; zeit: string; ueberMich: string; email: string; telefon: string; kontaktweg: string };

/** „Aktiv werden“ in drei Schritten – sendet an Netlify Forms (Formular „aktiv-werden“). */
export function AktivWerdenForm() {
  const [step, setStep] = useState(0);
  const [d, setD] = useState<Data>({ name: "", alter: "", ort: "", interessen: [], zeit: "", ueberMich: "", email: "", telefon: "", kontaktweg: "E-Mail" });
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const top = useRef<HTMLDivElement>(null);

  const set = (k: keyof Data, v: string) => setD((x) => ({ ...x, [k]: v }));
  const toggle = (v: string) =>
    setD((x) => ({ ...x, interessen: x.interessen.includes(v) ? x.interessen.filter((i) => i !== v) : [...x.interessen, v] }));

  const validate = (s: number) => {
    const e: Record<string, string> = {};
    if (s === 0 && d.name.trim().length < 2) e.name = "Bitte geben Sie Ihren Namen an.";
    if (s === 1 && d.interessen.length === 0) e.interessen = "Bitte wählen Sie mindestens einen Bereich.";
    if (s === 1 && !d.zeit) e.zeit = "Bitte wählen Sie, wie viel Zeit Sie haben.";
    if (s === 2 && !/^\S+@\S+\.\S+$/.test(d.email)) e.email = "Bitte geben Sie eine gültige E-Mail-Adresse an.";
    if (s === 2 && !consent) e.consent = "Bitte stimmen Sie der Speicherung zu.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const goto = (s: number) => {
    setStep(s);
    top.current?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
  };

  const onSubmit = async (ev: FormEvent) => {
    ev.preventDefault();
    if (step < 2) {
      if (validate(step)) goto(step + 1);
      return;
    }
    if (!validate(2)) return;
    setState("sending");
    try {
      await submitNetlify("aktiv-werden", {
        name: d.name, alter: d.alter, ort: d.ort, interessen: d.interessen.join(", "), zeit: d.zeit,
        "ueber-mich": d.ueberMich, email: d.email, telefon: d.telefon, kontaktweg: d.kontaktweg, datenschutz: "ja",
      });
      setState("done");
    } catch {
      setState("error");
    }
  };

  if (state === "done")
    return (
      <Success title={`Danke, ${d.name.split(" ")[0]}!`}>
        Ihre Angaben sind bei uns angekommen. Wir melden uns in den nächsten Tagen per {d.kontaktweg === "Telefon" ? "Telefon" : "E-Mail"} bei Ihnen.
      </Success>
    );

  return (
    <div ref={top} className="scroll-mt-28">
      {/* Fortschritt */}
      <ol className="mb-8 grid grid-cols-3 gap-2" aria-label="Fortschritt">
        {steps.map((s, i) => (
          <li key={s} aria-current={i === step ? "step" : undefined}>
            <span className={`block h-1.5 rounded-full transition-colors duration-300 ${i <= step ? "bg-brand" : "bg-line dark:bg-white/15"}`} />
            <span className={`mt-2 block text-sm ${i === step ? "font-medium text-ink dark:text-white" : "text-ink-soft"}`}>
              {i + 1}. {s}
            </span>
          </li>
        ))}
      </ol>

      <form onSubmit={onSubmit} noValidate className="space-y-6">
        {step === 0 && (
          <fieldset className="space-y-6">
            <legend className="text-3xl font-semibold tracking-tight">Erzählen Sie uns von sich.</legend>
            <Field label="Name" name="name" autoComplete="name" required value={d.name} onChange={(e) => set("name", e.target.value)} error={errors.name} />
            <div className="grid gap-6 sm:grid-cols-2">
              <Field label="Alter (optional)" name="alter" inputMode="numeric" value={d.alter} onChange={(e) => set("alter", e.target.value)} />
              <Field label="Wohnort (optional)" name="ort" autoComplete="address-level2" value={d.ort} onChange={(e) => set("ort", e.target.value)} />
            </div>
          </fieldset>
        )}

        {step === 1 && (
          <fieldset className="space-y-8">
            <legend className="text-3xl font-semibold tracking-tight">Was interessiert Sie?</legend>
            <div>
              <p className="text-base font-medium">Bereiche (Mehrfachauswahl) *</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {bereiche.map((b) => (
                  <Chip key={b} name="interessen" value={b} checked={d.interessen.includes(b)} onChange={() => toggle(b)}>
                    {b}
                  </Chip>
                ))}
              </div>
              {errors.interessen && <p className="mt-2 text-sm text-[#e30000]">{errors.interessen}</p>}
            </div>
            <div>
              <p className="text-base font-medium">Wie viel Zeit haben Sie? *</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {zeiten.map((z) => (
                  <Chip key={z} type="radio" name="zeit" value={z} checked={d.zeit === z} onChange={() => set("zeit", z)}>
                    {z}
                  </Chip>
                ))}
              </div>
              {errors.zeit && <p className="mt-2 text-sm text-[#e30000]">{errors.zeit}</p>}
            </div>
            <Area label="Möchten Sie uns noch etwas sagen? (optional)" name="ueber-mich" value={d.ueberMich} onChange={(e) => set("ueberMich", e.target.value)} placeholder="z. B. Erfahrungen, Sprachen, Wünsche …" />
          </fieldset>
        )}

        {step === 2 && (
          <fieldset className="space-y-6">
            <legend className="text-3xl font-semibold tracking-tight">Wie erreichen wir Sie?</legend>
            <Field label="E-Mail" name="email" type="email" autoComplete="email" required value={d.email} onChange={(e) => set("email", e.target.value)} error={errors.email} />
            <Field label="Telefon (optional)" name="telefon" type="tel" autoComplete="tel" value={d.telefon} onChange={(e) => set("telefon", e.target.value)} />
            <div>
              <p className="text-base font-medium">Wie sollen wir uns melden?</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {["E-Mail", "Telefon"].map((k) => (
                  <Chip key={k} type="radio" name="kontaktweg" value={k} checked={d.kontaktweg === k} onChange={() => set("kontaktweg", k)}>
                    {k}
                  </Chip>
                ))}
              </div>
            </div>
            <Consent checked={consent} onChange={() => setConsent((c) => !c)} error={errors.consent} />
          </fieldset>
        )}

        {state === "error" && (
          <p role="alert" className="rounded-2xl bg-[#fff2f2] p-4 text-base text-[#b00000] dark:bg-[#3a0d0d] dark:text-[#ff8a8a]">
            Das Senden hat leider nicht geklappt. Bitte versuchen Sie es noch einmal oder schreiben Sie uns an{" "}
            <a href={mailto("Ich möchte aktiv werden")} className="underline">{site.email}</a>.
          </p>
        )}

        <div className="flex items-center justify-between gap-4 pt-2">
          {step > 0 ? (
            <button type="button" className={secondaryBtn} onClick={() => goto(step - 1)}>
              ‹ Zurück
            </button>
          ) : (
            <span />
          )}
          <button type="submit" className={primaryBtn} disabled={state === "sending"}>
            {step < 2 ? "Weiter" : state === "sending" ? "Wird gesendet …" : "Absenden"}
          </button>
        </div>
      </form>
    </div>
  );
}
