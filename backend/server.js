// External dependencies
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';

// NodeJS Internal dependencies
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// =================================================================
// 1. ENVIRONMENT CONFIGURATION
// =================================================================

// Load Environment Variables
dotenv.config();

// Define __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path where the CACHE file is stored
const CACHE_FILE_PATH = path.join(__dirname, '..', 'rates-cache.json');

// Read CACHE duration from environment variable
const CACHE_DURATION_HOURS = Number(process.env.CACHE_DURATION_HOURS) || 24;

const app = express();

// Server port configuration
const PORT = process.env.PORT || 3000;



// =================================================================
// 2. MIDDLEWARE
// =================================================================

// Enable Cross-Origin Resource Sharing (CORS)
app.use(cors());

app.use(express.json());



// =================================================================
// 3. API ROUTES (CACHE LOGIC)
// =================================================================

async function getRatesData() {
    const CACHE_LIFETIME_MS = CACHE_DURATION_HOURS * 60 * 60 * 1000;

    // Attempt to read the cache file
    try {
        const cacheContent = await fs.readFile(CACHE_FILE_PATH, 'utf-8');
        const cacheData = JSON.parse(cacheContent);
        
        // Check if the cache is expired
        const now = Date.now();
        if (now - cacheData.timestamp < CACHE_LIFETIME_MS) {
            return cacheData;
        } else {
            console.log('⚠️ Cache is Expired');
        }
    } catch (error) {
        
        if (error.code === 'ENOENT') {
            console.log('⚠️ Cache file not found');
        } else {
            console.log('⚠️ Error reading cache file:', error);
        }
    }

    
    // If cache is expired or missing, fetch new data from external API
    const API_URL = `https://v6.exchangerate-api.com/v6/${process.env.EXCHANGE_API_KEY}/latest/USD`;

    if (!process.env.EXCHANGE_API_KEY || process.env.EXCHANGE_API_KEY === "TU_CLAVE_AQUI") {
        throw new Error("Missing API Key in the .env file");
    }

    try {
        console.log('📡 CALLING API: Connecting to external server...');
        const response = await axios.get(API_URL);
        
        // Prepare data for caching
        const ratesData = {
            timestamp: Date.now(),
            base: response.data.base_code,
            rates: response.data.conversion_rates,
        };

        // Save data to the cache file
        await fs.writeFile(CACHE_FILE_PATH, JSON.stringify(ratesData, null, 2), 'utf-8');
        console.log('✅ Cache file updated successfully');

        return ratesData;
    } catch (apiError) {
        console.error('🔥 CRITIC ERROR: API Failed!', apiError.message);
        throw new Error('Couldnt get Change Rates from API.')
    }        
}

// =================================================================
// 4. ENDPOINT (API)
// =================================================================

app.get('/api/rates', async (req, res) => {
    try {
        // Fetch rates data (from cache or API)
        const data = await getRatesData();

        // Send successful response
        res.json({
            success: true,
            source: 'backend-coinzy',
            data: data,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
})

// =================================================================
// 5. TEST ROUTES
// =================================================================

// Simple route to check server status
app.get('/', (req, res) => {
    res.send('Server is running. Use /api/rates for data.');
});

// =================================================================
// 6. TURNING ON THE SERVER
// =================================================================

app.listen(PORT, () => {
    console.log(`\n🚀 SERVER READY on port: http://localhost:${PORT}`);
    console.log(`⭐️ Test the API here: http://localhost:${PORT}/api/rates\n`);
})