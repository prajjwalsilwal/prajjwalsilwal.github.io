# Sales Performance Optimization Dashboard

**A complete sales analytics pipeline using SQL automation and Jupyter-based data processing to analyze 10,000+ transactions and regional KPIs, resulting in a 40% improvement in planning accuracy and 20% growth in operational efficiency.**

---

## Project Overview

This project demonstrates a comprehensive sales analytics workflow, from data preprocessing through dashboard development. The pipeline standardizes data cleaning, aggregation, and KPI logic, enabling a scalable BI foundation for dashboard reporting and monthly performance reviews.

---

## Tech Stack

- **SQL**: Data aggregation, cleaning, and KPI calculations
- **Python**: Data processing and analysis (pandas, numpy)
- **Jupyter Notebook**: Exploratory data analysis and visualization
- **Power BI** (referenced): Dashboard visualization and presentation layer
- **Excel**: Data export and stakeholder communication

---

## Business Context

In a multi-region sales organization, leadership needed better visibility into:

- Regional sales performance and trends
- Actual vs. target/budget comparisons
- Product performance across different regions
- Planning accuracy and forecast variance
- Operational efficiency metrics

This dashboard addresses these needs by providing automated, standardized reporting that supports data-driven decision-making.

---

## Dataset

The `sample_sales_data.csv` includes synthetic but realistic sales transaction data with the following fields:

- **date**: Transaction date
- **region**: Sales region (North, South, East, West, Central)
- **product_category**: Product category (Electronics, Clothing, Home & Garden, etc.)
- **product_name**: Specific product name
- **units_sold**: Number of units sold in transaction
- **unit_price**: Price per unit
- **revenue**: Total revenue (units_sold × unit_price)
- **sales_target**: Target revenue for the period
- **sales_rep**: Sales representative identifier
- **customer_segment**: Customer segment (Enterprise, SMB, Consumer)

**Note**: This is synthetic sample data created for demonstration purposes.

---

## Key Questions Answered

1. **Which regions are top performers?** Identify highest revenue-generating regions and trends over time.
2. **What is the variance vs. target?** Compare actual sales to targets to identify gaps and opportunities.
3. **How do sales trends evolve over time?** Analyze monthly/quarterly trends to support forecasting.
4. **Which products drive the most revenue?** Product-level analysis to inform inventory and marketing decisions.
5. **How accurate are our sales plans?** Measure planning accuracy and identify areas for improvement.

---

## Approach

### 1. Data Cleaning

- Handle missing values (revenue, units_sold, dates)
- Standardize region names and product categories
- Validate data types and ranges
- Remove duplicates and outliers

### 2. SQL-Based Aggregation Logic

- Aggregate sales by region, product category, and time period
- Calculate KPIs: total revenue, units sold, average order value
- Compute variance metrics: (actual - target) / target × 100
- Create time-based aggregations (monthly, quarterly)

### 3. Feature Engineering

- Create derived metrics: revenue per unit, revenue per region
- Calculate growth rates: month-over-month, year-over-year
- Create categorical flags: above_target, below_target
- Time-based features: month, quarter, year

### 4. Dashboard Design Logic

- **Executive Summary**: Top-level KPIs (total revenue, variance %, top region)
- **Regional Performance**: Revenue by region with trend lines
- **Product Analysis**: Revenue by product category, top products
- **Variance Analysis**: Actual vs. target comparison with drill-down capability
- **Trend Analysis**: Time-series charts showing sales trends

---

## Key Insights & Impact

### Insights Generated

- Identified top-performing regions and underperforming markets
- Highlighted products with highest revenue contribution
- Quantified variance between actual sales and targets
- Revealed planning accuracy issues and root causes

### Business Impact (from resume)

- ✅ **40% improvement in planning accuracy**: Standardized KPI definitions and automated reporting eliminated inconsistencies in planning assumptions
- ✅ **20% growth in operational efficiency**: Automated data processing freed up analyst time, allowing focus on strategic analysis rather than manual data work
- ✅ **Scalable BI foundation**: SQL workflow enables consistent reporting across multiple business units

---

## How to Run

### Prerequisites

- Python 3.11+
- Required libraries: pandas, numpy, matplotlib, seaborn, jupyter

### Setup

1. Install dependencies:
```bash
pip install pandas numpy matplotlib seaborn jupyter
```

2. Navigate to the project directory:
```bash
cd projects/sales-performance-optimization-dashboard
```

### Run Analysis

1. **Data Preprocessing**:
```bash
python src/data_preprocessing.py
```
This will load `data/sample_sales_data.csv`, clean the data, and save a processed dataset.

2. **Sales Analysis**:
```bash
python src/sales_analysis.py
```
This will run the analysis and generate summary reports.

3. **Interactive Analysis** (Jupyter Notebook):
```bash
jupyter notebook notebooks/analysis_overview.ipynb
```
Open the notebook to explore the data interactively, view visualizations, and see detailed analysis steps.

### Outputs

- Processed dataset (CSV)
- Summary statistics printed to console
- Visualizations in the Jupyter notebook
- Analysis reports with key metrics

---

## Project Structure

```
sales-performance-optimization-dashboard/
├── README.md
├── data/
│   └── sample_sales_data.csv
├── notebooks/
│   └── analysis_overview.ipynb
└── src/
    ├── data_preprocessing.py
    └── sales_analysis.py
```

---

## Next Steps

- Integrate with live SQL Server or Azure SQL Database
- Connect to Power BI for interactive dashboard deployment
- Add automated scheduling for monthly report generation
- Expand to include predictive forecasting capabilities

