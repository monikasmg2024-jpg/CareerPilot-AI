const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

// Mobile navigation
$('#menuToggle').addEventListener('click', () => $('#mainNav').classList.toggle('open'));
$$('#mainNav a').forEach(link => link.addEventListener('click', () => $('#mainNav').classList.remove('open')));

// Search/filter sample job cards
function filterJobs() {
  const query = $('#jobSearch').value.trim().toLowerCase();
  const type = $('#jobType').value;
  let visible = 0;
  $$('.job-card').forEach(card => {
    const text = `${card.dataset.title} ${card.dataset.company} ${card.dataset.skills} ${card.dataset.type}`.toLowerCase();
    const matches = text.includes(query) && (type === 'all' || card.dataset.type === type || (type === 'Remote' && card.querySelector('.job-details').textContent.includes('Remote')));
    card.hidden = !matches;
    if (matches) visible++;
  });
  $('#jobCount').textContent = `${visible} ${visible === 1 ? 'opportunity' : 'opportunities'} to explore`;
  $('#emptyJobs').hidden = visible !== 0;
}
$('#searchBtn').addEventListener('click', filterJobs);
$('#jobSearch').addEventListener('input', filterJobs);
$('#jobType').addEventListener('change', filterJobs);
$('#jobSearch').addEventListener('keydown', event => { if (event.key === 'Enter') filterJobs(); });

// Save buttons (kept in this browser session)
$$('.save-job').forEach(button => button.addEventListener('click', () => {
  const saved = button.classList.toggle('saved');
  button.textContent = saved ? '♥' : '♡';
  button.setAttribute('aria-pressed', String(saved));
  button.setAttribute('aria-label', `${saved ? 'Unsave' : 'Save'} ${button.dataset.job}`);
}));

// Sample role detail dialog
const roleDialog = $('#roleDialog');
const roleDescriptions = {
  'Junior Frontend Developer': 'Help build responsive web interfaces. Useful skills: HTML, CSS, JavaScript, and a willingness to learn a frontend framework.',
  'HR & Recruitment Intern': 'Support candidate coordination, interview scheduling, communication, and recruitment records. Useful skills: communication, organization, and spreadsheets.',
  'Data Analyst Trainee': 'Practice working with data, preparing reports, and finding useful patterns. Useful skills: Excel, SQL, and basic Python.',
  'IT Support Associate': 'Help users troubleshoot common device, software, and connectivity issues. Useful skills: problem-solving, Windows basics, and clear communication.',
  'UI/UX Design Intern': 'Help research user needs and create wireframes and prototypes. Useful skills: design thinking, Figma, and communication.',
  'Customer Success Associate': 'Help customers use a service successfully and resolve common questions. Useful skills: empathy, communication, and organization.'
};
$$('.apply-btn').forEach(button => button.addEventListener('click', () => {
  const title = button.dataset.title;
  $('#roleTitle').textContent = title;
  $('#roleDescription').textContent = roleDescriptions[title] || 'Explore this sample role and the skills it uses.';
  roleDialog.showModal();
}));
$('#closeRole').addEventListener('click', () => roleDialog.close());
$('#closeRole2').addEventListener('click', () => roleDialog.close());

// Interview practice prompts
const questions = [
  'Tell me about yourself and what interests you about this role.',
  'Describe a challenge you faced and how you worked through it.',
  'What is one skill you are improving, and how are you practising it?',
  'Why do you want to work with this company or team?',
  'Tell me about a time you worked with others to complete a task.',
  'What would you like to learn in your first three months in this role?'
];
let lastQuestion = -1;
function nextQuestion() {
  let index = Math.floor(Math.random() * questions.length);
  if (questions.length > 1 && index === lastQuestion) index = (index + 1) % questions.length;
  lastQuestion = index;
  $('#questionText').textContent = questions[index];
  $('#questionBox').hidden = false;
}
$('#newQuestion').addEventListener('click', nextQuestion);
$('#anotherQuestion').addEventListener('click', nextQuestion);

// Skill planner
const skillSets = {
  web: ['HTML & semantic structure', 'CSS layouts and responsive design', 'JavaScript fundamentals', 'Git and GitHub basics', 'Build and publish a small project'],
  hr: ['Professional communication', 'Interview scheduling and coordination', 'Excel or Google Sheets', 'Recruitment and onboarding basics', 'Confidentiality and record keeping'],
  data: ['Excel formulas and charts', 'SQL queries', 'Basic statistics', 'Data cleaning and visualisation', 'Explain findings clearly'],
  support: ['Windows troubleshooting', 'Computer hardware basics', 'Networking fundamentals', 'Ticketing and documentation', 'Customer communication']
};
$('#showSkills').addEventListener('click', () => {
  const list = $('#skillList');
  list.innerHTML = '';
  skillSets[$('#careerTrack').value].forEach(skill => {
    const li = document.createElement('li'); li.textContent = skill; list.appendChild(li);
  });
  list.hidden = false;
});

// Resume starter downloads a plain-text draft; no data is sent to a server.
const resumeDialog = $('#resumeDialog');
$('#openResume').addEventListener('click', () => resumeDialog.showModal());
$('#closeResume').addEventListener('click', () => resumeDialog.close());
$('#resumeForm').addEventListener('submit', event => {
  event.preventDefault();
  const name = $('#fullName').value.trim();
  const email = $('#email').value.trim();
  const target = $('#targetRole').value.trim();
  const skills = $('#resumeSkills').value.split(',').map(s => s.trim()).filter(Boolean);
  const about = $('#aboutYou').value.trim();
  const lines = [name.toUpperCase(), email, '', 'CAREER OBJECTIVE', about || `Motivated candidate seeking an opportunity as ${target}, eager to learn and contribute.`, '', 'TARGET ROLE', target, '', 'SKILLS', ...(skills.length ? skills.map(s => `• ${s}`) : ['• Add your relevant skills here']), '', 'EDUCATION & PROJECTS', '• Add your education, projects, certifications, and achievements here.', '', 'Note: Review and customise this draft before applying.'];
  const blob = new Blob([lines.join('\n')], {type:'text/plain;charset=utf-8'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = `${name.replace(/[^a-z0-9]+/gi,'_') || 'careerpilot'}_resume_draft.txt`; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
  resumeDialog.close();
});
