# 💰 Coinzy Backend Service – Exchange Rate Caching API

![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=flat&logo=express&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
![API](https://img.shields.io/badge/API-ExchangeRate--API-blue)

## 📖 About

This project is a **backend service** built using **Node.js** and **Express** that supports the Coinzy Currency Converter application.  
It implements a **file-based caching system** designed to reduce external API calls by storing exchange rates locally and refreshing them based on a TTL (time-to-live).

The server logic is designed to demonstrate:

- **File-based caching** using a local JSON file (`rates-cache.json`).
- **TTL-controlled cache refreshing** to minimize unnecessary API requests.
- Real-time currency rates fetched reliably from **ExchangeRate-API**.
- **CORS enabled** for frontend access.

This backend service is optimized for speed, efficiency, and cost-effective currency conversion.

---

## 🏷️ Features Overview

### ⚙️ Cache Management and API Integration

- **File-Based Cache:** Saves exchange rates to a local file to avoid frequent API calls.
- **Cache Expiration:** Cache refreshes only after the configured number of hours (`CACHE_DURATION_HOURS`).
- **External Data Source:** Fetches rates from ExchangeRate-API.
- **CORS Support:** Enables cross-origin requests from frontend clients.

---

### 📡 API Endpoints

| Method   | Endpoint      | Description                                                       |
| :------- | :------------ | :---------------------------------------------------------------- |
| **GET**  | `/api/rates`  | Returns cached or updated currency exchange rates with USD base. |

---

## 🔑 Configuration and Environment Variables

This project requires environment variables for security and proper operation.

1. Create a file named **`.env`** in the project root (this file **must** be in your `.gitignore`).
2. Add the following variables:

```env
# Your secret API key from ExchangeRate-API
EXCHANGE_API_KEY=YOUR_SECRET_API_KEY_HERE

# Cache duration in hours before refreshing from the API (default 24)
CACHE_DURATION_HOURS=24

# Port where the Express server will run (default 3000)
PORT=3000
```

---


## 🚀 Running the Server

To start the server in development mode, run:

```bash
npm run dev
```

---

## 📌 Example Response — `/api/rates`

```json
{
  "success": true,
  "source": "backend-coinzy",
  "data": {
    "timestamp": 1700000000000,
    "base": "USD",
    "rates": {
      "USD": 1,
      "EUR": 0.92,
      "GBP": 0.81,
      "CAD": 1.36,
      "..."
    }
  }
}
```