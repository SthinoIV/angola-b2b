import { criarPedido } from './actions'
import { categorias } from '@/lib/categorias'

export default async function NovoPedidoPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; sucesso?: string; pedidoId?: string }>
}) {
  const { error, sucesso, pedidoId } = await searchParams

  if (sucesso) {
    return (
      <div style={{ maxWidth: 480, margin: '80px auto' }}>
        <h1>Pedido enviado!</h1>
        <p>Vamos ligar o seu pedido às empresas certas e entrar em contacto em breve.</p>
        <p><a href="/pedidos/consultar">Consultar o estado do meu pedido</a></p>

        {pedidoId && (
          <div style={{ marginTop: 24, padding: 16, border: '1px solid #ddd', borderRadius: 6 }}>
            <p style={{ fontWeight: 'bold', margin: '0 0 8px' }}>
              Cria uma conta grátis e guarda este pedido automaticamente
            </p>
            <p style={{ margin: '0 0 12px' }}>
              Deixas de precisar de repetir o WhatsApp para consultares o estado — e pedidos de contas registadas são tratados com prioridade.
            </p>
            <a href={`/login?pedidoId=${pedidoId}`}>Criar conta grátis →</a>
          </div>
        )}
      </div>
    )
  }

  // resto da página (o formulário) fica exactamente igual


  return (
    <div style={{ maxWidth: 480, margin: '60px auto' }}>
      <h1>Publique o que precisa</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form action={criarPedido} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <label htmlFor="descricao">O que precisa</label>
        <textarea id="descricao" name="descricao" required />

        <label htmlFor="categoria">Categoria</label>
        <select id="categoria" name="categoria" required defaultValue="">
          <option value="" disabled>Escolha uma categoria</option>
          {categorias.map(([valor, label]) => (
            <option key={valor} value={valor}>{label}</option>
          ))}
        </select>

        <label htmlFor="localizacao">Localização</label>
        <input id="localizacao" name="localizacao" required />

        <label htmlFor="prazo">Prazo (opcional)</label>
        <input id="prazo" name="prazo" placeholder="Ex: 2 semanas, urgente" />

        <label htmlFor="nome">O seu nome</label>
        <input id="nome" name="nome" required />

        <label htmlFor="contacto">O seu WhatsApp</label>
        <input id="contacto" name="contacto" required />

        <button type="submit">Enviar pedido</button>
      </form>
    </div>
  )
}

