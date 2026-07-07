# AI Market Direction

A machine learning semester project to predict Indian stock market direction (NIFTY 50) using historical data, macroeconomic indicators, technical analysis, and machine learning models.

## 📚 Project Documentation
For a deep dive into the application flow, architecture, and logic, see the detailed documentation below:
- **[User Flow](file:///c:/Users/lalan/Desktop/aiml/AI_Market_Direction/docs/USER_FLOW.md)**: Walkthrough of user interaction and frontend dashboard features.
- **[Builder Flow](file:///c:/Users/lalan/Desktop/aiml/AI_Market_Direction/docs/BUILDER_FLOW.md)**: Developer setup, pipeline execution, and model training instructions.
- **[System Design](file:///c:/Users/lalan/Desktop/aiml/AI_Market_Direction/docs/SYSTEM_DESIGN.md)**: App architecture, components, directory structure, and data flow diagrams.
- **[How It Works](file:///c:/Users/lalan/Desktop/aiml/AI_Market_Direction/docs/HOW_IT_WORKS.md)**: Machine learning ensemble algorithms, consensus calculations, and feature engineering details.

## Folder Structure
```text
AI_Market_Direction/
│
├── backend/          # Flask API backend application
│
├── data/
│   ├── raw/          # Original downloaded CSV files
│   └── processed/    # Merged & processed datasets
│
├── docs/             # Technical documentation & design guides
│
├── notebooks/        # Jupyter Notebooks for step-by-step development
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

