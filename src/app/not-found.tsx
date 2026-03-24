import Link from "next/link";

/**
 * Custom 404 page — keeps visitors in the Hyper Reality world
 * instead of showing a generic Next.js error.
 */
export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-16 text-center">
      <div className="max-w-md w-full space-y-8">
        <p className="font-hand text-8xl text-gray-200">404</p>
        <h1 className="font-hand text-4xl text-gray-900">
          This reality doesn&apos;t exist
        </h1>
        <p className="font-body text-gray-400">
          You&apos;ve wandered into an alternate timeline that was never written.
          Even with 6,561 versions, this page isn&apos;t one of them.
        </p>
        <div className="pt-4 space-y-3">
          <Link
            href="/"
            className="inline-block border-2 border-accent-blue text-accent-blue px-8 py-3 rounded-full font-hand text-xl hover:bg-accent-blue hover:text-white transition-all duration-300 hover:scale-105"
          >
            Return to Reality
          </Link>
          <p className="text-xs text-gray-300 font-body">
            or take the survey and find your version
          </p>
        </div>
      </div>
    </main>
  );
}
