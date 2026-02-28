import { supabase } from './supabase.js'

export async function login() {
  const email = document.getElementById('email').value
  const password = document.getElementById('password').value
  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) return alert(error.message)
  location.href = 'dashboard.html'
}

export async function signup() {
  const name = document.getElementById('name').value
  const email = document.getElementById('signup-email').value
  const password = document.getElementById('signup-password').value
  const role = document.getElementById('role').value

  const { error } = await supabase.auth.signUp({
    email, password, options: { data: { name, role } }
  })
  if (error) return alert(error.message)
  alert('Account bana! Ab login karo')
  hideSignup()
}

export function showSignup() {
  document.getElementById('signup-modal').style.display = 'flex'
}

export function hideSignup() {
  document.getElementById('signup-modal').style.display = 'none'
}

export async function loadUserAndRender() {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return location.href = 'index.html'

  const { data: profile } = await supabase.from('profiles').select('name,role').eq('id', session.user.id).single()

  document.getElementById('user-name').textContent = profile?.name || session.user.email
  document.getElementById('user-role').textContent = (profile?.role || 'patient').toUpperCase()

  window.currentRole = profile?.role || 'patient'
  window.currentUserId = session.user.id  

  window.renderSidebar()
  setTimeout(() => {
    if (window.showSection) {
      window.showSection('home')
    }
  }, 300)
}

window.logout = async () => {
  await supabase.auth.signOut()
  location.href = 'index.html'
}