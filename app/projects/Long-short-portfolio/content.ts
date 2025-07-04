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
 
 Extracting the data from S3 is done using the **Boto3** library, which is the official AWS SDK for Python. It allows us to connect to S3 (**Simple Storage Service**), a cloud storage service that 
 allows users to store and retrieve data. Polygon.io provides a public S3 bucket that contains all the historical data in compressed CSV format. To use the Boto3 library, you need to provide an access key and 
 a secret key, each of which can be found in your Polygon.io dashboard. It is recommended to store these keys in a **.env** file, which can be loaded using the **dotenv** library. This decouples your api keys
 from your code, allowing you to keep them private. This file also should be **git-ignored** to prevent it from being uploaded to a public repository.

\`\`\`python
# Make the environment variables available to python from the .env file
load_dotenv()
# Load the environment variables into python variables
ACCESS_KEY = os.getenv("AWS_ACCESS_KEY_ID")
SECRET_KEY = os.getenv("AWS_SECRET_ACCESS_KEY")
POLYGON_KEY = os.getenv("POLYGON_API_KEY")
 \`\`\` 
 
 After loading the environment variables, starting a session with the S3 service is straightforward.
 
 \`\`\`python
# Initialize a session using the AWS keys
session = boto3.Session( # Session object used to configure users and environment control
    aws_access_key_id=ACCESS_KEY,
    aws_secret_access_key=SECRET_KEY,
)
 \`\`\` 
 
 After creating a session, we must specify the AWS service that we want to use, in this case S3. We must also specify an endpoint to connect to, which is the Polygon.io S3 bucket.
 
\`\`\`python
# Create a client with session and speficy the endpoint (where the data is located)
s3 = session.client(
    's3', # Connecting to the S3 (Simple Storage Service) specifically (can connect to any aws service here)
    endpoint_url='https://files.polygon.io', # Base url for the service you want to access
    config=Config(signature_version='s3v4'), # Ensures client is using AWS signature Version 4 protocol by prohibiting api requests unless supplied with
                                             # a secret key. Used for hashsing
)
# The previous code is everything needed to accesss the S3 flatfiles
\`\`\` 

Now that we have connected to polygon.io's S3 bucket, we can download the data. The data is stored in a flat file structure containing a folder for each year, and within each year a folder for each month. Each month
folder contains a file for every trading day of that month, containing the OHLCVT data for all tickers for that day. Boto3 requires that you specify at least each parent directory in the path to the file you want to download. 
I created a function that takes a start year and the number of years to download, and returns a list of all the files to download. This function uses a paginator to recursively get all the files from S3 after entering the parent directory.

\`\`\`python
# Initialize a paginator for listing objects
paginator = s3.get_paginator('list_objects_v2')

# Choose the appropriate prefix depending on the data you need:
# - 'global_crypto' for global cryptocurrency data
# - 'global_forex' for global forex data
# - 'us_indices' for US indices data
# - 'us_options_opra' for US options (OPRA) data
# - 'us_stocks_sip' for US stocks (SIP) data
def get_daily_polygon_files(start_year, years):
    """
    returns all the s3 files to download

    Args:
        start_year (int): Year to start historical data pull.
        years (int): Amount of years to pull files for.

    Returns:
        object_keys: A list of files that will be pulled from S3.
    """
    #One liner to make the list of years to pull from. Paginator will recursively get all the files from s3
    prefixes = [f'us_stocks_sip/day_aggs_v1/{year}' for year in range(start_year, start_year + years)]
    # List objects using the selected prefix
    object_keys = []
    for prefix in prefixes:
        for page in paginator.paginate(Bucket='flatfiles', Prefix=prefix):
            for obj in page['Contents']:
                object_keys.append(obj['Key'])
    return object_keys
\`\`\` 

this function first creates a list of "folder paths" to search through called prefixes the result looks like: 

- ['us_stocks_sip/day_aggs_v1/2022',   'us_stocks_sip/day_aggs_v1/2023',   'us_stocks_sip/day_aggs_v1/2024']

Then I used the paginator to recursively get all the month files from S3 and then I further stepped in to each month folder and appended the name of each daily file to a list called object_keys.
S3 provides the paginator to recursively get all the files from S3, which is useful for navigating nested folder structures like the one used by Polygon.io. The function finally returns a list of all the file names which will be fed
to a download function. 
`;




export default markdown;
