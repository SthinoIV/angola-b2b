import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { prisma } from '@/lib/prisma'
import { categoriaLabel } from '@/lib/categorias'
import { atualizarEstado } from './actions'
import { logout } from '@/app/login/actions'

const estados = ['NOVO', 'CONTACTADO', 'EM_NEGOCIACAO', 'GANHO', 'PERDIDO'] as const
const estadoLabel: Record<string, string> = {
  NOVO: 'Novo', CONTACTADO: 'Contactado', EM_NEGOCIACAO: 'Em negociação', GANHO: 'Ganho', PERDIDO: 'Perdido',
}

export default async function AdminPedidosPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || user.email !== process.env.ADMIN_EMAIL) {
    redirect('/dashboard')
  }

  const pedidos = await prisma.pedido.findMany({ orderBy: { createdAt: 'desc' } })

  const empresasPorCategoria = new Map<string, { nome: string; whatsapp: string; slug: string }[]>()
  for (const pedido of pedidos) {
    if (!empresasPorCategoria.has(pedido.categoria)) {
      const empresas = await prisma.company.findMany({
        where: { categoria: pedido.categoria },
        select: { nome: true, whatsapp: true, slug: true },
        orderBy: [{ verificada: 'desc' }, { createdAt: 'desc' }],
        take: 5,
      })
      empresasPorCategoria.set(pedido.categoria, empresas)
    }
  }

  return (
    <div style={{ maxWidth: 800, margin: '60px auto' }}>
      <h1>Painel de gestão — Pedidos</h1>

      <form action={logout} style={{ marginBottom: 20 }}>
  <button type="submit">Sair</button>
</form>

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {pedidos.map((pedido) => {
          const empresas = empresasPorCategoria.get(pedido.categoria) ?? []
          return (
            <li key={pedido.id} style={{ border: '1px solid #ddd', borderRadius: 6, padding: 16, marginBottom: 16 }}>
              <p style={{ margin: 0, fontWeight: 'bold' }}>{pedido.descricao}</p>
              <p style={{ margin: '4px 0', color: '#555' }}>
                {categoriaLabel(pedido.categoria)} — {pedido.localizacao}
                {pedido.prazo && ` — Prazo: ${pedido.prazo}`}
              </p>
              <p style={{ margin: '4px 0' }}>
                {pedido.nome} · {pedido.contacto} {pedido.authUserId && '· conta registada'}
              </p>

              <form action={atualizarEstado.bind(null, pedido.id)} style={{ display: 'flex', gap: 8, alignItems: 'center', margin: '10px 0' }}>
                <label htmlFor={`estado-${pedido.id}`}>Estado:</label>
                <select key={pedido.estado} id={`estado-${pedido.id}`} name="estado" defaultValue={pedido.estado}>
                  {estados.map((estado) => (
                    <option key={estado} value={estado}>{estadoLabel[estado]}</option>
                  ))}
                </select>
                <button type="submit">Actualizar</button>
              </form>

              {empresas.length > 0 && (
                <div style={{ marginTop: 8 }}>
                  <p style={{ margin: '0 0 6px', fontSize: 14, color: '#555' }}>Empresas correspondentes:</p>
                  <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {empresas.map((empresa) => {
                      const mensagem = encodeURIComponent(
                        `Olá ${empresa.nome}, temos um pedido na Angola B2B que pode ser do vosso interesse: "${pedido.descricao}" (${pedido.localizacao}). Podem responder?`
                      )
                      return (
                        <li key={empresa.slug}>
                          <a href={`https://wa.me/${empresa.whatsapp.replace(/\D/g, '')}?text=${mensagem}`} target="_blank">
                            Contactar {empresa.nome} via WhatsApp
                          </a>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
