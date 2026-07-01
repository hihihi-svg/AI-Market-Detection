# AI Market Direction

A machine learning semester project to predict Indian stock market direction (NIFTY 50) using historical data, macroeconomic indicators, technical analysis, and machine learning models.

## Folder Structure
```text
AI_Market_Direction/
│
├── data/
│   ├── raw/          # Original downloaded CSV files
│   └── processed/    # Merged & processed datasets
│
├── notebooks/        # Jupyter Notebooks for step-by-step development
│
├── src/              # Modular python source code
│
├── models/           # Saved trained models
│
├── dashboard/        # Interactive dashboard files
│
├── requirements.txt  # Python package requirements
└── README.md         # Project documentation
```

## Step 1: Data Collection & Dataset Creation
Historical daily data (from 2010-01-01 to 2025-12-31) is collected for the following:
* **NIFTY 50 (`^NSEI`)**: Main market index (Target Market)
* **Gold (`GC=F`)**: Safe-haven investment asset
* **Crude Oil (`CL=F`)**: Macroeconomic input cost driver
* **USD/INR (`INR=X`)**: Currency fluctuations driver
* **India VIX (`^INDIAVIX`)**: Market volatility & fear gauge
