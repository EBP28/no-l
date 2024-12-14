const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Chargement des images
const backgroundImage = new Image();
const tataLeleImage = new Image();

backgroundImage.src = 'background_christmas.png';  // Chemin de l'image de fond
tataLeleImage.src = 'tata_lele.png';  // Chemin de l'image de l'héroïne

// Variables pour le dialogue et les choix
let currentDialogueIndex = 0;
let dialogues = [
    "HO HO HO Tata Lélé, j'imagine que tu es prête à recevoir ton cadeau.",
    "Que voudrais-tu pour Noël ?"
];

let choices = [
    "Un massage près de Vannes (dans la limite de 60 € bien évidemment pour ne pas que les autres se sentent lésés, petite maligne).",
    "Rien, j'ai déjà ce qu'il me faut."
];

let responses = [
    "Excellent choix, va voir ton Secret Santa (si tu sais qui c'est) pour lui donner la meilleure adresse de massage de Vannes. Et surtout, joyeux Noël !",
    "Ho ho ho, heureusement que tout le monde ne réagit pas comme toi, tu veux la mort du petit commerce ou quoi ? Mais bon, joyeux Noël quand même."
];

let selectedChoice = 0;
let isChoosing = false;
let isFinalMessage = false;
let showingResponse = false;

// Fonction pour redimensionner dynamiquement le canvas
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Redessiner en fonction de l'état actuel
    if (isChoosing) {
        drawChoices();
    } else if (showingResponse) {
        makeChoice();
    } else if (isFinalMessage) {
        drawFinalMessage();
    } else {
        drawDialogue();
    }
}

// Dessiner le fond sans le redimensionner de manière disproportionnée
function drawBackground() {
    const imgRatio = backgroundImage.width / backgroundImage.height;
    const canvasRatio = canvas.width / canvas.height;

    if (canvasRatio > imgRatio) {
        const newHeight = canvas.width / imgRatio;
        ctx.drawImage(backgroundImage, 0, (canvas.height - newHeight) / 2, canvas.width, newHeight);
    } else {
        const newWidth = canvas.height * imgRatio;
        ctx.drawImage(backgroundImage, (canvas.width - newWidth) / 2, 0, newWidth, canvas.height);
    }
}

// Dessiner Tata Lélé
function drawTataLele() {
    const tataLeleWidth = 100;
    const tataLeleHeight = 200;
    const x = canvas.width / 2 - tataLeleWidth / 2;
    const y = canvas.height - tataLeleHeight;
    ctx.drawImage(tataLeleImage, x, y, tataLeleWidth, tataLeleHeight);
}

// Fonction pour afficher le dialogue
function drawDialogue() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground();
    drawTataLele();

    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(10, 10, canvas.width - 20, 150); // Boîte de dialogue
    ctx.fillStyle = '#fff';
    ctx.font = '16px "Press Start 2P"';
    wrapText(ctx, dialogues[currentDialogueIndex], 20, 50, canvas.width - 40, 20);
}

// Fonction pour afficher les choix
function drawChoices() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground();
    drawTataLele();

    const choiceBoxHeight = 60;
    const choiceBoxWidth = canvas.width - 20;
    const choiceBoxYStart = canvas.height - 160;

    for (let i = 0; i < choices.length; i++) {
        const choiceBoxY = choiceBoxYStart + (i * choiceBoxHeight);
        ctx.fillStyle = (i === selectedChoice) ? 'rgba(102, 204, 102, 0.7)' : 'rgba(0, 0, 0, 1)';
        ctx.fillRect(10, choiceBoxY, choiceBoxWidth, choiceBoxHeight);
        ctx.fillStyle = '#ff0000';
        ctx.font = '16px "Press Start 2P"';
        wrapText(ctx, choices[i], 20, choiceBoxY + 20, canvas.width - 40, 20);
    }

    ctx.fillStyle = '#f00';
    ctx.fillText('→', 10, canvas.height - 115 + (selectedChoice * 60));
}

// Fonction pour afficher une réponse après un choix
function makeChoice() {
    isChoosing = false;
    showingResponse = true;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground();
    drawTataLele();
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(10, 10, canvas.width - 20, 150);
    ctx.fillStyle = '#fff';
    ctx.font = '16px "Press Start 2P"';
    wrapText(ctx, responses[selectedChoice], 20, 50, canvas.width - 40, 20);
}

// Fonction pour afficher le message final
function drawFinalMessage() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground();
    drawTataLele();
    ctx.fillStyle = 'rgba(0, 0, 0, 1)';
    ctx.fillRect(10, canvas.height / 2 - 75, canvas.width - 20, 150);
    ctx.fillStyle = '#fff';
    ctx.font = '48px "Press Start 2P"';
    ctx.textAlign = 'center';
    wrapText(ctx, 'JOYEUX NOËL TATA LÉLÉ', canvas.width / 2, canvas.height / 2 - 24, canvas.width - 40, 48);
}

// Gestion des événements clavier (PC)
document.addEventListener('keydown', (event) => {
    if (event.code === 'Space') {
        if (isChoosing) {
            makeChoice();
        } else if (showingResponse) {
            drawFinalMessage();
            showingResponse = false;
            isFinalMessage = true;
        } else if (!isFinalMessage) {
            advanceDialogue();
        }
    } else if (event.code === 'ArrowUp' && isChoosing) {
        selectedChoice = (selectedChoice > 0) ? selectedChoice - 1 : choices.length - 1;
        drawChoices();
    } else if (event.code === 'ArrowDown' && isChoosing) {
        selectedChoice = (selectedChoice < choices.length - 1) ? selectedChoice + 1 : 0;
        drawChoices();
    }
});

// Gestion des événements tactiles (smartphone)
canvas.addEventListener('touchstart', (event) => {
    const touch = event.touches[0];
    const rect = canvas.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;

    if (isChoosing) {
        const choiceBoxHeight = 60;
        const choiceBoxYStart = canvas.height - 160;
        for (let i = 0; i < choices.length; i++) {
            const choiceBoxY = choiceBoxYStart + (i * choiceBoxHeight);
            if (y > choiceBoxY && y < choiceBoxY + choiceBoxHeight) {
                selectedChoice = i;
                makeChoice();
                return;
            }
        }
    } else if (showingResponse) {
        drawFinalMessage();
        showingResponse = false;
        isFinalMessage = true;
    } else if (!isFinalMessage) {
        advanceDialogue();
    }
});

// Fonction pour gérer les dialogues
function advanceDialogue() {
    if (currentDialogueIndex < dialogues.length - 1) {
        currentDialogueIndex++;
        if (currentDialogueIndex === dialogues.length - 1) {
            isChoosing = true;
            drawChoices();
        } else {
            drawDialogue();
        }
    }
}

// Fonction pour afficher du texte avec retour à la ligne
function wrapText(context, text, x, y, maxWidth, lineHeight) {
    let words = text.split(' ');
    let line = '';

    for (let n = 0; n < words.length; n++) {
        let testLine = line + words[n] + ' ';
        let metrics = context.measureText(testLine);
        let testWidth = metrics.width;
        if (testWidth > maxWidth && n > 0) {
            context.fillText(line, x, y);
            line = words[n] + ' ';
            y += lineHeight;
        } else {
            line = testLine;
        }
    }
    context.fillText(line, x, y);
}

// Lancer les dialogues au chargement des images
backgroundImage.onload = () => {
    resizeCanvas();
    drawDialogue();
};

// Redimensionner au chargement initial
resizeCanvas();
window.addEventListener('resize', resizeCanvas);
