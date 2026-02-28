import { supabase } from './supabase.js'

export async function loadPatients(container) {
  const { data } = await supabase.from('patients').select('*').order('created_at', {ascending:false})

  let html = `<button onclick="openModal('add-patient-modal')" class="btn-primary" style="margin-bottom:1.5rem;">+ Add New Patient</button>`
  html += `<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:1.5rem;">`

  if (data?.length) {
    data.forEach(p => {
      html += `<div class="card"><h3 style="margin-bottom:0.5rem;">${p.name}</h3><p style="color:var(--text-muted);">${p.age||'?'} yrs • ${p.gender||'?'} • ${p.contact||'-'}</p></div>`
    })
  } else {
    html += `<p style="grid-column:1/-1;text-align:center;color:var(--text-muted);padding:3rem 0;">No patients added yet</p>`
  }

  html += `</div>`
  container.innerHTML = html
}