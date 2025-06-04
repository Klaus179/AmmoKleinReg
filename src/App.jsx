import React, { useState } from "react";
import { createRoot } from "react-dom/client";

function App() {
  const [imap, setImap] = useState("");
  const [imapPass, setImapPass] = useState("");
  const [captcha, setCaptcha] = useState("");
  const [botToken, setBotToken] = useState("");
  const [chatId, setChatId] = useState("");
  const [emailsFile, setEmailsFile] = useState(null);
  const [proxiesFile, setProxiesFile] = useState(null);
  const [log, setLog] = useState("");
  const [statusList, setStatusList] = useState([]);

  const handleDrop = (e, setter) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    setter(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const runScript = async () => {
    const config = {
      imap_server: imap,
      imap_password: imapPass,
      anticaptcha_key: captcha,
      telegram_token: botToken,
      telegram_chat_id: chatId,
      emails_file: emailsFile?.path,
      proxies_file: proxiesFile?.path,
    };
    const result = await window.electronAPI.runScript(config);
    setLog(result);

    // Простейший парсер для статусов
    const lines = result.split('\n').filter(line => line.includes('@'));
    const status = lines.map(line => {
      if (line.includes('✅')) return { email: line.split(' ')[0], status: '✅' };
      if (line.includes('❌')) return { email: line.split(' ')[0], status: '❌' };
      return { email: line.split(' ')[0], status: '...' };
    });
    setStatusList(status);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Kleinanzeigen Account Bot (Advanced)</h2>

      <div>
        <label>IMAP сервер:</label>
        <input value={imap} onChange={(e) => setImap(e.target.value)} />
      </div>
      <div>
        <label>IMAP пароль:</label>
        <input type="password" value={imapPass} onChange={(e) => setImapPass(e.target.value)} />
      </div>
      <div>
        <label>Anti-Captcha ключ:</label>
        <input value={captcha} onChange={(e) => setCaptcha(e.target.value)} />
      </div>
      <div>
        <label>Telegram Bot Token:</label>
        <input value={botToken} onChange={(e) => setBotToken(e.target.value)} />
      </div>
      <div>
        <label>Telegram Chat ID:</label>
        <input value={chatId} onChange={(e) => setChatId(e.target.value)} />
      </div>

      <div
        onDrop={(e) => handleDrop(e, setEmailsFile)}
        onDragOver={handleDragOver}
        style={{ border: "2px dashed #ccc", padding: 20, marginTop: 10 }}
      >
        {emailsFile ? `📄 ${emailsFile.name}` : "Перетащите файл emails.txt сюда"}
      </div>

      <div
        onDrop={(e) => handleDrop(e, setProxiesFile)}
        onDragOver={handleDragOver}
        style={{ border: "2px dashed #ccc", padding: 20, marginTop: 10 }}
      >
        {proxiesFile ? `📄 ${proxiesFile.name}` : "Перетащите файл proxies.txt сюда"}
      </div>

      <button onClick={runScript} style={{ marginTop: 20 }}>🚀 Запустить</button>

      <h3 style={{ marginTop: 20 }}>Статус по email:</h3>
      <ul>
        {statusList.map((s, i) => (
          <li key={i}>{s.email} — {s.status}</li>
        ))}
      </ul>

      <pre style={{ background: '#eee', marginTop: 20, padding: 10, maxHeight: 300, overflowY: 'scroll' }}>
        {log}
      </pre>
    </div>
  );
}

const root = createRoot(document.getElementById('root'));
root.render(<App />);
