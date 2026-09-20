'use server'

import { redirect } from 'next/navigation'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { createClient } from '@/utils/supabase/server'
import type { Categoria } from '@/generated/prisma/client'

const schema = z.object({
  descricao: z.string().min(10, 'Descreve com mais detalhe o que precisas'),
  categoria: z.enum([
    'CONSTRUCAO', 'TECNOLOGIA', 'MARKETING_DESIGN', 'LOGISTICA',
    'CONSULTORIA', 'COMERCIO', 'INDUSTRIA', 'SERVICOS_PROFISSIONAIS',
    'HOTELARIA', 'AGRICULTURA', 'OUTRA',
  ]),
  localizacao: z.string().min(2, 'Localização obrigatória'),
  prazo: z.string().optional(),
  nome: z.string().min(2, 'Nome obrigatório'),
  contacto: z.string().min(9, 'Contacto inválido'),
})

export async function criarPedido(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const parsed = schema.safeParse({
    descricao: formData.get('descricao'),
    categoria: formData.get('categoria'),
    localizacao: formData.get('localizacao'),
    prazo: formData.get('prazo'),
    nome: formData.get('nome'),
    contacto: formData.get('contacto'),
  })

  if (!parsed.success) {
    redirect('/pedidos/novo?error=' + encodeURIComponent(parsed.error.issues[0].message))
  }

  const pedido = await prisma.pedido.create({
    data: {
      descricao: parsed.data!.descricao,
      categoria: parsed.data!.categoria as Categoria,
      localizacao: parsed.data!.localizacao,
      prazo: parsed.data!.prazo || null,
      nome: parsed.data!.nome,
      contacto: parsed.data!.contacto,
      authUserId: user?.id ?? null,
    },
  })

  const destino = user
    ? '/pedidos/novo?sucesso=1'
    : `/pedidos/novo?sucesso=1&pedidoId=${pedido.id}`
  redirect(destino)
}