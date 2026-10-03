export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 bg-[#0B2545]/90 backdrop-blur-md flex flex-col items-center justify-center text-white">
      <div className="w-16 h-16 rounded-2xl bg-white/10 p-2 flex items-center justify-center border border-[#C59B27]/40 shadow-xl mb-6 animate-pulse">
        <img
          src="/icons/logo.svg"
          alt="BABFEZ"
          width={48}
          height={48}
          className="w-full h-full object-contain"
        />
      </div>
      <div className="w-10 h-10 border-3 border-[#C59B27] border-t-transparent rounded-full animate-spin mb-4"></div>
      <span className="text-sm font-bold tracking-widest uppercase text-[#C59B27]">Chargement BABFEZ...</span>
    </div>
  );
}
