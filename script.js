// Ajout de la gestion du responsive au début du script
function resizeCanvas() {
    const container = canvas.parentElement;
    canvas.width = container.clientWidth;
    canvas.height = window.innerHeight;
    
    // Redessiner tout après le redimensionnement
    if (backgroundImage.complete) {
        drawBackground();
        drawTataLele();
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
}

// Écouteur pour le redimensionnement
window.addEventListener('resize', resizeCanvas);

// Ajout des événements tactiles
canvas.addEventListener('touchstart', handleTouch);

function handleTouch(event) {
    event.preventDefault();
    const touch = event.touches[0];
    const rect = canvas.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;

    if (isChoosing) {
        // Calcul de la zone des choix
        const choiceBoxHeight = 60;
        const choiceBoxYStart = canvas.height - 160;
        
        for (let i = 0; i < choices.length; i++) {
            const choiceBoxY = choiceBoxYStart + (i * choiceBoxHeight);
            if (y >= choiceBoxY && y <= choiceBoxY + choiceBoxHeight) {
                selectedChoice = i;
                drawChoices();
                makeChoice();
                return;
            }
        }
    } else if (showingResponse) {
        showingResponse = false;
        isFinalMessage = true;
        drawFinalMessage();
    } else if (!isFinalMessage) {
        advanceDialogue();
    }
}

// Modification de la fonction drawTataLele pour le responsive
function drawTataLele() {
    const maxWidth = canvas.width * 0.4; // 40% de la largeur de l'écran
    const maxHeight = canvas.height * 0.4; // 40% de la hauteur de l'écran
    
    // Calculer les dimensions en gardant le ratio
    let tataLeleWidth = maxWidth;
    let tataLeleHeight = maxHeight;
    
    if (tataLeleWidth / tataLeleHeight > tataLeleImage.width / tataLeleImage.height) {
        tataLeleWidth = tataLeleHeight * (tataLeleImage.width / tataLeleImage.height);
    } else {
        tataLeleHeight = tataLeleWidth / (tataLeleImage.width / tataLeleImage.height);
    }
    
    const x = canvas.width / 2 - tataLeleWidth / 2;
    const y = canvas.height - tataLeleHeight;
    
    ctx.drawImage(tataLeleImage, x, y, tataLeleWidth, tataLeleHeight);
}

// Modification de wrapText pour meilleure lisibilité sur mobile
function wrapText(context, text, x, y, maxWidth, lineHeight) {
    const scaleFactor = Math.min(canvas.width / 800, canvas.height / 600); // Adapte la taille du texte
    const fontSize = Math.max(14, Math.floor(16 * scaleFactor)); // Taille minimum de 14px
    
    context.font = `${fontSize}px "Press Start 2P"`;
    let words = text.split(' ');
    let line = '';
    
    for (let n = 0; n < words.length; n++) {
        let testLine = line + words[n] + ' ';
        let metrics = context.measureText(testLine);
        let testWidth = metrics.width;
        if (testWidth > maxWidth && n > 0) {
            context.fillText(line, x, y);
            line = words[n] + ' ';
            y += lineHeight * scaleFactor;
        } else {
            line = testLine;
        }
    }
    context.fillText(line, x, y);
}