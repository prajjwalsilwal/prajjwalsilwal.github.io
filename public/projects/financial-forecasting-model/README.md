# Financial Forecasting Model

**A regression-based forecasting model using Python to analyze historical sales and expense patterns, improving forecast accuracy by 18% and strengthening proactive financial planning.**

---

## Project Overview

This project demonstrates a complete financial forecasting workflow, from data preparation through model development and visualization. The model analyzes historical sales and expense patterns to generate forecasts that support budgeting decisions, enabling leadership to compare baseline vs. scenario-based projections.

---

## Tech Stack

- **Python**: Data preprocessing, model development (pandas, numpy, scikit-learn)
- **Excel**: Data export and manual scenario adjustments
- **Power BI**: Visualization of baseline vs. scenario projections
- **Jupyter Notebook**: Model development, evaluation, and visualization

---

## Business Context

Financial planning teams need accurate forecasts to:

- Set realistic budgets for upcoming quarters
- Identify potential revenue shortfalls or expense overruns early
- Compare different scenarios (baseline, optimistic, pessimistic)
- Make data-driven decisions about resource allocation

Traditional forecasting relied heavily on manual adjustments and lacked statistical rigor. This model provides an automated, data-driven approach that improves forecast accuracy while enabling scenario analysis.

---

## Dataset

The `sample_financial_data.csv` includes synthetic but realistic monthly financial data with the following fields:

- **date**: Month-end date (YYYY-MM-DD format)
- **category**: Revenue or expense category (Sales, Marketing, Operations, etc.)
- **actual_sales**: Actual sales revenue for the month
- **forecast_sales**: Previously forecasted sales (for comparison)
- **actual_expenses**: Actual expenses for the month
- **forecast_expenses**: Previously forecasted expenses (for comparison)
- **scenario**: Scenario identifier (Baseline, Optimistic, Pessimistic)
- **seasonality_factor**: Seasonal adjustment factor (optional)
- **market_conditions**: Market condition indicator (optional)

**Note**: This is synthetic sample data created for demonstration purposes.

---

## Key Questions Answered

1. **What revenue should we expect next quarter?** Generate forecasts for upcoming periods based on historical trends.
2. **How accurate are our current forecasting methods?** Measure forecast accuracy and identify improvement opportunities.
3. **What are the expense trends?** Predict future expenses to support budgeting decisions.
4. **How do different scenarios impact our financials?** Compare baseline, optimistic, and pessimistic scenarios.
5. **What is the variance between actuals and forecasts?** Identify areas where forecasting consistently over- or underestimates.

---

## Approach

### 1. Data Cleaning

- Handle missing values in actual and forecast columns
- Standardize date formats and ensure chronological ordering
- Validate expense and revenue categories
- Calculate derived metrics: variance, percentage error

### 2. Exploratory Data Analysis

- Visualize historical trends (time-series plots)
- Identify seasonality patterns
- Analyze variance between actuals and previous forecasts
- Detect outliers and anomalies

### 3. Regression-Based Modeling

- **Linear Regression**: Model sales and expenses as functions of time
- **Polynomial Regression**: Capture non-linear trends
- **Feature Engineering**: Create time-based features (month, quarter, lag variables)
- **Train/Test Split**: Validate model performance on hold-out data

### 4. Scenario Analysis

- Generate baseline forecasts using the regression model
- Create optimistic scenarios (e.g., +10% growth assumption)
- Create pessimistic scenarios (e.g., -5% growth assumption)
- Compare scenarios to support decision-making

### 5. Visualization

- Time-series plots showing actual vs. forecast
- Scenario comparison charts
- Accuracy metrics (MAPE, RMSE)
- Budget vs. forecast comparisons

---

## Key Insights & Impact

### Insights Generated

- Identified systematic biases in previous forecasting methods
- Quantified seasonality effects in sales and expenses
- Generated more accurate baseline forecasts for budgeting
- Enabled scenario planning for risk management

### Business Impact (from resume)

- ✅ **18% improvement in forecast accuracy**: Regression-based approach reduced forecast error compared to previous manual methods
- ✅ **Proactive financial planning**: Earlier visibility into potential revenue shortfalls and expense overruns
- ✅ **Scenario-based decision support**: Leadership can compare multiple scenarios to make informed budgeting decisions

---

## How to Run

### Prerequisites

- Python 3.11+
- Required libraries: pandas, numpy, matplotlib, seaborn, scikit-learn, jupyter

### Setup

1. Install dependencies:
```bash
pip install pandas numpy matplotlib seaborn scikit-learn jupyter
```

2. Navigate to the project directory:
```bash
cd projects/financial-forecasting-model
```

### Run Analysis

1. **Data Preprocessing**:
```bash
python src/data_preprocessing.py
```
This will load `data/sample_financial_data.csv`, clean the data, engineer features, and save a processed dataset.

2. **Forecasting Model**:
```bash
python src/forecasting_model.py
```
This will train the regression model, generate forecasts, and output results.

3. **Interactive Analysis** (Jupyter Notebook):
```bash
jupyter notebook notebooks/forecasting_overview.ipynb
```
Open the notebook to:
- Explore the data interactively
- See model development steps
- Visualize forecasts and scenarios
- Review accuracy metrics

### Outputs

- Processed dataset (CSV)
- Forecast results (CSV)
- Model accuracy metrics printed to console
- Visualizations in the Jupyter notebook
- Scenario comparison charts

---

## Project Structure

```
financial-forecasting-model/
├── README.md
├── data/
│   └── sample_financial_data.csv
├── notebooks/
│   └── forecasting_overview.ipynb
└── src/
    ├── data_preprocessing.py
    └── forecasting_model.py
```

---

## Model Details

### Regression Approach

- **Target Variables**: Monthly sales revenue, monthly expenses
- **Features**: Time index, month of year, quarter, lagged values
- **Model Types**: Linear regression, polynomial regression
- **Evaluation Metrics**: Mean Absolute Percentage Error (MAPE), Root Mean Squared Error (RMSE)

### Forecast Horizon

- Short-term: 1-3 months ahead
- Medium-term: Quarterly forecasts
- Long-term: Annual projections

---

## Next Steps

- Implement time-series models (ARIMA, Prophet) for better seasonality handling
- Integrate external variables (market indicators, economic data)
- Build automated forecast refresh workflows
- Deploy forecasts to Power BI for interactive scenario analysis
- Add confidence intervals to forecast ranges

