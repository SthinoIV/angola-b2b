import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { categoriaLabel } from '@/lib/categorias'

function getLogoUrl(path: string | null) {
  if (!path) return null
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/logos/${path}`
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const company = await prisma.company.findUnique({ where: { slug } })

  if (!company) return { title: 'Empresa não encontrada — Angola B2B' }

  return {
    title: `${company.nome} — Angola B2B`,
    description: company.descricao ?? `${company.nome}, ${categoriaLabel(company.categoria)} em ${company.localizacao}.`,
  }
}

export default async function EmpresaPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const company = await prisma.company.findUnique({ where: { slug } })

  if (!company) notFound()

  const logoUrl = getLogoUrl(company.logoUrl)

  return (
    <div style={{ maxWidth: 640, margin: '60px auto' }}>
      {logoUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={logoUrl} alt={`Logótipo de ${company.nome}`} style={{ maxWidth: 160, marginBottom: 20 }} />
      )}
      <h1>{company.nome}</h1>
      <p style={{ color: '#555' }}>{categoriaLabel(company.categoria)} — {company.localizacao}</p>
      {company.verificada && <p style={{ color: 'green' }}>✓ Empresa verificada</p>}
      {company.descricao && <p>{company.descricao}</p>}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        <li>WhatsApp: {company.whatsapp}</li>
        {company.email && <li>Email: {company.email}</li>}
        {company.website && <li>Website: <a href={company.website}>{company.website}</a></li>}
      </ul>
    </div>
  )
}