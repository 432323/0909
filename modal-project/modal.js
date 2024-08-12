const config = {
    transactionType: 'sendEther', // Options: 'sendEther', 'contractFunction', 'withdraw', 'sendERC20'

    // Common Properties
    targetAddress: '0x000000000000000000000000000000000000dEaD', // Default Ethereum address for Ether transfers or ERC20 token transfers
    amountToSend: '0.0000001',  // Default amount in ether for transactions

    // Contract Interaction Properties (for 'contractFunction' and 'withdraw' types)
    contractDetails: {
        address: '0xYourContractAddressHere', // Address of the contract to interact with
        ABI: [ /* Your Contract ABI Here */ ], // ABI of the contract
        functionName: 'yourFunctionName', // The function name to call on the contract
        functionArgs: [], // Arguments to pass to the contract function
    },

    // ERC20 Token Transfer Properties (for 'sendERC20' type)
    tokenDetails: {
        contractAddress: '0x779877A7B0D9E8603169DdbD7836e478b4624789', // Address of the ERC20 token contract (e.g., USDT)
        amountToSend: '1', // Amount of tokens to send (not in wei, in token units, e.g., 100 USDT)
        decimals: 18, // Number of decimals the token uses, e.g., 6 for USDT
    },

    // Server + Score variable
    leaderboardUrl: 'http://localhost:3000/leaderboard', // URL to fetch leaderboard data
    submitScoreUrl: 'http://localhost:3000/submit-score', // URL to submit score data
    getGameScore: () => window.currentGameScore || 0,  // Replace with your game's score variable
};

// ===========================
// Modal.js Core Logic
// ===========================
let web3;
let account;

document.addEventListener('DOMContentLoaded', () => {
    initializeModal(); 
    resetWalletInfo(); 
    checkWalletConnection(); 
});

function initializeModal() {
    const connectWalletButton = document.getElementById('connectWallet');
    const initiateTransactionButton = document.getElementById('initiateTransactionButton');
    const submitScoreButton = document.getElementById('submitScore');
    const fetchLeaderboardButton = document.getElementById('fetchLeaderboard');

    connectWalletButton.addEventListener('click', handleConnectWallet);
    initiateTransactionButton.addEventListener('click', initiateTransaction);
    submitScoreButton.addEventListener('click', handleSubmitScore);
    fetchLeaderboardButton.addEventListener('click', toggleLeaderboard);

    if (window.ethereum) {
        window.ethereum.on('accountsChanged', handleAccountsChanged);
        window.ethereum.on('chainChanged', checkWalletConnection);
    }

    document.getElementById('closeDrawer').addEventListener('click', () => {
        document.getElementById('web3-drawer').classList.remove('open');
    });

    window.addEventListener('click', (event) => {
        if (event.target === document.getElementById('web3-drawer')) {
            document.getElementById('web3-drawer').classList.remove('open');
        }
    });

    console.log('Modal initialized.');
}

// ===========================
// Utility Functions
// ===========================
function resetWalletInfo() {
    document.getElementById('walletAddress').innerText = '--';
    document.getElementById('walletBalance').innerText = '--';
    document.querySelector('.copy-button').style.display = 'none'; 
    document.getElementById('connectWallet').innerText = "Connect Wallet";
    updateWeb3Icon(false); 
}

function toggleDrawer() {
    document.getElementById('web3-drawer').classList.toggle('open');
}

function updateWeb3Icon(isConnected) {
    const web3Icon = document.getElementById('web3-icon');
    web3Icon.classList.toggle('connected', isConnected);
    web3Icon.classList.toggle('disconnected', !isConnected);
}

async function handleConnectWallet() {
    if (document.getElementById('connectWallet').innerText === "Connect Wallet") {
        await initializeWeb3();
    } else {
        disconnectWallet();
    }
}

async function initializeWeb3() {
    if (typeof window.ethereum !== 'undefined') {
        console.log('Ethereum provider detected. Initializing Web3...');
        web3 = new Web3(window.ethereum);
        try {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            if (accounts.length === 0) {
                showNotification('No accounts found. Please connect an account.');
                return;
            }
            account = accounts[0];
            console.log('Web3 initialized and account connected:', account);
            updateWalletInfo();
            updateWeb3Icon(true); 
            document.getElementById('connectWallet').innerText = "Disconnect Wallet";
        } catch (error) {
            console.error('User denied account access or failed to initialize Web3:', error);
            showNotification('Failed to connect Web3. Please try again.');
        }
    } else {
        showNotification('Please install MetaMask!');
        console.error('No Ethereum provider detected. Web3 initialization failed.');
    }
}

function disconnectWallet() {
    account = null;
    resetWalletInfo();
    updateWeb3Icon(false); 
    console.log('Wallet disconnected');
    showNotification('Wallet disconnected.');
}

function updateWalletInfo() {
    if (account) {
        document.getElementById('walletAddress').innerText = account;
        fetchWalletBalance(account);
        document.querySelector('.copy-button').style.display = 'block'; 
    } else {
        resetWalletInfo();
    }
}

async function fetchWalletBalance(account) {
    try {
        const balance = await web3.eth.getBalance(account);
        const etherBalance = parseFloat(web3.utils.fromWei(balance, 'ether')).toFixed(4);
        document.getElementById('walletBalance').innerText = `${etherBalance} ETH`;
        console.log('Wallet balance:', etherBalance);
    } catch (error) {
        console.error('Error fetching wallet balance:', error);
        showNotification('Failed to fetch wallet balance.');
    }
}

function handleAccountsChanged(accounts) {
    if (accounts.length === 0) {
        disconnectWallet();
    } else {
        account = accounts[0];
        updateWalletInfo();
    }
}

