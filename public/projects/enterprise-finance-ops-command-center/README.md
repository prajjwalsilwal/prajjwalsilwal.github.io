# Enterprise Finance & Operations Command Center

A comprehensive, end-to-end analytics ecosystem for finance and operations built with Python, SQL-backed data pipelines, automated reporting, KPI standardization, and executive-ready dashboards.

## 📋 Project Overview

This project demonstrates a complete analytics solution for enterprise finance and operations, featuring:

- **Synthetic Data Generation:** Realistic financial and operational data for 3-4 years
- **Exploratory Data Analysis:** Comprehensive Jupyter notebook analysis with automated chart generation
- **Interactive Dashboard:** Streamlit-based executive dashboard with real-time filtering and visualization
- **Automated Reporting:** Auto-generated insights report with key findings and recommendations
- **KPI Standardization:** Consistent metrics across financial and operational dimensions

The project showcases skills in:
- Data engineering and pipeline development
- Financial analytics and variance analysis
- Operations metrics and SLA tracking
- Dashboard development and data visualization
- Business intelligence and reporting

## 🛠️ Tech Stack

- **Python 3.8+**
- **Pandas** - Data manipulation and analysis
- **NumPy** - Numerical computations
- **Matplotlib** - Data visualization
- **Seaborn** - Statistical visualizations
- **Streamlit** - Interactive web dashboard
- **Jupyter** - Exploratory data analysis
- **Faker** - Synthetic data generation

## 📊 Data Description

### Fact Tables

**fact_financials**
- Financial metrics: revenue, opex, capex, profit, headcount
- Budget and forecast data for variance analysis
- Monthly granularity across departments and regions
- Calculated fields: profit margin, revenue variance, forecast accuracy

**fact_operations**
- Operational metrics: tickets resolved, SLA breaches, cycle time
- Resource utilization and backlog tracking
- Monthly granularity across departments and regions
- Calculated fields: SLA breach rate, tickets per headcount

### Dimension Tables

**dim_date**
- Date dimension with year, quarter, month, day attributes
- Supports time-based analysis and aggregations

**dim_department**
- 8 departments: Engineering, Sales, Marketing, Operations, Finance, HR, Customer Support, Product
- Cost center and department head information

**dim_region**
- 4 regions: North America, Europe, Asia Pacific, Latin America
- Regional manager and timezone information

### Processed Analytical Tables

- **financials_analytical.csv** - Joined financial data with dimensions and calculated metrics
- **operations_analytical.csv** - Joined operations data with dimensions and calculated metrics
- **combined_metrics_monthly.csv** - Monthly aggregated metrics combining financial and operational data

## 🚀 Features

### 1. KPI Design & Standardization
- Revenue, profit, profit margin tracking
- OPEX and CAPEX analysis
- Budget vs actual vs forecast variance analysis
- Operations KPIs: SLA breach rate, cycle time, utilization

### 2. Variance Analysis
- Quarterly variance reporting
- Budget accuracy tracking
- Forecast accuracy metrics
- Department and region-level variance analysis

### 3. Executive Dashboard
- Real-time filtering by date range, department, and region
- KPI cards with key metrics
- Interactive time series charts
- Department and region performance comparisons
- Variance analysis visualizations
- Operations KPIs monitoring

### 4. Automated Reporting
- Comprehensive insights report
- Key findings and recommendations
- Visual chart references
- Executive summary and detailed analysis

## 📁 Project Structure

```
enterprise-finance-ops-command-center/
│
├── data/
│   ├── finance_data_generator.py    # Synthetic data generation script
│   ├── raw/                          # Raw dimension and fact tables
│   │   ├── dim_date.csv
│   │   ├── dim_department.csv
│   │   ├── dim_region.csv
│   │   ├── fact_financials.csv
│   │   └── fact_operations.csv
│   └── processed/                    # Processed analytical tables
│       ├── financials_analytical.csv
│       ├── operations_analytical.csv
│       └── combined_metrics_monthly.csv
│
├── notebooks/
│   └── finance_eda.ipynb             # Exploratory data analysis notebook
│
├── app/
│   └── finance_dashboard.py          # Streamlit dashboard application
│
├── images/                           # Auto-generated charts and visualizations
│   ├── revenue_expense_profit_trends.png
│   ├── profit_margin_by_department.png
│   ├── variance_analysis_quarterly.png
│   ├── department_performance_comparison.png
│   ├── region_performance_comparison.png
│   └── operations_kpis_analysis.png
│
├── reports/
│   └── finance_insights_report.md    # Executive insights report
│
├── README.md                         # This file
└── requirements.txt                  # Python dependencies
```

## 🏃 How to Run

### Prerequisites

- Python 3.8 or higher
- pip (Python package manager)

### Installation

1. **Clone or navigate to the project directory:**
   ```bash
   cd enterprise-finance-ops-command-center
   ```

2. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

### Step 1: Generate Data

Generate synthetic financial and operational data:

```bash
python data/finance_data_generator.py
```

This will create:
- Raw CSV files in `data/raw/`
- Processed analytical tables in `data/processed/`

**Expected output:**
```
Generating synthetic finance and operations data...
============================================================
Generating dimension tables...
  ✓ dim_date: 1461 rows
  ✓ dim_department: 8 rows
  ✓ dim_region: 4 rows

Generating fact tables...
  ✓ fact_financials: 1536 rows
  ✓ fact_operations: 1536 rows

Saving raw data...
✓ Raw data saved to data/raw/

Creating analytical tables...
✓ Processed analytical tables saved to data/processed/
```

### Step 2: Run Jupyter Analysis

Launch Jupyter Notebook and run the EDA:

```bash
jupyter notebook notebooks/finance_eda.ipynb
```

Or use JupyterLab:

```bash
jupyter lab notebooks/finance_eda.ipynb
```

The notebook will:
- Load processed data
- Perform descriptive statistics
- Generate trend analysis
- Create variance analysis
- Compare department and region performance
- Analyze operations KPIs
- Save all charts to `images/` directory

**Charts generated:**
- `revenue_expense_profit_trends.png`
- `profit_margin_by_department.png`
- `variance_analysis_quarterly.png`
- `department_performance_comparison.png`
- `region_performance_comparison.png`
- `operations_kpis_analysis.png`

### Step 3: Launch Streamlit Dashboard

Run the interactive dashboard:

```bash
streamlit run app/finance_dashboard.py
```

The dashboard will open in your default web browser (typically at `http://localhost:8501`).

**Dashboard features:**
- Sidebar filters for date range, department, and region
- Real-time KPI cards
- Interactive time series charts
- Department and region comparisons
- Variance analysis visualizations
- Operations KPIs monitoring

### Step 4: Review Insights Report

Read the comprehensive analysis report:

```bash
# Open in your preferred markdown viewer or text editor
cat reports/finance_insights_report.md
```

Or view it in any markdown-compatible viewer.

## 📈 Screenshots & Visualizations

All charts are automatically saved to the `images/` directory when you run the Jupyter notebook. Key visualizations include:

### Financial Trends
- **Revenue vs Expenses vs Profit Trends** (`revenue_expense_profit_trends.png`)
  - Shows monthly trends over the entire analysis period
  - Highlights growth trajectory and seasonal patterns

### Department Analysis
- **Profit Margin by Department** (`profit_margin_by_department.png`)
  - Horizontal bar chart showing average profit margins
  - Identifies top-performing departments

- **Department Performance Comparison** (`department_performance_comparison.png`)
  - Side-by-side revenue and profit comparisons
  - Highlights revenue leaders and profit efficiency

### Variance Analysis
- **Quarterly Variance Analysis** (`variance_analysis_quarterly.png`)
  - Actual vs budget vs forecast comparison
  - Variance percentage visualization

### Regional Performance
- **Region Performance Comparison** (`region_performance_comparison.png`)
  - Revenue and profit by region
  - Identifies regional strengths and opportunities

### Operations KPIs
- **Operations KPIs Analysis** (`operations_kpis_analysis.png`)
  - Four-panel visualization: SLA breach rate, cycle time, utilization, tickets resolved
  - Shows trends and target achievement

## 🔍 Key Metrics Tracked

### Financial KPIs
- **Revenue:** Total and by department/region
- **Profit:** Total and margin percentage
- **OPEX:** Operating expenses and ratio to revenue
- **CAPEX:** Capital expenditures by department
- **Variance:** Actual vs budget vs forecast

### Operational KPIs
- **Tickets Resolved:** Total and by department
- **SLA Breach Rate:** Percentage of tickets breaching SLA
- **Cycle Time:** Average time to resolve tickets
- **Utilization:** Resource utilization percentage
- **Backlog:** Pending tickets over time

## 📝 Notes

- **Data:** All data is synthetic and generated for demonstration purposes
- **Performance:** The dashboard handles large datasets efficiently with Streamlit caching
- **Extensibility:** The codebase is modular and can be extended with additional metrics or visualizations
- **Customization:** All charts and dashboards can be customized by modifying the respective Python files

## 🤝 Contributing

This is a portfolio project demonstrating end-to-end analytics capabilities. Feel free to:
- Extend the analysis with additional metrics
- Add new visualizations
- Improve the dashboard functionality
- Enhance the data generation logic

## 📄 License

This project is provided as-is for portfolio and educational purposes.

## 👤 Author

Built as a portfolio project demonstrating:
- End-to-end analytics ecosystem development
- SQL-backed data pipeline design
- Automated reporting and KPI standardization
- Executive-ready dashboard creation
- Business intelligence and data visualization

---

**For questions or feedback, please refer to the code comments and documentation within each file.**

