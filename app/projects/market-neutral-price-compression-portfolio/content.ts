// content.ts
const markdown = `
<h1 align="center">
Creating a Factor-Based market-neutral trading strategy
</h1>

---

<p align="center">
  <img src="/images/longshortportfolioproject/longshortportfoliocover.png" alt="Example Image" />
</p>

---

## Overview

Systematic investing using **data-driven signals** is a cornerstone of modern quantitative finance.  This project demonstrates how to build a **long-short signal-based strategy** using open-source Python libraries and structured data pipelines.  

### Key steps:
1. **Setting up a Database**
2. **Creating Alpha Factors**
3. **Evaluating Alpha Factors**
4. **Backtesting**

---

## Setting Up the Tools

For this project, I used **JupyterLab**, which provides a notebook-style coding experience with:
- separate **code and markdown cells**
- an **interactive debugger**
- **contextual help windows**
- and **autocompletion** for productivity

I also utilized python **version 3.10** in an anaconda environment, which allows for easy package management and environment isolation. The environment yml file is available 
in the GitHub repository for this project along with the code used in this report.

---

## Designing the Database

To manage historical market data efficiently, I leveraged a **PostgreSQL** database with the **TimescaleDB** extension. TimescaleDB introduces **hypertables**: an ultra efficent way to store time-series data,
 allowing for fast queries and substantial compression. The two tables I createed are:

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
Setting each column to **NOT NULL** ensures data integrity, and setting a composite primary key on (time, ticker) prevents duplicate entries for the same stock at the same timestamp.
The primary key also allows cross referencing between the two tables, enabling efficient joins and queries that combine price data with metadata.

---

## Data Overview

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

## Raw Data Aquisition

I faced many issues initially downloading the data via the **REST API**. Polygons REST API throttles the rate of requests which can lead to incomplete data downloads. 
I later resorted to the **Amazon S3** method, which allows for bulk downloads of historical data via Amazon cloud storage. The first thing(after constructing a database) is to import
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

Your env file should be named .env and should contain the following: 


\`\`\` text
AWS_ACCESS_KEY_ID=your_aws_key
AWS_SECRET_ACCESS_KEY=your_aws_secret
POLYGON_API_KEY=your_polygon_api_key
POSTGRES_USER=your_db_user
POSTGRES_PASSWORD=your_db_password
POSTGRES_HOST=your_db_host
POSTGRES_PORT=your_db_port
POSTGRES_DB=your_db_name
 \`\`\` 

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

Now that we have connected to polygon.io's S3 bucket, we can download the data. The data is stored in a flat file structure containing a folder for **each year, and within each year a folder for each month**. Each month
folder contains a file for **every trading day of that month**, containing the **OHLCVT** data for all tickers for that day. Boto3 requires that you specify at least each **parent directory**(top level year folder names) in the path to the file you want to download. 
I created a function that takes a start year and the number of years to download, and returns a list of all the files to download. This function uses a **paginator** to recursively get all the files from S3 **after entering the parent directory**.

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
    for prefix in prefixes: #Step into each parent fdirectory
        for page in paginator.paginate(Bucket='flatfiles', Prefix=prefix): #Use the paginator to search throuigh the files in the remote S3 bucket
            for obj in page['Contents']: # Step into each month folder
                object_keys.append(obj['Key']) #Append the name of each daily file to a list
    return object_keys
\`\`\` 

This function first creates a list of "folder paths" to search through called **prefixes**. The result looks like: 

\`\`\`python
['us_stocks_sip/day_aggs_v1/2022',   'us_stocks_sip/day_aggs_v1/2023',   'us_stocks_sip/day_aggs_v1/2024']
\`\`\` 

Then I used the **paginator** to recursively get all the **month files** from S3 and then I further stepped in to each **month folder** and **appended the name of each daily file to a list called object_keys**.
S3 provides the paginator to recursively get all the files from S3, which is useful for navigating **nested folder structures** like the one used by Polygon.io. The function finally returns a list of all the file names which will be fed
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
    for key in tqdm(keys, desc="Fetching Stock data"): #Progress bar loop for each file
        if key.endswith('csv.gz'): #Only download the compressed csv files
            response = s3.get_object(Bucket='flatfiles', Key=key) # Download the object from S3
            df = pd.read_csv(BytesIO(response['Body'].read()), compression = 'gzip') # Read the raw compressed file as bytes and store them in our computers main memory(RAM)
            dfs.append(df) # Read the bytes into a pandas DataFrame, specifying that the file is compressed with gzip
    return pd.concat(dfs, ignore_index=True)   # Concatenate all the dataframes in the list into a single dataframe
\`\`\` 

The download function is relatively simple. We first create an empty list called dfs that will temporarily hold the dataframes for each file. Then we iterate through the keys list with a tqdm progress bar. 
We check if the key ends with 'csv.gz' to ensure we are only downloading the **compressed CSV files**. We download the object from S3 and put it into a **response object**.
We read the raw compressed file as bytes and store them in our computers main memory(RAM) using the **BytesIO** function. Then we read the bytes into a pandas DataFrame using the **read_csv** function, specifying that the file is compressed with **gzip**.
The result is appended to the dfs list. After looping through all the keys, we **concatenate** all the dataframes in the dfs list into a single dataframe and return it. We finally call these functions to download the data and store it in a dataframe called data.

\`\`\`python
data = get_daily_data(get_daily_polygon_files(2021, 5))
\`\`\`
\`\`\`text
Fetching Stock data: 100%|████████████████████████████████████████████████████████████████████████| 1078/1078 [01:41<00:00, 10.66it/s]
\`\`\` 

---

## Data Preprocessing

After downloading the data there are still many steps in ensuring that our data is clean and ready for analysis. The first of which is pruning tickers that have **missing trading days** and **invalid data**. 
To tackle this I created a function called **data_evaluation** that inputs a dataframe and prints out information regarding its validity. 

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
    **
    print(f"""
Amount of null values per column: \\n {data.isnull().sum()} \\n
Number of unique tickers: {data['ticker'].nunique()}
The mode of the amount of tickers is {most_common_value}
The number of incomplete tickers is {num_incomplete_tickers}
The percentage of incomplete tickers relative to the mode is {incomplete_percentage:.3f}%
    """)
\`\`\`

This function prints out a few key metrics about the data. It counts the number of **null values** in each column,
 counts the number of **unique tickers**, finds the **mode** of the number of tickers, and calculates the number and percentage of **incomplete tickers relative to the mode**.
 After running this function we can see that most of the data is invalid and only **30%** of the original tickers have complete data. 
 
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
    """ 
    filters out incomplete tickers from the data
    
    Args:
        data: input data frame
        
    Returns:
        dataframe: filtered dataframe with only complete tickers
    """
    #Remove null tickers from ticker list
    unique_tickers = data['ticker'].dropna().unique() #Get unique tickers, dropping nulls
    tickers_with_null = data[data.isnull().any(axis=1)]['ticker'].dropna().unique().tolist() #Get tickers with null values
    valid_tickers = list(set(unique_tickers) - set(tickers_with_null)) #Get valid tickers by removing null tickers from unique tickers

    #Create new filtered DataFrame and filter further based on mode amount of samples
    filtered_null_data = data[data['ticker'].isin(valid_tickers)] #Filter out null tickers from data
    ticker_counts = filtered_null_data['ticker'].value_counts() #Count the number of rows for each ticker
    most_common_value = ticker_counts.mode().iloc[0] #Get the mode of the number of rows for each ticker
    # Get tickers that don't have the mode number of rows
    incomplete_tickers = ticker_counts[ticker_counts != most_common_value].index.tolist() #Get tickers that don't have the mode number of rows
    filtered_final_data = filtered_null_data[filtered_null_data['ticker'].isin(list(set(valid_tickers) - set(incomplete_tickers)))] #Filter out incomplete tickers from data

    #Print null tickers, evaulate final data, and return final df
    print(f"tickers with null: {tickers_with_null}")
    data_evaluation(filtered_final_data) #Evaluate the final data to ensure it is valid
    filtered_final_data = filtered_final_data.copy() #Avoid SettingWithCopyWarning
    filtered_final_data['time'] = pd.to_datetime(filtered_final_data['window_start']).dt.date #Convert nanosecond time to datetime format
    filtered_final_data = filtered_final_data.drop(columns=['window_start']) #Drop the window_start column
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
transactions    0
time            0
dtype: int64 

Number of unique tickers: 5540
The mode of the amount of tickers is 1078
The number of incomplete tickers is 0
The percentage of incomplete tickers relative to the mode is 0.000%
\`\`\`

From the data evaluation we can see that the data is now valid and contains no null values. The final dataframe contains ****5540 unique tickers****, all of which have exactly ****1078 days of data****.

---

## Adjusting for Stock Splits

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

We can see that the data looks good, but there are some issues with the data. The first issue is that the prices are not adjusted for **stock splits** or **dividends**. Polygon.io does not provide adjusted prices so its up to the user to adjust the prices themselves.
Stock splits heavily affect the price of a stock, but dividends do not affect the price of a stock, they only affect the total return of the stock. I decided to only adjust the prices for stock splits, as dividends are minor in comparison.
To acquire the stock split data, I used the Polygon.io **REST API** to download the stock split data for each ticker. The stock split data is much smaller than the price data, so the download is much faster. The following code
takes each stock split ordered by execution date and appends it to a list called **splits**. 

 \`\`\`python
from polygon import RESTClient

client = RESTClient(POLYGON_KEY) # Initialize the Polygon.io REST client with API key

splits = []
for s in tqdm(client.list_splits(
\torder="asc", # Order by ascending execution date
\tlimit="10", # Limit to 10 results per request (max is 1000)
\tsort="execution_date", # Sort by execution date
\t)):
    splits.append(s)  # Append each split to the list
\`\`\`

After obtaining the split information for stocks, I created a function that takes the split data and price dataframe and adjusts all the tickers for **stock splits**. 

 \`\`\`python
def adjust_for_splits(data, splits):
    """
    Adjusts the OHLCV data for stock splits.
    
    Args:
        data (DataFrame): DataFrame containing OHLCV data with columns ['time', 'ticker', 'open', 'high', 'low', 'close', 'volume'].
        splits (list): List of split objects containing attributes 'execution_date', 'split_from', 'split_to', and 'ticker'.
        
    Returns:
        DataFrame: Adjusted OHLCV data.
    """
    
    start_date = pd.to_datetime(data['time'].min()) # Get the start and end date of the data
    end_date = pd.to_datetime(data['time'].max()) 

    tickers_in_data = set(data['ticker'].unique()) # Create a set of valid tickers in the data

    # Filter splits to only include those within the date range and valid tickers
    filtered = [
        s for s in splits # List comprehension to filter splits
        if start_date <= pd.to_datetime(s.execution_date) <= end_date # Only include splits within the date range
        and s.ticker in tickers_in_data # Only include splits for tickers in the data
    ]

    data = data.copy() # Avoid SettingWithCopyWarning
    splits = sorted(filtered, key=lambda s: s.execution_date) # Sort splits by execution date

    for split in tqdm(splits, desc='Adjusting ohlcv data to splits'): # Progress bar loop for each split
        exec_date = pd.to_datetime(split.execution_date) # Convert execution date to datetime
        ratio = split.split_from / split.split_to # Calculate the split ratio
        ticker = split.ticker # Get the ticker symbol

        # Use the 'time' column for the date filter
        mask = (data['ticker'] == ticker) & (pd.to_datetime(data['time']) < exec_date) # Create a boolean mask for the date range to adjust
        data.loc[mask, ['open', 'high', 'low', 'close']] *= ratio # Adjust the OHLC prices by the split ratio
        data.loc[mask, 'volume'] /= ratio # Adjust the volume by the inverse of the split ratio

    return data
\`\`\`

First, the function takes the start and end dates of the data to later filter the splits.**
Then, a list of valid tickers is created by making a set of all unique tickers in the data. After that, the splits are then filtered to only include ones that are in the data and within the date range. The splits are 
also sorted by execution date to ensure that the splits are applied in the **correct order**. The function then iterates through each split, converts the splits execution date to a **datetime object**, and calculates the **split ratio**.
After a stocks split ratio is calculated, a **boolean mask** is created to select only the date range that is to be adjusted. Using the mask, the ratio is applied to the open, high, low, and close prices of the stock, and the volume is divided by the ratio.
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

Upon visual inspection we can see that the prices are now adjusted for stock splits, and the data looks good. 

---

## Downloading and Cleaning Metadata

The code below first extracts the unique tickers from the data dataframe and stores them in a list called tickers. Then it initializes two empty lists, 
one for storing the metadata and one for storing the bad tickers. It then loops through each ticker and tries to get the ticker details using the Polygon.io REST API. If it fails to get the details,
 it appends the ticker to the bad tickers list and continues to the next ticker. We build a simple dictionary from the response attributes, containing the **ticker**, **active status**, **market cap**, **list date**, and **sic code**.
 If the ticker is inactive or any field (besides ticker) is None, it appends the ticker to the bad tickers list and continues to the next ticker. It then builds a clean DataFrame from the metadata list and **deduplicates the bad tickers list**.
  Finally, it prints the first 5 rows of the clean metadata DataFrame and the number of bad tickers skipped. 


 \`\`\`python

# 1) Extract unique tickers from your existing DataFrame
tickers = data['ticker'].dropna().unique().tolist() # Get unique tickers, dropping nulls
print("First 20 tickers:", tickers[:20]) # Print the first 20 tickers for inspection

# 2) Initialize lists to hold metadata and bad tickers
meta_list   = []
bad_tickers = []

# 3) Loop through tickers
for t in tqdm(tickers, desc="Fetching ticker details"): # Progress bar loop for each ticker
    try: 
        resp = client.get_ticker_details(t) # Get ticker details from Polygon.io
    except Exception: 
        # couldn’t fetch details at all 
        bad_tickers.append(t) 
        continue**

    # build a simple dict from resp attributes
    record = {
        'ticker':                     t,
        'active':                     resp.active,
        'market_cap':                 resp.market_cap,
        'list_date':                  resp.list_date,
        'sic_code':                   resp.sic_code,
    }

    # 4) if inactive or any field (besides ticker) is None → mark bad & skip
    has_missing = any(
        record[field] is None # check for None values
        for field in record 
        if field != 'ticker'
    )
    if not record['active'] or has_missing: # Check if ticker is inactive or has missing fields
        bad_tickers.append(t) 
        continue

    # 5) otherwise keep it
    meta_list.append(record) 

# 6) Build the clean DataFrame
meta_df = pd.DataFrame(meta_list) # Create DataFrame from metadata list

# 7) Deduplicate bad_tickers 
bad_tickers = sorted(set(bad_tickers)) # Remove duplicates and sort

# 8) Inspect
print("Clean metadata:")
print(meta_df.head())
print(f"\\nTickers skipped (inactive or missing data): {len(bad_tickers)}")

\`\`\`

 \`\`\`text
First 20 tickers: ['A', 'AA', 'AAA', 'AAAU', 'AAL', 'AAOI', 'AAON', 'AAP', 'AAPL', 'AAT', 'AAXJ', 'AB', 'ABBV', 'ABCB', 'ABCL', 'ABEO', 'ABEQ', 'ABEV', 'ABG', 'ABM']
Fetching ticker details: 100%|████████████████████████████████████████████████████████████████████| 5540/5540 [04:38<00:00, 19.91it/s]
Clean metadata:
  ticker  active    market_cap   list_date sic_code
0      A    True  2.998995e+10  1999-11-18     3826
1     AA    True  6.474725e+09  2016-10-18     3334
2    AAL    True  6.206615e+09  2013-12-10     4512
3   AAOI    True  5.653103e+08  2013-09-26     3674
4   AAON    True  6.705448e+09  1990-12-01     3585

Tickers skipped (inactive or missing data): 2970
\`\`\`

  
  Unfortunately, polygon has incomplete data for **2970 of the stocks in our dataset** so we will have to work with the remaining 2570 stocks. 
  ****
 
  \`\`\`python
# Filter out bad tickers from the data
new_tickers = [t for t in tickers if t not in bad_tickers]
filtered_data = data[data['ticker'].isin(new_tickers)].copy()

# Reset the index
filtered_data.reset_index(drop=True, inplace=True)

#evaluate the new data 
data_evaluation(filtered_data)
\`\`\`
  \`\`\`text
Amount of null values per column: 
 ticker          0
volume          0
open            0
close           0
high            0
low             0
transactions    0
time            0
dtype: int64 

Number of unique tickers: 2570
The mode of the amount of tickers is 1078
The number of incomplete tickers is 0
The percentage of incomplete tickers relative to the mode is 0.000%
\`\`\`

---

## Storing the data in the database

Using SQLAlchemy, we can store the data in the PostgreSQL database that we created earlier. After creating a connection to the database, we can use the pandas ****to_sql**** function to store the data in the database.

\`\`\`python
db_user = os.getenv("POSTGRES_USER")
db_password = os.getenv("POSTGRES_PASSWORD")
db_host = os.getenv("POSTGRES_HOST")
db_port = os.getenv("POSTGRES_PORT")
db_name = os.getenv("POSTGRES_DB")
\`\`\`
\`\`\`python
from sqlalchemy import create_engine

engine = create_engine(  # Create a database engine
    f"postgresql+psycopg2://{db_user}:{db_password}@{db_host}:{db_port}/{db_name}" # Create the database connection string
)
\`\`\`

Engine is our database connection, the to_sql function takes the database connection, 
the name of the table to store the data in, and the dataframe to store. It allows us to **bypass handling the SQL queries ourselves**,
 making it easier to store data in the database.
 
 \`\`\`python
# append ticker metadata into the existing ticker_metadata table
meta_df.to_sql( 
    "ticker_metadata",
    engine,
    if_exists="append",
    index=False
)
\`\`\`
 \`\`\`python
# append OHLCV DataFrame into the existing ohlcv_data table
filtered_data.to_sql(
    "ohlcv_data",
    engine,
    if_exists="append",
    index=False
)
\`\`\`

Now that we have stored the data in the database, 
we can query the data with blazing fast speeds, making data analysis and backtesting much easier.

---

## Creating a database API

To make it easier to query the databse, I created a class on top of **psycopg2**, the postgresql python library, that allows us to query the database using python functions. The class has methods
for getting data for a single ticker, getting data for multiple tickers, and getting data for all tickers.
 It also has methods for getting the metadata for a single ticker and getting the metadata for all tickers. It takes a few inputs like tickers, date, lookback period,freq, and columns. 

  \`\`\`python
import pandas as pd
import psycopg2 # PostgreSQL database adapter for Python
from psycopg2.extras import RealDictCursor # Allows us to get the results as a dictionary
from datetime import timedelta 

class PostgresDataHandler:
    def __init__(self, db_uri):
        self.conn = psycopg2.connect(db_uri, cursor_factory=RealDictCursor)  # Connect to DB

    def get_data(self, tickers=None, date=None, lookback=30, freq="daily", columns=['close']):
        """
        Query daily OHLCV data for one or more tickers over a lookback period ending on a specific date.
    
        Args:
            tickers (list or None): List of tickers, or None to fetch all.
            date (str): Last date of the lookback period (YYYY-MM-DD). Required.
            lookback (int): Number of days before \`date\` to fetch.
            freq (str): Only 'daily' is supported for now.
            columns (list): List of columns to retrieve.
    
        Returns:
            pd.DataFrame: Pivoted DataFrame (if one column) or tidy format (if multiple).
        """
        if date is None:
            raise ValueError("You must supply a \`date\` for get_data().")
    
        if freq != "daily":
            raise ValueError("Only daily frequency is supported.")
    
        end_date = pd.to_datetime(date)
        start_date = end_date - timedelta(days=lookback)
    
        selected_cols = ', '.join(['time', 'ticker'] + columns) # Columns to select in SQL query
    
        if tickers is None: # If no tickers specified, fetch all
            sql = f"""
            SELECT {selected_cols}
            FROM ohlcv_data
            WHERE time BETWEEN %s AND %s
            ORDER BY time
            """
            params = (start_date, end_date)
        else: # Fetch only specified tickers
            sql = f"""
            SELECT {selected_cols}
            FROM ohlcv_data
            WHERE ticker = ANY(%s)
              AND time BETWEEN %s AND %s
            ORDER BY time
            """
            params = (tickers, start_date, end_date)
    
        with self.conn.cursor() as cur: # Execute the SQL query
            cur.execute(sql, params) 
            rows = cur.fetchall() # Fetch all results
    
        df = pd.DataFrame(rows) # Convert results to DataFrame
    
        if df.empty: 
            return df # Return empty DataFrame if no results
    
        df['date'] = pd.to_datetime(df['time'], utc=True) # Convert 'time' to datetime
    
        if len(columns) == 1: # If only one column, pivot the DataFrame
            return df.pivot(index='date', columns='ticker', values=columns[0])
        else: # If multiple columns, return tidy format
            return df

    def get_sic_codes(self):
        """
        Retrieve a dictionary mapping each ticker to its SIC code.

        Returns:
            dict: { ticker: sic_code }
        """
        sql = "SELECT ticker, sic_code FROM ticker_metadata" # SQL query to fetch ticker and sic_code
        with self.conn.cursor() as cur: # Execute the SQL query
            cur.execute(sql) 
            rows = cur.fetchall() # Fetch all results
        # rows are dicts thanks to RealDictCursor
        return {row['ticker']: row['sic_code'] for row in rows} # Convert results to dictionary

    def close(self): # Close the database connection
        self.conn.close()


)
\`\`\`

For time's sake, I will not go into detail about the methods, but they allow us to query the database using python functions **instead of writing raw SQL queries** which can be 
cumbersome and error-prone when done outside the PSQL shell. The idea is that now we can just import the api into our code, passing the database **URI**,
 and use the methods to query the database in just a **few lines** code.

---

## Using the Database API

 Before we can create alpha factors, we need to import the data from the database using our newly created **PostgresDataHandler API**.
 
 \`\`\`python
import matplotlib.pyplot as plt
from AlphactoryDB.dbapi import PostgresDataHandler # Import the PostgresDataHandler class
from dotenv import load_dotenv # To load environment variables from a .env file
import os 
import pandas as pd
\`\`\`

When we inserted the data into the database, we used a database URI that contains the ******database credentials******. We need to redefine the database URI to connect to the database
and call the handler class with the URI. 

 \`\`\`python
# Load the .env file
load_dotenv()

# Read environment variables
user = os.getenv("POSTGRES_USER")
password = os.getenv("POSTGRES_PASSWORD")
host = os.getenv("POSTGRES_HOST")
port = os.getenv("POSTGRES_PORT")
db_name = os.getenv("POSTGRES_DB")

# Construct the DB URI
db_uri = f"postgresql://{user}:{password}@{host}:{port}/{db_name}" 

# Create the PostgresDataHandler instance
handler = PostgresDataHandler(db_uri) # Initialize the data handler with the DB URI
\`\`\`

Now that we have our handler, we can simply call the methods to obtain the data. This approach is much more efficient than downloading the data from polygon.io every time
 we want to create a new alpha factor. Now we obtain the prices for a **specific date and lookback period**, and store it in a dataframe called prices.
 
  \`\`\`python
# Get close prices for all tickers over the last 2000 days(will get all available data if less than 2000 days)
prices = handler.get_data(date="2025-04-15", lookback=2000, columns = ['close']) 
\`\`\`

Before moving on to creating alpha factors, there is one important step that needs to be done to ensure the data is ready for analysis. 

- Ensure price index is **datetime**, **timezone-naive**, and **normalized**. 


\`\`\`python
# Ensure prices.index is datetime, timezone-naive, and normalized
prices.index = pd.to_datetime(prices.index).tz_localize(None).normalize()
\`\`\`

---

## Creating Alpha Factors

Alpha factors are signals that can be used to predict the future price movement of a stock. They can be based on various metrics, such as price, volume
and other financial indicators. We use alpha factors to rank stocks on a daily basis, and then use the rankings to create a **long-short portfolio**.
An alpha factor is similar in dimensions to the prices dataframe, but instead of prices, it contains the alpha factor values for each ticker:
**a prediction of the future price movement of the stock**. The alpha factor I use for the strategy is one I created called **Price Compression**. The calculation is very simple 
and involves 3 steps:

1. Computing the daily **price change** and taking the **absolute value** of the changes. 

2. Take a **rolling standard deviation** with a **window length of 14** with a **minimum window length period of 3** to create the **compression score**. 

3. **Invert** the compression score.

Lastly, we create a dataframe for the factor with **multi-indexing**, where the first index is the **date** and the second index is the **ticker**, the required input for **Alphalens***. 

\`\`\`python
window = 14  # How many days to look back

# 1. Compute daily price change (absolute not percent)
daily_change = prices.diff().abs()

# 2. Rolling std of price change → how “compressed” is the price movement
compression = daily_change.rolling(window=window, min_periods=3).std()

# 3. Invert to score tight price action as higher signal
compression_factor = 1 / (compression)

# 4. Stack for Alphalens
factor = compression_factor.stack(dropna=True)
factor.name = "factor_price_compression"
\`\`\`

Due to the rolling window calculation used, the first 3 days of data will be NaN for the alpha factor, but alphalens will handle this automatically.
To get a better visual understanding, I plotted the factor for Apple and the price for Apple side by side. Each stock has an alpha factor value for that day just like 
each stock has a close price. 

\`\`\`python
aapl_values = factor.loc[(slice(None), 'AAPL')].sort_index()
aapl_values.plot(title="AAPL Factor Values", figsize=(10, 5))
plt.grid(True)
plt.show()
\`\`\`

<p align="center">
  <img src="/images/longshortportfolioproject/aapl_price.png" alt="Image 1">
</p>

\`\`\`python
prices['AAPL'].plot(title="AAPL Prices", ylabel="Price", figsize=(10, 5))
plt.grid(True)
plt.show()
\`\`\`

<p align="center">
<img src="/images/longshortportfolioproject/aapl_factor.png" alt="Image 2">
</p>

Since we lost 3 days in the rolling window calculation, we must remove the first 3 days of prices to ensure that the dates match. We must also maket the dataframe a 
multi-indexed dataframe with the first index being the date and the second index being the ticker. We also need to ensure that the index is timezone-naive.

\`\`\`python
# Clean factor index (ensure tz-naive)
factor.index = pd.MultiIndex.from_tuples(
    [(pd.to_datetime(d).tz_localize(None), t) for d, t in factor.index],
    names=["date", "ticker"]
)

prices = prices.iloc[3:] # Drop the first 3 days of prices to match the factor index
\`\`\`
---

## Evaluating Alpha Factors

To evaluate the **alpha factor**, we can use the **Alphalens library**, which provides tools for analyzing and visualizing alpha factors.
Alphalens also creates a ****long-short portfolio**** based on the alpha factor, which can be used to evaluate the performance of the alpha factor. 

To evaluate the alpha factor, we first need to import the Alphalens library and get ****clean factor and forward returns data****. We also import the **sic codes** from our
**postgresdatahandler** to do a **sector analysis** of the alpha factor.

\`\`\`python
import alphalens as al

groups = handler.get_sic_codes()

factor_data = al.utils.get_clean_factor_and_forward_returns( # Get clean factor and forward returns
    factor=factor,
    prices=prices,
    groupby = groups, # Pass the sic codes to do a sector analysis
    quantiles=9, # Number of quantiles to create
    periods=(1, 2, 3,) # Forward return periods to compute (in days)
)

\`\`\`

After running this code, Alphalens groups each stock every day into **9 quantiles** based on the **alpha factor value**. The lowest quantile contains stocks with **low** factor values.
We want these stocks to have **negative future returns**. The highest quantile contains stocks with **high** factor values, which we want to have **positive future returns**. 
Alphalens then computes **forward returns** for each quantile, which is the return of the stock in the next 1, 2, and 3 days.

<p align="center">
<img src="/images/longshortportfolioproject/quantile1.png" alt="Image 2">
</p>

 It is this data that is used to create the **full-tear sheet**,
 which contains various metrics and visualizations to evaluate the alpha factor. We also passes the sic codes to the tear sheet to do a sector analysis of the alpha factor 
 which allows us to see how the alpha factor performs across different sectors.
 
 \`\`\`python
al.tears.create_full_tear_sheet(factor_data, by_group=True)
\`\`\`

<p align="center">
<img src="/images/longshortportfolioproject/alphalens1.png" alt="Image 2">
</p>
`;


export default markdown;
