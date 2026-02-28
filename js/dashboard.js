import { supabase } from './js/supabase.js'

    let currentRole = 'patient'

    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return location.href = 'index.html'

    window.currentUserId = session.user.id

    window.logout = () => {
      supabase.auth.signOut()
      location.href = 'index.html'
    }

    function renderSidebar() {
      const menu = document.getElementById('sidebar-menu')
      let html = `<div onclick="showSection('home')" class="sidebar-item hover-bg"><i class="fas fa-home"></i> Home</div>`

      if (['receptionist', 'doctor', 'admin'].includes(currentRole)) {
        html += `<div onclick="showSection('patients')" class="sidebar-item hover-bg"><i class="fas fa-users"></i> Patients</div>`
        html += `<div onclick="showSection('appointments')" class="sidebar-item hover-bg"><i class="fas fa-calendar"></i> Appointments</div>`
      }

      if (['doctor', 'admin'].includes(currentRole)) {
        html += `<div onclick="showSection('prescriptions')" class="sidebar-item hover-bg"><i class="fas fa-file-prescription"></i> Prescriptions</div>`
      }

      if (currentRole === 'patient') {
        html += `<div onclick="showSection('my-prescriptions')" class="sidebar-item hover-bg"><i class="fas fa-file-prescription"></i> Meri Prescriptions</div>`
      }

      menu.innerHTML = html
    }

    window.showSection = async (section) => {
      document.getElementById('page-title').textContent = section === 'home' ? 'Dashboard' : section.charAt(0).toUpperCase() + section.slice(1).replace('-', ' ')
      const c = document.getElementById('main-content')

      if (section === 'home') {
        c.innerHTML = `<div style="text-align:center;padding:120px 20px;"><h1 style="font-size:3rem;color:var(--primary);">Welcome to AI Clinic</h1><p style="color:var(--text-muted);margin-top:1rem;font-size:1.2rem;">Modern Clinic Management System</p></div>`
      }

      else if (section === 'patients') {
        const { data } = await supabase.from('patients').select('*').order('created_at', { ascending: false })
        let h = `<button onclick="openModal('add-patient-modal')" class="btn-primary" style="margin-bottom:1.5rem;">+ Add New Patient</button>`
        h += `<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:1.5rem;">`
        if (data?.length) {
          data.forEach(p => {
            h += `<div class="card"><h3 style="margin-bottom:0.5rem;">${p.name}</h3><p style="color:var(--text-muted);">${p.age || '?'} yrs • ${p.gender || '?'} • ${p.contact || '-'}</p></div>`
          })
        } else {
          h += `<p style="grid-column:1/-1;text-align:center;color:var(--text-muted);padding:3rem 0;">No patients added yet</p>`
        }
        h += `</div>`
        c.innerHTML = h
      }

      else if (section === 'appointments') {
        const { data } = await supabase.from('appointments').select('*, patients(name)').order('appointment_date')
        let h = `<button onclick="openModal('book-appointment-modal')" class="btn-primary" style="margin-bottom:1.5rem;">+ Book Appointment</button>`
        h += `<div style="display:flex;flex-direction:column;gap:1rem;">`
        if (data?.length) {
          data.forEach(a => {
            h += `<div class="card"><strong>${a.patients?.name || 'Unknown'}</strong><br><span style="color:var(--text-muted);">${a.appointment_date} • ${a.appointment_time || '--'} • ${a.status}</span></div>`
          })
        } else {
          h += `<p style="text-align:center;color:var(--text-muted);padding:3rem 0;">No appointments booked yet</p>`
        }
        h += `</div>`
        c.innerHTML = h
      }

      else if (section === 'prescriptions') {
        let h = `<button onclick="openModal('new-prescription-modal')" class="btn-primary" style="margin-bottom:1.5rem;">+ New Prescription</button>`
        h += `<p style="color:var(--text-muted);">Prescriptions added by doctor will appear here (basic view for now)</p>`
        c.innerHTML = h
      }

      else if (section === 'my-prescriptions') {
        c.innerHTML = `<h2 style="color:var(--primary);margin-bottom:1rem;">Meri Prescriptions</h2><p style="color:var(--text-muted);">Doctor jo likhega yahan dikhega</p>`
      }
    }

    // Modal Helpers
    window.openModal = (id) => document.getElementById(id).style.display = 'flex'
    window.closeModal = (id) => document.getElementById(id).style.display = 'none'

    // Save Patient from Modal
    window.savePatient = async () => {
      const name = document.getElementById('p-name').value
      const age = document.getElementById('p-age').value
      const gender = document.getElementById('p-gender').value
      const contact = document.getElementById('p-contact').value

      if (!name) return alert('Name required!')

      const { error } = await supabase.from('patients').insert([{ name, age: Number(age) || null, gender, contact }])
      if (error) alert("Error: " + error.message)
      else {
        alert("Patient added successfully!")
        closeModal('add-patient-modal')
        showSection('patients')
      }
    }

    // Save Appointment from Modal
    window.saveAppointment = async () => {
      const patientId = document.getElementById('a-patient-id').value
      const date = document.getElementById('a-date').value
      const time = document.getElementById('a-time').value

      if (!patientId || !date) return alert('Patient ID and Date required!')

      const { error } = await supabase.from('appointments').insert([{
        patient_id: Number(patientId),
        doctor_id: supabase.auth.user()?.id,
        appointment_date: date,
        appointment_time: time,
        status: 'pending'
      }])

      if (error) alert("Error: " + error.message)
      else {
        alert("Appointment booked!")
        closeModal('book-appointment-modal')
        showSection('appointments')
      }
    }

    // Save Prescription from Modal
    window.savePrescription = async () => {
      const patientId = document.getElementById('pr-patient-id').value
      const medicinesText = document.getElementById('pr-medicines').value
      const instructions = document.getElementById('pr-instructions').value

      if (!patientId || !medicinesText) return alert('Patient ID and Medicines required!')

      const medicines = medicinesText.split('\n').map(m => m.trim()).filter(m => m)

      const { error } = await supabase.from('prescriptions').insert([{
        patient_id: Number(patientId),
        doctor_id: supabase.auth.user()?.id,
        medicines,
        instructions
      }])

      if (error) alert("Error: " + error.message)
      else {
        alert("Prescription saved!")
        closeModal('new-prescription-modal')
        showSection('prescriptions')
      }
    }

    // Init
    (async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return location.href = 'index.html'

      const { data: profile } = await supabase.from('profiles').select('name,role').eq('id', session.user.id).single()

      document.getElementById('user-name').textContent = profile?.name || session.user.email
      document.getElementById('user-role').textContent = (profile?.role || 'patient').toUpperCase()

      currentRole = profile?.role || 'patient'
      renderSidebar()
      showSection('home')
    })()