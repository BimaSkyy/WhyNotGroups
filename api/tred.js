export default async function handler(req, res) {
  const symbols = ["PEPEUSDT", "TSTUSDT", "TONUSDT", "ETHUSDT"];

  try {
    const promises = symbols.map(sym =>
      fetch(`https://api.binance.com/api/v3/ticker/24hr?symbol=${sym}`)
        .then(res => res.json())
        .then(data => ({
          symbol: sym,
          data: data.code ? null : data // cek jika error
        }))
    );

    const datas = await Promise.all(promises);

    const result = datas.map(({ symbol, data }) => ({
      aset: symbol.replace("USDT", "/USDT"),
      "$": data ? `$${parseFloat(data.lastPrice).toFixed(6)}` : "N/A",
      "%": data ? `${parseFloat(data.priceChangePercent).toFixed(2)}%` : "N/A"
    }));

    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Gagal mengambil data Binance' });
  }
}
