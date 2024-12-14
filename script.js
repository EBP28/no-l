const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Chargement des images
const backgroundImage = new Image();
const tataLeleImage = new Image();

backgroundImage.src = 'background_christmas.png';  // Chemin de l'image de fond
tataLeleImage.src = 'tata_lele.png';  // Chemin de l'image de l'héroïne

// Chargement de la musique
const backgroundMusic = new Audio('background_music.mp3');
backgroundMusic.loop = true; // Répéter la musique en boucle
let isMusicPlaying = false; // L'état initial de la musique (démarre en pause)

// Bouton pour activer/désactiver la musique
const toggleMusicButton = document.getElementById('toggleMusic');
toggleMusicButton.addEventListener('click', () => {
    if (isMusicPlaying) {
        backgroundMusic.pause(); // Mettre en pause la musique
        toggleMusicButton.textContent = '🔊'; // Icône son activé
    } else {
        backgroundMusic.play().catch(error => {
            console.error('Erreur lors de la lecture de la musique :', error);
        });
        toggleMusicButton.textContent = '🔇'; // Icône son coupé
    }
    isMusicPlaying = !isMusicPlaying; // Alterner l'état
});

// Demander une interaction de l'utilisateur pour démarrer la musique
// C'est ici que la musique démarre, grâce à l'interaction initiale (clic sur la page)
window.addEventListener('click', () => {
    if (!isMusicPlaying) {
        backgroundMusic.play().catch(error => {
            console.error('Erreur lors de la lecture automatique de la musique :', error);
        });
        toggleMusicButton.textContent = '🔇'; // Icône son coupé
        isMusicPlaying = true; // La musique est maintenant jouée
    }
});

// Vérification du chargement de la musique
backgroundMusic.addEventListener('canplay', () => {
    console.log('Musique de fond chargée.');
});

// Variables pour le dialogue et les choix
let currentDialogueIndex = 0;
let dialogues = [
    "HO HO HO Tata Lélé, j'imagine que tu es prête à recevoir ton cadeau.Que voudrais-tu pour Noël ",
    "Que voudrais-tu pour Noël ?"
];

let choices = [
    "Un massage fait par "El famoso" Richard quand tu seras de passage à Chartres",
    "Rien, j'ai déjà ce qu'il me faut, ma vie est merveilleuse."
];

let responses = [
    "Excellent choix, va voir ton Secret Santa (si tu sais qui c'est) pour lui la date Et surtout, joyeux Noël !",
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

// Fonction pour afficher le dialogue actuel
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

// Fonction pour gérer l'avancement du dialogue
function advanceDialogue() {
    if (currentDialogueIndex < dialogues.length - 1) {
        currentDialogueIndex++; // Passe au dialogue suivant
        if (currentDialogueIndex === dialogues.length - 1) {
            // Quand le dernier dialogue est atteint, afficher les choix
            isChoosing = true;
            drawChoices();
        } else {
            drawDialogue(); // Affiche le dialogue suivant
        }
    }
}

// Gérer l'avancement du dialogue avec un clic ou la barre d'espace
window.addEventListener('click', () => {
    if (!isChoosing && !showingResponse && !isFinalMessage) {
        advanceDialogue(); // Avancer le dialogue si l'on clique
    }
});

// Gérer l'avancement du dialogue avec la barre d'espace
document.addEventListener('keydown', (event) => {
    if (event.code === 'Space') {
        if (!isChoosing && !showingResponse && !isFinalMessage) {
            advanceDialogue(); // Avancer le dialogue si on appuie sur la barre d'espace
        }
    }
});

// Lancer les dialogues au chargement des images
backgroundImage.onload = () => {
    resizeCanvas();
    drawDialogue();
};

// Redimensionner au chargement initial
resizeCanvas();
window.addEventListener('resize', resizeCanvas);
