# Chitkara Qualifier 1 – BFHL APIs

REST APIs for Qualifier 1: **POST /bfhl** and **GET /health**.

## Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Environment (optional)**
   - Copy `.env.example` to `.env`
   - Set `OFFICIAL_EMAIL` to your Chitkara email
   - Set `GEMINI_API_KEY` for AI questions (free key: https://aistudio.google.com → Get API Key)

3. **Run**
   ```bash
   npm start
   ```
   Server runs at `http://localhost:3000` (or `PORT` from env).

## API Reference

### GET /health

Returns service health.

**Response (200):**
```json
{
  "is_success": true,
  "official_email": "YOUR CHITKARA EMAIL"
}
```

---

### POST /bfhl

Body must contain **exactly one** of: `fibonacci`, `prime`, `lcm`, `hcf`, `AI`.

| Key         | Input           | Output                    |
|------------|-----------------|---------------------------|
| fibonacci  | Integer         | Fibonacci series array    |
| prime      | Integer array   | Array of primes from it   |
| lcm        | Integer array   | LCM (number)              |
| hcf        | Integer array   | HCF/GCD (number)          |
| AI         | Question string | Single-word AI answer     |

**Success response (200):**
```json
{
  "is_success": true,
  "official_email": "YOUR CHITKARA EMAIL",
  "data": ...
}
```

**Error response (4xx/5xx):**
```json
{
  "is_success": false,
  "official_email": "YOUR CHITKARA EMAIL",
  "error": "message"
}
```

**Example requests:**

```bash
# Fibonacci
curl -X POST http://localhost:3000/bfhl -H "Content-Type: application/json" -d "{\"fibonacci\": 7}"

# Prime filter
curl -X POST http://localhost:3000/bfhl -H "Content-Type: application/json" -d "{\"prime\": [2,4,7,9,11]}"

# LCM
curl -X POST http://localhost:3000/bfhl -H "Content-Type: application/json" -d "{\"lcm\": [12,18,24]}"

# HCF
curl -X POST http://localhost:3000/bfhl -H "Content-Type: application/json" -d "{\"hcf\": [24,36,60]}"

# AI (needs GEMINI_API_KEY)
curl -X POST http://localhost:3000/bfhl -H "Content-Type: application/json" -d "{\"AI\": \"What is the capital city of Maharashtra?\"}"
```

## Deployment

- **Railway:** New Project → Deploy from GitHub → Select repo → Add env vars (`OFFICIAL_EMAIL`, `GEMINI_API_KEY`) → Deploy.
- **Render:** New Web Service → Connect repo → Build: `npm install` → Start: `npm start` → Add env vars → Deploy.
- **Vercel:** Use “Node.js” runtime; set Build: `npm install`, Start: `npm start`. Or use a serverless adapter for Express.
- **ngrok (local):** `ngrok http 3000` (server must be running locally).

## Tech Stack

- Node.js, Express
- Google Gemini API for `AI` key (optional; other AI APIs can be wired similarly)
