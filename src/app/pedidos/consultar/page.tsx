import { prisma } from '@/lib/prisma'
import { categoriaLabel } from '@/lib/categorias'
import { createClient } from '@/utils/supabase/server'

const estadoLabel: Record<string, string> = {
  NOVO: 'Novo', CONTACTADO: 'Contactado', EM_NEGOCIACAO: 'Em negociação', GANHO: 'Ganho', PERDIDO: 'Perdido',
}

export default async function ConsultarPedidosPage({
  searchParams,
}: {
  searchParams: Promise<{ contacto?: string }>
}) {
  const { contacto } = await searchParams
  const contactoLimpo = contacto?.trim()

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const pedidos = user
    ? await prisma.pedido.findMany({ where: { authUserId: user.id }, orderBy: { createdAt: 'desc' } })
    : contactoLimpo
    ? await prisma.pedido.findMany({ where: { contacto: contactoLimpo }, orderBy: { createdAt: 'desc' } })
    : []

  return (
    <div style={{ maxWidth: 560, margin: '60px auto' }}>
      <h1>Os meus pedidos</h1>

      {!user && (
        <form method="get" style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
          <input type="text" name="contacto" placeholder="O teu WhatsApp" defaultValue={contactoLimpo} required />
          <button type="submit">Consultar</button>
        </form>
      )}

      {!user && contactoLimpo && pedidos.length === 0 && <p>Nenhum pedido encontrado com este contacto.</p>}
      {user && pedidos.length === 0 && <p>Ainda não tens pedidos associados a esta conta.</p>}

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {pedidos.map((pedido) => (
          <li key={pedido.id} style={{ borderBottom: '1px solid #ddd', padding: '12px 0' }}>
            <p style={{ margin: 0 }}>{pedido.descricao}</p>
            <p style={{ margin: '4px 0', color: '#555' }}>
              {categoriaLabel(pedido.categoria)} — {pedido.localizacao}
            </p>
            <p style={{ margin: 0, fontWeight: 'bold' }}>Estado: {estadoLabel[pedido.estado]}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}