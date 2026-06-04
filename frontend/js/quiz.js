requireAuth();

const params = new URLSearchParams(window.location.search);
const quizId = params.get('id');
let questions = [];
let timeLimit = 0;
let timerInterval;
let startTime;

if (!quizId) {
  window.location.href = 'dashboard.html';
}

async function loadQuiz() {
  try {
    const quiz = await apiFetch(`/quizzes/${quizId}`);
    document.getElementById('quiz-title').textContent = quiz.title;
    document.getElementById('quiz-desc').textContent = quiz.description;
    timeLimit = quiz.timeLimit || 10;

    questions = await apiFetch(`/questions/quiz/${quizId}`);
    renderQuestions();
    startTimer(timeLimit * 60);
    document.getElementById('submit-btn').style.display = 'inline-block';
  } catch (err) {
    showAlert('alert-box', err.message);
  }
}

function renderQuestions() {
  const area = document.getElementById('questions-area');
  if (!questions.length) {
    area.innerHTML = '<p>No questions found for this quiz.</p>';
    return;
  }
  area.innerHTML = questions.map((q, idx) => `
    <div class="question-box" data-id="${q._id}">
      <h4>Q${idx + 1}. ${escapeHtml(q.questionText)}</h4>
      <div class="options">
        ${q.options.map((opt, i) => `
          <label>
            <input type="radio" name="q_${q._id}" value="${i}" />
            ${escapeHtml(opt)}
          </label>
        `).join('')}
      </div>
    </div>
  `).join('');
}

function startTimer(seconds) {
  const timerEl = document.getElementById('timer');
  timerEl.classList.remove('hidden');
  startTime = Date.now();
  let remaining = seconds;

  timerInterval = setInterval(() => {
    remaining--;
    const m = Math.floor(remaining / 60).toString().padStart(2, '0');
    const s = (remaining % 60).toString().padStart(2, '0');
    timerEl.textContent = `Time Left: ${m}:${s}`;

    if (remaining <= 0) {
      clearInterval(timerInterval);
      submitQuiz(true);
    }
  }, 1000);
}

async function submitQuiz(auto = false) {
  clearInterval(timerInterval);
  const timeTaken = Math.floor((Date.now() - startTime) / 1000);
  const answers = [];

  questions.forEach(q => {
    const selected = document.querySelector(`input[name="q_${q._id}"]:checked`);
    answers.push({
      questionId: q._id,
      selectedOption: selected ? parseInt(selected.value) : -1,
    });
  });

  try {
    const result = await apiFetch('/results/submit', {
      method: 'POST',
      body: JSON.stringify({ quizId, answers, timeTaken }),
    });
    window.location.href = `result.html?id=${result._id}`;
  } catch (err) {
    showAlert('alert-box', err.message);
  }
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

loadQuiz();
