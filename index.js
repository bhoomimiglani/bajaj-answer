/**
 * Chitkara Qualifier 1 - REST APIs
 * POST /bfhl | GET /health
 * Replace OFFICIAL_EMAIL with your Chitkara email before submission.
 */

require("dotenv").config();
const express = require("express");
const app = express();

const OFFICIAL_EMAIL = process.env.OFFICIAL_EMAIL || "your.email@chitkara.edu.in";
const PORT = process.env.PORT || 3000;

// Middleware: parse JSON, size limit for security
app.use(express.json({ limit: "10kb" }));

// --- Helpers ---

function isPrime(n) {
  if (n < 2 || !Number.isInteger(n)) return false;
  for (let i = 2; i * i <= n; i++) if (n % i === 0) return false;
  return true;
}

function fibonacci(n) {
  if (n <= 0 || !Number.isInteger(n)) return [];
  if (n === 1) return [0];
  const out = [0, 1];
  for (let i = 2; i < n; i++) out.push(out[i - 1] + out[i - 2]);
  return out;
}

function gcd(a, b) {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) [a, b] = [b, a % b];
  return a;
}

function lcmOfTwo(a, b) {
  if (a === 0 || b === 0) return 0;
  return Math.abs(a * b) / gcd(a, b);
}

function lcm(arr) {
  if (!arr.length) return 0;
  let result = Math.abs(arr[0]);
  for (let i = 1; i < arr.length; i++) {
    result = lcmOfTwo(result, arr[i]);
  }
  return result;
}

function hcf(arr) {
  if (!arr.length) return 0;
  let result = Math.abs(arr[0]);
  for (let i = 1; i < arr.length; i++) {
    result = gcd(result, arr[i]);
  }
  return result;
}

async function getAiSingleWord(question) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY not set");
  }
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
  const body = {
    contents: [{ parts: [{ text: `Answer in exactly one word only. No punctuation. Question: ${question}` }] }],
    generationConfig: { maxOutputTokens: 10, temperature: 0 },
  };
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || `AI API error: ${res.status}`);
  }
  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error("No AI response");
  const word = String(text).trim().replace(/[.,!?;:]$/g, "");
  return word.split(/\s+/)[0] || word;
}

// --- GET /health ---

app.get("/health", (req, res) => {
  try {
    res.status(200).json({
      is_success: true,
      official_email: OFFICIAL_EMAIL,
    });
  } catch (err) {
    res.status(500).json({
      is_success: false,
      official_email: OFFICIAL_EMAIL,
    });
  }
});

// --- POST /bfhl ---

app.post("/bfhl", async (req, res) => {
  const keys = ["fibonacci", "prime", "lcm", "hcf", "AI"];
  const present = keys.filter((k) => req.body && req.body[k] !== undefined && req.body[k] !== null);

  if (present.length !== 1) {
    return res.status(400).json({
      is_success: false,
      official_email: OFFICIAL_EMAIL,
      error: "Exactly one of fibonacci, prime, lcm, hcf, AI must be present",
    });
  }

  const key = present[0];

  try {
    if (key === "fibonacci") {
      const n = req.body.fibonacci;
      if (typeof n !== "number" || !Number.isInteger(n) || n < 1 || n > 1000) {
        return res.status(400).json({
          is_success: false,
          official_email: OFFICIAL_EMAIL,
          error: "fibonacci must be an integer between 1 and 1000",
        });
      }
      return res.status(200).json({
        is_success: true,
        official_email: OFFICIAL_EMAIL,
        data: fibonacci(n),
      });
    }

    if (key === "prime") {
      const arr = req.body.prime;
      if (!Array.isArray(arr)) {
        return res.status(400).json({
          is_success: false,
          official_email: OFFICIAL_EMAIL,
          error: "prime must be an array of integers",
        });
      }
      const valid = arr.every((x) => Number.isInteger(x) && x >= 0 && x <= 1e9);
      if (!valid) {
        return res.status(400).json({
          is_success: false,
          official_email: OFFICIAL_EMAIL,
          error: "prime array must contain integers only (0 to 10^9)",
        });
      }
      const primes = arr.filter((x) => isPrime(x));
      return res.status(200).json({
        is_success: true,
        official_email: OFFICIAL_EMAIL,
        data: primes,
      });
    }

    if (key === "lcm") {
      const arr = req.body.lcm;
      if (!Array.isArray(arr) || arr.length === 0) {
        return res.status(400).json({
          is_success: false,
          official_email: OFFICIAL_EMAIL,
          error: "lcm must be a non-empty array of integers",
        });
      }
      const valid = arr.every((x) => Number.isInteger(x) && Math.abs(x) <= 1e9);
      if (!valid) {
        return res.status(400).json({
          is_success: false,
          official_email: OFFICIAL_EMAIL,
          error: "lcm array must contain integers only",
        });
      }
      return res.status(200).json({
        is_success: true,
        official_email: OFFICIAL_EMAIL,
        data: lcm(arr),
      });
    }

    if (key === "hcf") {
      const arr = req.body.hcf;
      if (!Array.isArray(arr) || arr.length === 0) {
        return res.status(400).json({
          is_success: false,
          official_email: OFFICIAL_EMAIL,
          error: "hcf must be a non-empty array of integers",
        });
      }
      const valid = arr.every((x) => Number.isInteger(x) && Math.abs(x) <= 1e9);
      if (!valid) {
        return res.status(400).json({
          is_success: false,
          official_email: OFFICIAL_EMAIL,
          error: "hcf array must contain integers only",
        });
      }
      return res.status(200).json({
        is_success: true,
        official_email: OFFICIAL_EMAIL,
        data: hcf(arr),
      });
    }

    if (key === "AI") {
      const q = req.body.AI;
      if (typeof q !== "string" || q.trim().length === 0) {
        return res.status(400).json({
          is_success: false,
          official_email: OFFICIAL_EMAIL,
          error: "AI must be a non-empty string (question)",
        });
      }
      if (q.length > 500) {
        return res.status(400).json({
          is_success: false,
          official_email: OFFICIAL_EMAIL,
          error: "Question too long",
        });
      }
      const singleWord = await getAiSingleWord(q.trim());
      return res.status(200).json({
        is_success: true,
        official_email: OFFICIAL_EMAIL,
        data: singleWord,
      });
    }

    return res.status(400).json({
      is_success: false,
      official_email: OFFICIAL_EMAIL,
      error: "Invalid key",
    });
  } catch (err) {
    if (err.message && err.message.includes("GEMINI_API_KEY")) {
      return res.status(503).json({
        is_success: false,
        official_email: OFFICIAL_EMAIL,
        error: "AI service not configured",
      });
    }
    return res.status(500).json({
      is_success: false,
      official_email: OFFICIAL_EMAIL,
      error: "Internal server error",
    });
  }
});

// 404
app.use((req, res) => {
  res.status(404).json({
    is_success: false,
    official_email: OFFICIAL_EMAIL,
    error: "Not found",
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
