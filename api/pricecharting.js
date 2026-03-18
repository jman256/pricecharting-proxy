export default async function handler(req, res) {
  const { q } = req.query; // card name / query from extension

  if (!q) {
    res.status(400).json({ error: 'Missing q parameter' });
    return;
  }

  try {
    // Your PriceCharting API token – set this as an env var in Vercel
    const API_TOKEN = process.env.PRICECHARTING_API_TOKEN;

    if (!API_TOKEN) {
      res.status(500).json({ error: 'Missing PRICECHARTING_API_TOKEN env var' });
      return;
    }

    // Use the /api/product endpoint with full-text search (best single match)
    const pcUrl =
      'https://www.pricecharting.com/api/product?' +
      new URLSearchParams({
        t: API_TOKEN,
        q: q
      }).toString();

    const pcRes = await fetch(pcUrl);
    if (!pcRes.ok) {
      res.status(pcRes.status).json({ error: 'PriceCharting error' });
      return;
    }

    const pcData = await pcRes.json(); // returns fields like loose-price, graded-price, product-name, retail-loose-sell, etc. [web:36]

    // Normalize cents -> dollars helper
    const toDollars = (cents) =>
      typeof cents === 'number' ? cents / 100 : null;

    const result = {
      query: q,
      name: pcData['product-name'] || pcData.productName || q,
      loosePrice: toDollars(pcData['loose-price']),
      gradedPrice: toDollars(pcData['graded-price']),
      retailLooseSell: toDollars(pcData['retail-loose-sell']),
      retailNewSell: toDollars(pcData['retail-new-sell']),
      sourceUrl: `https://www.pricecharting.com/game/${pcData.id || ''}`
    };

    // CORS so your extension can read it
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}
