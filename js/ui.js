export function renderSidebar() {
  const menu = document.getElementById('sidebar-menu')
  let html = `<div onclick="show('home')" class="hover-bg" style="padding:14px; border-radius:10px; cursor:pointer; display:flex; align-items:center; gap:12px;"><i class="fas fa-home"></i>Home</div>`

  if (['receptionist','doctor','admin'].includes(window.currentRole)) {
    html += `<div onclick="show('patients')" class="hover-bg" style="padding:14px; border-radius:10px; cursor:pointer; display:flex; align-items:center; gap:12px;"><i class="fas fa-users"></i>Patients</div>`
    html += `<div onclick="show('appointments')" class="hover-bg" style="padding:14px; border-radius:10px; cursor:pointer; display:flex; align-items:center; gap:12px;"><i class="fas fa-calendar"></i>Appointments</div>`
  }

  if (['doctor','admin'].includes(window.currentRole)) {
    html += `<div onclick="show('prescriptions')" class="hover-bg" style="padding:14px; border-radius:10px; cursor:pointer; display:flex; align-items:center; gap:12px;"><i class="fas fa-file-prescription"></i>Prescriptions</div>`
  }

  if (window.currentRole === 'patient') {
    html += `<div onclick="show('my-prescriptions')" class="hover-bg" style="padding:14px; border-radius:10px; cursor:pointer; display:flex; align-items:center; gap:12px;"><i class="fas fa-file-prescription"></i>Meri Prescriptions</div>`
  }

  menu.innerHTML = html
}

export async function show(section) {
  document.getElementById('page-title').textContent = section.charAt(0).toUpperCase() + section.slice(1).replace('-',' ')

  const content = document.getElementById('main-content')

  if (section === 'home') {
    content.innerHTML = `<div style="text-align:center; padding:100px 20px;"><h1 style="color:var(--primary); font-size:3rem;">Welcome to AI Clinic</h1><p style="color:#aaa; margin-top:20px;">Add data using buttons in sections</p></div>`
  } else if (section === 'patients') {
    import('./patients.js').then(m => m.loadPatients(content))
  } else if (section === 'appointments') {
    import('./appointments.js').then(m => m.loadAppointments(content))
  } else if (section === 'prescriptions') {
    import('./prescriptions.js').then(m => m.loadPrescriptions(content))
  } else if (section === 'my-prescriptions') {
    content.innerHTML = `<h2 style="color:var(--primary);">Meri Prescriptions</h2><p style="color:#aaa;">Doctor se banegi – abhi empty</p>`
  }
}