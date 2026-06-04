requireAuth();

async function loadQuizzes() {
  const container = document.getElementById('quiz-list');
  try {
    const quizzes = await apiFetch('/quizzes');
    if (!quizzes.length) {
      container.innerHTML = '<p>No quizzes available yet.</p>';
      return;
    }
    container.innerHTML = quizzes.map(q => `
      <div class="quiz-card">
        <h3>${escapeHtml(q.title)}</h3>
        <p>${escapeHtml(q.description)}</p>
        <div class="quiz-meta">
          <span>Marks: ${q.totalMarks}</span>
          <span>Time: ${q.timeLimit} min</span>
        </div>
        <div class="mt-20">
          <a href="quiz.html?id=${q._id}" class="btn btn-primary" style="width:100%; text-align:center; display:inline-block;">Start Quiz</a>
        </div>
      </div>
    `).join('');
  } catch (err) {
    showAlert('alert-box', err.message);
    container.innerHTML = '<p>Failed to load quizzes.</p>';
  }
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

loadQuizzes();
