import { Audio } from "@remotion/media";
import type React from "react";
import { Sequence } from "remotion";
import { ASSETS, musicSrc, voSrc } from "../assets";
import { VO_CUES } from "../timing";

// Score + eight voice-over lines. The score's ducking is baked offline into
// music/score_ducked.wav with sample-accurate gain (a volume callback here is
// evaluated once per video frame and steps audibly on sustained notes):
// -4.5 dB under each VO line (-6.5 dB under VO6 and VO8), 12-frame attack
// ending on the VO start, 36-frame release, sine in-out; 8 ms fade-in at 0;
// x0.9 bed trim. Rebuild it whenever VO_CUES change
// (`uv run tools/music/duck.py` reads the cues from timing.ts).

export const Soundtrack: React.FC = () => (
  <>
    {ASSETS.music ? <Audio name="Score (ducked)" src={musicSrc()} /> : null}
    {VO_CUES.map((cue) =>
      ASSETS.vo[cue.id] ? (
        <Sequence
          key={cue.id}
          name={`VO ${cue.id}`}
          from={cue.from}
          durationInFrames={cue.maxFrames + 60}
          layout="none"
        >
          <Audio src={voSrc(cue.id)} />
        </Sequence>
      ) : null,
    )}
  </>
);
