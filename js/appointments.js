import { supabase } from './supabase.js'

export async function loadAppointments(container) {
  const { data } = await supabase.from('appointments').select('*, patients(name)').order('appointment_date')

  let html = `<button onclick="openModal('book-appointment-modal')" class="btn-primary" style="margin-bottom:1.5rem;">+ Book Appointment</button>`
  html += `<div style="display:flex;flex-direction:column;gap:1rem;">`

  if (data?.length) {
    data.forEach(a => {
      html += `<div class="card"><strong>${a.patients?.name || 'Unknown'}</strong><br><span style="color:var(--text-muted);">${a.appointment_date} • ${a.appointment_time||'--'} • ${a.status}</span></div>`
    })
  } else {
    html += `<p style="text-align:center;color:var(--text-muted);padding:3rem 0;">No appointments booked yet</p>`
  }

  html += `</div>`
  container.innerHTML = html
}