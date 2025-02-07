window.yaContextCb.push(() => {
  Ya.Context.AdvManager.render({
    "blockId": "R-A-14027102-1",
    "renderTo": "yandex_rtb_R-A-14027102-1"
  })
})

let authKey = "";
let telegramId = "";

if (Telegram.WebApp && Telegram.WebApp.initDataUnsafe && Telegram.WebApp.initDataUnsafe.user) {
  telegramId = Telegram.WebApp.initDataUnsafe.user.id.toString();
} else {
  console.error("Не удалось получить Telegram ID");
}

function showTab(tabId) {
  document.querySelectorAll(".container").forEach(tab => tab.classList.remove("active"));
  document.querySelectorAll(".tab-link").forEach(link => link.classList.remove("active"));
  document.getElementById(tabId).classList.add("active");
  document.querySelector(`a[onclick="showTab('${tabId}')"]`).classList.add("active");
}

function xorCipher(input, key) {
  let output = "";
  for (let i = 0; i < input.length; i++) {
    output += String.fromCharCode(input.charCodeAt(i) ^ key.charCodeAt(i % key.length));
  }
  return output;
}

function customEncrypt(data, key) {
  return btoa(xorCipher(data, key));
}

async function getAuthKey() {
  try {
    const res = await fetch("https://neurospacex-ruspam.hf.space/api/generate_key", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tg_id: telegramId })
    });
    const json = await res.json();
    authKey = json.encryption_key;
  } finally {
    document.getElementById("global-loading").style.display = "none";
    document.getElementById("content-wrapper").style.display = "block";
  }
}

async function classify() {
  const message = document.querySelector(".input").value;
  const url = "https://neurospacex-ruspam.hf.space/api/check_spam";
  document.getElementById("loading-overlay").style.display = "flex";
  document.querySelector(".box").classList.add("loading");
  const encryptedInitData = customEncrypt(Telegram.WebApp.initData, authKey);

  try {
    const [bertRes, tinybertRes] = await Promise.all([
      fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json", "api-key": encryptedInitData },
        body: JSON.stringify({ message: message, model_name: "bert", telegram_id: telegramId })
      }).then(handleResponse),
      fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json", "api-key": encryptedInitData },
        body: JSON.stringify({ message: message, model_name: "tinybert", telegram_id: telegramId })
      }).then(handleResponse)
    ]);

    updateProgress("bert", bertRes);
    updateProgress("tinybert", tinybertRes);
  } catch (err) {
    if(err.message === 'Session expired') {
      alert('Ваша сессия истекла. Пожалуйста, перезапустите веб-приложение.');
      location.reload();
    } else {
      alert("Произошла ошибка при обработке запроса");
    }
  } finally {
    document.getElementById("loading-overlay").style.display = "none";
    document.querySelector(".box").classList.remove("loading");
  }
}

function handleResponse(response) {
  if(response.status === 403) throw new Error('Session expired');
  if(!response.ok) throw new Error('HTTP error');
  return response.json();
}

function updateProgress(prefix, res) {
  const spamPercent = Math.round(res.confidence * 100);
  document.getElementById(`${prefix}-spam`).style.width = `${spamPercent}%`;
  document.getElementById(`${prefix}-not-spam`).style.width = `${100 - spamPercent}%`;
  document.getElementById(`${prefix}-label`).textContent = `Спам ${spamPercent}%`;
}

document.getElementById("classify-btn").addEventListener("click", classify);
window.onload = getAuthKey;

document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('keydown', e => {
  if(e.keyCode === 123 || (e.ctrlKey && e.shiftKey && (e.keyCode === 73 || e.keyCode === 74 || e.keyCode === 67)) || (e.ctrlKey && e.keyCode === 85)) {
        e.preventDefault();
        return false;
      }
    });
    (function() {
      var devtools = { open: false }, threshold = 160;
      setInterval(function() {
        var widthThreshold = window.outerWidth - window.innerWidth > threshold,
            heightThreshold = window.outerHeight - window.innerHeight > threshold;
        if (widthThreshold || heightThreshold) {
          if (!devtools.open) {
            devtools.open = true;
            console.warn('Панель разработчика открыта');
          }
        } else {
          devtools.open = false;
        }
      }, 500);
    })();
