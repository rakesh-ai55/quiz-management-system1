requireAdmin();

let editingQuizId = null;
let editingQuestionId = null;
window.questionStore = {};

async function loadAdminData() {
  await loadQuizzes();
  await loadUsers();
  await loadResults();
}

async function loadQuizzes() {
  const container = document.getElementById('admin-quiz-list');
  window.questionStore = {};
  try {
    const quizzes = await apiFetch('/quizzes');
    if (!quizzes.length) {
      container.innerHTML = '<p>No quizzes found.</p>';
      return;
    }
    for (const q of quizzes) {
      const questions = await apiFetch(`/questions/quiz/${q._id}`);
      q.questions = questions;
      questions.forEach(qs => window.questionStore[qs._id] = qs);
    }
    container.innerHTML = quizzes.map(q => `
      <div class="quiz-card">
        <h3>${escapeHtml(q.title)}</h3>
        <p>${escapeHtml(q.description)}</p>
        <div class="quiz-meta">
          <span>Marks: ${q.totalMarks}</span>
          <span>Time: ${q.timeLimit}m</span>
        </div>
        <div class="mt-20" style="display:flex; gap:8px; flex-wrap:wrap;">
          <button class="btn btn-sm btn-primary" onclick="editQuiz('${q._id}', '${jsSafe(q.title)}', '${jsSafe(q.description)}', ${q.timeLimit})">Edit</button>
          <button class="btn btn-sm btn-danger" onclick="deleteQuiz('${q._id}')">Delete</button>
          <button class="btn btn-sm btn-success" onclick="openQuestionModal('${q._id}')">+ Question</button>
        </div>
        <div class="mt-20">
          <strong>Questions (${q.questions.length}):</strong>
          ${q.questions.map(qs => `
            <div style="padding:8px; background:#f8f9fa; border-radius:6px; margin-top:8px; display:flex; justify-content:space-between; align-items:center;">
              <span style="font-size:0.9rem;">${escapeHtml(qs.questionText)}</span>
              <div style="display:flex; gap:6px;">
                <button class="btn btn-sm btn-warning" onclick="editQuestionById('${qs._id}')">Edit</button>
                <button class="btn btn-sm btn-danger" onclick="deleteQuestion('${qs._id}')">Del</button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `).join('');
  } catch (err) {
    showAlert('alert-box', err.message);
  }
}

function jsSafe(str) {
  return str.replace(/'/g, "\\'").replace(/"/g, '\\"');
}

function editQuestionById(qid) {
  const qs = window.questionStore[qid];
  if (!qs) return;
  editQuestion(qs.quizId, qs._id, qs.questionText, qs.options, qs.correctAnswer, qs.marks);
}

async function loadUsers() {
  try {
    const users = await apiFetch('/users');
    const container = document.getElementById('admin-users');
    container.innerHTML = `
      <table class="leaderboard-table">
        <thead><tr><th>Name</th><th>Email</th><th>Registered</th></tr></thead>
        <tbody>
          ${users.map(u => `
            <tr>
              <td>${escapeHtml(u.name)}</td>
              <td>${escapeHtml(u.email)}</td>
              <td>${new Date(u.createdAt).toLocaleDateString()}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  } catch (err) {
    showAlert('alert-box', err.message);
  }
}

async function loadResults() {
  try {
    const results = await apiFetch('/results/all');
    const container = document.getElementById('admin-results');
    container.innerHTML = `
      <table class="leaderboard-table">
        <thead><tr><th>User</th><th>Quiz</th><th>Score</th><th>Total</th><th>Date</th></tr></thead>
        <tbody>
          ${results.map(r => `
            <tr>
              <td>${escapeHtml(r.userId?.name || 'Unknown')}</td>
              <td>${escapeHtml(r.quizId?.title || 'Unknown')}</td>
              <td>${r.score}</td>
              <td>${r.totalMarks}</td>
              <td>${new Date(r.createdAt).toLocaleDateString()}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  } catch (err) {
    showAlert('alert-box', err.message);
  }
}

function openQuizModal() {
  editingQuizId = null;
  document.getElementById('modal-title').textContent = 'Create Quiz';
  document.getElementById('qm-title').value = '';
  document.getElementById('qm-desc').value = '';
  document.getElementById('qm-time').value = 10;
  document.getElementById('quiz-modal').classList.remove('hidden');
}

function closeQuizModal() {
  document.getElementById('quiz-modal').classList.add('hidden');
}

function editQuiz(id, title, desc, time) {
  editingQuizId = id;
  document.getElementById('modal-title').textContent = 'Edit Quiz';
  document.getElementById('qm-title').value = title;
  document.getElementById('qm-desc').value = desc;
  document.getElementById('qm-time').value = time;
  document.getElementById('quiz-modal').classList.remove('hidden');
}

async function saveQuiz() {
  const payload = {
    title: document.getElementById('qm-title').value,
    description: document.getElementById('qm-desc').value,
    timeLimit: parseInt(document.getElementById('qm-time').value),
    totalMarks: 0,
  };
  try {
    if (editingQuizId) {
      await apiFetch(`/quizzes/${editingQuizId}`, { method: 'PUT', body: JSON.stringify(payload) });
    } else {
      await apiFetch('/quizzes', { method: 'POST', body: JSON.stringify(payload) });
    }
    closeQuizModal();
    showAlert('alert-box', 'Quiz saved successfully!', 'success');
    loadQuizzes();
  } catch (err) {
    showAlert('alert-box', err.message);
  }
}

async function deleteQuiz(id) {
  if (!confirm('Are you sure you want to delete this quiz?')) return;
  try {
    await apiFetch(`/quizzes/${id}`, { method: 'DELETE' });
    showAlert('alert-box', 'Quiz deleted.', 'success');
    loadQuizzes();
  } catch (err) {
    showAlert('alert-box', err.message);
  }
}

function openQuestionModal(quizId) {
  editingQuestionId = null;
  document.getElementById('qmodal-title').textContent = 'Add Question';
  document.getElementById('qq-quiz-id').value = quizId;
  document.getElementById('qq-id').value = '';
  document.getElementById('qq-text').value = '';
  document.getElementById('qq-opt0').value = '';
  document.getElementById('qq-opt1').value = '';
  document.getElementById('qq-opt2').value = '';
  document.getElementById('qq-opt3').value = '';
  document.getElementById('qq-ans').value = 0;
  document.getElementById('qq-marks').value = 1;
  document.getElementById('question-modal').classList.remove('hidden');
}

function closeQuestionModal() {
  document.getElementById('question-modal').classList.add('hidden');
}

function editQuestion(quizId, qid, text, opts, ans, marks) {
  editingQuestionId = qid;
  document.getElementById('qmodal-title').textContent = 'Edit Question';
  document.getElementById('qq-quiz-id').value = quizId;
  document.getElementById('qq-id').value = qid;
  document.getElementById('qq-text').value = text;
  opts.forEach((o, i) => document.getElementById(`qq-opt${i}`).value = o);
  document.getElementById('qq-ans').value = ans;
  document.getElementById('qq-marks').value = marks;
  document.getElementById('question-modal').classList.remove('hidden');
}

async function saveQuestion() {
  const quizId = document.getElementById('qq-quiz-id').value;
  const payload = {
    quizId,
    questionText: document.getElementById('qq-text').value,
    options: [
      document.getElementById('qq-opt0').value,
      document.getElementById('qq-opt1').value,
      document.getElementById('qq-opt2').value,
      document.getElementById('qq-opt3').value,
    ],
    correctAnswer: parseInt(document.getElementById('qq-ans').value),
    marks: parseInt(document.getElementById('qq-marks').value),
  };
  try {
    if (editingQuestionId) {
      await apiFetch(`/questions/${editingQuestionId}`, { method: 'PUT', body: JSON.stringify(payload) });
    } else {
      await apiFetch('/questions', { method: 'POST', body: JSON.stringify(payload) });
    }
    closeQuestionModal();
    showAlert('alert-box', 'Question saved successfully!', 'success');
    loadQuizzes();
  } catch (err) {
    showAlert('alert-box', err.message);
  }
}

async function deleteQuestion(id) {
  if (!confirm('Delete this question?')) return;
  try {
    await apiFetch(`/questions/${id}`, { method: 'DELETE' });
    showAlert('alert-box', 'Question deleted.', 'success');
    loadQuizzes();
  } catch (err) {
    showAlert('alert-box', err.message);
  }
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

loadAdminData();
