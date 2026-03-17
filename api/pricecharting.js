export default async function handler(req, res) {
  const { q } = req.query; // card name from extension

  if (!q) {
    res.status(400).json({ error: 'Missing q parameter' });
    return;
  }

  // TEMP: return fake data so we know the proxy works
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  res.status(200).json({
    query: q,
    loosePrice: 12.34,
    gradedPrice: 89.99,
    sourceUrl: 'https://www.pricecharting.com',
  });
}

