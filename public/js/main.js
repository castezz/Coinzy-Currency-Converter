/* =========================================
 * 1. HAMBURGER MENU & OVERLAY LOGIC
 * ========================================= */

const menuBtn = document.querySelector('.mobile-menu');
const menuIcon = document.querySelector('.mobile-menu i');
const overlay = document.querySelector('#mobile-overlay');

function toggleMenu() {
    const isClosed = !overlay.classList.contains('open');

    overlay.classList.toggle('open');
    document.body.classList.toggle('no-scroll');

    if (isClosed) {
        menuIcon.classList.remove('fa-bars');
        menuIcon.classList.add('fa-xmark');
        menuBtn.classList.add('rotate');
    } else {
        menuIcon.classList.remove('fa-xmark');
        menuIcon.classList.add('fa-bars');
        menuBtn.classList.remove('rotate');
    }
}

if (menuBtn) {
    menuBtn.addEventListener('click', (e) => {
        e.preventDefault();
        toggleMenu();
    });
}

if (overlay) {
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            toggleMenu();
        }
    });
}

/* =========================================
 * 2. CURRENCY CONVERTER SETUP
 * ========================================= */

const API_URL = 'https://coinzy-currency-converter.onrender.com/api/rates';

let conversionRates = {};
let baseCode = '';

const amountInput = document.querySelector('#amount');
const fromSelect = document.querySelector('#from');
const toSelect = document.querySelector('#to');
const resultOutput = document.querySelector('#result-amount');
const resultCurrency = document.querySelector('#result-currency');
const convertBtn = document.querySelector('#convert');
const submitBtn = document.querySelector('#submit-button');

const leftValue = document.querySelector('#left-value');
const leftCurrency = document.querySelector('#left-currency');
const rightValue = document.querySelector('#right-value');
const rightCurrency = document.querySelector('#right-currency');


/* =========================================
 * 3. POPULAR CURRENCY RATES SELECTORS
 * ========================================= */
const usdToEurEl = document.querySelector('#usd-to-eur-result .exchange-rate-value');
const audToCadEl = document.querySelector('#aud-to-cad-result .exchange-rate-value');
const mxnToCadEl = document.querySelector('#mxn-to-cad-result .exchange-rate-value');
const cadToCopEl = document.querySelector('#cad-to-cop-result .exchange-rate-value');


/* =========================================
 * 4. MAIN FUNCTIONS
 * ========================================= */

async function init() {
    try {
        console.log("Loading rates from the Backend...")

        const response = await fetch(API_URL);
        const data = await response.json();

        if (!data.success) {
            throw new Error("API request failed: success property is false.");
        }

        conversionRates = data.data.rates;
        baseCode = data.data.base;

        console.log(`✅ Data loaded successfully. Base: ${baseCode}, Total Currencies: ${Object.keys(conversionRates).length}`);

        populateSelectors();
        fromSelect.value = 'USD';
        toSelect.value = 'EUR';
        amountInput.value = 1;

        convertCurrency();
        updatePopularRates();

    } catch (error) {
        console.error('Error Initializing:', error);
        alert('There was an issue connecting to the server. Make sure the Backend is Running (npm run dev)')
    }
}

function populateSelectors() {
    const currencyCodes = Object.keys(conversionRates);

    fromSelect.innerHTML = '';
    toSelect.innerHTML = '';

    currencyCodes.forEach((code) => {
        const optionFrom = document.createElement('option');
        optionFrom.value = code;
        optionFrom.textContent = code;
        fromSelect.appendChild(optionFrom);

        const optionTo = document.createElement('option');
        optionTo.value = code;
        optionTo.textContent = code;
        toSelect.appendChild(optionTo);
    });
}

function convertCurrency() {

    const amount = parseFloat(amountInput.value) || 1;
    const from = fromSelect.value;
    const to = toSelect.value;

    const rateFrom = conversionRates[from];
    const rateTo = conversionRates[to];

    const result = (amount / rateFrom) * rateTo;

    resultOutput.textContent = result.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    resultCurrency.textContent = to;

    updateEquivalence(from, to, rateFrom, rateTo);
}

function updateEquivalence(from, to, rateFrom, rateTo) {

    const oneUnitResult = (1 / rateFrom) * rateTo;

    leftValue.textContent = "1";
    leftCurrency.textContent = from;

    rightValue.textContent = oneUnitResult.toLocaleString('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 4 });
    rightCurrency.textContent = to;

}

function updatePopularRates() {

    if (!conversionRates || Object.keys(conversionRates).length === 0) return;

    const formatRate = (rate) => rate.toLocaleString('en-US', { maximumFractionDigits: 2 });
    const getCrossRate = (codeA, codeB) => (1 / conversionRates[codeA]) * conversionRates[codeB];

    // 1. USD TO EUR
    if (usdToEurEl && conversionRates['EUR']) {
        const rate = conversionRates['EUR'];
        usdToEurEl.textContent = formatRate(rate);
    }

    // 2. AUD TO CAD
    if (audToCadEl && conversionRates['AUD'] && conversionRates['CAD']) {
        const result = getCrossRate('AUD', 'CAD');
        audToCadEl.textContent = formatRate(result);
    }

    // 3. MXN TO CAD
    if (mxnToCadEl && conversionRates['MXN'] && conversionRates['CAD']) {
        const result = getCrossRate('MXN', 'CAD');
        mxnToCadEl.textContent = formatRate(result);
    }

    // 4. CAD TO COP
    if (cadToCopEl && conversionRates['CAD'] && conversionRates['COP']) {
        const result = getCrossRate('CAD', 'COP');
        cadToCopEl.textContent = formatRate(result);
    }
}

/* ==========================================
 * 5. EVENT LISTENERS
 * ========================================== */

submitBtn.addEventListener('click', (e) => {
    e.preventDefault();
    convertCurrency();
});

convertBtn.addEventListener('click', () => {

    const temp = fromSelect.value;

    fromSelect.value = toSelect.value;
    toSelect.value = temp;

    convertCurrency();
});

/* ==========================================
 * 6. EXECUTION
 * ========================================== */
init();