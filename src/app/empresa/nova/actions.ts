'use server'

import { redirect } from 'next/navigation'
import { z } from 'zod'
import { createClient } from '@/utils/supabase/server'
import { prisma } from '@/lib/prisma'
import type { Categoria } from '@/generated/prisma/client'

const schema = z.object({
  nome: z.string().min(2, 'Nome demasiado curto'),
  categoria: z.enum([
    'CONSTRUCAO', 'TECNOLOGIA', 'MARKETING_DESIGN', 'LOGISTICA',
    'CONSULTORIA', 'COMERCIO', 'INDUSTRIA', 'SERVICOS_PROFISSIONAIS',
    'HOTELARIA', 'AGRICULTURA', 'OUTRA',
  ]),
  localizacao: z.string().min(2, 'Localização obrigatória'),
  descricao: z.string().optional(),
  whatsapp: z.string().min(9, 'WhatsApp inválido'),
  email: z.string().email().optional().or(z.literal('')),
  website: z.string().url().optional().or(z.literal('')),
})

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export async function criarEmpresa(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const parsed = schema.safeParse({
    nome: formData.get('nome'),
    categoria: formData.get('categoria'),
    localizacao: formData.get('localizacao'),
    descricao: formData.get('descricao'),
    whatsapp: formData.get('whatsapp'),
    email: formData.get('email'),
    website: formData.get('website'),
  })

  if (!parsed.success) {
    redirect('/empresa/nova?error=' + encodeURIComponent(parsed.error.issues[0].message))
  }

  let logoUrl: string | null = null
  const logo = formData.get('logo') as File

  if (logo && logo.size > 0) {
    const caminho = `${user!.id}/${Date.now()}-${logo.name}`
    const { error: uploadError } = await supabase.storage.from('logos').upload(caminho, logo)
    if (uploadError) {
      redirect('/empresa/nova?error=' + encodeURIComponent('Falha ao enviar logótipo: ' + uploadError.message))
    }
    logoUrl = caminho
  }

  const slugBase = slugify(parsed.data!.nome)
  let slug = slugBase
  let contador = 1
  while (await prisma.company.findUnique({ where: { slug } })) {
    slug = `${slugBase}-${contador++}`
  }

  await prisma.company.create({
    data: {
      authUserId: user!.id,
      nome: parsed.data!.nome,
      slug,
      categoria: parsed.data!.categoria as Categoria,
      localizacao: parsed.data!.localizacao,
      descricao: parsed.data!.descricao || null,
      whatsapp: parsed.data!.whatsapp,
      email: parsed.data!.email || null,
      website: parsed.data!.website || null,
      logoUrl,
    },
  })

  redirect(`/empresas/${slug}`)
}