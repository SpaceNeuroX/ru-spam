if (!window.Telegram || !Telegram.WebApp || !Telegram.WebApp.initData) {
  document.body.innerHTML = "<h2 style='text-align:center;margin-top:20%;color:#e91e63;'>Эта страница доступна только через Telegram WebApp.</h2>";
  throw new Error("Access denied");
}

particlesJS('particles-js', {
  particles: {
    number: { value: 100 },
    size: { value: 3 },
    move: { enable: true, speed: 1 },
    opacity: { value: 0.3 }
  }
});

async function checkSpam() {
  const message = document.getElementById('message').value;
  const resultsContainer = document.getElementById('results');
  const loadingDiv = document.getElementById('loading');
  if (!message.trim()) {
    resultsContainer.innerHTML = '<p style="color:#e91e63;">Введите сообщение.</p>';
    return;
  }
  loadingDiv.style.display = 'block';
  resultsContainer.innerHTML = '';
  const models = ["BERT", "TinyBERT"];
  const initData = Telegram.WebApp.initData;
  try {
    const promises = models.map(model =>
      fetch('https://neurospacex-ruspam.hf.space/api/check_spam', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': initData
        },
        body: JSON.stringify({ message, model_name: model })
      }).then(response => {
        if (!response.ok) throw new Error("Ошибка API: " + response.status);
        return response.json();
      }).then(data => ({ model, ...data }))
    );
    const results = await Promise.all(promises);
    loadingDiv.style.display = 'none';
    results.forEach(res => {
      const container = document.createElement('div');
      container.className = 'result-item';
      const label = document.createElement('div');
      label.className = 'result-label';
      const percentage = (res.confidence * 100).toFixed(2);
      label.textContent = `(${res.model}) ${res.is_spam ? 'СПАМ' : 'НЕ СПАМ'} (${percentage}%)`;
      label.style.color = res.is_spam ? "#e91e63" : "#4CAF50";
      container.appendChild(label);
      
      // Рассчитываем проценты: зеленый – не спам, красный – спам
      const notSpamPerc = res.is_spam ? (100 - res.confidence * 100) : res.confidence * 100;
      const spamPerc = 100 - notSpamPerc;
      
      const progress = document.createElement('div');
      progress.className = 'progress';
      
      const greenBar = document.createElement('div');
      greenBar.className = 'progress-bar green';
      greenBar.style.width = notSpamPerc + '%';
      
      const redBar = document.createElement('div');
      redBar.className = 'progress-bar red';
      redBar.style.width = spamPerc + '%';
      
      progress.appendChild(greenBar);
      progress.appendChild(redBar);
      container.appendChild(progress);
      resultsContainer.appendChild(container);
    });
  } catch (error) {
    loadingDiv.style.display = 'none';
    resultsContainer.innerHTML = `<p style="color:#e91e63;">Ошибка: ${error.message}</p>`;
  }
}

window.checkSpam = checkSpam;
