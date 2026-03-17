export default async function handler(req, res) {
  const { q } = req.query; // card name from extension

  if (!q) {
    res.status(400).json({ error: 'Missing q parameter' });
    return;
  }

  try {
    // TODO: replace with real PriceCharting API URL + key
    const pcRes = await fetch(
      'https://www.pricecharting.com/api/your-endpoint-here?q=' + encodeURIComponent(q)
    );

    if (!pcRes.ok) {
      res.status(pcRes.status).json({ error: 'PriceCharting error' });
      return;
    }

    const data = await pcRes.json();

    // CORS so your extension can read it
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    res.status(200).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}
