import type { CSSProperties } from "react";
import type { Mode, Point } from "@/lib/sample-day";

// Singapore, from URA coastline data via geoBoundaries (ODbL), and Johor,
// from Natural Earth (public domain), in the sample day's map space (see
// Point in sample-day).
const LABEL_FONT =
  "-apple-system, BlinkMacSystemFont, 'SF Pro Text', Geist, system-ui, sans-serif";

const JOHOR =
  "M-614.4 -860.2L1065.3 -860.2L1064.2 -842.1L1073.7 -799.8L1096.6 -755.6L1124.7 -732.1L1149.2 -751.8L1162.2 -751.8L1219.2 -652.8L1237.6 -558.8L1275.7 -505.6L1286.2 -475.3L1289.2 -406.1L1301.2 -377.6L1325.6 -349.3L1341.9 -323.1L1330.9 -301.8L1344.6 -274.1L1359.2 -188.8L1400.9 -76.8L1420.7 17.2L1422.7 68.6L1408.7 91.1L1391.7 109.7L1397.6 199.4L1387.2 230.7L1309.9 230.7L1299.7 237.6L1278.2 267.2L1268.2 274.1L1175.7 269.9L1135.6 261.6L1052.7 228.4L1036.7 214.7L1034.7 193.7L1036.2 154.7L1025.2 125.2L1000.7 103.6L972.6 84.6L952.2 64.2L940.9 -10.9L995.9 -46.8L1071.6 -76.8L1121.6 -133.9L1083.2 -142.8L1046.9 -133.3L1012.7 -113.1L943.7 -61.6L928.6 -53.8L921.2 -67.8L909.2 -104.8L844.2 -239.3L795.7 -312.1L749.6 -343.8L737.7 -319.1L758.6 -263.4L836.2 -140.8L836.9 -112.3L826.2 -55.1L830.9 -28.3L839.7 1.1L844.7 32.2L839.2 64.2L766.9 123.2L668.7 98.9L490.9 7.1L438.9 11.2L356.6 53.9L313.6 64.2L230.7 57.2L199.9 60.2L166.7 78.2L61.6 210.1L0.2 259.2L-72.3 246.1L-76.3 236.7L-91.1 215.6L-106.8 200.6L-114.3 210.6L-112.1 233.6L-102.3 264.1L-100.3 280.9L-105.4 303.7L-142.3 357.9L-171.3 429.2L-196.4 389.2L-268.3 327.7L-297.3 287.9L-314.8 247.2L-381.1 24.9L-419.1 -54.1L-476.4 -119.6L-563.1 -174.8L-614.4 -194.2Z";

