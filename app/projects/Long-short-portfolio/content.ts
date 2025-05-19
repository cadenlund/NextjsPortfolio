// content.ts
const markdown = `
# ✅ Building a Factor-Based Long-Short Strategy from Scratch

<p align="center">
  <img src="/images/longshortportfolioproject/longshortportfoliocover.png" alt="Example Image" />
</p>

Systematic investing using data-driven signals has become a cornerstone of modern quantitative finance. In this post, I’ll show you how I built a long-short equity strategy using open-source tools and structured data pipelines. We’ll start by building a scalable financial database, move on to pulling data from Polygon.io, engineer alpha factors, evaluate them using Alphalens, and finally backtest the strategy using VectorBT.

---

## 🛠️ Setting Up the Tools

For this project, I used **Python**, **Pandas**, **NumPy**, and **Matplotlib** for data manipulation and visualization.  
**PostgreSQL** with the **TimescaleDB** extension provided scalable storage for historical price data.  
I fetched historical market data using the **Polygon.io API**, evaluated factor performance with **Alphalens**, and ran backtests using **VectorBT**.

---

## 🗃️ Designing the Database

To manage historical market data efficiently, I designed a schema with three tables:

1. **Providers** – to record data providers.
2. **Instruments** – to track stock tickers and metadata.
3. **OHLCV** – to store historical price and volume data as a hypertable.

### Example SQL Schema

\`\`\`sql
CREATE TABLE providers (...);
CREATE TABLE instruments (...);
CREATE TABLE ohlcv (...);
SELECT create_hypertable('ohlcv', 'timestamp');

`;

export default markdown;
