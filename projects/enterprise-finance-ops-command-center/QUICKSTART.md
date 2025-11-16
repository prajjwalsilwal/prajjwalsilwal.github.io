# Quick Start Guide

## Step 1: Install Dependencies

```bash
pip install -r requirements.txt
```

## Step 2: Generate Data

```bash
python data/finance_data_generator.py
```

This creates all the data files needed for analysis.

## Step 3: Run Analysis (Choose One)

### Option A: Jupyter Notebook Analysis
```bash
jupyter notebook notebooks/finance_eda.ipynb
```
Run all cells to generate charts in the `images/` folder.

### Option B: Streamlit Dashboard
```bash
streamlit run app/finance_dashboard.py
```
Opens an interactive dashboard in your browser.

## Step 4: Review Report

Open `reports/finance_insights_report.md` to read the executive summary and findings.

---

**Note:** Make sure to run the data generator (Step 2) before running the notebook or dashboard!