const LAND =
  "M447 18.7L420.6 21L425.3 29.4L419.8 21.5L415.9 22.4L362.8 59L350 64.4L346.4 57.5L347.6 63.3L341.8 71.2L343.4 75.9L340.4 79.3L342.2 74.4L337.9 74.3L333.2 86.3L316.6 84.9L312.6 86.6L312.8 90.6L311.5 87.3L306.6 88.5L295 81.3L291.5 84.2L283.7 84.2L281.9 80.8L279.7 84.5L281 76.3L270 66.4L266.3 66.3L266.9 62.4L251.7 65.4L251.2 60L244.4 59.4L218.4 69.7L195.9 92.4L180.8 96.3L175.6 101.7L170.2 100.2L164.8 105L159.8 104.4L152.3 112.6L146.8 132.4L149.5 135.2L145.1 136.3L145.6 140.2L142.2 143.6L133.9 145.2L133.1 149.4L127.9 152.4L130.3 159.2L126 187L117.6 196L108.5 218.8L104.7 216.1L105 219.5L101 220.7L89.6 245.3L83.1 250.2L78.4 265.4L75.4 262.9L70.1 268.1L71.1 274.1L74.7 275.2L73 279.5L70.4 277.3L72.9 279.7L70 282.8L69.6 277.6L68 281.2L71.2 285.2L37.1 374.6L35.8 381.8L42.8 393.4L41 402.4L35.5 411L24.9 416.5L12.4 445.2L14.1 446.7L20.5 433.8L28.3 434.8L26.4 439.8L28.7 459.4L25 458.9L24.5 464.8L16.9 466.7L18.3 478.5L24.7 478.5L25.7 480.7L22 483.8L11 483.4L11.7 489.5L23.3 489L24.8 497L33.1 497.3L37.6 507.8L36.5 517.7L20.4 528.2L18.2 533.3L13.6 530.1L13.2 522.6L13.4 532L87.3 552.7L90.5 549.8L89.1 548.2L87.6 551.3L84.2 551.2L21.3 533.5L23.7 527.8L29.7 526.9L38.9 517.3L39.8 512.9L35.9 499.2L44.4 495L31.7 467.8L31.7 462.2L59.5 448.8L44.5 454.8L44.2 446.9L79.2 429.9L79.8 438.1L66.4 444.3L80.7 438.7L82.7 411.5L96.6 410.9L102.4 404.4L102.2 398.5L72.1 346.3L77.1 335L82.2 340.1L81.2 343.1L82.9 341.3L88.6 345.4L94.4 340.6L92.9 338.4L94.8 340.2L101.7 333.1L106.1 336.5L94.6 350.3L102 357.9L100.3 360.8L110.7 347.7L116.8 345.9L117.6 348.2L110.6 355.4L112.2 356.9L110.1 355.9L102 365.2L104.1 367.7L109.3 363.3L104.9 368.7L110.2 366L106 370L110.1 366.6L112.5 369.3L108.7 373.1L113 369.4L117.4 372.9L112.4 377.6L119.2 374.3L120.4 378.2L132.6 385.3L136.1 391.5L132.1 395.4L152.3 378.3L142.3 367.8L140.8 355.8L148.9 354.7L149.9 364.1L160.6 375.6L162.5 374.4L159.4 369.3L164.1 374.4L167.7 372.8L163.7 353.4L166.7 348.1L170.1 350.6L171.7 370.5L192.1 367.3L191.7 358L194.8 352.7L199.7 352.4L202.7 357.8L209.5 360.4L209.7 364.9L222.6 364.4L222 353L225.2 354.3L227 351.4L228 374.5L229.1 369.5L249.7 369.7L234.8 355.3L230.5 355.2L230.8 350.5L237.2 351.4L262 368.4L265.8 365.4L288.5 371.1L293.3 366.3L293.7 369L296.5 367L295.3 372.7L305.6 376.2L319 374.2L323.1 368.5L333.9 379.7L329.1 387.9L352.9 402L346.4 412.9L320.5 397.7L313.4 398.7L307.6 408.6L349.5 433.7L365 407.7L369.8 410.6L368.6 413L383.1 422.4L365.7 452.2L379.9 460.8L400 426.9L400.5 429.9L404.2 430L420.1 445.9L423.4 437.8L430.3 441.1L435.1 437.4L442.5 442.8L445.5 436.9L444 443L449.5 442.6L450 445.9L445.7 446.5L450.3 446.6L450.4 444.3L459.6 444.3L475.5 435.3L490.8 434.9L503.4 447.2L505.4 444.9L500.6 439L503.2 436.5L514.5 449.2L515.3 424.3L529.4 431.4L528.3 433.5L534.2 440.9L536 439.6L532.4 434.6L556.4 416L555.9 408.5L560.6 405.1L564.7 408.1L568.7 408.1L565 408L572.9 402.8L572.8 400.7L601.4 381.9L607 382.6L616 376.7L648.3 365.8L680.3 357.2L683.1 358.7L713.8 347L728.6 345.6L743.7 338.7L769.5 335.1L771.6 337.5L785.3 334.2L789 341.3L786.3 343.9L800.1 339.9L820.5 347.5L842.6 337.3L865.1 337L866.1 327.8L878.1 327.5L878.4 336.3L886.2 335.6L888 333L885.4 317.6L866.6 317.7L862.2 313.4L864.5 297.7L869.6 295.3L884 258.6L885.8 264.3L880.9 268.1L886.1 264.6L886.2 249L896.7 252L905.3 262.2L907.9 257.8L876.2 238.1L851 228.7L847.3 224.9L840 227.9L832 225.4L832.6 220.2L837.3 218L831 214.7L817.2 186.3L792.8 177.3L791.5 178.8L798.9 184.2L781.6 178.2L765.5 183.5L766.8 189.8L771.3 192L761.1 190.8L752.1 198.1L751.2 204.4L746.4 200.4L736.9 202.5L714.8 198.5L691.8 184.4L684.4 170.6L676.2 164.9L677.6 155.6L647.9 128.5L643.3 130.4L640.1 120.4L621.1 123L610.4 133.7L607.6 132.4L610.2 126.3L608.2 121.6L591.6 111.5L586.9 115.5L590.2 111.1L567.5 98.3L552.4 105.3L552.1 113.5L540.6 115L539.5 117.4L527.1 111.9L537.7 92.1L527 78.5L521.9 64.9L504.7 65.2L507.1 69.7L503.1 65.8L503.6 53.1L508 63.2L516.3 58.8L513 50.2L484.2 32.5L481.8 32.4L477 41.1L475.1 40L479.9 31.3L466.1 23.4L459.9 34.2L457.5 32.8L459.1 29.8L454.8 27.4L447.4 32.9L455.4 22.6ZM934.8 98.3L926.4 106.5L906.9 99.5L903.1 107.6L895.9 112.6L878.2 112.1L881.8 138L874.8 137.3L870.7 124.5L862.4 120.2L852.6 104L848.5 104.5L839 114.3L838 125.6L843.9 141.8L847.8 145.3L867.2 146L875.5 139.1L881.2 140.3L877.3 147.6L880.9 154.7L878.2 157.8L871.8 160.5L851 160.5L857.1 178.2L867.6 191.7L874 195.6L859.8 180.7L852.6 162.4L859.4 167.1L874.9 163L883.7 156L890.7 157.2L891.8 152.3L891.2 158.7L897.2 172.7L901.7 173.2L915.7 194.5L913 195.8L924.3 203.5L927.2 208.1L925.6 211.9L928.6 213.3L932.2 209.5L980.8 190.9L990.1 150.8L997.5 152.6L999.7 157.3L998.8 169.6L982.7 199.4L974.3 223.4L971.4 239.1L972.4 254.4L990.6 285.3L990.5 289.2L987.4 291.2L985.1 290.6L966.9 275.5L983.8 290.5L988.5 291.6L991 289.6L991.7 286.3L973.8 256L971.9 242.6L973.9 227.4L980.5 206.5L998.6 172.2L1000.4 163.9L999.9 155.8L998.5 153L996.2 151L990.6 149.5L994.6 143.3L984 124.6L961.5 107.8ZM230 385.3L228 375.5L227.9 385.6L218 384L212 388.4L220 398.9L217.6 400.2L220.2 409L227.3 414L222 419L214 413.1L212.1 406.5L205.2 399.6L194.5 410L197 414.1L191.2 417.7L188.9 415.7L181.2 425.3L172.2 417L185.9 403.6L196 388.7L179.8 388L155.3 400.3L115.6 428.1L141.7 480.6L133.2 486.2L140.8 502L149.7 503.1L155.9 516.2L147.3 525.2L142.6 515.3L146.6 525.9L148.5 527L152 526.4L185 491.3L176 455.2L164.2 444.5L174 433.4L191.7 449.5L197.1 469L233.3 453L233.5 450.3L214.5 439.5L218.4 432.6L223.3 434.9L225.3 431L226.5 436.5L250 448.7L257.4 440.5L264.2 440.1L263.8 435.9L252.3 432.6L258.8 426.7L272 431.7L287.1 423.9L277.9 413.4L265 407.7L259 401.1L255.4 390.3L247.3 386.5L243.5 389.5L245.6 386.4L241.7 385.2L240.6 387.8ZM509.3 510.3L502.9 507.9L510.8 512.9L505.8 519.4L512 513.8L512.5 516.5L516.5 516.3L516.6 519.7L512.6 520.6L516.4 523.3L514.5 530.4L503.1 525.5L498 528L515.8 546L513.1 532.9L517 527.2L526.4 537.3L529.2 536.1L527.1 533.5L529 529.3L518.8 517L520.5 513.8L527.6 512.8L529.1 507.8L522.8 508L525.4 509.1L523.7 511.6L514.2 512.7L522.5 508L514.7 508.9L515.5 510.7L511.1 512.6ZM685.6 107.6L668.6 115L672.5 124.7L677.3 128.4L684.4 127.3L684.5 131.6L694.3 133.3L697.9 138L713.9 143.7L718.4 152L725.5 153L733.5 165.1L759.1 159.8L766 155.6L765 151.5L775.2 147.4L786.7 149.7L803.6 146.9L799.8 144L802.6 133.2L798.1 126.7L789.9 124.7L776.8 128.9L757.2 123.7L735.3 129.9L727.8 124.8L713.5 122.9L714.6 119.6L709.1 115.7ZM428.5 450.7L423 451.7L429.3 459.1L432.4 458.5L450.3 473.6L453.5 472.1L465.2 487.7L468.1 486.2L471.8 489.9L470.6 492.3L477 496L491 490.6L493.6 487.5L490.3 486.4L493 475.9L495.6 476.5L494.7 486.8L508.4 468.5L503.6 464.4L496.1 466.4L493.6 471L494.8 463.5L465.2 461.6L446.9 450.6L439.5 452.8ZM331.8 550.6L325 537L322.9 561.5L328.3 576.9L327.3 581.8L336.2 591L328.2 580.5L340.3 568.5L358.5 579.8L357.2 587.4L350.6 592.8L344.2 594.8L337.8 592.8L343.4 595.7L348.6 595.2L357.8 588.3L360 579.2L370.5 572.9L371.1 554.1L362 551L346 556.6ZM249.6 545.7L232.8 550.6L219.5 564.2L241.3 568.3L273.7 566.3L270.4 561.3L262.3 557.5L265 553.7L267.6 557.3L264.6 550.6L256.2 552.5L252.8 548.4L255.9 547.6ZM911.5 86.6L906.5 81.2L897.2 80.2L868 88.3L858.7 95.7L868 90.6L873.6 92.7L896.3 87.4L898.8 91.9L911.2 90.8L917.9 94.7L931.1 96.1L916 92.7ZM302.4 496.9L286.7 501.7L287.3 506.8L311.6 512.5L328.2 521.4L345.8 522.5L349.9 517.4L342.6 511.9L327.7 510L322.3 498.3L316.2 503.1ZM336.3 490.5L327.4 492.5L329.1 507L349.6 513.2L354.8 522.5L366.7 524L362.7 514.4ZM496.5 455.2L483.5 442.6L472 443.1L459.1 450.4L471 458.3L473.3 455.8L484.1 461.3Z";

