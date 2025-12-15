import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-6">
      <div className="text-center">
        <h1 className="text-6xl font-bold bg-linear-to-r from-blue-400 via-purple-400 to-red-400 bg-clip-text text-transparent mb-4">
          MLBB Pick & Ban System
        </h1>
        <p className="text-gray-300 text-xl mb-12">
          Professional MPL-style draft system with 130+ heroes
        </p>
        
        <div className="flex gap-6 justify-center">
          <Link
            href="/controller"
            className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold rounded-xl transition transform hover:scale-105 shadow-lg"
          >
            🎮 Open Controller
          </Link>
          <Link
            href="/overlay"
            target="_blank"
            className="px-8 py-4 bg-red-600 hover:bg-red-700 text-white text-lg font-semibold rounded-xl transition transform hover:scale-105 shadow-lg"
          >
            📺 Open Overlay
          </Link>
          <Link
            href="/overlayv2"
            target="_blank"
            className="px-8 py-4 bg-green-600 hover:bg-green-700 text-white text-lg font-semibold rounded-xl transition transform hover:scale-105 shadow-lg"
          >
            📺 Overlay v2
          </Link>
        </div>

        <div className="mt-12 text-gray-400 text-sm">
          <p>✅ MPL Standard Draft Format</p>
          <p>✅ 130+ Heroes from API</p>
          <p>✅ Real-time Sync via LocalStorage</p>
          <p>✅ OBS-Ready Overlay</p>
        </div>
      </div>
    </div>
  );
}