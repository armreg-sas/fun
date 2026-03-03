let currentCard = null;
let markedCells = new Set();
let hasBingo = false;
let hasBlackout = false;

function showMenuScreen() {
    hideAllScreens();
    document.getElementById('menu-screen').classList.add('active');
}

function showCreateScreen() {
    hideAllScreens();
    document.getElementById('create-screen').classList.add('active');
    initializeCreateGrid();
}

function showLoadScreen() {
    hideAllScreens();
    document.getElementById('load-screen').classList.add('active');
    loadSavedCards();
}

function showImportScreen() {
    hideAllScreens();
    document.getElementById('import-screen').classList.add('active');
    document.getElementById('import-code').value = '';
}

function showPlayScreen(card) {
    hideAllScreens();
    currentCard = card;
    markedCells.clear();
    hasBingo = false;
    hasBlackout = false;
    document.getElementById('play-screen').classList.add('active');
    document.getElementById('play-card-name').textContent = card.name;
    initializePlayGrid(card);
}

function hideAllScreens() {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
}

function initializeCreateGrid() {
    const grid = document.getElementById('create-grid');
    grid.innerHTML = '';
    
    for (let i = 0; i < 25; i++) {
        const cell = document.createElement('div');
        cell.className = 'bingo-cell editable';
        
        if (i === 12) {
            cell.className = 'bingo-cell free';
            cell.textContent = '✨ FREE ✨';
        } else {
            const input = document.createElement('input');
            input.type = 'text';
            input.maxLength = 30;
            input.placeholder = `#${i < 12 ? i + 1 : i}`;
            
            // Prevent script injection
            input.addEventListener('input', (e) => {
                e.target.value = e.target.value.replace(/[<>]/g, '');
            });
            
            cell.appendChild(input);
        }
        
        grid.appendChild(cell);
    }
}

function sanitizeText(text) {
    // Remove any HTML tags and dangerous characters
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function saveCard() {
    const cardName = sanitizeText(document.getElementById('card-name').value.trim());
    if (!cardName) {
        alert('Please name your bingo card! 💖');
        return;
    }
    
    const inputs = document.querySelectorAll('#create-grid input');
    const cells = [];
    let emptyCount = 0;
    
    inputs.forEach(input => {
        const value = sanitizeText(input.value.trim());
        if (!value) emptyCount++;
        cells.push(value);
    });
    
    if (emptyCount > 12) {
        alert('Fill in more squares to make your card sparkle! ✨');
        return;
    }
    
    const card = {
        id: Date.now(),
        name: cardName,
        cells: cells,
        created: new Date().toISOString()
    };
    
    const savedCards = getSavedCards();
    savedCards.push(card);
    
    try {
        localStorage.setItem('bingoCards', JSON.stringify(savedCards));
        alert('Card saved! 💖');
        document.getElementById('card-name').value = '';
        // Clear the grid inputs
        document.querySelectorAll('#create-grid input').forEach(input => {
            input.value = '';
        });
        showMenuScreen();
    } catch (e) {
        console.error('Save error:', e);
        alert('Could not save card. Storage might be full! 💔');
    }
}

function getSavedCards() {
    try {
        const saved = localStorage.getItem('bingoCards');
        return saved ? JSON.parse(saved) : [];
    } catch (e) {
        console.error('Error loading saved cards:', e);
        return [];
    }
}

function loadSavedCards() {
    const list = document.getElementById('saved-cards-list');
    const cards = getSavedCards();
    
    if (cards.length === 0) {
        list.innerHTML = '<p style="text-align: center; color: #a0aec0;">No saved cards yet. Create one! ✨</p>';
        return;
    }
    
    list.innerHTML = '';
    cards.forEach(card => {
        const item = document.createElement('div');
        item.className = 'saved-card-item';
        
        const nameDiv = document.createElement('div');
        nameDiv.className = 'saved-card-name';
        nameDiv.textContent = card.name;
        
        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'saved-card-actions';
        
        const shareBtn = document.createElement('button');
        shareBtn.className = 'btn btn-small btn-share';
        shareBtn.onclick = () => shareCard(card.id);
        shareBtn.innerHTML = '<span class="icon">🔗</span> Share';
        
        const playBtn = document.createElement('button');
        playBtn.className = 'btn btn-small btn-play';
        playBtn.onclick = () => playCard(card.id);
        playBtn.innerHTML = '<span class="icon">🎮</span> Play';
        
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'btn btn-small btn-delete';
        deleteBtn.onclick = () => deleteCard(card.id);
        deleteBtn.innerHTML = '<span class="icon">🗑️</span>';
        
        actionsDiv.appendChild(shareBtn);
        actionsDiv.appendChild(playBtn);
        actionsDiv.appendChild(deleteBtn);
        item.appendChild(nameDiv);
        item.appendChild(actionsDiv);
        list.appendChild(item);
    });
}

function playCard(cardId) {
    const cards = getSavedCards();
    const card = cards.find(c => c.id === cardId);
    if (card) {
        showPlayScreen(card);
    }
}

function deleteCard(cardId) {
    if (!confirm('Delete this card? 💔')) return;
    
    const cards = getSavedCards();
    const filtered = cards.filter(c => c.id !== cardId);
    localStorage.setItem('bingoCards', JSON.stringify(filtered));
    loadSavedCards();
}

function shareCard(cardId) {
    const cards = getSavedCards();
    const card = cards.find(c => c.id === cardId);
    if (!card) return;
    
    // Create a shareable version without the ID
    const shareData = {
        name: card.name,
        cells: card.cells
    };
    
    // Encode to base64
    const encoded = btoa(JSON.stringify(shareData));
    
    // Create shareable text
    const shareText = `✨ Bingo Card: ${card.name} ✨\n\nImport this card by copying the code below and pasting it in the "Import Shared Card" section:\n\n${encoded}`;
    
    // Try to copy to clipboard
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(shareText).then(() => {
            alert('Share code copied to clipboard! 💖\n\nSend it to your friends so they can import your card!');
        }).catch(() => {
            showShareModal(shareText);
        });
    } else {
        showShareModal(shareText);
    }
}