// Approximate outlines: the Central Catchment, the Botanic Gardens, Gardens by the Bay.
const PARKS: [cx: number, cy: number, rx: number, ry: number][] = [
  [420, 235, 57, 45],
  [441, 339, 10, 17],
  [544, 407, 9, 6],
];

function Singapore({ labels }: { labels: boolean }) {
  return (
    <g>
      <defs>
        {/* Building footprints, so the land reads as a city */}
        <pattern
          id="city-bld"
          width="64"
          height="64"
          patternUnits="userSpaceOnUse"
          patternTransform="scale(0.5)"
        >
          <g fill="#EAE6DC" stroke="#DED9CD" strokeWidth="1">
            <rect x="5" y="5" width="22" height="15" rx="2" />
            <rect x="31" y="5" width="27" height="21" rx="2" />
            <rect x="5" y="25" width="15" height="28" rx="2" />
            <rect x="24" y="31" width="13" height="22" rx="2" />
            <rect x="41" y="31" width="17" height="12" rx="2" />
            <rect x="41" y="47" width="17" height="10" rx="2" />
          </g>
        </pattern>
        <pattern
          id="city-trees"
          width="22"
          height="22"
          patternUnits="userSpaceOnUse"
        >
          <circle cx="6" cy="6" r="4" fill="#CFE0C4" />
          <circle cx="17" cy="15" r="3.5" fill="#CFE0C4" />
        </pattern>
      </defs>

      {/* Sea */}
      <rect x="-1024" y="-1024" width="3072" height="3072" fill="#D5E4F0" />

      {/* Land */}
      <path d={JOHOR} fill="#F4F2EC" stroke="#C9DCEB" strokeWidth="3" />
      <path d={JOHOR} fill="url(#city-bld)" />
      <path d={LAND} fill="#F4F2EC" stroke="#C9DCEB" strokeWidth="3" />
      <path d={LAND} fill="url(#city-bld)" />

      {/* Parks */}
      {PARKS.map(([cx, cy, rx, ry]) => (
        <g key={`${cx},${cy}`}>
          <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="#DDE8D3" />
          <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="url(#city-trees)" />
        </g>
      ))}

      {labels && (
        <>
          <text
            fontFamily={LABEL_FONT}
            fontSize="15"
            fontWeight="500"
            letterSpacing="3.5"
            fill="#1B1B19"
            fillOpacity="0.32"
            x="512"
            y="221"
            textAnchor="middle"
          >
            SINGAPORE
          </text>
          <text
            fontFamily={LABEL_FONT}
            fontSize="14"
            fontStyle="italic"
            letterSpacing="2"
            fill="#5D88AA"
            fillOpacity="0.75"
            x="614"
            y="471"
            textAnchor="middle"
          >
            Singapore Strait
          </text>
        </>
      )}
    </g>
  );
}

