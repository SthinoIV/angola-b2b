import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { categoriaLabel } from '@/lib/categorias'

function getLogoUrl(path: string | null) {
  if (!path) return null
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/logos/${path}`
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const company = await prisma.company.findUnique({ where: { slug } })
  if (!company) return { title: 'Empresa não encontrada — Angola B2B' }
  return {
    title: `${company.nome} — Angola B2B`,
    description: company.descricao ?? `${company.nome}, ${categoriaLabel(company.categoria)} em ${company.localizacao}.`,
  }
}

export default async function EmpresaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const company = await prisma.company.findUnique({ where: { slug } })
  if (!company) notFound()

  const logoUrl = getLogoUrl(company.logoUrl)

  return (
    <div className="max-w-2xl mx-auto px-4 py-14">
      {logoUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={logoUrl} alt={`Logótipo de ${company.nome}`} className="max-w-40 mb-6 rounded-md" />
      )}
      <h1 className="font-serif text-3xl font-bold">{company.nome}</h1>
      <p className="text-neutral-500 mt-2">{categoriaLabel(company.categoria)} — {company.localizacao}</p>
      {company.verificada && <p className="text-green-700 mt-2 text-sm font-medium">✓ Empresa verificada</p>}
      {company.descricao && <p className="mt-6 text-neutral-800">{company.descricao}</p>}

      <ul className="mt-8 space-y-2 text-sm border-t border-neutral-200 pt-6">
        <li><span className="text-neutral-500">WhatsApp:</span> {company.whatsapp}</li>
        {company.email && <li><span className="text-neutral-500">Email:</span> {company.email}</li>}
        {company.website && (
          <li><span className="text-neutral-500">Website:</span> <a href={company.website} className="text-amber-700 hover:underline">{company.website}</a></li>
        )}
      </ul>
    </div>
  )
}