function showShareModal(shareText) {
    const modal = document.createElement('div');
    modal.className = 'share-modal';
    
    const modalContent = document.createElement('div');
    modalContent.className = 'share-modal-content';
    
    const title = document.createElement('h3');
    title.textContent = 'Share Your Card! 💖';
    
    const description = document.createElement('p');
    description.textContent = 'Copy this code and send it to your friends:';
    
    const textarea = document.createElement('textarea');
    textarea.readOnly = true;
    textarea.rows = 8;
    textarea.value = shareText;
    
    const closeBtn = document.createElement('button');
    closeBtn.className = 'btn btn-primary';
    closeBtn.textContent = 'Close';
    closeBtn.onclick = () => modal.remove();
    
    modalContent.appendChild(title);
    modalContent.appendChild(description);
    modalContent.appendChild(textarea);
    modalContent.appendChild(closeBtn);
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
    
    textarea.select();
}

function importCard() {
    const importCode = document.getElementById('import-code').value.trim();
    if (!importCode) {
        alert('Please paste a share code! 💖');
        return;
    }
    
    try {
        // Extract just the base64 code (last line)
        const lines = importCode.split('\n');
        const encoded = lines[lines.length - 1].trim();
        
        // Decode from base64
        const decoded = atob(encoded);
        const shareData = JSON.parse(decoded);
        
        // Validate the data
        if (!shareData.name || !Array.isArray(shareData.cells) || shareData.cells.length !== 24) {
            throw new Error('Invalid card data');
        }
        
        // Sanitize all data
        const card = {
            id: Date.now(),
            name: sanitizeText(shareData.name),
            cells: shareData.cells.map(cell => sanitizeText(cell || '')),
            created: new Date().toISOString()
        };
        
        // Save the imported card
        const savedCards = getSavedCards();
        savedCards.push(card);
        localStorage.setItem('bingoCards', JSON.stringify(savedCards));
        
        alert(`Card "${card.name}" imported successfully! 💖`);
        showLoadScreen();
    } catch (e) {
        alert('Invalid share code! Please check and try again. 💔');
        console.error('Import error:', e);
    }
}