// Route styles mirror the app's map: dotted walking, a heavier train line.
const ROUTE_STYLE: Record<
  Mode,
  { color: string; width: number; dash?: string }
> = {
  walk: { color: "var(--walk)", width: 3, dash: "0.1 6" },
  train: { color: "var(--train)", width: 4.5 },
  drive: { color: "var(--drive)", width: 3.5 },
};

export type MapRoute = {
  mode: Mode;
  points: Point[];
  opacity?: number;
  /** Draws the route in once, after `delay` seconds over `duration` seconds. */
  draw?: { delay: number; duration: number };
};

export type MapPin = {
  at: Point;
  label?: string;
  side?: "l" | "r" | "u" | "d";
  radius?: number;
  fill?: string;
  /** Fades the pin in after `delay` seconds. */
  delay?: number;
};

/** A map's box, and the points it fits inside its padding. */
export type MapView = {
  width: number;
  height: number;
  fit: Point[];
  padding: number | [number, number, number, number];
};

/** How a view maps sample-day points into its box: x' = ox + x × scale. */
export function fitView({ width, height, fit, padding }: MapView) {
  const xs = fit.map((p) => p[0]);
  const ys = fit.map((p) => p[1]);
  const left = Math.min(...xs);
  const right = Math.max(...xs);
  const top = Math.min(...ys);
  const bottom = Math.max(...ys);
  const [pt, pr, pb, pl] =
    typeof padding === "number"
      ? [padding, padding, padding, padding]
      : padding;
  const innerWidth = width - pl - pr;
  const innerHeight = height - pt - pb;
  const scale = Math.min(
    innerWidth / (right - left),
    innerHeight / (bottom - top),
  );
  const ox = pl + (innerWidth - (right - left) * scale) / 2 - left * scale;
  const oy = pt + (innerHeight - (bottom - top) * scale) / 2 - top * scale;
  return { scale, ox, oy };
}

