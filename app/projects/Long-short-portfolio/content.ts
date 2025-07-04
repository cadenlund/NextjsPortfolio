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

## 📈 Overview

Systematic investing using **data-driven signals** is a cornerstone of modern quantitative finance.  
This project demonstrates how to build a **long-short signal-based strategy** using open-source Python libraries and structured data pipelines.  

### Key steps:
1. **Setting up a Database**
2. **Creating Alpha Factors**
3. **Evaluating Alpha Factors**
4. **Backtesting**
5. **Live Implementation**

---

## 🛠️ Setting Up the Tools

For this project, I used **JupyterLab**, which provides a notebook-style coding experience with:
- separate **code and markdown cells**
- an **interactive debugger**
- **contextual help windows**
- and **autocompletion** for productivity

I also utilized python **version 3.10** in an anaconda environment, which allows for easy package management and environment isolation.

---

## 🗃️ Designing the Database

To manage historical market data efficiently, I leveraged a **PostgreSQL** database with the **TimescaleDB** extension. TimescaleDB introduces **hypertables**: an ultra efficent way to store time-series data,
 allowing for fast queries and substantial compression.

1. **Metadata** – Metadata about sector and industry classifications, and other instrument details.
2. **OHLCV** – to store historical price and volume data as a hypertable.

### Example SQL Schema

\`\`\`sql
-- 1) Metadata table for all tickers
CREATE TABLE IF NOT EXISTS ticker_metadata (
    ticker       TEXT        PRIMARY KEY,
    active       BOOLEAN     NOT NULL,
    market_cap   DOUBLE PRECISION,
    list_date    DATE,
    sic_code     TEXT
);

-- 2) OHLCV table, linked by a foreign key to ticker_metadata
CREATE TABLE IF NOT EXISTS ohlcv_data (
    time         TIMESTAMPTZ NOT NULL,
    ticker       TEXT        NOT NULL
        REFERENCES ticker_metadata(ticker)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,
    open         DOUBLE PRECISION NOT NULL,
    high         DOUBLE PRECISION NOT NULL,
    low          DOUBLE PRECISION NOT NULL,
    close        DOUBLE PRECISION NOT NULL,
    volume       DOUBLE PRECISION NOT NULL,
    transactions BIGINT       NOT NULL,
    PRIMARY KEY (time, ticker)
);

SELECT create_hypertable('ohlcv_data', 'time');
\`\`\`

Storing information such as **sic_code** and **market_cap** allows for more sophisticated filtering and analysis, we can group stocks by sector or industry, or filter out small-cap stocks.

---

## 📊 Data Overview

The data provider that I used for this project is **Polygon.io**. We paid access for the standard plan giving us access to around 12000 us stocks and ETFs, with 5 years of historical data.
They also include access to company financials, stock splits, dividends, and other useful data that will be used later in the project. Polygon.io provides two standard methods of acessing data:

1. **REST API** – for downloading small to medium amounts of historical data
2. **Amazon S3** – for downloading bulk amounts of historical data

Before showing how to download, process, and store the data, I will show some examples of the data that we will be working with. Using the **PSQL command line client**,
 we can query both tables to get a larger view. 
 
 ### Example ohlcv data query:
 \`\`\`sql
 SELECT * FROM ohlcv_data
LIMIT 50;
 \`\`\`
 
 <p align="center">
  <img src="/images/longshortportfolioproject/ohlcv_data.png" alt="Example Image" />
</p>

### Example metadata query:
 \`\`\`sql
 SELECT * FROM ticker_metadata
LIMIT 50;
 \`\`\`
 
  <p align="center">
  <img src="/images/longshortportfolioproject/metadata.png" alt="Example Image" />
</p>

---

## 📥 Data Aquisition and Preprocessing

I faced many issues initially downloading the data via the REST API. Polygons REST API throttles the rate of requests which can lead to incomplete data downloads. 
I later resorted to the Amazon S3 method, which allows for bulk downloads of historical data via Amazon cloud storage. The first thing(after constructing a database) is to import
the required python libraries and packages.

 \`\`\`python
 import boto3 #Amazon AWS Python SDK
from botocore.config import Config #Config for SDK
from dotenv import load_dotenv # Load .ENV file containing protected information
import os # Ability to manage and access neigboring files 
from io import BytesIO # For reading binary data from S3
import pandas as pd # For data manipulation
from tqdm import tqdm # For progress bars
import matplotlib.pyplot as plt # For plotting data
 \`\`\` 
 
 Extracting the data from S3 is done using the **boto3** library, which is the official AWS SDK for Python. It allows us to connect to S3 (**Simple Storage Service**), a cloud storage service that 
 allows users to store and retrieve data. Polygon.io provides a public S3 bucket that contains all the historical data in compressed CSV format.


`;

export default markdown;
