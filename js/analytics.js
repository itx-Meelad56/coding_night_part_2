export function loadAnalytics(container) {
  container.innerHTML = `
    <h2 style="font-size:1.8rem;margin-bottom:2rem;text-align:center;">Clinic Analytics Overview</h2>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:2rem;max-width:1100px;margin:0 auto;">
      <div class="card">
        <h3 style="margin-bottom:1rem;text-align:center;">Appointments Trend</h3>
        <canvas id="appointmentsChart" height="180"></canvas>
      </div>
      <div class="card">
        <h3 style="margin-bottom:1rem;text-align:center;">Common Conditions</h3>
        <canvas id="conditionsChart" height="180"></canvas>
      </div>
    </div>
  `


  setTimeout(() => {
    new Chart(document.getElementById('appointmentsChart'), {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr'],
        datasets: [{
          label: 'Appointments',
          data: [12, 19, 28, 35],
          borderColor: '#10b981',
          tension: 0.4,
          fill: false
        }]
      },
      options: { scales: { y: { beginAtZero: true } } }
    })

    new Chart(document.getElementById('conditionsChart'), {
      type: 'doughnut',
      data: {
        labels: ['Fever', 'Cough', 'Diabetes', 'Hypertension', 'Others'],
        datasets: [{
          data: [40, 25, 15, 12, 8],
          backgroundColor: ['#10b981', '#14b8a6', '#22d3ee', '#8b5cf6', '#f59e0b']
        }]
      }
    })
  }, 300)
}

