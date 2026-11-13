"use client";

import { Float, RoundedBox } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, type ReactNode } from "react";
import * as THREE from "three";
import { readBrandColors, type BrandColors } from "@/lib/brandColors";

/**
 * Schwebende, abstrakte Kultur-Objekte (Maske, Noten, Buch, Pinsel).
 * Farben kommen aus dem Tailwind-Theme (styles/globals.css).
 * Wird ausschließlich über Hero3D (lazy) geladen.
 */
type Props = {
  /** Handys/Tablets: weniger Objekte, gröbere Geometrie, keine Mausreaktion */
  simplified: boolean;
  /** false → keine Frames rendern (Hero nicht sichtbar) */
  active: boolean;
  onReady?: () => void;
};

export default function HeroScene({ simplified, active, onReady }: Props) {
  const colors = useMemo(readBrandColors, []);

  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      dpr={simplified ? [1, 1.25] : [1, 1.75]}
      camera={{ position: [0, 0, 9], fov: 35 }}
      gl={{ alpha: true, antialias: !simplified, powerPreference: "low-power" }}
      onCreated={() => onReady?.()}
    >
      <ambientLight intensity={0.55} />
      <hemisphereLight args={[colors.cream, colors["teal-dark"], 0.9]} />
      <directionalLight position={[4, 5, 6]} intensity={2.2} color={colors.cream} />
      <directionalLight position={[-6, -2, 3]} intensity={0.8} color={colors["terracotta-light"]} />
      <Objects colors={colors} simplified={simplified} />
    </Canvas>
  );
}

/* ------------------------------------------------------------------ */
/* Anordnung, Maus & Scroll                                            */
/* ------------------------------------------------------------------ */

type Placement = { x: number; y: number; scale: number };

