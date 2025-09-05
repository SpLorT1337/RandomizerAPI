const themeImages = {
    huligan: 'bear.jpg', // Russian Huligan
    millers: 'Millers.jpg',
    wedding: 'Wedding.jpg'
};

let items = ["Пример 1", "Пример 2", "Пример 3"];

const baseColors = [
    "#ffeb3b", "#e57373", "#81d4fa", "#d4e157", "#ffa000",
    "#ba68c8", "#aed581", "#ffd54f", "#4fc3f7", "#ffd700"
];

const wheel = document.getElementById("wheel");
const itemsList = document.getElementById("items");
const dialog = document.getElementById("dialog");
const winnerText = document.getElementById("winner-text");
const removeBtn = document.getElementById("remove-btn");
const addButton = document.getElementById("add-button");
const spinButton = document.getElementById("spin-button");
const excludeButton = document.getElementById("exclude-button");
const newItemInput = document.getElementById("newItem");
const themeSelect = document.getElementById("theme-select");
const parallaxBg = document.getElementById("parallax-bg");

let spinning = false;
let winnerIndex = -1;

addButton.onclick = addItem;
spinButton.onclick = spinWheel;
excludeButton.onclick = excludeMagaMagomed;
removeBtn.onclick = () => {
    if (spinning) return;
    dialog.style.display = "none";
    if (winnerIndex !== -1) {
        items.splice(winnerIndex, 1);
        winnerIndex = -1;
        updateItems();
    }
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
    const cnv = document.createElement('canvas');
    cnv.width = cnv.height = 880;
    const ctx = cnv.getContext("2d");
    const n = items.length;
    const r = 440;
    let startAngle = -Math.PI / 2;

    if (n === 0) {
        ctx.beginPath();
        ctx.arc(r, r, r - 4, 0, 2 * Math.PI);
        ctx.fillStyle = '#fff';
        ctx.fill();
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 1;
        ctx.stroke();
        wheel.appendChild(cnv);
        return;
    }

    for (let i = 0; i < n; ++i) {
        const segStart = startAngle;
        const segEnd = startAngle + 2 * Math.PI / n;

        ctx.save();
        if (i === winnerIndex) {
            ctx.shadowColor = "#000";
            ctx.shadowBlur = 30;
        }

        ctx.beginPath();
        ctx.moveTo(r, r);
        ctx.arc(r, r, r - 4, segStart, segEnd, false);
        ctx.closePath();

        ctx.fillStyle = baseColors[i % baseColors.length];
        ctx.fill();

        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(r, r);
        ctx.lineTo(r + Math.cos(segStart) * (r - 4), r + Math.sin(segStart) * (r - 4));
        ctx.stroke();

        ctx.restore();

        // Текст
        const textAngle = (segStart + segEnd) / 2;
        const textRadius = r * 0.67;
        const textX = r + Math.cos(textAngle) * textRadius;
        const textY = r + Math.sin(textAngle) * textRadius;

        ctx.save();
        ctx.font = "bold 20px Arial";
        ctx.fillStyle = "#222";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.translate(textX, textY);
        ctx.rotate(textAngle);
        ctx.fillText(items[i], 0, 0);
        ctx.restore();

        startAngle = segEnd;
    }

    // Линия указателя
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
        winnerText.textContent = `Победитель: ${items[winnerIndex]}`;
        dialog.style.display = "flex";

        canvas.style.transition = "";
        canvas.removeEventListener('transitionend', onTransitionEnd);

        addButton.disabled = false;
        spinButton.disabled = false;
        excludeButton.disabled = false;
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
        winnerText.textContent = `Победитель: ${items[targetIndex]}`;
        dialog.style.display = "flex";
        canvas.style.transition = "";
        canvas.removeEventListener('transitionend', onTransitionEnd);

        addButton.disabled = false;
        spinButton.disabled = false;
        excludeButton.disabled = false;
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

        document.addEventListener('mousemove', function(e) {
            const x = e.clientX / window.innerWidth;
            const y = e.clientY / window.innerHeight;
            parallaxBg.style.backgroundPosition =
                `${50 + 10 * (x - 0.5)}% ${50 + 10 * (y - 0.5)}%`;
        });
    }
}

// Инициализация
changeTheme();
updateItems();
