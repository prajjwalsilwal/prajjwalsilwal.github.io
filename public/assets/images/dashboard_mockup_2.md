# Dashboard Mockup: Financial Forecasting Model Dashboard

## Visual Description

This markdown file describes the layout and components of the Financial Forecasting Dashboard built in Power BI, which visualizes forecast results and scenario comparisons.

### Overall Layout

The dashboard is structured to support financial planning and budgeting decisions:
- **Historical vs. Forecast Page**: Shows historical trends alongside future projections
- **Scenario Comparison Page**: Enables side-by-side comparison of baseline, optimistic, and pessimistic scenarios
- **Accuracy Analysis Page**: Demonstrates forecast accuracy improvements

### Historical vs. Forecast Page Components

1. **Header Section**
   - Dashboard title: "Financial Forecasting Dashboard"
   - Model last updated timestamp
   - Category filter (Sales, Marketing, Operations)

2. **KPI Cards (Top Row)**
   - Next Quarter Forecast: Baseline forecast for upcoming quarter
   - Forecast Accuracy (MAPE): Shows model accuracy metric
   - Historical Average: Average of historical actuals for context
   - Improvement vs. Previous Method: Percentage improvement in accuracy

3. **Main Time-Series Chart (Large Central Area)**
   - Line chart spanning historical and forecast periods
   - Historical period: Shows actual sales/expenses (solid blue line)
   - Forecast period: Shows baseline forecast (solid green line)
   - Vertical divider line separating historical from forecast
   - Optional: Confidence intervals shown as shaded area around forecast line

4. **Variance Analysis (Right Sidebar)**
   - Small table or cards showing:
     - Average historical variance between actual and previous forecasts
     - Average variance for new model (on training data)
     - Improvement percentage

5. **Monthly Breakdown Table (Bottom)**
   - Detailed table showing:
     - Historical months: Actual, Previous Forecast, Variance
     - Forecast months: Baseline Forecast, Optimistic, Pessimistic
   - Color-coded variance column (green for good, red for high variance)

### Scenario Comparison Page Components

1. **Triple-Line Chart (Main Visualization)**
   - Three forecast lines:
     - Baseline Forecast (solid green)
     - Optimistic Scenario (dashed orange, +5% assumption)
     - Pessimistic Scenario (dashed red, -5% assumption)
   - Historical actuals shown for context (faded blue line)
   - X-axis: Future months (6-12 month horizon)
   - Y-axis: Revenue or Expenses in dollars

2. **Scenario Summary Cards**
   - Three side-by-side cards showing:
     - Total forecast for next 6 months (Baseline, Optimistic, Pessimistic)
     - Variance between scenarios (Optimistic vs. Baseline, Pessimistic vs. Baseline)

3. **Risk Analysis**
   - Small bar chart showing range of outcomes
   - Highlights the spread between optimistic and pessimistic scenarios

### Visual Design Notes

- **Color Scheme**: Professional financial color palette (blue for historical, green for baseline, orange/red for scenarios)
- **Clarity**: Clear differentiation between historical (actual) and forecasted (projected) data
- **Interactivity**: Date range filters, category filters, scenario toggle options
- **Export**: Ability to export forecast tables for budget planning

### Key Features

- **What-If Analysis**: Users can adjust scenario assumptions (growth rates, etc.)
- **Comparison Mode**: Toggle between single-line and multi-scenario views
- **Export to Excel**: Export forecast tables for integration into budget workbooks
- **Drill-Down**: Click on a month to see category-level breakdowns (Sales, Marketing, Operations)

### Accuracy Analysis Page (Optional)

- Line chart comparing:
  - Historical forecasts (from previous method) vs. actuals
  - Model predictions (on historical data) vs. actuals
- Shows improvement in forecast accuracy over time
- Includes MAPE and RMSE metrics in visual annotations

---

**Note**: This is a text description. In a real portfolio, this would be replaced with actual dashboard screenshots or a link to a published Power BI dashboard.