function Objects({ colors, simplified }: { colors: BrandColors; simplified: boolean }) {
  const group = useRef<THREE.Group>(null!);
  const pointer = useRef({ x: 0, y: 0 });
  const viewport = useThree((s) => s.viewport);

  // Maus über die ganze Seite verfolgen (nicht nur über dem Canvas)
  useEffect(() => {
    if (simplified) return;
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [simplified]);

  useFrame((_, delta) => {
    const g = group.current;
    // 0 … 1,5 Bildschirmhöhen gescrollt
    const scroll = Math.min(window.scrollY / window.innerHeight, 1.5);
    const damp = THREE.MathUtils.damp;
    // Mobil liegt die Szene als schmaler Streifen unter dem Text → Scroll-Effekt nur angedeutet,
    // damit nichts aus dem Bild wandert
    const s = simplified ? 0.3 : 1;
    g.rotation.x = damp(g.rotation.x, pointer.current.y * 0.22 + scroll * 0.35 * s, 2.5, delta);
    g.rotation.y = damp(g.rotation.y, pointer.current.x * 0.35 + scroll * 0.6 * s, 2.5, delta);
    g.position.y = damp(g.position.y, simplified ? 0 : scroll * viewport.height * 0.35, 3, delta);
  });

  // Positionen relativ zur sichtbaren Fläche, damit es auf Hoch- und Querformat passt
  const landscape = viewport.width > viewport.height;
  const unit = Math.min(viewport.width, viewport.height);
  const place = (rx: number, ry: number, s: number): Placement => ({
    x: (rx * viewport.width) / 2,
    y: (ry * viewport.height) / 2,
    scale: s * unit * 0.24,
  });

  const layout = landscape
    ? {
        mask: place(-0.52, 0, 0.9),
        notes: place(0.02, 0.12, 0.85),
        book: place(0.52, -0.08, 0.85),
        brush: place(0.3, -0.45, 0.75),
      }
    : {
        mask: place(-0.32, 0.42, 1.05),
        notes: place(0.48, 0.5, 0.8),
        book: place(-0.3, -0.52, 0.95),
        brush: place(0.5, -0.12, 0.8),
      };

  const seg = simplified ? 16 : 40;

  return (
    <group ref={group}>
      <Floating at={layout.mask} speed={1.2} phase={0} tilt={[0.15, 0.25, -0.12]}>
        <Mask color={colors.terracotta} simplified={simplified} />
      </Floating>
      <Floating at={layout.notes} speed={1.6} phase={1.3}>
        <Notes color={colors["terracotta-light"]} seg={seg} />
      </Floating>
      <Floating at={layout.book} speed={1.1} phase={2.4}>
        <Book cover={colors["teal-light"]} pages={colors.cream} />
      </Floating>
      {!simplified && (
        <>
          <Floating at={layout.brush} speed={1.4} phase={3.1}>
            <Brush handle={colors.cream} ferrule={colors["cream-dark"]} tip={colors["terracotta-dark"]} seg={seg} />
          </Floating>
          <Accents colors={colors} viewportWidth={viewport.width} viewportHeight={viewport.height} />
        </>
      )}
    </group>
  );
}

/** Schweben (drei/Float) plus sanftes Hin-und-her-Drehen */
function Floating({
  at,
  speed,
  phase,
  tilt = [0, 0, 0],
  children,
}: {
  at: Placement;
  speed: number;
  phase: number;
  tilt?: [number, number, number];
  children: ReactNode;
}) {
  const spin = useRef<THREE.Group>(null!);
  useFrame(({ clock }) => {
    const t = clock.elapsedTime * 0.4 * speed + phase;
    spin.current.rotation.y = Math.sin(t) * 0.55;
    spin.current.rotation.z = Math.cos(t * 0.7) * 0.08;
  });
  return (
    <group position={[at.x, at.y, 0]} rotation={tilt} scale={at.scale}>
      <Float speed={speed} rotationIntensity={0.35} floatIntensity={0.9} floatingRange={[-0.12, 0.12]}>
        <group ref={spin}>{children}</group>
      </Float>
    </group>
  );
}

function Material({ color, roughness = 0.5, metalness = 0.05 }: { color: string; roughness?: number; metalness?: number }) {
  return <meshStandardMaterial color={color} roughness={roughness} metalness={metalness} />;
}

/* ------------------------------------------------------------------ */
/* Objekte                                                             */
/* ------------------------------------------------------------------ */

/** Theatermaske: extrudierte Schildform mit Augen- und Mundöffnungen, leicht gewölbt */
function Mask({ color, simplified }: { color: string; simplified: boolean }) {
  const geometry = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(-1, 1);
    shape.quadraticCurveTo(0, 0.72, 1, 1);
    shape.lineTo(1, 0.1);
    shape.bezierCurveTo(1, -0.75, 0.45, -1.2, 0, -1.32);
    shape.bezierCurveTo(-0.45, -1.2, -1, -0.75, -1, 0.1);
    shape.closePath();

    // Augen: links fröhlich geschwungen, rechts schräg (traurig)
    const eyeL = new THREE.Path();
    eyeL.absellipse(-0.42, 0.28, 0.25, 0.12, 0, Math.PI * 2, false, 0.2);
    const eyeR = new THREE.Path();
    eyeR.absellipse(0.42, 0.28, 0.25, 0.12, 0, Math.PI * 2, false, -0.25);
    // Mund: lächelnde Sichel
    const mouth = new THREE.Path();
    mouth.moveTo(-0.5, -0.38);
    mouth.quadraticCurveTo(0, -0.95, 0.5, -0.38);
    mouth.quadraticCurveTo(0, -0.66, -0.5, -0.38);
    shape.holes.push(eyeL, eyeR, mouth);

    const geo = new THREE.ExtrudeGeometry(shape, {
      depth: 0.18,
      bevelEnabled: true,
      bevelThickness: 0.07,
      bevelSize: 0.05,
      bevelSegments: simplified ? 2 : 5,
      curveSegments: simplified ? 12 : 32,
    });
    geo.center();
    return geo;
  }, [simplified]);

  useEffect(() => () => geometry.dispose(), [geometry]);

  return (
    <mesh geometry={geometry}>
      <Material color={color} roughness={0.42} />
    </mesh>
  );
}

/** Zwei verbundene Achtelnoten */
function Notes({ color, seg }: { color: string; seg: number }) {
  return (
    <group position={[-0.15, -0.15, 0]}>
      <mesh position={[-0.45, -0.55, 0]} rotation={[0, 0, 0.4]} scale={[1, 0.74, 0.7]}>
        <sphereGeometry args={[0.32, seg, seg]} />
        <Material color={color} roughness={0.35} />
      </mesh>
      <mesh position={[0.45, -0.35, 0]} rotation={[0, 0, 0.4]} scale={[1, 0.74, 0.7]}>
        <sphereGeometry args={[0.32, seg, seg]} />
        <Material color={color} roughness={0.35} />
      </mesh>
      <mesh position={[-0.17, 0.1, 0]}>
        <cylinderGeometry args={[0.055, 0.055, 1.3, 12]} />
        <Material color={color} />
      </mesh>
      <mesh position={[0.73, 0.3, 0]}>
        <cylinderGeometry args={[0.055, 0.055, 1.3, 12]} />
        <Material color={color} />
      </mesh>
      <RoundedBox args={[1.02, 0.18, 0.13]} radius={0.05} position={[0.28, 0.86, 0]} rotation={[0, 0, Math.atan2(0.2, 0.9)]}>
        <Material color={color} />
      </RoundedBox>
    </group>
  );
}

