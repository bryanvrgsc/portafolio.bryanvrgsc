import Link from "next/link";

export default function NotFound() {
    return (
        <div className="min-h-screen bg-[#1c1c1e] flex items-center justify-center p-8">
            <div className="max-w-md text-center">
                <div className="w-24 h-24 bg-orange-500/10 rounded-3xl flex items-center justify-center text-6xl mx-auto mb-6 border border-orange-500/20">
                    🔍
                </div>
                <h1 className="text-4xl font-bold text-white mb-4">404</h1>
                <p className="text-white/60 mb-8 text-lg">
                    La página que buscas no existe o ha sido movida.
                </p>
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-xl transition-colors"
                >
                    <span>←</span>
                    Volver al inicio
                </Link>
            </div>
        </div>
    );
}
