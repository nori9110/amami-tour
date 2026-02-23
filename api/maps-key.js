export default function handler(req, res) {
  const key = process.env.GOOGLE_MAPS_API_KEY;
  if (!key) {
    res.status(500).json({ error: 'GOOGLE_MAPS_API_KEY is not set' });
    return;
  }
  // このキーはクライアントに公開されます。必ずHTTPリファラー制限を有効にしてください。
  res.setHeader('Cache-Control', 'no-store');
  res.status(200).json({ key });
}

