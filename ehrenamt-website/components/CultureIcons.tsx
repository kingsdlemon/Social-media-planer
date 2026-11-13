import type { ReactNode, SVGProps } from "react";

/**
 * Kultur-Icons als Linien-SVGs (24er-Raster, 2px Strich, runde Enden).
 * Farbe über `currentColor`, Größe über `size` (px oder CSS-Länge).
 * Standardmäßig dekorativ (aria-hidden); mit `title` werden sie als Bild ausgezeichnet.
 */
export type CultureIconProps = Omit<SVGProps<SVGSVGElement>, "children"> & {
  size?: number | string;
  title?: string;
};

function IconBase({ size = 24, title, children, ...props }: CultureIconProps & { children: ReactNode }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      focusable="false"
      {...props}
    >
      {title && <title>{title}</title>}
      {children}
    </svg>
  );
}

/** Theatermaske, geteilt in Komödie (links) und Tragödie (rechts) */
export function TheaterMaskIcon(props: CultureIconProps) {
  return (
    <IconBase {...props}>
      <path d="M4 3.5c2.7 1.3 5.3 1.9 8 1.9s5.3-.6 8-1.9V11c0 5.3-3.4 9-8 10-4.6-1-8-4.7-8-10Z" />
      <path d="M12 5.4V21" />
      <path d="M6.4 10q1.2-1.4 2.4 0" />
      <path d="M15.2 9.3q1.2 1.4 2.4 0" />
      <path d="M6.4 14q1.8 2.6 5.6 2.6" />
      <path d="M14.2 17.2q1.6-2.2 3.8-1.6" />
    </IconBase>
  );
}

/** Ionische Säule */
export function ColumnIcon(props: CultureIconProps) {
  return (
    <IconBase {...props}>
      <path d="M4 3h16" />
      <path d="M6 6h12a1.5 1.5 0 0 1 0 3H6a1.5 1.5 0 0 1 0-3Z" />
      <path d="M8 9v9M16 9v9M12 11v5" />
      <path d="M6 18h12" />
      <path d="M4.5 21h15" />
    </IconBase>
  );
}

/** Zwei verbundene Achtelnoten */
export function MusicNotesIcon(props: CultureIconProps) {
  return (
    <IconBase {...props}>
      <ellipse cx="6" cy="18" rx="2.5" ry="2.2" />
      <ellipse cx="17" cy="16" rx="2.5" ry="2.2" />
      <path d="M8.5 18V6.5l11-2.5V16" />
      <path d="M8.5 10l11-2.5" />
    </IconBase>
  );
}

/** Aufgeschlagenes Buch */
export function OpenBookIcon(props: CultureIconProps) {
  return (
    <IconBase {...props}>
      <path d="M12 6.5C9.5 4.8 6.5 4.5 4 5.3v11.5c2.5-.8 5.5-.5 8 1.2 2.5-1.7 5.5-2 8-1.2V5.3c-2.5-.8-5.5-.5-8 1.2Z" />
      <path d="M12 6.5V18" />
      <path d="M2 7.5V20h8l2 1 2-1h8V7.5" />
    </IconBase>
  );
}

/** Pinsel, diagonal */
export function PaintbrushIcon(props: CultureIconProps) {
  return (
    <IconBase {...props}>
      <path d="M19.2 2.8a1.5 1.5 0 0 1 2 2.1l-8.8 9.6-2.9-2.9Z" />
      <path d="M14.6 7.9l1.6 1.6" />
      <path d="M9.5 11.6c-2.2-.3-4.1 1.4-4.2 3.6-.1 1.7-1 3.4-2.8 4.6 3 .5 6.3-.4 8.2-2.4 1.2-1.3 1.6-2.7 1.7-3" />
    </IconBase>
  );
}

/** Filmrolle mit auslaufendem Filmstreifen */
export function FilmReelIcon(props: CultureIconProps) {
  return (
    <IconBase {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="0.5" />
      <circle cx="12" cy="7" r="1.2" />
      <circle cx="16.8" cy="10.5" r="1.2" />
      <circle cx="14.9" cy="16" r="1.2" />
      <circle cx="9.1" cy="16" r="1.2" />
      <circle cx="7.2" cy="10.5" r="1.2" />
      <path d="M12 20.5h10" />
    </IconBase>
  );
}

export const cultureIcons = {
  theater: TheaterMaskIcon,
  column: ColumnIcon,
  music: MusicNotesIcon,
  book: OpenBookIcon,
  brush: PaintbrushIcon,
  film: FilmReelIcon,
} as const;

export type CultureIconName = keyof typeof cultureIcons;

export function CultureIcon({ name, ...props }: CultureIconProps & { name: CultureIconName }) {
  const Cmp = cultureIcons[name];
  return <Cmp {...props} />;
}
