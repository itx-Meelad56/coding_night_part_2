import { supabase } from './supabase.js'

export async function loadPrescriptions(container) {
  container.innerHTML = `
    <button onclick="addPrescription()" style="background:var(--primary); color:white; padding:12px 24px; border:none; border-radius:10px; margin-bottom:20px; font-weight:600; cursor:pointer;">
      + New Prescription
    </button>
    <p style="color:var(--text-muted);">Prescriptions save hone pe alert aayega (list abhi basic)</p>
  `
}

window.addPrescription = async () => {
  const pid = prompt("Patient ID:")
  if (!pid) return
  const meds = prompt("Medicines (comma separated):")
  const inst = prompt("Instructions:")

  const medicines = meds ? meds.split(',').map(m => m.trim()) : []

  const { error } = await supabase.from('prescriptions').insert([{
    patient_id: Number(pid),
    doctor_id: supabase.auth.user()?.id,
    medicines,
    instructions: inst || ''
  }])

  if (error) alert("Error: " + error.message)
  else alert("Prescription save ho gayi!")
}

window.savePrescription = async () => {
  const patientId = document.getElementById('pr-patient-id').value
  const medicinesText = document.getElementById('pr-medicines').value
  const instructions = document.getElementById('pr-instructions').value

  if (!patientId || !medicinesText) return alert('Patient ID and Medicines required!')

  if (!currentUserId) return alert('User not logged in properly.')

  const medicines = medicinesText.split('\n').map(m => m.trim()).filter(m => m)

  const { error } = await supabase.from('prescriptions').insert([{
    patient_id: Number(patientId),
    doctor_id: currentUserId,   // ← Yahan bhi
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
