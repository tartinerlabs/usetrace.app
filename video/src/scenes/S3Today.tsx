import type React from "react";
import { useCurrentFrame } from "remotion";
import { Chip } from "../components/Chip";
import { CopyColumn } from "../components/CopyColumn";
import { Eyebrow } from "../components/Eyebrow";
import type { Layout } from "../layout";
import { enter } from "../motion";
import { C, MONO } from "../theme";

// S3 · 600-1050 · Today. Day totals land as chips beside the phone; a small
// legend lights the day's beats as VO3 says them. VO3 starts at local 20; its
// sentences start +4, +95 and +205 frames into the line (measured in
// vo3_48k.wav), so each entry starts 4 frames ahead and lands on the word:
//   "The train to work."      -> Train (the screen focuses the Downtown Line)
//   "An evening across town." -> Drive (the map shows Office -> Dempsey Hill)
//   "The drive home."         -> Home  (the timeline: Driving, then Home)
// Numbers match the app's demo day: 46.0 km, 1 h 41 min in motion, 3 places.

const LEGEND = [
  { name: "Train", color: C.train, at: 20 },
  { name: "Drive", color: C.drive, at: 111 },
  { name: "Home", color: C.place, at: 221 },
];

export const S3Today: React.FC<{ layout: Layout }> = ({ layout }) => {
  const frame = useCurrentFrame();
  const portrait = layout.orientation === "portrait";
  const size = layout.type.chip;
  const exitAt = 434;
  return (
    <CopyColumn layout={layout} gap={portrait ? 18 : 22}>
      <Eyebrow
        start={10}
        exitAt={exitAt}
        size={layout.type.eyebrow}
        style={{ marginBottom: portrait ? 6 : 14 }}
      >
        TODAY · MON 5 OCT
      </Eyebrow>
      <Chip
        icon="route"
        color={C.train}
        value={46}
        format={(n) => `${n.toFixed(1)} km`}
        label="travelled"
        start={18}
        size={size}
        exitAt={exitAt}
      />
      <Chip
        icon="clock"
        color={C.walk}
        value={101}
        format={(n) =>
          `${Math.floor(n / 60)} h ${String(Math.floor(n % 60)).padStart(2, "0")} min`
        }
        label="in motion"
        start={30}
        size={size}
        exitAt={exitAt + 2}
      />
      <Chip
        icon="pin"
        color={C.place}
        value={3}
        format={(n) => `${Math.round(n)}`}
        label="places"
        start={42}
        size={size}
        exitAt={exitAt + 4}
      />
      <div style={{ display: "flex", gap: 28, marginTop: portrait ? 10 : 22 }}>
        {LEGEND.map((l) => {
          const t = enter(frame, l.at, 16);
          const out = enter(frame, exitAt, 12);
          return (
            <div
              key={l.name}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                fontFamily: MONO,
                fontSize: layout.type.eyebrow,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: C.secondary,
                opacity: (0.25 + 0.75 * t) * (1 - out),
              }}
            >
              <span
                style={{
                  width: 34,
                  height: 6,
                  borderRadius: 99,
                  background: l.color,
                  scale: `${0.2 + 0.8 * t} 1`,
                  transformOrigin: "left center",
                }}
              />
              {l.name}
            </div>
          );
        })}
      </div>
    </CopyColumn>
  );
};
