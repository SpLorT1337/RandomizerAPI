const themeImages = {
  huligan: 'bear.jpg',
  millers: 'Millers.jpg',
  wedding: 'Wedding.jpg',
  millers1: 'Millers1.jpg',
  millers2: 'Millers2.jpg',
  millers3: 'Millers3.jpg',
  millers4: 'Millers4.jpg',
  millers5: 'Millers5.jpg',
  millers6: 'Millers6.jpg',
  millers7: 'Millers7.jpg'
};

let items = ["Пример 1", "Пример 2", "Пример 3"];
const baseColors = [
  "#ffeb3b", "#e57373", "#81d4fa", "#d4e157", "#ffa000",
  "#ba68c8", "#aed581", "#ffd54f", "#4fc3f7", "#ffd700"
];

const wheel = document.getElementById("wheel");
const itemsList = document.getElementById("items");
const dialog = document.getElementById("dialog");
const winnerTextPopup = document.getElementById("winner-text-popup");
const removeBtnDialogPopup = document.getElementById("remove-btn-dialog-popup");
const addButton = document.getElementById("add-button");
const spinButton = document.getElementById("spin-button");
const excludeButton = document.getElementById("exclude-button");
const dondigidonBtn = document.getElementById("dondigidon-btn");
const newItemInput = document.getElementById("newItem");
const themeSelect = document.getElementById("theme-select");
const closeBtnPopup = document.getElementById("close-btn-popup");

const historyDialog = document.getElementById('history-dialog');
const historyButton = document.getElementById('history-button');
const closeHistoryButton = document.getElementById('close-history-btn');
const spinHistoryContainer = document.getElementById('spin-history');

const parallaxBg = document.getElementById("parallax-bg");

let spinning = false;
let winnerIndex = -1;
let spinHistory = [];