/** Aufgeschlagenes Buch: Einband plus zwei leicht angehobene Seitenblöcke */
function Book({ cover, pages }: { cover: string; pages: string }) {
  return (
    <group rotation={[0.55, -0.2, 0]} scale={0.95}>
      <RoundedBox args={[2.1, 0.08, 1.45]} radius={0.035} position={[0, -0.07, 0]}>
        <Material color={cover} roughness={0.6} />
      </RoundedBox>
      <group rotation={[0, 0, -0.16]}>
        <RoundedBox args={[0.98, 0.14, 1.32]} radius={0.04} position={[-0.5, 0.05, 0]}>
          <Material color={pages} roughness={0.85} />
        </RoundedBox>
      </group>
      <group rotation={[0, 0, 0.16]}>
        <RoundedBox args={[0.98, 0.14, 1.32]} radius={0.04} position={[0.5, 0.05, 0]}>
          <Material color={pages} roughness={0.85} />
        </RoundedBox>
      </group>
      {/* Lesebändchen */}
      <mesh position={[0.15, 0.13, 0.69]} rotation={[0.25, 0, 0]}>
        <boxGeometry args={[0.07, 0.02, 0.4]} />
        <Material color={cover} />
      </mesh>
    </group>
  );
}

/** Pinsel, diagonal: Stiel, Zwinge, tropfenförmige Spitze */
function Brush({ handle, ferrule, tip, seg }: { handle: string; ferrule: string; tip: string; seg: number }) {
  const tipGeometry = useMemo(() => {
    const pts = [
      [0, 0],
      [0.05, 0.05],
      [0.11, 0.17],
      [0.12, 0.28],
      [0.1, 0.38],
    ].map(([x, y]) => new THREE.Vector2(x, y));
    return new THREE.LatheGeometry(pts, seg);
  }, [seg]);
  useEffect(() => () => tipGeometry.dispose(), [tipGeometry]);

  return (
    <group rotation={[0, 0, -Math.PI / 4]} position={[0, 0.1, 0]}>
      <mesh position={[0, 0.6, 0]}>
        <cylinderGeometry args={[0.06, 0.1, 1.7, seg]} />
        <Material color={handle} roughness={0.4} />
      </mesh>
      <mesh position={[0, -0.39, 0]}>
        <cylinderGeometry args={[0.105, 0.1, 0.3, seg]} />
        <Material color={ferrule} roughness={0.25} metalness={0.6} />
      </mesh>
      <mesh geometry={tipGeometry} position={[0, -0.92, 0]}>
        <Material color={tip} roughness={0.7} />
      </mesh>
    </group>
  );
}

/** Kleine Begleitformen für Tiefe (nur Desktop) */
function Accents({ colors, viewportWidth, viewportHeight }: { colors: BrandColors; viewportWidth: number; viewportHeight: number }) {
  const w = viewportWidth / 2;
  const h = viewportHeight / 2;
  return (
    <>
      <Float speed={2} floatIntensity={1.2} rotationIntensity={1}>
        <mesh position={[w * 0.05, h * 0.05, -1.5]} rotation={[1.1, 0.3, 0]}>
          <torusGeometry args={[0.32, 0.07, 16, 48]} />
          <Material color={colors["terracotta-light"]} roughness={0.35} />
        </mesh>
      </Float>
      <Float speed={1.7} floatIntensity={1.4}>
        <mesh position={[-w * 0.7, -h * 0.75, -1]}>
          <sphereGeometry args={[0.16, 24, 24]} />
          <Material color={colors["teal-soft"]} roughness={0.3} />
        </mesh>
      </Float>
      <Float speed={2.3} floatIntensity={1.6}>
        <mesh position={[w * 0.75, h * 0.85, -2]}>
          <sphereGeometry args={[0.12, 24, 24]} />
          <Material color={colors.terracotta} roughness={0.3} />
        </mesh>
      </Float>
    </>
  );
}
