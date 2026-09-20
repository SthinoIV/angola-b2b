import 'dotenv/config'
import { PrismaClient } from '../src/generated/prisma/client'
import type { Categoria } from '../src/generated/prisma/client'

const prisma = new PrismaClient()

const categorias: Categoria[] = [
  'CONSTRUCAO', 'TECNOLOGIA', 'MARKETING_DESIGN', 'LOGISTICA', 'CONSULTORIA',
  'COMERCIO', 'INDUSTRIA', 'SERVICOS_PROFISSIONAIS', 'HOTELARIA', 'AGRICULTURA', 'OUTRA',
]

const localizacoes = [
  'Ingombota', 'Maianga', 'Rangel', 'Sambizanga', 'Cazenga',
  'Cacuaco', 'Viana', 'Belas', 'Talatona', 'Kilamba Kiaxi',
]

const prefixos: Record<Categoria, string> = {
  CONSTRUCAO: 'Construções', TECNOLOGIA: 'TechSoluções',
  MARKETING_DESIGN: 'Estúdio Criativo', LOGISTICA: 'TransRota',
  CONSULTORIA: 'Consultoria', COMERCIO: 'Comercial',
  INDUSTRIA: 'Indústrias', SERVICOS_PROFISSIONAIS: 'Serviços',
  HOTELARIA: 'Hotel', AGRICULTURA: 'AgroNegócio', OUTRA: 'Empresa',
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

async function main() {
  for (let i = 1; i <= 35; i++) {
    const categoria = categorias[i % categorias.length]
    const localizacao = localizacoes[i % localizacoes.length]
    const nome = `${prefixos[categoria]} ${localizacao} ${i}`

    await prisma.company.create({
      data: {
        authUserId: `teste-seed-${i}`,
        nome,
        slug: slugify(nome),
        categoria,
        localizacao: `Luanda, ${localizacao}`,
        descricao: `Empresa de teste para validar o diretório — categoria ${categoria}.`,
        whatsapp: `9${20000000 + i}`,
      },
    })
  }
  console.log('35 empresas de teste criadas.')
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())