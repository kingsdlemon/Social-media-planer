import { Container } from "./ui";

/** Die Szene-Illustration (Ehrenamtliche in verschiedenen Kultureinrichtungen). */
export function Illustration({ alt, caption }: { alt: string; caption?: string }) {
  return (
    <Container className="pt-10 sm:pt-14">
      <figure>
        <img
          src="/images/ehrenamt-illustration.webp"
          alt={alt}
          width={1200}
          height={655}
          loading="lazy"
          decoding="async"
          className="h-auto w-full rounded-3xl border border-cream-dark bg-white dark:border-teal-dark dark:brightness-90"
        />
        {caption && <figcaption className="mt-3 text-base text-ink-soft dark:text-cream/70">{caption}</figcaption>}
      </figure>
    </Container>
  );
}
