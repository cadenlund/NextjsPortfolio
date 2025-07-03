// content.ts
const markdown = `
<h1 align="center">
Creating a Factor-Based Long-Short stock Strategy
</h1>


---

<p align="center">
  <img src="/images/longshortportfolioproject/longshortportfoliocover.png" alt="Example Image" />
</p>

---

<p class="text-lg font-medium indent-8 leading-relaxed my-4 text-justify">
  <strong>Systematic investing</strong> using data-driven signals has become a <strong>cornerstone</strong> of modern quantitative finance. In this post, I will show you how I
  constructed a long-short signal-based strategy using open-source Python libraries and <strong>structured</strong> data pipelines.
  Below are the <strong>key steps</strong> in recreating this framework to build your own strategies:
</p>

<ol class="list-decimal list-inside text-lg font-medium space-y-2">
  <li>Setting up a Database</li>
  <li>Creating Alpha Factors</li>
  <li>Evaluating Alpha Factors</li>
  <li>Backtesting</li>
  <li>Live Implementation</li>
</ol>



---

## Setting Up the Tools

<p class="text-lg font-medium indent-8 leading-relaxed my-4 text-justify">
  For this project, I use <strong>jupyter lab</strong> for python coding. Jupyter Lab provides a <strong>notebook</strong> like coding experience with blocks for
  <strong>code and markdown</strong>. It also provides a <strong>rich toolset</strong> with features like an <strong>interactive debugger</strong>, <strong>contextual help windows</strong>,
   and <strong>autocompletion</strong>. 
</p>

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
