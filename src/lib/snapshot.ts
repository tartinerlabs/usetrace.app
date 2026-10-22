import { fitView, type MapView } from "@/components/day-map";
import { toLatLng } from "@/lib/sample-day";

// Signed Apple Maps Web Snapshot URLs, made on the server when the page
// renders. The private key stays here; the page gets only a URL whose
// signature covers exactly its parameters.

function base64url(data: ArrayBuffer): string {
  return btoa(String.fromCharCode(...new Uint8Array(data)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

/** An Apple Maps image of exactly the box of `view`, or undefined without keys. */
export async function snapshotUrl(view: MapView): Promise<string | undefined> {
  const keyId = process.env.MAPKIT_KEY_ID;
  const teamId = process.env.APPLE_TEAM_ID;
  const pem = process.env.MAPKIT_PRIVATE_KEY;
  if (!keyId || !teamId || !pem) return undefined;

  // The corners of the box, as sample-day points, then as latitude and longitude.
  const { scale, ox, oy } = fitView(view);
  const [north, west] = toLatLng([-ox / scale, -oy / scale]);
  const [south, east] = toLatLng([
    (view.width - ox) / scale,
    (view.height - oy) / scale,
  ]);
  const params = new URLSearchParams({
    center: `${((north + south) / 2).toFixed(6)},${((west + east) / 2).toFixed(6)}`,
    spn: `${(north - south).toFixed(6)},${(east - west).toFixed(6)}`,
    size: `${Math.round(view.width)}x${Math.round(view.height)}`,
    scale: "2",
    t: "mutedStandard",
    colorScheme: "light",
    poi: "0",
    lang: "en-GB",
  });
  const path = `/api/v1/snapshot?${params}&teamId=${teamId}&keyId=${keyId}`;

  const der = Uint8Array.from(
    atob(pem.replace(/-----[^-]+-----|\s/g, "")),
    (c) => c.charCodeAt(0),
  );
  const key = await crypto.subtle.importKey(
    "pkcs8",
    der,
    { name: "ECDSA", namedCurve: "P-256" },
    false,
    ["sign"],
  );
  // Web Crypto returns the raw r || s signature that ES256 expects.
  const signature = await crypto.subtle.sign(
    { name: "ECDSA", hash: "SHA-256" },
    key,
    new TextEncoder().encode(path),
  );
  return `https://snapshot.apple-mapkit.com${path}&signature=${base64url(signature)}`;
}
