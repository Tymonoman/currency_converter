const apiKey = "8c863104fc53446aa859a1b06dccf539";
const baseCurrency = 'USD';
const targetCurrencies = ['EUR', 'PLN', 'GBP', 'BTC', 'XMR', 'XRP'];

const fiatApiUrl = `https://open.er-api.com/v6/latest/${baseCurrency}?apikey=${apiKey}`;
const cryptoApiUrl = 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,monero,ripple&vs_currencies=usd,eur,pln,gbp';

let cachedRates = null;

async function fetchExchangeRates() {
    try {
        const [fiatResponse, cryptoResponse] = await Promise.all([
            fetch(fiatApiUrl),
            fetch(cryptoApiUrl)
        ]);

        const fiatData = await fiatResponse.json();
        const cryptoData = await cryptoResponse.json();

        if (fiatResponse.ok && cryptoResponse.ok) {
            cachedRates = {
                ...fiatData.rates,
                BTC: cryptoData.bitcoin,
                XMR: cryptoData.monero,
                XRP: cryptoData.ripple
            };
        } else {
            console.error(`Error: ${fiatData.error || cryptoData.error}`);
        }
    } catch (error) {
        console.error('An error occurred:', error);
    }
}

function updateCurrencies(amount, baseCurrency) {
    if (!cachedRates) {
        console.error('Exchange rates not available');
        return;
    }

    const usdInput = document.getElementById('usd');
    const eurInput = document.getElementById('eur');
    const plnInput = document.getElementById('pln');
    const gbpInput = document.getElementById('gbp');
    const btcInput = document.getElementById('btc');
    const xmrInput = document.getElementById('xmr');
    const xrpInput = document.getElementById('xrp');

    const usdRate = cachedRates['USD'];
    const eurRate = cachedRates['EUR'];
    const plnRate = cachedRates['PLN'];
    const gbpRate = cachedRates['GBP'];
    const btcRates = cachedRates['BTC'];
    const xmrRates = cachedRates['XMR'];
    const xrpRates = cachedRates['XRP'];

    let usdValue, eurValue, plnValue, gbpValue, btcValue, xmrValue, xrpValue;

    switch (baseCurrency) {
        case 'USD':
            usdValue = amount;
            eurValue = amount * (eurRate / usdRate);
            plnValue = amount * (plnRate / usdRate);
            gbpValue = amount * (gbpRate / usdRate);
            btcValue = amount / btcRates.usd;
            xmrValue = amount / xmrRates.usd;
            xrpValue = amount / xrpRates.usd;
            break;
        case 'EUR':
            usdValue = amount * (usdRate / eurRate);
            eurValue = amount;
            plnValue = amount * (plnRate / eurRate);
            gbpValue = amount * (gbpRate / eurRate);
            btcValue = (amount * (usdRate / eurRate)) / btcRates.usd;
            xmrValue = (amount * (usdRate / eurRate)) / xmrRates.usd;
            xrpValue = (amount * (usdRate / eurRate)) / xrpRates.usd;
            break;
        case 'PLN':
            usdValue = amount * (usdRate / plnRate);
            eurValue = amount * (eurRate / plnRate);
            plnValue = amount;
            gbpValue = amount * (gbpRate / plnRate);
            btcValue = (amount * (usdRate / plnRate)) / btcRates.usd;
            xmrValue = (amount * (usdRate / plnRate)) / xmrRates.usd;
            xrpValue = (amount * (usdRate / plnRate)) / xrpRates.usd;
            break;
        case 'GBP':
            usdValue = amount * (usdRate / gbpRate);
            eurValue = amount * (eurRate / gbpRate);
            plnValue = amount * (plnRate / gbpRate);
            gbpValue = amount;
            btcValue = (amount * (usdRate / gbpRate)) / btcRates.usd;
            xmrValue = (amount * (usdRate / gbpRate)) / xmrRates.usd;
            xrpValue = (amount * (usdRate / gbpRate)) / xrpRates.usd;
            break;
        case 'BTC':
            usdValue = amount * btcRates.usd;
            eurValue = (amount * btcRates.eur);
            plnValue = (amount * btcRates.pln);
            gbpValue = (amount * btcRates.gbp);
            btcValue = amount;
            xmrValue = (amount * btcRates.usd) / xmrRates.usd;
            xrpValue = (amount * btcRates.usd) / xrpRates.usd;
            break;
        case 'XMR':
            usdValue = amount * xmrRates.usd;
            eurValue = (amount * xmrRates.eur);
            plnValue = (amount * xmrRates.pln);
            gbpValue = (amount * xmrRates.gbp);
            btcValue = (amount * xmrRates.usd) / btcRates.usd;
            xmrValue = amount;
            xrpValue = (amount * xmrRates.usd) / xrpRates.usd;
            break;
        case 'XRP':
            usdValue = amount * xrpRates.usd;
            eurValue = (amount * xrpRates.eur);
            plnValue = (amount * xrpRates.pln);
            gbpValue = (amount * xrpRates.gbp);
            btcValue = (amount * xrpRates.usd) / btcRates.usd;
            xmrValue = (amount * xrpRates.usd) / xmrRates.usd;
            xrpValue = amount;
            break;
        default:
            break;
    }

    if (document.activeElement !== usdInput) {
        usdInput.value = usdValue.toFixed(2);
    }
    if (document.activeElement !== eurInput) {
        eurInput.value = eurValue.toFixed(2);
    }
    if (document.activeElement !== plnInput) {
        plnInput.value = plnValue.toFixed(2);
    }
    if (document.activeElement !== gbpInput) {
        gbpInput.value = gbpValue.toFixed(2);
    }
    if (document.activeElement !== btcInput) {
        btcInput.value = btcValue.toFixed(8);
    }
    if (document.activeElement !== xmrInput) {
        xmrInput.value = xmrValue.toFixed(8);
    }
    if (document.activeElement !== xrpInput) {
        xrpInput.value = xrpValue.toFixed(8);
    }
}

// Event listener for all input fields using input
document.getElementById('usd').addEventListener('input', function (event) {
    const amount = parseFloat(event.target.value);
    if (!isNaN(amount)) {
        updateCurrencies(amount, 'USD');
    }
});

document.getElementById('eur').addEventListener('input', function (event) {
    const amount = parseFloat(event.target.value);
    if (!isNaN(amount)) {
        updateCurrencies(amount, 'EUR');
    }
});

document.getElementById('pln').addEventListener('input', function (event) {
    const amount = parseFloat(event.target.value);
    if (!isNaN(amount)) {
        updateCurrencies(amount, 'PLN');
    }
});

document.getElementById('gbp').addEventListener('input', function (event) {
    const amount = parseFloat(event.target.value);
    if (!isNaN(amount)) {
        updateCurrencies(amount, 'GBP');
    }
});

document.getElementById('btc').addEventListener('input', function (event) {
    const amount = parseFloat(event.target.value);
    if (!isNaN(amount)) {
        updateCurrencies(amount, 'BTC');
    }
});

document.getElementById('xmr').addEventListener('input', function (event) {
    const amount = parseFloat(event.target.value);
    if (!isNaN(amount)) {
        updateCurrencies(amount, 'XMR');
    }
});

document.getElementById('xrp').addEventListener('input', function (event) {
    const amount = parseFloat(event.target.value);
    if (!isNaN(amount)) {
        updateCurrencies(amount, 'XRP');
    }
});

// Fetch exchange rates and update currencies when the page loads
fetchExchangeRates().then(() => {
    updateCurrencies(1, 'USD'); // You can change the initial amount if needed
});