/**
 * The sample day on the map of Singapore, fitted to `fit` and cropped to fill
 * its box. With `snapshot`, an Apple Maps image of exactly the box replaces
 * the drawn map.
 */
export function DayMap({
  fontSize = 13,
  strokeScale = 1,
  labels = true,
  routes = [],
  pins = [],
  snapshot,
  ...view
}: MapView & {
  fontSize?: number;
  strokeScale?: number;
  labels?: boolean;
  routes?: MapRoute[];
  pins?: MapPin[];
  snapshot?: string;
}) {
  const { width, height } = view;
  const fs = fontSize;
  const { scale, ox, oy } = fitView(view);
  const project = (p: Point) => [ox + p[0] * scale, oy + p[1] * scale];
  const path = (points: Point[]) =>
    points
      .map(
        (p, i) =>
          (i ? "L" : "M") +
          project(p)
            .map((v) => v.toFixed(1))
            .join(" "),
      )
      .join("");

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      className="absolute inset-0 block size-full"
    >
      {snapshot ? (
        <image
          href={snapshot}
          width={width}
          height={height}
          preserveAspectRatio="none"
        />
      ) : (
        <g
          transform={`translate(${ox.toFixed(1)} ${oy.toFixed(1)}) scale(${scale.toFixed(4)})`}
        >
          <Singapore labels={labels} />
        </g>
      )}
      {routes.map((route, i) => {
        const style = ROUTE_STYLE[route.mode];
        const d = path(route.points);
        const drawn = route.draw
          ? ({
              pathLength: 1,
              strokeDasharray: 1,
              className: "route-draw",
              style: {
                "--draw-delay": `${route.draw.delay}s`,
                "--draw-duration": `${route.draw.duration}s`,
              } as CSSProperties,
            } as const)
          : null;
        return (
          // biome-ignore lint/suspicious/noArrayIndexKey: fixed order of the day
          <g key={i} fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path
              d={d}
              stroke="#ffffff"
              strokeWidth={(style.width + 3) * strokeScale}
              opacity={route.opacity ?? 0.9}
              {...drawn}
            />
            <path
              d={d}
              stroke={style.color}
              strokeWidth={style.width * strokeScale}
              strokeDasharray={style.dash}
              opacity={route.opacity ?? 1}
              {...drawn}
            />
          </g>
        );
      })}
      {pins.map((pin, i) => {
        const [x, y] = project(pin.at);
        const labelWidth = pin.label
          ? pin.label.length * fs * 0.56 + fs * 1.5
          : 0;
        const labelHeight = fs * 1.9;
        const labelX =
          pin.side === "u" || pin.side === "d"
            ? x - labelWidth / 2
            : pin.side === "l"
              ? x - fs * 0.9 - labelWidth
              : x + fs * 0.9;
        const labelY =
          pin.side === "u"
            ? y - labelHeight - fs * 0.8
            : pin.side === "d"
              ? y + fs * 0.8
              : y - labelHeight / 2;
        return (
          <g
            // biome-ignore lint/suspicious/noArrayIndexKey: fixed order of the day
            key={i}
            className={pin.delay === undefined ? undefined : "stop-in"}
            style={
              pin.delay === undefined
                ? undefined
                : ({ "--stop-delay": `${pin.delay}s` } as CSSProperties)
            }
          >
            <circle
              cx={x}
              cy={y}
              r={pin.radius ?? fs * 0.42}
              fill={pin.fill ?? "var(--ink)"}
              stroke="#ffffff"
              strokeWidth={fs * 0.22}
            />
            {pin.label && (
              <>
                <rect
                  x={labelX}
                  y={labelY}
                  width={labelWidth}
                  height={labelHeight}
                  rx={labelHeight / 2}
                  fill="#ffffff"
                  style={{ filter: "drop-shadow(0 1px 3px rgba(0,0,0,0.14))" }}
                />
                <text
                  x={labelX + labelWidth / 2}
                  y={labelY + labelHeight / 2}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={fs}
                  fontWeight={600}
                  fill="var(--ink)"
                  style={{
                    fontFamily: "var(--font-geist), system-ui, sans-serif",
                  }}
                >
                  {pin.label}
                </text>
              </>
            )}
          </g>
        );
      })}
    </svg>
  );
}
