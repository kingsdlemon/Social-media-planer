/**
 * Kleine Feder-Physik im Apple-Stil (WWDC „Designing Fluid Interfaces“).
 * Parameter wie bei Apple: dampingRatio (1 = kein Nachschwingen) und response (Sekunden).
 * Eine Feder startet immer vom aktuellen Wert und übernimmt die aktuelle Geschwindigkeit –
 * dadurch ist jede Animation jederzeit unterbrechbar und ohne Ruck umlenkbar.
 */
export type SpringOptions = { dampingRatio?: number; response?: number; velocity?: number };

export type SpringHandle = { stop: () => number /* gibt aktuelle Geschwindigkeit zurück */ };

export function spring(
  from: number,
  to: number,
  onUpdate: (value: number) => void,
  { dampingRatio = 1, response = 0.4, velocity = 0 }: SpringOptions = {},
  onDone?: () => void,
): SpringHandle {
  const stiffness = Math.pow((2 * Math.PI) / response, 2);
  const damping = (4 * Math.PI * dampingRatio) / response;
  let x = from;
  let v = velocity;
  let last = performance.now();
  let raf = 0;

  const step = (now: number) => {
    // feste Teilschritte für stabile Physik, egal wie lang ein Frame dauert
    let dt = Math.min((now - last) / 1000, 0.064);
    last = now;
    while (dt > 0) {
      const h = Math.min(dt, 1 / 240);
      const a = -stiffness * (x - to) - damping * v;
      v += a * h;
      x += v * h;
      dt -= h;
    }
    if (Math.abs(x - to) < 0.5 && Math.abs(v) < 5) {
      onUpdate(to);
      onDone?.();
      return;
    }
    onUpdate(x);
    raf = requestAnimationFrame(step);
  };
  raf = requestAnimationFrame(step);

  return {
    stop: () => {
      cancelAnimationFrame(raf);
      return v;
    },
  };
}

/** Apples Momentum-Projektion: wohin würde ein Wisch mit dieser Geschwindigkeit (px/s) auslaufen? */
export function project(velocity: number, decelerationRate = 0.998) {
  return ((velocity / 1000) * decelerationRate) / (1 - decelerationRate);
}

/** Gummiband-Widerstand am Rand: je weiter drüber, desto weniger folgt der Inhalt. */
export function rubberband(overshoot: number, dimension: number, constant = 0.55) {
  return (overshoot * dimension * constant) / (dimension + constant * Math.abs(overshoot));
}

export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
