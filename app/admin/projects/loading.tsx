export default function Loading() {
  return (
    <main className="min-h-screen bg-[#030303] px-6 py-20 text-white">
      <div className="mx-auto max-w-7xl">

        <div className="h-3 w-32 animate-pulse bg-white/[0.08]" />

        <div className="mt-5 h-12 w-64 animate-pulse bg-white/[0.06]" />

        <div className="mt-12 space-y-4">

          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="h-32 animate-pulse border-y border-white/[0.06] bg-white/[0.015]"
            />
          ))}

        </div>

      </div>
    </main>
  );
}
