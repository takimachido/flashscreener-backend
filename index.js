import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());

// ===============================================
// Função fetch segura (evita crash se Gecko cair)
// ===============================================
async function safeFetch(url) {
  try {
    const r = await fetch(url, {
      headers: {
        "accept": "application/json"
      }
    });
    return await r.json();
  } catch (e) {
    return { error: true, details: e.toString() };
  }
}

// ===============================================
// GET /api/token/:ca → Informações do token
// ===============================================
app.get("/api/token/:ca", async (req, res) => {
  const ca = req.params.ca;

  const data = await safeFetch(
    `https://api.geckoterminal.com/api/v3/networks/solana/tokens/${ca}`
  );

  res.json(data);
});

// ===============================================
// GET /api/pools/:ca → Pools do token
// ===============================================
app.get("/api/pools/:ca", async (req, res) => {
  const ca = req.params.ca;

  const data = await safeFetch(
    `https://api.geckoterminal.com/api/v3/networks/solana/tokens/${ca}/pools`
  );

  res.json(data);
});

// ===============================================
// GET /api/search → busca por nome, ticker, CA
// ===============================================
app.get("/api/search", async (req, res) => {
  const q = req.query.q || "";

  // rota correta do GeckoTerminal v3
  const data = await safeFetch(
    `https://api.geckoterminal.com/api/v3/search/tokens?query=${encodeURIComponent(
      q
    )}&limit=8`
  );

  res.json(data);
});

// ===============================================
// HOME
// ===============================================
app.get("/", (req, res) => {
  res.send("FlashScreener Proxy API Running ✔");
});

// ===============================================
// START SERVER
// ===============================================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("FlashScreener API running on port " + PORT);
});
