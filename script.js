const API_KEY = "";
const ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";


const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('user-input');

function appendMessage(sender, text) {
  const message = document.createElement('p');
  message.className = sender === 'user' ? 'user-msg' : 'bot-msg';
  // message.textContent = text;
  message.innerHTML = convertMarkdownToHTML(text);

  chatBox.appendChild(message);
  chatBox.scrollTop = chatBox.scrollHeight;
}

async function sendMessage() {
  const text = userInput.value.trim();
  if (!text) return;

  appendMessage('user', text);

  const typingIndicator = document.createElement("div");
  typingIndicator.id = "typing-indicator";
  typingIndicator.textContent = "🤖 Bot is typing...";
  document.getElementById("chat-box").appendChild(typingIndicator);

  userInput.value = "";

  try {
    

    const response = await fetch('/chat', {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    message: text
  })
});

const data = await response.json();
const reply = data.reply || "Sorry, no response.";
// Remove typing indicator
    typingIndicator.remove();
appendFormattedBotMessage(reply);



  } catch (error) {
    console.error("Error:", error);
    appendMessage('bot', "Error: Could not fetch response.");
  }
}



// function appendFormattedBotMessage(text) {
//   const message = document.createElement('div');
//   message.className = 'bot-msg';

//   // Basic Markdown to HTML
//   let html = text
//     .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // bold
//     .replace(/\*(.*?)\*/g, '<em>$1</em>')             // italic
//     .replace(/^### (.*$)/gim, '<h3>$1</h3>')           // H3
//     .replace(/^## (.*$)/gim, '<h2>$1</h2>')            // H2
//     .replace(/^- (.*$)/gim, '<ul><li>$1</li></ul>')    // bullet point
//     .replace(/<\/ul>\s*<ul>/gim, '')                   // merge ULs
//     .replace(/```([^`]+)```/g, '<pre><code>$1</code></pre>') // code block
//     .replace(/\n/g, '<br>');                           // line breaks

//   // Optional: table support
//   html = html.replace(/\|(.+?)\|/g, (match) => {
//     const cells = match.split("|").filter(Boolean);
//     return "<tr>" + cells.map(c => `<td>${c.trim()}</td>`).join("") + "</tr>";
//   });
//   if (html.includes('<tr>')) html = "<table>" + html + "</table>";

//   message.innerHTML = html;
//   chatBox.appendChild(message);
//   chatBox.scrollTop = chatBox.scrollHeight;
// }

function appendFormattedBotMessage(text) {
  const chatBox = document.getElementById("chat-box");
  const botMsg = document.createElement("div");
  botMsg.className = "bot-message typing";

  // Convert Markdown to HTML using your logic
  let html = text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // bold
    .replace(/\*(.*?)\*/g, '<em>$1</em>')             // italic
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')           // H3
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')            // H2
    .replace(/^- (.*$)/gim, '<ul><li>$1</li></ul>')    // bullet point
    .replace(/<\/ul>\s*<ul>/gim, '')                   // merge ULs
    .replace(/```([^`]+)```/g, '<pre><code>$1</code></pre>') // code block
    .replace(/\n/g, '<br>');                           // line breaks

  // Table conversion (Markdown-style)
  html = html.replace(/\|(.+?)\|/g, (match) => {
    const cells = match.split("|").filter(Boolean);
    return "<tr>" + cells.map(c => `<td>${c.trim()}</td>`).join("") + "</tr>";
  });
  if (html.includes('<tr>')) html = "<table>" + html + "</table>";

  // Typing animation per character (with HTML preserved)
  let tempDiv = document.createElement("div");
  tempDiv.innerHTML = html;
  const fullHTML = tempDiv.innerHTML;
  botMsg.innerHTML = "";

  let i = 0;
  const interval = setInterval(() => {
    botMsg.innerHTML = fullHTML.slice(0, i) + "<span class='cursor'>|</span>";
    i++;
    if (i > fullHTML.length) {
      clearInterval(interval);
      botMsg.classList.remove("typing");
      botMsg.innerHTML = fullHTML;
    }
    chatBox.scrollTop = chatBox.scrollHeight;
  }, 10); // speed of typing (adjust if needed)

  chatBox.appendChild(botMsg);
}




function convertMarkdownToHTML(text) {
  // Convert bullet points
  text = text.replace(/^\* (.+)$/gm, '<li>$1</li>');
  text = text.replace(/(<li>.*<\/li>)/gms, '<ul>$1</ul>');

  // Convert Markdown-style tables
  const tableRegex = /((?:\|.*?\|.*\n)+)/g;
  text = text.replace(tableRegex, match => {
    const lines = match.trim().split('\n');
    const headers = lines[0].split('|').filter(Boolean).map(h => `<th>${h.trim()}</th>`).join('');
    const rows = lines.slice(2).map(row =>
      '<tr>' + row.split('|').filter(Boolean).map(cell => `<td>${cell.trim()}</td>`).join('') + '</tr>'
    ).join('');
    return `<table><thead><tr>${headers}</tr></thead><tbody>${rows}</tbody></table>`;
  });

  // Convert newlines to <br> for readability
  return text.replace(/\n/g, '<br>');
}
