export default async function handler(req, res) {
  const symbols = ["PEPEUSDT", "TSTUSDT", "TONUSDT", "ETHUSDT"];

  try {
    const promises = symbols.map(sym =>
      fetch(`https://api.binance.com/api/v3/ticker/24hr?symbol=${sym}`)
        .then(res => res.json())
    );

    const datas = await Promise.all(promises);

    const result = datas.map((data, i) => ({
      aset: symbols[i].replace("USDT", "/USDT"),
      "$": `$${parseFloat(data.lastPrice).toFixed(6)}`,
      "%": `${parseFloat(data.priceChangePercent).toFixed(2)}%`
    }));

    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: 'Gagal mengambil data Binance' });
  }
}
