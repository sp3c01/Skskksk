let rows = 5;
let cols = 5;
let minesCount = 2;
let grid = [];
let balance = 0;
let gameOver = false;
let depositAmount = 0; // Armazenar o valor do depósito

function initGrid() {
    for (let i = 0; i < rows; i++) {
        grid[i] = [];
        for (let j = 0; j < cols; j++) {
            grid[i][j] = {
                hasMine: false,
                revealed: false,
                minesAround: 0
            };
        }
    }
}

function placeMines() {
    let placedMines = 0;
    while (placedMines < minesCount) {
        let row = Math.floor(Math.random() * rows);
        let col = Math.floor(Math.random() * cols);
        if (!grid[row][col].hasMine) {
            grid[row][col].hasMine = true;
            placedMines++;
            updateMinesAround(row, col);
        }
    }
}

function updateMinesAround(row, col) {
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            if (row + i >= 0 && row + i < rows && col + j >= 0 && col + j < cols) {
                grid[row + i][col + j].minesAround++;
            }
        }
    }
}

function renderGrid() {
    const gridElement = document.getElementById('grid');
    gridElement.innerHTML = '';
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.row = i;
            cell.dataset.col = j;
            cell.addEventListener('click', () => revealCell(i, j));
            gridElement.appendChild(cell);
        }
    }
}

function revealCell(row, col) {
    if (grid[row][col].revealed || gameOver) return;
    grid[row][col].revealed = true;
    const cell = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
    if (grid[row][col].hasMine) {
        cell.classList.add('mine', 'revealed');
        cell.innerText = 'X';
        balance = 0; // Resetar saldo
        updateBalance();
        gameOver = true;
        revealAllMines(); // Revelar todas as minas
        document.getElementById('loseMessage').innerText = 'Você perdeu! Seu saldo foi resetado para $0. Por favor, deposite novamente para jogar.';
    } else {
        cell.classList.add('safe', 'revealed');
        cell.innerText = grid[row][col].minesAround || '';
        balance -= 5; // Diminuir saldo
        updateBalance();
    }
}

function updateBalance() {
    document.getElementById('balance').innerText = (balance + depositAmount).toFixed(2); // Adicionar o valor do depósito ao saldo atual
}

function resetGame() {
    grid = [];
    gameOver = false;
    initGrid();
    placeMines();
    renderGrid();
    balance = 0; // Resetar o saldo
    depositAmount = 0; // Resetar o valor do depósito
    updateBalance();
    document.getElementById('loseMessage').innerText = '';
}

function revealAllMines() {
    grid.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
            if (cell.hasMine) {
                const mineCell = document.querySelector(`.cell[data-row="${rowIndex}"][data-col="${colIndex}"]`);
                mineCell.classList.add('mine', 'revealed');
                mineCell.innerText = 'X';
            }
        });
    });
}

function startGame() {
    if (balance + depositAmount < 5) { // Adicionar o valor do depósito ao saldo atual
        alert('Você precisa depositar no mínimo $5 para iniciar o jogo.');
        return;
    }
    resetGame();
}

function deposit() {
    let amount = prompt('Digite o valor do depósito:');
    amount = parseFloat(amount);
    if (isNaN(amount) || amount <= 0) {
        alert('Por favor, insira um valor válido.');
        return;
    }
    depositAmount = amount; // Armazenar o valor do depósito
    updateBalance(); // Atualizar o saldo exibido
    
    // Redirecionar para a página de pagamento com o valor do depósito
    window.location.href = `pagina_de_pagamento.html?amount=${depositAmount}`;
}

window.onload = function() {
    const params = new URLSearchParams(window.location.search);
    const depositAmount = parseFloat(params.get('depositAmount')) || 0;
    balance += depositAmount;
    updateBalance();
};

document.getElementById('startBtn').addEventListener('click', startGame);
document.getElementById('depositBtn').addEventListener('click', deposit);
