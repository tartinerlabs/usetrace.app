import type React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { Backdrop } from "./components/Backdrop";
import { getLayout, type Orientation } from "./layout";
import { DeviceTrack } from "./scenes/DeviceTrack";
import { S1Hook } from "./scenes/S1Hook";
import { iconSunAtStart, S2Reveal } from "./scenes/S2Reveal";
import { S3Today } from "./scenes/S3Today";
import { S4Journey } from "./scenes/S4Journey";
import { S5History } from "./scenes/S5History";
import { S6Places } from "./scenes/S6Places";
import { S7Privacy } from "./scenes/S7Privacy";
import { S8EndCard } from "./scenes/S8EndCard";
import { Soundtrack } from "./scenes/Soundtrack";
import { FONT } from "./theme";
import { SCENES } from "./timing";

export type TracePromoProps = { orientation: Orientation };

// "Your day, retraced." 52.0 s, 60 fps. Layers, back to front:
// backdrop (day / night / dawn) -> per-scene copy & graphics -> the
// continuous iPhone (S2-S7) -> end card.
export const TracePromo: React.FC<TracePromoProps> = ({ orientation }) => {
  const layout = getLayout(orientation);
  const seq = (id: keyof typeof SCENES) => ({
    from: SCENES[id].from,
    durationInFrames: SCENES[id].to - SCENES[id].from,
    name: `${id} · ${SCENES[id].name}`,
  });

  return (
    <AbsoluteFill style={{ fontFamily: FONT, overflow: "hidden" }}>
      <Backdrop layout={layout} />

      <Sequence {...seq("S1")}>
        <S1Hook layout={layout} iconSunTarget={iconSunAtStart(layout)} />
      </Sequence>
      <Sequence {...seq("S2")}>
        <S2Reveal layout={layout} />
      </Sequence>
      <Sequence {...seq("S3")}>
        <S3Today layout={layout} />
      </Sequence>
      <Sequence {...seq("S4")}>
        <S4Journey layout={layout} />
      </Sequence>
      <Sequence {...seq("S5")}>
        <S5History layout={layout} />
      </Sequence>
      <Sequence {...seq("S6")}>
        <S6Places layout={layout} />
      </Sequence>
      <Sequence {...seq("S7")}>
        <S7Privacy layout={layout} />
      </Sequence>

      {/* Global frames: the track places its own screen clips on the timeline. */}
      <DeviceTrack layout={layout} />

      <Sequence {...seq("S8")}>
        <S8EndCard layout={layout} />
      </Sequence>

      <Soundtrack />
    </AbsoluteFill>
  );
};
