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

## 📥 Raw Data Aquisition

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
# Create a client with session and specify the endpoint (where the data is located)
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
to a download function. The download function loops through each file name and downloads it from the S3 bucket, decompresses it, and saves it to a pandas DataFrame.

\`\`\`python
def get_daily_data(keys):
    """
    grabs all the csv files stored in keys, unzips them, and concatenates them all in a dataframe


    Args:
        keys (String[]): list of csv file paths to download from s3

    Returns:
        Dataframe: dataframe with stock data appended from all days
    """
    dfs = []
    for key in tqdm(keys, desc="Fetching Stock data"):
        if key.endswith('csv.gz'):
            response = s3.get_object(Bucket='flatfiles', Key=key)
            df = pd.read_csv(BytesIO(response['Body'].read()), compression = 'gzip')
            dfs.append(df)
    return pd.concat(dfs, ignore_index=True)  
\`\`\` 

The download function is relatively simple. We first create an empty list called dfs that will temporarily hold the dataframes for each file. then we iterate through the keys list with a tqdm progress bar. 
We check if the key ends with 'csv.gz' to ensure we are only downloading the compressed CSV files. We download the object from S3 and put it into a response object.
We read the raw compressed file as bytes and store them in our computers main memory(RAM) using the BytesIO function. Then we read the bytes into a pandas DataFrame using the read_csv function, specifying that the file is compressed with gzip.
The result is appended to the dfs list. After looping through all the keys, we concatenate all the dataframes in the dfs list into a single dataframe and return it. We finally call these functions to download the data and store it in a dataframe called data.

\`\`\`python
data = get_daily_data(get_daily_polygon_files(2021, 5))
\`\`\`
\`\`\`text
Fetching Stock data: 100%|████████████████████████████████████████████████████████████████████████| 1078/1078 [01:41<00:00, 10.66it/s]
\`\`\` 

---

## Data Preprocessing

After downloading the data there are still many steps in ensuring that our data is clean and ready for analysis. The first of which is pruning tickers that have missing trading days and invalid data. 
To tackle this I created a function called data_evaluation that inputs a dataframe and prints out information regarding its validity. 

\`\`\`python
def data_evaluation(data):
    """
    evaluates the data and prints null values and missing data

    Args:
        data: input data frame

    Returns:
        Void
    """
    ticker_counts = data['ticker'].value_counts()
    most_common_value = ticker_counts.mode().iloc[0]
    num_incomplete_tickers = int((ticker_counts != most_common_value).sum())
    incomplete_percentage = (num_incomplete_tickers / ticker_counts.size) * 100
    
    print(f"""
Amount of null values per column: \\n {data.isnull().sum()} \\n
Number of unique tickers: {data['ticker'].nunique()}
The mode of the amount of tickers is {most_common_value}
The number of incomplete tickers is {num_incomplete_tickers}
The percentage of incomplete tickers relative to the mode is {incomplete_percentage:.3f}%
    """)
\`\`\`

This function prints out a few key metrics about the data. It counts the number of null values in each column,
 counts the number of unique tickers, finds the mode of the number of tickers, and calculates the number and percentage of incomplete tickers relative to the mode.
 After running this function we can see that most of the data is invalid and only 30% of the original tickers have complete data. 
 
 \`\`\`python
data_evaluation(data)
\`\`\`
\`\`\`text
Amount of null values per column: 
 ticker          693
volume            0
open              0
close             0
high              0
low               0
window_start      0
transactions      0
dtype: int64 

Number of unique tickers: 18017
The mode of the amount of tickers is 1078
The number of incomplete tickers is 12477
The percentage of incomplete tickers relative to the mode is 69.251%
\`\`\` 

Next, I create a function that filters out the incomplete tickers and returns a new dataframe with only the complete tickers. It does so in 4 key steps:

1. **Remove null values from ticker list**
2. **Further filter the ticker list to only include tickers with exactly the mode of the mode amount of days from each stock** (only stocks with exactly 1078 days of data)
3. **convert nanosecond time to a normalized datetime format** (from nanoseconds to seconds)
4. **Finally call the evaluation function on the new dataframe to ensure that it is valid**

Once all that is complete, I call the function and store the result in a new dataframe called **filtered_data**.

 \`\`\`python
def get_clean_tickers(data):
    
    #Remove null tickers from ticker list
    unique_tickers = data['ticker'].dropna().unique()
    tickers_with_null = data[data.isnull().any(axis=1)]['ticker'].dropna().unique().tolist()
    valid_tickers = list(set(unique_tickers) - set(tickers_with_null))

    #Create new filtered DataFrame and filter further based on mode amount of samples
    filtered_null_data = data[data['ticker'].isin(valid_tickers)]
    ticker_counts = filtered_null_data['ticker'].value_counts()
    most_common_value = ticker_counts.mode().iloc[0]
    # Get tickers that don't have the mode number of rows
    incomplete_tickers = ticker_counts[ticker_counts != most_common_value].index.tolist()
    filtered_final_data = filtered_null_data[filtered_null_data['ticker'].isin(list(set(valid_tickers) - set(incomplete_tickers)))]

    #Print null tickers, evaulate final data, and return final df
    print(f"tickers with null: {tickers_with_null}")
    data_evaluation(filtered_final_data)
    filtered_final_data = filtered_final_data.copy()
    filtered_final_data['time'] = pd.to_datetime(filtered_final_data['window_start']).dt.date
    filtered_final_data.drop(columns=['window_start'])
    return filtered_final_data
\`\`\`
 \`\`\`python
filtered_data = get_clean_tickers(data)
\`\`\`
 \`\`\`text
tickers with null: []

Amount of null values per column: 
 ticker          0
volume          0
open            0
close           0
high            0
low             0
window_start    0
transactions    0
dtype: int64 

Number of unique tickers: 5540
The mode of the amount of tickers is 1078
The number of incomplete tickers is 0
The percentage of incomplete tickers relative to the mode is 0.000%
\`\`\`

From the data evaluation we can see that the data is now valid and contains no null values. The final dataframe contains 5540 unique tickers, all of which have exactly 1078 days of data.

### Further processing 

Now after filtering out the incomplete tickers, we can plot a few stocks to see how they look, a visual test is always important especially when dealing with financial data.

 \`\`\`python
filtered_data[filtered_data['ticker'] == 'TSLA'].plot(x='time', y='close', title='TSLA Close Price')
plt.xticks(rotation=45)  # Rotate x-axis labels vertically
plt.tight_layout()       # Optional: prevent clipping
plt.show()
\`\`\`

 <p align="center">
  <img src="/images/longshortportfolioproject/tsla_price_before_adj.png" alt="Example Image" />
</p>

We can see that the data looks good, but there are some issues with the data. The first issue is that the prices are not adjusted for stock splits or dividends. Polygon.io does not provide adjusted prices so its up to the user to adjust the prices themselves.
Stock splits heavily affect the price of a stock, but dividends do not affect the price of a stock, they only affect the total return of the stock. I decided to only adjust the prices for stock splits, as dividends are minor in comparison.
To acquire the stock split data, I used the Polygon.io REST API to download the stock split data for each ticker. The stock split data is much smaller than the price data, so the download is much faster. the following code
takes each stock split ordered by execution date and appends it to a list called splits. 

 \`\`\`python
from polygon import RESTClient

# 2) Prepare your Polygon client
client = RESTClient(POLYGON_KEY)

splits = []
for s in tqdm(client.list_splits(
\torder="asc",
\tlimit="10",
\tsort="execution_date",
\t)):
    splits.append(s) 
\`\`\`

After obtaining the split information for stocks, I created a function that takes the split data and price dataframe and adjusts all the tickers for stock splits. 

 \`\`\`python
def adjust_for_splits(data, splits):
    start_date = pd.to_datetime(data['time'].min())
    end_date = pd.to_datetime(data['time'].max())

    tickers_in_data = set(data['ticker'].unique())

    # Filter splits
    filtered = [
        s for s in splits
        if start_date <= pd.to_datetime(s.execution_date) <= end_date
        and s.ticker in tickers_in_data
    ]

    data = data.copy()
    splits = sorted(filtered, key=lambda s: s.execution_date)

    for split in tqdm(splits, desc='Adjusting ohlcv data to splits'):
        exec_date = pd.to_datetime(split.execution_date)
        ratio = split.split_from / split.split_to
        ticker = split.ticker

        # Use the 'time' column for the date filter
        mask = (data['ticker'] == ticker) & (pd.to_datetime(data['time']) < exec_date)
        data.loc[mask, ['open', 'high', 'low', 'close']] *= ratio
        data.loc[mask, 'volume'] /= ratio

    return data
\`\`\`

First, the function takes the start and end dates of the data and filters the splits to only include splits that occurred within that date range.
Then, a list of valid tickers is created by making a set of all unique tickers in the data. After that, the splits are then filtered to only include ones that are in the data and within the date range. The splits are 
also sorted by execution date to ensure that the splits are applied in the correct order. The function then iterates through each split, converts the splits execution date to a datetime object, and calculates the split ratio.
After a stocks split ratio is calculated, a boolean mask is created to select only the date range that is to be adjusted. Using the mask, the ratio is applied to the open, high, low, and close prices of the stock, and the volume is divided by the ratio.
Lastly, the function returns the adjusted dataframe. We can call the function, store the result in a dataframe called **data**, and plot the adjusted data to see how it looks.

 \`\`\`python
data = adjust_for_splits(filtered_data, splits)
\`\`\`
 \`\`\`text
Adjusting ohlcv data to splits: 100%|███████████████████████████████████████████████████████████████| 761/761 [06:13<00:00,  2.04it/s]
\`\`\`
 \`\`\`python
data[data['ticker'] == 'TSLA'].plot(x='time', y='close', title='TSLA Close Price')
plt.xticks(rotation=45)  # Rotate x-axis labels vertically
plt.tight_layout()       # Optional: prevent clipping
plt.show()
\`\`\`

 <p align="center">
  <img src="/images/longshortportfolioproject/tsla_price_after_adj.png" alt="Example Image" />
</p>

`;




export default markdown;
