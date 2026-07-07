# System Design

This document details the system architecture, component stack, data flow, and directory structure of the **AI Market Direction** application.

---

## 1. High-Level Architecture

The system follows a classic decoupled 3-tier architecture:

```
┌────────────────────────────────────────────────────────┐
│                   Presentation Layer                   │
│      (React 19 / Vite / Recharts / Tailwind CSS)        │
└───────────────────────────┬────────────────────────────┘
                            │ (HTTP / JSON)
                            ▼
┌────────────────────────────────────────────────────────┐
│                      API Backend                       │
│              (Flask / Flask-CORS / WSGI)               │
└───────────────────────────┬────────────────────────────┘
                            │ (File System Read)
                            ▼
┌────────────────────────────────────────────────────────┐
│                   Data & Model Layer                   │
│       (joblib PKL Models / CSV Feature Database)       │
└────────────────────────────────────────────────────────┘
```

### Component Details
1. **Presentation Layer**: A single-page application (SPA) built using React 19 and Vite. Styled with vanilla CSS and TailwindCSS. Charts are powered by Plotly and Recharts.
2. **API Backend**: A lightweight Flask web application that serves endpoints for prediction consensus, market snapshots, model details, historical predictions, and live alerts.
3. **Data & Model Layer**: Consists of serialised `.pkl` machine learning models (Logistic Regression, Random Forest, Gradient Boosting), a scaling transformer (`scaler.pkl`), and the pre-computed feature database (`feature_engineered_data.csv`).

---

## 2. Directory Structure

```text
AI_Market_Direction/
│
├── backend/                  # Flask API Application
│   ├── app.py                # Main backend controller and router
│   └── requirements.txt      # Python dependencies
│
├── data/                     # Raw and compiled datasets
│   ├── raw/                  # Raw CSV files downloaded via yfinance
│   └── processed/            # Preprocessed and feature-engineered datasets
│
├── docs/                     # Documentation files
│   ├── USER_FLOW.md          # User experience walkthrough
│   ├── BUILDER_FLOW.md       # Development & pipeline configuration
│   ├── SYSTEM_DESIGN.md      # Architecture & system configuration
│   └── HOW_IT_WORKS.md       # Inference math & consensus logic
│
├── frontend/                 # React 19 Frontend App
│   ├── src/
│   │   ├── components/       # Visual components (cards, gauges, charts)
│   │   ├── layouts/          # Page layouts
│   │   ├── pages/            # View pages (Dashboard, Analytics, Insights)
│   │   └── services/         # Axios API service handlers
│   ├── package.json          # Node dependencies and build scripts
│   └── index.html            # Main HTML entry point
│
├── models/                   # Serialized ML assets (joblib pickle files)
│   ├── logistic_regression.pkl
│   ├── random_forest.pkl
│   ├── gradient_boosting.pkl
│   └── scaler.pkl
│
├── notebooks/                # Jupyter Notebooks for model builders
│   └── 01_... to 05_...
│
└── requirements.txt          # Root Python dependencies
```

---

## 3. Data Flow (Inference Request)

1. The user visits the dashboard.
2. The frontend triggers concurrent HTTP GET requests to:
   - `/api/prediction` (consensual forecast)
   - `/api/market` (market volatility state)
   - `/api/history` (retrospective logs)
   - `/api/alerts` (health and signal alerts)
3. The backend extracts the latest row from `data/processed/feature_engineered_data.csv`.
4. The backend transforms the features using the preloaded `scaler.pkl` transformer.
5. The scaled vector is fed into the three loaded classifiers: Logistic Regression, Random Forest, and Gradient Boosting.
6. The backend computes the consensus predictions and return values, sending them as JSON back to the client.
7. React updates the state and updates the interactive elements on the UI.
