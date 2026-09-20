'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import type { EstadoPedido } from '@/generated/prisma/client'

export async function atualizarEstado(pedidoId: string, formData: FormData) {
  const estado = formData.get('estado') as EstadoPedido
  await prisma.pedido.update({ where: { id: pedidoId }, data: { estado } })
  revalidatePath('/admin/pedidos')
}