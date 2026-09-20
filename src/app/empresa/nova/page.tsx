import { criarEmpresa } from './actions'

import { categorias } from '@/lib/categorias'

export default async function NovaEmpresaPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const { error } = await searchParams

  return (
    <div style={{ maxWidth: 480, margin: '60px auto' }}>
      <h1>Cadastrar empresa</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form action={criarEmpresa} encType="multipart/form-data" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <label htmlFor="nome">Nome da empresa</label>
        <input id="nome" name="nome" required />

        <label htmlFor="categoria">Categoria</label>
        <select id="categoria" name="categoria" required defaultValue="">
          <option value="" disabled>Escolha uma categoria</option>
          {categorias.map(([valor, label]) => (
            <option key={valor} value={valor}>{label}</option>
          ))}
        </select>

        <label htmlFor="localizacao">Localização</label>
        <input id="localizacao" name="localizacao" required />

        <label htmlFor="descricao">Descrição</label>
        <textarea id="descricao" name="descricao" />

        <label htmlFor="whatsapp">WhatsApp</label>
        <input id="whatsapp" name="whatsapp" required />

        <label htmlFor="email">Email (opcional)</label>
        <input id="email" name="email" type="email" />

        <label htmlFor="website">Website (opcional)</label>
        <input id="website" name="website" type="url" />

        <label htmlFor="logo">Logótipo (opcional)</label>
        <input id="logo" name="logo" type="file" accept="image/*" />

        <button type="submit">Criar perfil</button>
      </form>
    </div>
  )
}