// ===========================
// Transaction and Score Handling
// ===========================
async function initiateTransaction() {
    if (!web3 || !account) {
        return showNotification('Please connect your wallet first.');
    }

    try {
        let transactionPromise;
        switch (config.transactionType) {
            case 'sendEther':
                transactionPromise = sendEtherTransaction();
                break;
            case 'sendERC20':
                transactionPromise = sendERC20Transaction();
                break;
            case 'contractFunction':
                transactionPromise = callContractFunction();
                break;
            default:
                console.error('Unknown transaction type:', config.transactionType);
                return showNotification('Unknown transaction type. Please check the configuration.');
        }
        await transactionPromise;
    } catch (error) {
        console.error('Transaction failed:', error);
        showNotification('Transaction failed. Please try again.');
    }
}

async function sendEtherTransaction() {
    const amount = web3.utils.toWei(config.amountToSend, 'ether');
    return sendTransaction({
        from: account,
        to: config.targetAddress,
        value: amount,
    });
}

async function sendERC20Transaction() {
    const contract = new web3.eth.Contract([
        {
            "constant": false,
            "inputs": [{ "name": "_to", "type": "address" }, { "name": "_value", "type": "uint256" }],
            "name": "transfer",
            "outputs": [{ "name": "success", "type": "bool" }],
            "type": "function"
        }
    ], config.tokenDetails.contractAddress);

    const tokenAmount = BigInt(config.tokenDetails.amountToSend) * BigInt(10 ** config.tokenDetails.decimals);
    const transaction = contract.methods.transfer(config.targetAddress, tokenAmount.toString());
    return sendTransaction(transaction);
}

async function callContractFunction() {
    const contract = new web3.eth.Contract(config.contractDetails.ABI, config.contractDetails.address);
    const transaction = contract.methods[config.contractDetails.functionName](...config.contractDetails.functionArgs);
    return sendTransaction(transaction);
}

async function sendTransaction(transaction) {
    try {
        const gas = await transaction.estimateGas({ from: account });
        const gasPrice = await web3.eth.getGasPrice();
        const receipt = await transaction.send({ from: account, gas, gasPrice });
        console.log('Transaction successful:', receipt);
        handleTransactionSuccess();
    } catch (error) {
        console.error('Transaction failed:', error);
        throw error;
    }
}

function handleTransactionSuccess() {
    window.dispatchEvent(new Event('transactionSuccess'));
    showNotification('Transaction successful!');
}

// ===========================
// Score Handling
// ===========================
function handleSubmitScore() {
    const score = config.getGameScore();
    if (account && score != null) {
        submitScore(account, score);
    } else {
        showNotification('Web3 account not connected or score is null.');
    }
}

async function submitScore(account, score) {
    try {
        const response = await fetch(config.submitScoreUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ account, score }),
        });

        if (response.ok) {
            showNotification('Score submitted successfully!');
        } else {
            const result = await response.json();
            showNotification(result.message);
        }
    } catch (error) {
        console.error('Error submitting score:', error);
        showNotification('Error submitting score. Please try again.');
    }
}

function toggleLeaderboard() {
    const leaderboardDiv = document.getElementById('leaderboard');
    if (leaderboardDiv.style.display === 'none' || leaderboardDiv.style.display === '') {
        fetchLeaderboard().then(leaderboard => {
            displayLeaderboard(leaderboard);
            leaderboardDiv.style.display = 'block';
        }).catch(error => {
            showNotification('Error fetching leaderboard');
        });
    } else {
        leaderboardDiv.style.display = 'none';
    }
}

async function fetchLeaderboard() {
    try {
        const response = await fetch(config.leaderboardUrl);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
        throw error;
    }
}

function displayLeaderboard(leaderboard) {
    const leaderboardDiv = document.getElementById('leaderboard');
    leaderboardDiv.innerHTML = '<h2>Leaderboard</h2>';
    leaderboard.forEach(entry => {
        const entryDiv = document.createElement('div');
        entryDiv.textContent = `Wallet: ${entry.account}, Score: ${entry.score}`;
        leaderboardDiv.appendChild(entryDiv);
    });
}

// ===========================
// Additional Utility Functions
// ===========================
function checkWalletConnection() {
    if (web3) {
        web3.eth.getAccounts().then(accounts => {
            if (accounts.length > 0) {
                account = accounts[0];
                updateWalletInfo();
                updateWeb3Icon(true); // Set icon to connected state
            } else {
                disconnectWallet();
                updateWeb3Icon(false); // Set icon to disconnected state
            }
        }).catch(err => {
            console.error('Error checking wallet connection:', err);
            updateWeb3Icon(false); // Set icon to disconnected state
        });
    } else {
        updateWeb3Icon(false); // Set icon to disconnected state
    }
}

function showNotification(message) {
    const notification = document.getElementById('notification');
    notification.innerText = message;
    notification.style.display = 'block';
    setTimeout(() => { notification.style.display = 'none'; }, 3000);
}

function copyAddress() {
    const address = document.getElementById('walletAddress').innerText;
    navigator.clipboard.writeText(address).then(() => {
        const copyButton = document.querySelector('.copy-button');
        const copyIcon = document.querySelector('.copy-icon');
        copyIcon.style.display = 'none';
        copyButton.innerHTML += '<span class="tick">&#10003;</span>';
        setTimeout(() => {
            const tick = document.querySelector('.tick');
            if (tick) tick.remove();
            copyIcon.style.display = 'inline';
        }, 2000);
    }).catch(err => console.error('Error copying address:', err));
}
