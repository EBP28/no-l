const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const backgroundImage = new Image();
backgroundImage.src = 'background_christmas.png';

const tataLeleImage = new Image();
tataLeleImage.src = 'tata_lele.png';

backgroundImage.onload = () => {
    console.log('Background image loaded');
    drawBackground();
    drawTataLele(); // Assurez-vous que Tata Lélé est dessinée après le fond
    startDialogue();
};

tataLeleImage.onload = () => {
    console.log('Tata Lélé image loaded');
    drawTataLele();
};

function drawBackground() {
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
}

function drawTataLele() {
    const tataLeleWidth = 100; // Définir la largeur souhaitée
    const tataLeleHeight = 200; // Définir la hauteur souhaitée
    const x = canvas.width / 2 - tataLeleWidth / 2; // Centrer horizontalement
    const y = canvas.height - tataLeleHeight; // Placer en bas de l'écran
    ctx.drawImage(tataLeleImage, x, y, tataLeleWidth, tataLeleHeight);
}

let currentDialogueIndex = 0;
let dialogues = [
    "HO HO HO Tata Lélé, j'imagine que tu es prête à recevoir ton cadeau.Que voudrais-tu pour Noël",
    
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

// Variables pour la musique
let audioElement = new Audio('background_music.mp3');
audioElement.loop = true;
audioElement.addEventListener('canplay', () => {
    console.log('Music loaded and can play');
    audioElement.play().catch(error => {
        console.error('Error attempting to play music:', error);
    });
});
audioElement.addEventListener('error', () => {
    console.error('Error loading music');
});

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

function startDialogue() {
    drawDialogue();
}

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

function makeChoice() {
    isChoosing = false;
    showingResponse = true;

    // Afficher la réponse correspondante au choix
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground();
    drawTataLele();
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(10, 10, canvas.width - 20, 150);
    ctx.fillStyle = '#fff';
    ctx.font = '16px "Press Start 2P"';
    wrapText(ctx, responses[selectedChoice], 20, 50, canvas.width - 40, 20);
}

function drawDialogue() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground();
    drawTataLele();
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(10, 10, canvas.width - 20, 150);
    ctx.fillStyle = '#fff';
    ctx.font = '16px "Press Start 2P"';
    wrapText(ctx, dialogues[currentDialogueIndex], 20, 50, canvas.width - 40, 20);
}

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

function drawFinalMessage() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground();
    drawTataLele();
    ctx.fillStyle = 'rgba(0, 0, 0, 1)'; // Fond noir opaque pour la boîte de dialogue
    ctx.fillRect(10, canvas.height / 2 - 75, canvas.width - 20, 150); // Boîte de dialogue centrée
    ctx.fillStyle = '#fff'; // Couleur blanche pour le texte final
    ctx.font = '48px "Press Start 2P"'; // Taille de police plus grande
    ctx.textAlign = 'center';
    ctx.lineWidth = 5; // Épaisseur de la bordure
    ctx.strokeStyle = '#000'; // Couleur de la bordure
    wrapText(ctx, 'JOYEUX NOËL TATA LÉLÉ', canvas.width / 2, canvas.height / 2 - 24, canvas.width - 40, 48);
}

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