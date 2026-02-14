import Link from "next/link";
import HDiagram from "@/components/HDiagram";
import Dice from "@/components/Dice";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-16">
      <div className="max-w-lg w-full space-y-12 text-center">
        {/* H-Diagram */}
        <HDiagram />

        {/* Title */}
        <div className="space-y-3">
          <h1 className="font-hand text-6xl md:text-7xl font-bold tracking-tight text-gray-900">
            Hyper Reality
          </h1>
          <p className="font-hand text-xl md:text-2xl text-gray-500">
            The Mysterious Death of Alex Lambert 2
          </p>
          <p className="text-sm tracking-widest uppercase text-accent-warm mt-4">
            A book unique to YOU
          </p>
        </div>

        {/* Dice */}
        <Dice />

        {/* CTA */}
        <Link
          href="/survey"
          className="inline-block border-2 border-accent-blue text-accent-blue px-8 py-3 rounded-full font-hand text-2xl hover:bg-accent-blue hover:text-white transition-all duration-300"
        >
          Take the Survey
        </Link>
      </div>
    </main>
  );
}
