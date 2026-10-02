import Image from "next/image";

interface FooterProps {
  isLoading?: boolean;
}

export function Footer({ isLoading = false }: FooterProps) {
  return (
    <footer className="bg-[#0b2545] border-t-4 border-[#ffde00] px-4 py-5 text-center text-white sm:py-6">
      <div className="mx-auto flex max-w-2xl flex-col items-center justify-center gap-2">
        <div className="relative h-16 w-16 sm:h-18 sm:w-18 overflow-hidden rounded-full ring-3 ring-[#ffde00] bg-white shadow-lg">
          <Image
            src="/kya-khaugey.png"
            alt="Khaoge Kya?"
            fill
            className="object-cover"
            sizes="72px"
            unoptimized
          />
        </div>
        <div>
          <p className="font-navbar-brand text-lg font-black tracking-tight text-white sm:text-xl">
            KHA<span className="text-[#e51b24]">OGE</span> KYA<span className="text-[#e51b24]">?</span>
          </p>
          <p className="text-[10px] font-extrabold uppercase tracking-widest text-[#ffde00] sm:text-[11px]">
            Good Food For Good Moments
          </p>
        </div>
        <div className="mt-1 border-t border-white/10 pt-2 w-full max-w-xs">
          <p className="font-body text-[10px] text-white/60">
            Provisioningtech • Restaurant Marketing Partner
          </p>
        </div>
      </div>
    </footer>
  );
}
