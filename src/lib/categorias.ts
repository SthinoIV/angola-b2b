import type { Categoria } from '@/generated/prisma/client'

export const categorias: [Categoria, string][] = [
  ['CONSTRUCAO', 'Construção'], ['TECNOLOGIA', 'Tecnologia'],
  ['MARKETING_DESIGN', 'Marketing & Design'], ['LOGISTICA', 'Logística'],
  ['CONSULTORIA', 'Consultoria'], ['COMERCIO', 'Comércio'],
  ['INDUSTRIA', 'Indústria'], ['SERVICOS_PROFISSIONAIS', 'Serviços profissionais'],
  ['HOTELARIA', 'Hotelaria'], ['AGRICULTURA', 'Agricultura'], ['OUTRA', 'Outra'],
]

export const categoriaLabel = (categoria: Categoria) =>
  categorias.find(([valor]) => valor === categoria)?.[1] ?? categoria