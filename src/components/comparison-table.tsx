import { BRAND } from "@/lib/site";

// How well an app does on a row. Be fair: the other app gets "yes" where it
// does well.
export type Status = "yes" | "partly" | "no";

export type ComparisonRow = {
  topic: string;
  trace: string;
  traceStatus: Status;
  other: string;
  otherStatus: Status;
};

// Icons must be in ICON_NAMES in layout.tsx.
const STATUS: Record<
  Status,
  { icon: string; label: string; className: string }
> = {
  yes: { icon: "check_circle", label: "Yes", className: "text-walk" },
  partly: {
    icon: "do_not_disturb_on",
    label: "Partly",
    className: "text-secondary",
  },
  no: { icon: "cancel", label: "No", className: "text-[#b3412f]" },
};

export function StatusMark({ status }: { status: Status }) {
  const { icon, label, className } = STATUS[status];
  return (
    <span
      role="img"
      aria-label={label}
      className={`icon text-[22px] ${className}`}
    >
      {icon}
    </span>
  );
}

/** Trace in the first column, highlighted; the other app in the second. */
export function ComparisonTable({
  other,
  rows,
}: {
  other: string;
  rows: ComparisonRow[];
}) {
  return (
    // Below md, each row stacks into a card and the cells carry their own labels.
    <div className="overflow-hidden rounded-[32px] border border-line bg-surface">
      <table className="w-full text-left text-[15px] leading-relaxed">
        <thead className="max-md:sr-only">
          <tr className="border-line border-b">
            <th scope="col" className="w-[22%] px-6 py-5">
              <span className="sr-only">Topic</span>
            </th>
            <th
              scope="col"
              className="w-[39%] bg-sun/[0.06] px-6 py-5 font-semibold"
            >
              <span className="flex items-center gap-2.5">
                {/* biome-ignore lint/performance/noImgElement: static SVG artwork needs no optimisation */}
                <img
                  src="/brand/logo.svg"
                  alt=""
                  width={28}
                  height={28}
                  className="rounded-[22.37%]"
                />
                {BRAND}
              </span>
            </th>
            <th scope="col" className="px-6 py-5 font-semibold">
              {other}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {rows.map((row) => (
            <tr
              key={row.topic}
              className="align-top max-md:block max-md:px-5 max-md:py-5"
            >
              <th
                scope="row"
                className="px-6 py-5 font-semibold max-md:block max-md:p-0 max-md:pb-3"
              >
                {row.topic}
              </th>
              <td className="bg-sun/[0.06] px-6 py-5 text-ink max-md:block max-md:rounded-2xl max-md:px-4 max-md:py-3">
                <span className="mb-1 block font-mono text-[11px] text-sun tracking-[1px] md:hidden">
                  {BRAND.toUpperCase()}
                </span>
                <span className="flex gap-3">
                  <StatusMark status={row.traceStatus} />
                  <span>{row.trace}</span>
                </span>
              </td>
              <td className="px-6 py-5 text-secondary max-md:block max-md:px-4 max-md:pt-3 max-md:pb-0">
                <span className="mb-1 block font-mono text-[11px] tracking-[1px] md:hidden">
                  {other.toUpperCase()}
                </span>
                <span className="flex gap-3">
                  <StatusMark status={row.otherStatus} />
                  <span>{row.other}</span>
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
