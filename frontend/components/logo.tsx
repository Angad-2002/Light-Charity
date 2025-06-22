import Link from "next/link"
import Image from "next/image"

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
      <div className="relative w-10 h-10 flex-shrink-0">
        <Image
          src="/images/light-charity-logo-new.png"
          alt="Light Charity Logo"
          width={40}
          height={40}
          className="object-contain"
          priority
        />
      </div>
      <span className="text-xl font-bold tracking-wider">
        <span className="gradient-text-fallback gradient-text" style={{ lineHeight: "1.3" }}>
          Light Charity
        </span>
      </span>
    </Link>
  )
}
