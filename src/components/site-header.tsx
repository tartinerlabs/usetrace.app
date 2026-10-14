import Image from "next/image";
import Link from "next/link";
import { BRAND } from "@/lib/site";

export function SiteHeader() {
  return (
    <header className="mx-auto flex w-full flex-wrap max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
      <Link
        href="/"
        className="flex items-center gap-2 rounded-small font-rounded text-lg font-semibold"
      >
        <Image
          src="/images/app-icon.png"
          alt=""
          width={32}
          height={32}
          className="size-8 rounded-[0.5rem]"
        />
        {BRAND}
      </Link>
      <nav aria-label="Primary">
        <ul className="flex flex-wrap items-center gap-x-4 gap-y-2 text-secondary text-sm sm:gap-x-6">
          <li>
            <Link href="/privacy" className="hover:text-ink">
              Privacy
            </Link>
          </li>
          <li>
            <Link href="/support" className="hover:text-ink">
              Support
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
