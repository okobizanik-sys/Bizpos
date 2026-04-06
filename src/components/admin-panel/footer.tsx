import Link from "next/link";

export function Footer() {
  const brandName = process.env.NEXT_PUBLIC_BRAND_NAME;
  return (
    <div className="supports-backdrop-blur:bg-background/60 z-20 w-full shadow bg-background/95 backdrop-blur">
      <div className="mx-4 md:mx-8 flex h-14 items-cente">
        <p className="text-xs md:text-sm leading-loose text-muted-foreground text-left">
          &copy; {new Date().getFullYear()} <Link href="/">{brandName}</Link>.
          All rights reserved.
        </p>
        <p className="text-xs md:text-sm leading-loose text-muted-foreground text-right ml-auto">
          Powered by{" "}
          <Link
            href="https://www.okobiz.com"
            target="_blank"
            className="text-blue-700"
          >
            okobiz
          </Link>
        </p>
      </div>
    </div>
  );
}
