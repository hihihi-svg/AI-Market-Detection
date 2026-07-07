# How It Works

This document explains the mathematical foundations, machine learning algorithms, feature engineering techniques, and simulated mechanics that power the **AI Market Direction** application.

---

## 1. Feature Engineering

To predict stock index direction (NIFTY 50), the system doesn't rely solely on historical closing prices. It derives multiple dimensions of information:

### Technical Indicators
- **Simple & Exponential Moving Averages (SMA/EMA)**: Captures price trends over windows like 5, 10, and 20 days.
- **Relative Strength Index (RSI)**: Measures the speed and change of price movements on a scale of 0 to 100 to detect overbought or oversold conditions.
- **Moving Average Convergence Divergence (MACD)**: Indicates trend-following momentum changes.
- **Bollinger Bands**: Captures market volatility levels and potential price extremes.

### Inter-market Indicators
- **Safe-Havens (Gold)**: Used to detect risk-off sentiment shifts.
- **Energy Commodities (Crude Oil)**: High crude oil prices typically impact fiscal balance and inflation metrics in import-heavy nations like India.
- **Forex (USD/INR)**: Tracks currency strength fluctuations.
- **Volatility (India VIX)**: Directly gauges option-implied market volatility and short-term risk levels.

---

## 2. Machine Learning Ensemble Model

The application leverages a voting ensemble classifier consisting of three algorithms:

1. **Logistic Regression (LR)**: Establishes a baseline probabilistic model using a linear decision boundary.
2. **Random Forest (RF)**: A bagging ensemble tree-based classifier that handles non-linear patterns and interactions.
3. **Gradient Boosting (GB)**: An additive boosting model that iteratively builds trees to minimize classification errors.

### Consensus & Ensemble Logic
For a given features vector $X$:
1. Extract features and scale them:
   $$X_{scaled} = \text{Scaler}(X)$$
2. Predict binary direction (0 = Down, 1 = Up) and probability score $P(y=1|X_{scaled})$ for each classifier.
3. Compute the Consensus Vote ($C_v$):
   $$C_v = 1 \quad \text{if} \quad \frac{\text{LR}_{pred} + \text{RF}_{pred} + \text{GB}_{pred}}{3} \ge 0.5 \quad \text{else} \quad 0$$
4. Compute the Ensemble Confidence:
   $$\text{Confidence} = \frac{P_{lr} + P_{rf} + P_{gb}}{3}$$

---

## 3. Simulated Live Engine

To recreate the dynamic feel of real-time trading terminals, the application implements active simulation mechanics:
- **Price Tickers**: The current price oscillates within random, bounded increments on the client dashboard.
- **Probability Fluctuations**: A slight random volatility factor ($\pm 4\%$) is introduced to the probabilities at each API request, simulating real-time market updates.
- **Last Updated Timestamps**: Timestamps are computed relative to the current local server clock to maintain a realistic real-time dashboard state.
