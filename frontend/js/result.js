requireAuth();

const params = new URLSearchParams(window.location.search);
const resultId = params.get('id');

async function loadResultDetail() {
  document.getElementById('results-list').style.display = 'none';
  document.getElementById('result-detail').style.display = 'block';
  try {
    const result = await apiFetch(`/results/${resultId}`);
    const pct = ((result.score / result.totalMarks) * 100).toFixed(1);
    const content = document.getElementById('result-content');
    content.innerHTML = `
      <div class="text-center" style="padding:20px;">
        <h1 style="font-size:3rem; color:#667eea;">${result.score} / ${result.totalMarks}</h1>
        <p style="font-size:1.2rem; color:#555;">Percentage: ${pct}%</p>
        <p style="color:#888;">Time Taken: ${formatTime(result.timeTaken)}</p>
      </div>
      <div class="mt-20">
        <h3>Answer Review</h3>
        ${result.answers.map((a, idx) => {
          const q = a.questionId;
          const correct = a.isCorrect;
          if (!q) return `<div class="question-box"><h4>Q${idx + 1}. [Question deleted]</h4></div>`;
          return `
            <div class="question-box" style="border-left: 5px solid ${correct ? '#27ae60' : '#e74c3c'};">
              <h4>Q${idx + 1}. ${escapeHtml(q.questionText)}</h4>
              <p>Your Answer: <strong style="color:${correct ? '#27ae60' : '#e74c3c'}">${q.options[a.selectedOption] || 'Not answered'}</strong></p>
              ${!correct ? `<p>Correct Answer: <strong style="color:#27ae60">${q.options[q.correctAnswer]}</strong></p>` : ''}
            </div>
          `;
        }).join('')}
      </div>
    `;
  } catch (err) {
    showAlert('alert-box', err.message);
  }
}

async function loadHistory() {
  try {
    const results = await apiFetch('/results/myresults');
    const container = document.getElementById('history-content');
    if (!results.length) {
      container.innerHTML = '<p>You have not attempted any quizzes yet.</p>';
      return;
    }
    container.innerHTML = `
      <table class="leaderboard-table">
        <thead>
          <tr><th>Quiz</th><th>Score</th><th>Total</th><th>Date</th><th>Action</th></tr>
        </thead>
        <tbody>
          ${results.map(r => `
            <tr>
              <td>${escapeHtml(r.quizId?.title || 'Unknown')}</td>
              <td>${r.score}</td>
              <td>${r.totalMarks}</td>
              <td>${new Date(r.createdAt).toLocaleDateString()}</td>
              <td><a href="result.html?id=${r._id}" class="btn btn-sm btn-primary">View</a></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  } catch (err) {
    showAlert('alert-box', err.message);
  }
}

function formatTime(sec) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}m ${s}s`;
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

if (resultId) {
  loadResultDetail();
} else {
  loadHistory();
}
