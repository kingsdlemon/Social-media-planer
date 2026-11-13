import { Container } from "./ui";

/** Die Szene-Illustration (Ehrenamtliche in verschiedenen Kultureinrichtungen). */
export function Illustration({ alt, caption }: { alt: string; caption?: string }) {
  return (
    <Container className="pt-10 sm:pt-14">
      <figure data-reveal>
        <div
          data-parallax-root
          className="overflow-hidden rounded-[28px] bg-white"
        >
          {/* Mit Animation oben/unten je ~3 % Reserve (negative Ränder, Breite bleibt vollständig),
              damit die Parallax-Verschiebung keine Kanten zeigt */}
          <img
            src="/images/ehrenamt-illustration.webp"
            alt={alt}
            width={1200}
            height={670}
            loading="lazy"
            decoding="async"
            data-parallax="0.025"
            className="h-auto w-full in-[.motion-ok]:-my-[1.7%] dark:brightness-90"
          />
        </div>
        {caption && <figcaption className="mt-3 text-base text-ink-soft dark:text-white/60">{caption}</figcaption>}
      </figure>
    </Container>
  );
}