// Форматирование даты (день.месяц.год часы:минуты:секунды)
function formatDate(date) {
  return date.toLocaleString('ru-RU', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
}

// Обновляем содержимое истории прокруток
function updateHistory() {
  if (!spinHistoryContainer) return;
  spinHistoryContainer.innerHTML = '';
  if (spinHistory.length === 0) {
    spinHistoryContainer.textContent = 'История пуста.';
    return;
  }
  spinHistory.forEach(entry => {
    const div = document.createElement('div');
    div.textContent = `${entry.date} — ${entry.item}`;
    div.style.padding = '6px 0';
    spinHistoryContainer.appendChild(div);
  });
}

// Показываем окно истории при клике на кнопку и обновляем список
historyButton.onclick = () => {
  updateHistory();
  historyDialog.classList.remove('modal-hidden');
};
// Закрываем окно истории
closeHistoryButton.onclick = () => {
  historyDialog.classList.add('modal-hidden');
};

function getWheelCanvasSize() {
  const viewportW = Math.min(window.innerWidth, window.innerHeight);
  return Math.max(236, Math.round(viewportW * 0.90));
}

addButton.onclick = addItem;
spinButton.onclick = spinWheel;
excludeButton.onclick = excludeMagaMagomed;
removeBtnDialogPopup.onclick = () => {
  if (spinning) return;
  dialog.style.display = "none";
  if (winnerIndex !== -1) {
    items.splice(winnerIndex, 1);
    winnerIndex = -1;
    updateItems();
  }
};
dondigidonBtn.onclick = donDigiDonProcess;
closeBtnPopup.onclick = () => {
  if (spinning) return;
  dialog.style.display = "none";
};
newItemInput.addEventListener("keyup", e => {
  if (e.key === "Enter") addItem();
});
themeSelect.onchange = changeTheme;

function updateItems() {
  itemsList.innerHTML = '';
  items.forEach((item, ix) => {
    const li = document.createElement('li');
    li.textContent = item;
    li.style.color = baseColors[ix % baseColors.length];
    const delBtn = document.createElement('button');
    delBtn.textContent = '✕';
    delBtn.title = "Удалить участника";
    delBtn.onclick = () => {
      if (spinning) return;
      items.splice(ix, 1);
      if (winnerIndex === ix) winnerIndex = -1;
      updateItems();
      drawWheel();
    };
    li.appendChild(delBtn);
    itemsList.appendChild(li);
  });
  drawWheel();
}

function addItem() {
  if (spinning) return;
  const v = newItemInput.value.trim();
  if (v && !items.includes(v)) {
    items.push(v);
    newItemInput.value = '';
    updateItems();
  }
}

function drawWheel() {
  wheel.innerHTML = '';
  const size = getWheelCanvasSize();
  const cnv = document.createElement('canvas');
  cnv.width = cnv.height = size;
  const ctx = cnv.getContext("2d");
  const n = items.length;
  const r = size / 2;
  let startAngle = -Math.PI / 2;
  if (n === 0) {
    ctx.beginPath();
    ctx.arc(r, r, r - 4, 0, 2 * Math.PI);
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.fill();
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 1;
    ctx.stroke();
    wheel.appendChild(cnv);
    return;
  }

  for (let i = 0; i < n; i++) {
    const segStart = startAngle;
    const segEnd = startAngle + (2 * Math.PI) / n;
    ctx.save();
    if (i === winnerIndex) {
      ctx.shadowColor = "#000";
      ctx.shadowBlur = 30;
      ctx.beginPath();
      ctx.moveTo(r, r);
      ctx.arc(r, r, r - 4, segStart, segEnd, false);
      ctx.closePath();
      ctx.fillStyle = baseColors[i % baseColors.length];
      ctx.fill();
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(r, r);
      ctx.lineTo(r + Math.cos(segStart) * (r - 4), r + Math.sin(segStart) * (r - 4));
      ctx.stroke();
    }
    ctx.restore();

    ctx.beginPath();
    ctx.moveTo(r, r);
    ctx.arc(r, r, r - 4, segStart, segEnd, false);
    ctx.closePath();
    ctx.fillStyle = baseColors[i % baseColors.length];
    ctx.fill();
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 1;
    ctx.stroke();

    const textAngle = (segStart + segEnd) / 2;
    const textRadius = r * 0.7;
    const textX = r + Math.cos(textAngle) * textRadius;
    const textY = r + Math.sin(textAngle) * textRadius;
    ctx.save();

    const segmentAngleRad = segEnd - segStart;
    const maxTextWidth = 2 * Math.sin(segmentAngleRad / 2) * r * 0.8;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    let fontSize = Math.round(size / 18);
    const minFontSize = 9;
    ctx.font = `bold ${fontSize}px Arial`;

    function fitText(text, maxWidth) {
      let fittedText = text;
      ctx.font = `bold ${fontSize}px Arial`;
      let width = ctx.measureText(fittedText).width;
      while (width > maxWidth && fontSize > minFontSize) {
        fontSize--;
        ctx.font = `bold ${fontSize}px Arial`;
        width = ctx.measureText(fittedText).width;
      }
      if (width > maxWidth) {
        let len = fittedText.length;
        do {
          len--;
          fittedText = text.slice(0, len) + '...';
          width = ctx.measureText(fittedText).width;
          if (len === 0) break;
        } while (width > maxWidth);
      }
      return fittedText;
    }

    const displayText = fitText(items[i], maxTextWidth);
    ctx.font = `bold ${fontSize}px Arial`;
    ctx.translate(textX, textY);
    ctx.rotate(textAngle + Math.PI / 2);
    ctx.shadowColor = "rgba(0,0,0,0.7)";
    ctx.shadowBlur = 6;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    ctx.lineWidth = 4;
    ctx.strokeStyle = "#222";
    ctx.strokeText(displayText, 0, 0);
    ctx.fillStyle = "#fff";
    ctx.fillText(displayText, 0, 0);
    ctx.restore();

    startAngle = segEnd;
  }

  ctx.strokeStyle = '#000';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(r, r);
  ctx.lineTo(r + Math.cos(-Math.PI / 2) * (r - 4), r + Math.sin(-Math.PI / 2) * (r - 4));
  ctx.stroke();

  wheel.appendChild(cnv);
  cnv.style.transform = '';
}

function spinWheel() {
  if (spinning) return;
  if (items.length === 0) return;
  spinning = true;
  addButton.disabled = true;
  spinButton.disabled = true;
  excludeButton.disabled = true;
  dondigidonBtn.disabled = true;
  newItemInput.disabled = true;

  const n = items.length;
  const segmentAngle = 360 / n;
  winnerIndex = Math.floor(Math.random() * n);
  const baseRotation = 360 * 5;
  const rotateTo = -(baseRotation + (winnerIndex * segmentAngle) + segmentAngle / 2);
  const canvas = wheel.querySelector('canvas');
  canvas.style.transition = "";
  canvas.style.transform = "";

  setTimeout(() => {
    canvas.style.transition = "transform 5s cubic-bezier(0.33, 1, 0.68, 1)";
    canvas.style.transform = `rotate(${rotateTo}deg)`;
  }, 40);

  function onTransitionEnd() {
    spinning = false;
    winnerTextPopup.textContent = `Победитель: ${items[winnerIndex]}`;
    dialog.style.display = "flex";

    // Добавляем в историю
    spinHistory.push({
      item: items[winnerIndex],
      date: formatDate(new Date())
    });
    updateHistory();

    canvas.style.transition = "";
    canvas.removeEventListener('transitionend', onTransitionEnd);
    addButton.disabled = false;
    spinButton.disabled = false;
    excludeButton.disabled = false;
    dondigidonBtn.disabled = false;
    newItemInput.disabled = false;
    drawWheel();
  }
  canvas.addEventListener('transitionend', onTransitionEnd);
}

function excludeMagaMagomed() {
  if (spinning) return;
  const targetIndex = items.findIndex(item =>
    item.toLowerCase() === 'maga' || item.toLowerCase() === 'magomed'
  );
  if (targetIndex === -1) {
    alert('Участников с именем Maga или Magomed нет');
    return;
  }

  spinning = true;
  addButton.disabled = true;
  spinButton.disabled = true;
  excludeButton.disabled = true;
  dondigidonBtn.disabled = true;
  newItemInput.disabled = true;

  const segmentAngle = 360 / items.length;
  const baseRotation = 360 * 5;
  const rotateTo = -(baseRotation + (targetIndex * segmentAngle) + segmentAngle / 2);
  const canvas = wheel.querySelector('canvas');
  canvas.style.transition = "";
  canvas.style.transform = "";

  setTimeout(() => {
    canvas.style.transition = "transform 5s cubic-bezier(0.33, 1, 0.68, 1)";
    canvas.style.transform = `rotate(${rotateTo}deg)`;
  }, 40);

  function onTransitionEnd() {
    spinning = false;
    winnerTextPopup.textContent = `Победитель: ${items[targetIndex]}`;
    dialog.style.display = "flex";

    // Добавляем в историю
    spinHistory.push({
      item: items[targetIndex],
      date: formatDate(new Date())
    });
    updateHistory();

    canvas.style.transition = "";
    canvas.removeEventListener('transitionend', onTransitionEnd);
    addButton.disabled = false;
    spinButton.disabled = false;
    excludeButton.disabled = false;
    dondigidonBtn.disabled = false;
    newItemInput.disabled = false;
    winnerIndex = targetIndex;
    drawWheel();
  }
  canvas.addEventListener('transitionend', onTransitionEnd);
}

function changeTheme() {
  const theme = themeSelect.value;
  const img = themeImages[theme];
  if (img) {
    parallaxBg.style.backgroundImage = `url('${img}')`;
    parallaxBg.style.backgroundAttachment = 'fixed';
    parallaxBg.style.backgroundPosition = 'center';
    parallaxBg.style.backgroundRepeat = 'no-repeat';
    parallaxBg.style.backgroundSize = 'cover';

    document.addEventListener('mousemove', (e) => {
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;
      parallaxBg.style.backgroundPosition = `${50 + 10 * (x - 0.5)}% ${50 + 10 * (y - 0.5)}%`;
    });
  }
}

function donDigiDonProcess() {
  if (spinning || items.length < 2) return;

  spinning = true;
  addButton.disabled = true;
  spinButton.disabled = true;
  excludeButton.disabled = true;
  dondigidonBtn.disabled = true;
  newItemInput.disabled = true;

  function nextSpin() {
    if (items.length === 1) {
      spinning = false;
      winnerIndex = 0;
      drawWheel();
      winnerTextPopup.textContent = `Дон дигидон передаёт привет победителю: ${items[0]}`;
      dialog.style.display = "flex";

      // Добавляем в историю
      spinHistory.push({
        item: items[0],
        date: formatDate(new Date())
      });
      updateHistory();

      addButton.disabled = false;
      spinButton.disabled = false;
      excludeButton.disabled = false;
      dondigidonBtn.disabled = false;
      newItemInput.disabled = false;
      return;
    }

    const n = items.length;
    const segmentAngle = 360 / n;
    winnerIndex = Math.floor(Math.random() * n);
    const baseRotation = 360 * 3;
    const rotateTo = -(baseRotation + (winnerIndex * segmentAngle) + segmentAngle / 2);
    const canvas = wheel.querySelector('canvas');
    canvas.style.transition = "";
    canvas.style.transform = "";

    setTimeout(() => {
      canvas.style.transition = "transform 1.2s cubic-bezier(0.33, 1, 0.68, 1)";
      canvas.style.transform = `rotate(${rotateTo}deg)`;
    }, 40);

    function onTransitionEnd() {
      canvas.removeEventListener('transitionend', onTransitionEnd);

      // Добавляем в историю
      spinHistory.push({
        item: items[winnerIndex],
        date: formatDate(new Date())
      });
      updateHistory();

      items.splice(winnerIndex, 1);
      winnerIndex = -1;
      updateItems();

      setTimeout(() => nextSpin(), 400);
    }
    canvas.addEventListener('transitionend', onTransitionEnd);
  }

  nextSpin();
}

window.addEventListener('resize', () => {
  drawWheel();
});

changeTheme();
updateItems();
