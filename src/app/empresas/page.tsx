import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { categorias, categoriaLabel } from '@/lib/categorias'
import type { Categoria } from '@/generated/prisma/client'

const PAGE_SIZE = 20

export default async function EmpresasPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; categoria?: string; localizacao?: string; page?: string }>
}) {
  const { q = '', categoria = '', localizacao = '', page = '1' } = await searchParams
  const pageNumber = Math.max(1, parseInt(page) || 1)

  const where = {
    AND: [
      q ? { OR: [
        { nome: { contains: q, mode: 'insensitive' as const } },
        { descricao: { contains: q, mode: 'insensitive' as const } },
      ] } : {},
      categoria ? { categoria: categoria as Categoria } : {},
      localizacao ? { localizacao: { contains: localizacao, mode: 'insensitive' as const } } : {},
    ],
  }

  const [empresas, total] = await Promise.all([
    prisma.company.findMany({ where, orderBy: { createdAt: 'desc' }, skip: (pageNumber - 1) * PAGE_SIZE, take: PAGE_SIZE }),
    prisma.company.count({ where }),
  ])

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const paramsSemPage = new URLSearchParams({
    ...(q && { q }), ...(categoria && { categoria }), ...(localizacao && { localizacao }),
  }).toString()

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="font-serif text-3xl font-bold mb-6">Empresas</h1>

      <form method="get" className="flex flex-col sm:flex-row gap-3 mb-8">
        <input type="text" name="q" placeholder="Nome ou descrição" defaultValue={q}
          className="flex-1 rounded-md border border-neutral-300 px-3 py-2" />
        <select name="categoria" defaultValue={categoria} className="rounded-md border border-neutral-300 px-3 py-2">
          <option value="">Todas as categorias</option>
          {categorias.map(([valor, label]) => <option key={valor} value={valor}>{label}</option>)}
        </select>
        <input type="text" name="localizacao" placeholder="Localização" defaultValue={localizacao}
          className="rounded-md border border-neutral-300 px-3 py-2" />
        <button type="submit" className="rounded-md border border-neutral-900 px-5 py-2 hover:bg-neutral-100 transition-colors shrink-0">
          Pesquisar
        </button>
      </form>

      <p className="text-sm text-neutral-500 mb-4">
        {total} empresa{total !== 1 ? 's' : ''} encontrada{total !== 1 ? 's' : ''}
      </p>

      <ul className="divide-y divide-neutral-200">
        {empresas.map((empresa) => (
          <li key={empresa.id} className="py-4">
            <Link href={`/empresas/${empresa.slug}`} className="font-semibold hover:underline">{empresa.nome}</Link>
            <p className="text-sm text-neutral-500 mt-1">{categoriaLabel(empresa.categoria)} — {empresa.localizacao}</p>
          </li>
        ))}
      </ul>

      {empresas.length === 0 && <p className="text-neutral-500 py-8">Nenhuma empresa encontrada com estes filtros.</p>}

      <div className="flex items-center gap-4 mt-8 text-sm">
        {pageNumber > 1 && <Link href={`/empresas?${paramsSemPage}&page=${pageNumber - 1}`} className="hover:underline">← Anterior</Link>}
        <span className="text-neutral-500">Página {pageNumber} de {totalPages}</span>
        {pageNumber < totalPages && <Link href={`/empresas?${paramsSemPage}&page=${pageNumber + 1}`} className="hover:underline">Seguinte →</Link>}
      </div>
    </div>
  )
}