function initializePlayGrid(card) {
    const grid = document.getElementById('play-grid');
    grid.innerHTML = '';
    
    // Shuffle the cells (excluding the free space)
    const shuffledCells = [...card.cells].sort(() => Math.random() - 0.5);
    
    let cellIndex = 0;
    for (let i = 0; i < 25; i++) {
        const cell = document.createElement('div');
        
        if (i === 12) {
            cell.className = 'bingo-cell free marked';
            cell.textContent = '✨ FREE ✨';
            cell.dataset.index = i;
            markedCells.add(i);
        } else {
            cell.className = 'bingo-cell playable';
            cell.textContent = shuffledCells[cellIndex] || `Square ${cellIndex + 1}`;
            cell.dataset.index = i;
            cell.onclick = () => toggleCell(i);
            cellIndex++;
        }
        
        grid.appendChild(cell);
    }
}

function toggleCell(index) {
    const cell = document.querySelector(`#play-grid .bingo-cell[data-index="${index}"]`);
    
    if (markedCells.has(index)) {
        markedCells.delete(index);
        cell.classList.remove('marked');
        
        // Reset flags if unmarking causes loss of win condition
        if (hasBingo || hasBlackout) {
            hasBingo = false;
            hasBlackout = false;
        }
    } else {
        markedCells.add(index);
        cell.classList.add('marked');
        
        // Check for blackout first (all 25 squares)
        if (!hasBlackout && markedCells.size === 25) {
            hasBlackout = true;
            celebrateBlackout();
        }
        // Then check for regular bingo
        else if (!hasBingo) {
            checkForBingo();
        }
    }
}

function checkForBingo() {
    const winPatterns = [
        [0, 1, 2, 3, 4], [5, 6, 7, 8, 9], [10, 11, 12, 13, 14],
        [15, 16, 17, 18, 19], [20, 21, 22, 23, 24],
        [0, 5, 10, 15, 20], [1, 6, 11, 16, 21], [2, 7, 12, 17, 22],
        [3, 8, 13, 18, 23], [4, 9, 14, 19, 24],
        [0, 6, 12, 18, 24], [4, 8, 12, 16, 20]
    ];
    
    for (const pattern of winPatterns) {
        if (pattern.every(index => markedCells.has(index))) {
            hasBingo = true;
            celebrateBingo();
            return;
        }
    }
}

function celebrateBingo() {
    const overlay = document.getElementById('bingo-overlay');
    const bingoText = overlay.querySelector('.bingo-text');
    const bingoSubtext = overlay.querySelector('.bingo-subtext');
    
    bingoText.textContent = '🎉 BINGO! 🎉';
    bingoSubtext.textContent = 'Congratulations! You did it! ✨💖✨';
    
    overlay.classList.add('active');
    createConfetti();
}

function celebrateBlackout() {
    const overlay = document.getElementById('bingo-overlay');
    const bingoText = overlay.querySelector('.bingo-text');
    const bingoSubtext = overlay.querySelector('.bingo-subtext');
    
    bingoText.textContent = '✨ BLACKOUT! ✨';
    bingoSubtext.textContent = 'You got everything! You\'re amazing! 🌟💖🌟';
    
    overlay.classList.add('active');
    createConfetti();
}

function closeBingoOverlay() {
    const overlay = document.getElementById('bingo-overlay');
    overlay.classList.remove('active');
}

function createConfetti() {
    const container = document.getElementById('confetti-container');
    const colors = ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#ffd700'];
    
    for (let i = 0; i < 100; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.animationDelay = Math.random() * 0.5 + 's';
            container.appendChild(confetti);
            
            setTimeout(() => confetti.remove(), 3000);
        }, i * 30);
    }
}

function resetCard() {
    if (!confirm('Reset this card? All marks will be cleared. 🔄')) return;
    
    markedCells.clear();
    hasBingo = false;
    hasBlackout = false;
    initializePlayGrid(currentCard);
}

function downloadCard() {
    const grid = document.getElementById('play-grid');
    const cardName = document.getElementById('play-card-name').textContent;
    
    if (typeof html2canvas === 'undefined') {
        alert('Screenshot feature is loading. Please try again in a moment! 💖');
        return;
    }
    
    html2canvas(grid, {
        backgroundColor: '#ffffff',
        scale: 2
    }).then(canvas => {
        const link = document.createElement('a');
        link.download = `${cardName.replace(/[^a-z0-9]/gi, '_')}_bingo.png`;
        link.href = canvas.toDataURL();
        link.click();
    }).catch(err => {
        console.error('Download error:', err);
        alert('Could not save image. Please try again! 💔');
    });
}

showMenuScreen();
