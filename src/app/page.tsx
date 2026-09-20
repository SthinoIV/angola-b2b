import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { categorias, categoriaLabel } from '@/lib/categorias'

export default async function HomePage() {
  const empresasDestaque = await prisma.company.findMany({
    orderBy: [{ verificada: 'desc' }, { createdAt: 'desc' }],
    take: 6,
  })

  return (
    <div className="max-w-5xl mx-auto px-4">
      <section className="text-center py-16 sm:py-20">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold mb-4">
          Onde as empresas encontram negócios.
        </h1>
        <p className="text-neutral-600 text-lg max-w-xl mx-auto mb-8">
          Descubra empresas, produtos, serviços e oportunidades de negócio em Angola.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/pedidos/novo" className="rounded-md bg-neutral-900 text-white px-6 py-3 hover:bg-neutral-700 transition-colors">
            Publicar um pedido
          </Link>
          <Link href="/empresa/nova" className="rounded-md border border-neutral-900 px-6 py-3 hover:bg-neutral-100 transition-colors">
            Cadastrar a minha empresa
          </Link>
        </div>
      </section>

      <section className="py-6">
        <form method="get" action="/empresas" className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
          <input
            type="text"
            name="q"
            placeholder="Pesquisar empresas, produtos ou serviços..."
            className="flex-1 rounded-md border border-neutral-300 px-4 py-3"
          />
          <button type="submit" className="rounded-md border border-neutral-900 px-6 py-3 hover:bg-neutral-100 transition-colors">
            Pesquisar
          </button>
        </form>
      </section>

      <section className="py-14">
        <h2 className="font-serif text-2xl font-semibold mb-5">Principais categorias</h2>
        <div className="flex flex-wrap gap-2">
          {categorias.map(([valor, label]) => (
            <Link
              key={valor}
              href={`/empresas?categoria=${valor}`}
              className="rounded-full border border-neutral-300 px-4 py-2 text-sm hover:border-neutral-900 transition-colors"
            >
              {label}
            </Link>
          ))}
        </div>
      </section>

      <section className="py-14">
        <h2 className="font-serif text-2xl font-semibold mb-5">Empresas em destaque</h2>
        {empresasDestaque.length === 0 ? (
          <p className="text-neutral-500">Ainda não há empresas cadastradas. Sê a primeira!</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {empresasDestaque.map((empresa) => (
              <Link
                key={empresa.id}
                href={`/empresas/${empresa.slug}`}
                className="block rounded-lg border border-neutral-200 p-5 hover:border-neutral-400 transition-colors"
              >
                <p className="font-semibold">{empresa.nome}</p>
                <p className="text-sm text-neutral-500 mt-1">
                  {categoriaLabel(empresa.categoria)} — {empresa.localizacao}
                </p>
                {empresa.verificada && <p className="text-sm text-green-700 mt-2">✓ Verificada</p>}
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="text-center border-t border-neutral-200 py-16">
        <h2 className="font-serif text-xl font-semibold mb-4">Tem uma empresa?</h2>
        <Link href="/empresa/nova" className="inline-block rounded-md bg-neutral-900 text-white px-6 py-3 hover:bg-neutral-700 transition-colors">
          Cadastre gratuitamente
        </Link>
      </section>
    </div>
  )
}