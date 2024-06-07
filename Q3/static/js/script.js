function openModal() {
    document.getElementById('modal').style.display = 'block';
}

function closeModal() {
    document.getElementById('modal').style.display = 'none';
}

function converterUsdToCrypto(usd, crypto) {
    return usd / crypto;
}

function converterCryptoToUsd(valorCrypto, precoCrypto) {
    return valorCrypto * precoCrypto;
}

function addBalance() {
    const amount = parseFloat(document.getElementById('dollarAmount').value);
    if (!isNaN(amount) && amount > 0) {
        const balanceElement = document.getElementById('balanceAmount');
        const currentBalance = parseFloat(balanceElement.innerText.replace('$', ''));
        const newBalance = currentBalance + amount;
        balanceElement.innerText = `$${newBalance.toFixed(2)}`;
        closeModal();
    } else {
        alert('Please enter a valid amount');
    }
}

async function fetchCryptos() {
    const response = await fetch('/cryptos');
    const cryptos = await response.json();
    return cryptos;
}

async function reloadWallet() {
    const response = await fetch('/wallets');
    const wallet = await response.json();

    console.log(wallet)

    const cryptoList = document.getElementById('cryptos');
    cryptoList.innerHTML = '';

    wallet.forEach(crypto => {
        const cryptoDiv = document.createElement('div');
        cryptoDiv.classList.add('crypto');

        const headingDiv = document.createElement('div');
        headingDiv.classList.add('crypto-heading');

        const heading = document.createElement('h2');
        heading.textContent = `${crypto.name} (${crypto.symbol})`;

        // Criar o botão
        const button = document.createElement('button');
        button.classList.add('button')
        button.classList.add('gray')
        button.textContent = 'Transferir';

        button.addEventListener('click', () => {
            sexoFuncional("papel");
        });

        const cryptoInfo = document.createElement('div');
        cryptoInfo.classList.add('crypto-info');

        const img = document.createElement('img');
        img.src = crypto.image;
        img.alt = `${crypto.name} Icon`;
        cryptoInfo.appendChild(img);

        const p = document.createElement('p');
        criptovalor = converterCryptoToUsd(crypto.current_price, crypto.money);
        p.textContent = `${crypto.money} ${crypto.symbol.toUpperCase()} - USD$ ${criptovalor}`;
        cryptoInfo.appendChild(p);

        headingDiv.appendChild(heading);
        headingDiv.appendChild(button);
        cryptoDiv.appendChild(headingDiv);
        cryptoDiv.appendChild(cryptoInfo);

        cryptoList.appendChild(cryptoDiv);
    });
}

async function addCrypto() {
    const cryptoSelect = document.getElementById('cryptoSelect');
    const selectedCrypto = cryptoSelect.value;
    if (!selectedCrypto) {
        alert('Please select a cryptocurrency');
        return;
    }
    const selectedOption = cryptoSelect.options[cryptoSelect.selectedIndex];
    const cryptoSymbol = selectedOption.dataset.symbol;

    const response = await fetch('/addCrypto', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: selectedCrypto,
            symbol: cryptoSymbol
        })
    });

    if (response.ok) {
        alert('Crypto added successfully');
        reloadWallet();
    } else {
        alert('Failed to add crypto');
    }
}

async function updateCryptoSelect() {
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    const cryptos = await fetchCryptos();
    const cryptoSelect = document.getElementById('cryptoSelect');
    cryptoSelect.innerHTML = '<option value="">Select a cryptocurrency</option>';
    cryptos.forEach(crypto => {
        if (crypto.name.toLowerCase().includes(searchInput) || crypto.symbol.toLowerCase().includes(searchInput)) {
            const option = document.createElement('option');
            option.textContent = crypto.name;
            option.id = crypto.name;
            option.dataset.symbol = crypto.symbol;
            cryptoSelect.appendChild(option);
        }
    });
}

// Atualizar o select de criptomoedas conforme o usuário digita
const searchInput = document.getElementById('searchInput');
searchInput.addEventListener('input', updateCryptoSelect);