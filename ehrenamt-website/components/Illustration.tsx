import { Container } from "./ui";

/** Die Szene-Illustration (Ehrenamtliche in verschiedenen Kultureinrichtungen). */
export function Illustration({ alt, caption }: { alt: string; caption?: string }) {
  return (
    <Container className="pt-10 sm:pt-14">
      <figure data-reveal>
        <div
          data-parallax-root
          className="overflow-hidden rounded-3xl border border-mist bg-white dark:border-brand-deep"
        >
          {/* Mit Animation leicht vergrößert, damit die Parallax-Verschiebung keine Kanten zeigt */}
          <img
            src="/images/ehrenamt-illustration.webp"
            alt={alt}
            width={1200}
            height={655}
            loading="lazy"
            decoding="async"
            data-parallax="0.05"
            className="h-auto w-full in-[.motion-ok]:scale-[1.12] dark:brightness-90"
          />
        </div>
        {caption && <figcaption className="mt-3 text-base text-ink-soft dark:text-paper/70">{caption}</figcaption>}
      </figure>
    </Container>
  );
}
