import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Angola B2B — Onde as empresas encontram negócios",
  description: "Descubra empresas, produtos, serviços e oportunidades de negócio em Angola.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-AO">
      <body className="antialiased bg-white text-neutral-900 flex min-h-screen flex-col">
        <header className="border-b border-neutral-200">
          <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
            <Link href="/" className="font-serif text-xl font-bold shrink-0">
              Angola <span className="text-amber-600">B2B</span>
            </Link>
            <nav className="hidden sm:flex gap-6 text-sm text-neutral-600">
              <Link href="/empresas" className="hover:text-neutral-900">Empresas</Link>
              <Link href="/pedidos/novo" className="hover:text-neutral-900">Publicar pedido</Link>
            </nav>
            <Link
              href="/empresa/nova"
              className="text-sm border border-neutral-900 rounded-md px-4 py-2 hover:bg-neutral-900 hover:text-white transition-colors shrink-0"
            >
              Cadastrar empresa
            </Link>
          </div>
        </header>

        <main className="flex-1">{children}</main>

        <footer className="border-t border-neutral-200 mt-20">
          <div className="max-w-5xl mx-auto px-4 py-8 text-sm text-neutral-500">
            Angola B2B — Fase de validação (V0)
          </div>
        </footer>
      </body>
    </html>
  );
}