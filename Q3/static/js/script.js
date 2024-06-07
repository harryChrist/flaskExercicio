function openModal() {
    document.getElementById('modal').style.display = 'block';
}

function closeModal() {
    document.getElementById('modal').style.display = 'none';
}

function openModal2(symbol) {
    document.getElementById('modal2').style.display = 'block';
}

function closeModal2() {
    document.getElementById('modal2').style.display = 'none';
}

function openModal3(symbol) {
    document.getElementById('modal3').style.display = 'block';
}

function closeModal3() {
    document.getElementById('modal3').style.display = 'none';
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

async function fetchWallet() {
    const response = await fetch('/wallets');
    const wallet = await response.json();
    return wallet;
}

async function fetchDollar() {
    const response = await fetch('/dollars');
    const dollars = await response.json();

    console.log(dollars)

    const balanceElement = document.getElementById('balanceAmount');
    balanceElement.innerText = `$${dollars.money}`
    return cryptos;
}

async function addDollar() {
    const response = await fetch('/addDolar', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            value: document.getElementById('dollarAmount').value
        })
    });

    if (response.ok) {
        alert('Crypto added successfully');
        reloadWallet();
        fetchDollar()
    } else {
        alert('Failed to add crypto');
    }
    const cryptos = await response.json();

    fetchDollar()
    return cryptos;
}

async function remDollar() {
    const response = await fetch('/remDolar', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            value: document.getElementById('dollarAmount2').value
        })
    });

    if (response.ok) {
        alert('Crypto added successfully');
        reloadWallet();
        fetchDollar()
    } else {
        alert('Failed to add crypto');
    }
    const cryptos = await response.json();

    fetchDollar()
    return cryptos;
}

async function transferirCrypto() {
    const selectTransfer = document.getElementById('selectTransfer');
    const selectTransfer2 = document.getElementById('selectTransfer2');
    const transferirAmount = document.getElementById('transferirAmount');
    
    const selectedOption = selectTransfer.options[selectTransfer.selectedIndex];
    const selectedOption2 = selectTransfer2.options[selectTransfer2.selectedIndex];
   
    const symbol = selectedOption.dataset.symbol;
    const symbol2 = selectedOption2.dataset.symbol;
    const amount = transferirAmount.value;


    if (!symbol || !symbol2 || !amount) {
        alert('Por favor, preencha todos os campos');
        return;
    }
    const amountNumber = parseFloat(amount);
    if (isNaN(amountNumber)) return alert(console.error("O valor não é um número válido."))
        
    const response = await fetch('/transferirCrypto', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            symbol,
            symbol2,
            amount:amountNumber
        })
    });
    if (response.ok) {
        alert('Crypto transferido com sucesso');
        reloadWallet();
        fetchDollar();
    } else {
        // Mensagem de erro
        console.log(response.json())
        alert('Falha ao transferir crypto');
    }
}

async function reloadWallet() {
    const response = await fetch('/wallets');
    const wallet = await response.json();

    fetchDollar();
    updateTranfers();

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
        button.textContent = 'Transferir';
        button.addEventListener('click', () => {
            openModal2(crypto.symbol);
        });

        const button2 = document.createElement('button');
        button2.classList.add('button')
        button2.textContent = 'Retirar';
        button2.addEventListener('click', () => {
            openModal3(crypto.symbol);
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
        headingDiv.appendChild(button2);
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
        fetchDollar()
        updateTranfers();
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

async function updateTranfers() {
    const cryptos = await fetchWallet();
    const cryptoSelect = document.getElementById('selectTransfer');
    cryptoSelect.innerHTML = '<option value="dollar" data-symbol="dollar">Dollar</option>';
    const cryptoSelect2 = document.getElementById('selectTransfer2');
    cryptoSelect2.innerHTML = '<option value="dollar" data-symbol="dollar">Dollar</option>';
    cryptos.forEach(crypto => {
        const option = document.createElement('option');
        option.textContent = crypto.name;
        option.id = crypto.symbol;
        option.dataset.symbol = crypto.symbol;
        cryptoSelect.appendChild(option);
    });

    cryptos.forEach(crypto => {
        const option = document.createElement('option');
        option.textContent = crypto.name;
        option.id = crypto.symbol;
        option.dataset.symbol = crypto.symbol;
        cryptoSelect2.appendChild(option);
    });
}

// Atualizar o select de criptomoedas conforme o usuário digita
const searchInput = document.getElementById('searchInput');
searchInput.addEventListener('input', updateCryptoSelect);