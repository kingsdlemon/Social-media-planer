/**
 * Zahl, die beim Hineinscrollen hochzählt (Animation in MotionEffects).
 * Server-gerendert steht immer der Endwert da – ohne JavaScript oder bei
 * reduzierter Bewegung bleibt es dabei. Screenreader lesen nur den Endwert.
 */
export function CountUp({
  to,
  from = 0,
  prefix = "",
  suffix = "",
  grouping = true,
  className = "",
}: {
  to: number;
  from?: number;
  prefix?: string;
  suffix?: string;
  grouping?: boolean;
  className?: string;
}) {
  const text = `${prefix}${new Intl.NumberFormat("de-DE", { useGrouping: grouping }).format(to)}${suffix}`;
  return (
    <span className={className}>
      <span className="sr-only">{text}</span>
      <span
        aria-hidden="true"
        className="tabular-nums"
        data-countup={to}
        data-countup-from={from}
        data-countup-prefix={prefix}
        data-countup-suffix={suffix}
        data-countup-grouping={grouping ? "true" : "false"}
      >
        {text}
      </span>
    </span>
  );
}
