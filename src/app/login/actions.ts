'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { prisma } from '@/lib/prisma'

async function ligarPedidoSeExistir(userId: string, pedidoId: FormDataEntryValue | null) {
  if (!pedidoId) return
  await prisma.pedido.updateMany({
    where: { id: pedidoId as string, authUserId: null },
    data: { authUserId: userId },
  })
}

export async function login(formData: FormData) {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.signInWithPassword({
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  })

  if (error) redirect('/login?error=' + encodeURIComponent(error.message))
  if (data.user) await ligarPedidoSeExistir(data.user.id, formData.get('pedidoId'))

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.signUp({
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  })

  if (error) redirect('/login?error=' + encodeURIComponent(error.message))
  if (!data.session) redirect('/login?error=' + encodeURIComponent('Registo feito. Confirma o teu email antes de entrares.'))
  if (data.user) await ligarPedidoSeExistir(data.user.id, formData.get('pedidoId'))

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}