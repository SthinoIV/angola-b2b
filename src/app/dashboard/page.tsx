import { logout } from '../login/actions'

export default function DashboardPage() {
  return (
    <div style={{ maxWidth: 480, margin: '80px auto' }}>
      <p>Dashboard — só devias ver isto autenticado.</p>
      <form action={logout}>
        <button type="submit">Sair</button>
      </form>
    </div>
  )
}