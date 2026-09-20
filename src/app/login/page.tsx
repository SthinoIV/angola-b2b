import { login, signup } from './actions'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; pedidoId?: string }>
}) {
  const { error, pedidoId } = await searchParams

  return (
    <div style={{ maxWidth: 360, margin: '80px auto' }}>
      <h1>Entrar ou registar</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" required />
        <label htmlFor="password">Password</label>
        <input id="password" name="password" type="password" required minLength={6} />
        {pedidoId && <input type="hidden" name="pedidoId" value={pedidoId} />}
        <button formAction={login}>Entrar</button>
        <button formAction={signup}>Registar</button>
      </form>
    </div>
  )
}