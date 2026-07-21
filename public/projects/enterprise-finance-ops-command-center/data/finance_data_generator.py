"""
Finance & Operations Data Generator
Generates synthetic but realistic financial and operational data for analytics.
Creates fact tables (fact_financials, fact_operations) and dimension tables.
"""

import pandas as pd
import numpy as np
from faker import Faker
import random
from datetime import datetime, timedelta
import os

# Initialize Faker
fake = Faker()
Faker.seed(42)
np.random.seed(42)
random.seed(42)

# Configuration
START_DATE = datetime(2021, 1, 1)
END_DATE = datetime(2024, 12, 31)
MONTHS = pd.date_range(START_DATE, END_DATE, freq='MS')  # Monthly start dates

# Department and Region definitions
DEPARTMENTS = [
    'Engineering', 'Sales', 'Marketing', 'Operations', 
    'Finance', 'HR', 'Customer Support', 'Product'
]

REGIONS = ['North America', 'Europe', 'Asia Pacific', 'Latin America']

def generate_dim_date():
    """Generate date dimension table."""
    dates = []
    current_date = START_DATE
    
    while current_date <= END_DATE:
        dates.append({
            'date_key': current_date.strftime('%Y%m%d'),
            'date': current_date,
            'year': current_date.year,
            'quarter': f"Q{(current_date.month - 1) // 3 + 1}",
            'month': current_date.month,
            'month_name': current_date.strftime('%B'),
            'year_month': current_date.strftime('%Y-%m'),
            'day_of_week': current_date.strftime('%A'),
            'is_weekend': 1 if current_date.weekday() >= 5 else 0
        })
        current_date += timedelta(days=1)
    
    df = pd.DataFrame(dates)
    return df

def generate_dim_department():
    """Generate department dimension table."""
    departments = []
    for i, dept in enumerate(DEPARTMENTS, 1):
        departments.append({
            'department_id': i,
            'department_name': dept,
            'cost_center': f"CC{1000 + i}",
            'head_of_dept': fake.name()
        })
    df = pd.DataFrame(departments)
    return df

def generate_dim_region():
    """Generate region dimension table."""
    regions = []
    for i, region in enumerate(REGIONS, 1):
        regions.append({
            'region_id': i,
            'region_name': region,
            'region_manager': fake.name(),
            'timezone': random.choice(['EST', 'PST', 'GMT', 'JST', 'BRT'])
        })
    df = pd.DataFrame(regions)
    return df

def generate_fact_financials(dim_date, dim_department, dim_region):
    """Generate financial fact table with revenue, expenses, and budget data."""
    records = []
    budget_cache = {}  # Cache budgets by (year, dept_id, region_id)
    
    for month in MONTHS:
        for dept in dim_department.itertuples():
            for region in dim_region.itertuples():
                # Base revenue varies by department and region
                base_revenue = {
                    'Engineering': 800000,
                    'Sales': 1200000,
                    'Marketing': 600000,
                    'Operations': 400000,
                    'Finance': 200000,
                    'HR': 150000,
                    'Customer Support': 300000,
                    'Product': 500000
                }[dept.department_name]
                
                # Regional multipliers
                region_mult = {
                    'North America': 1.2,
                    'Europe': 1.0,
                    'Asia Pacific': 0.9,
                    'Latin America': 0.7
                }[region.region_name]
                
                # Add trend and seasonality
                months_from_start = (month.year - START_DATE.year) * 12 + (month.month - START_DATE.month)
                trend = 1 + (months_from_start * 0.01)  # 1% growth per month
                seasonality = 1 + 0.1 * np.sin(2 * np.pi * month.month / 12)  # Seasonal variation
                
                revenue = base_revenue * region_mult * trend * seasonality * np.random.uniform(0.85, 1.15)
                
                # Operating expenses (OPEX) - typically 60-80% of revenue
                opex_ratio = np.random.uniform(0.60, 0.80)
                opex = revenue * opex_ratio
                
                # Capital expenditures (CAPEX) - varies by department
                capex_ratio = {
                    'Engineering': 0.15,
                    'Sales': 0.05,
                    'Marketing': 0.10,
                    'Operations': 0.12,
                    'Finance': 0.03,
                    'HR': 0.02,
                    'Customer Support': 0.08,
                    'Product': 0.20
                }[dept.department_name]
                capex = revenue * capex_ratio * np.random.uniform(0.8, 1.2)
                
                # Headcount - grows with revenue but with lag
                base_headcount = {
                    'Engineering': 50,
                    'Sales': 30,
                    'Marketing': 20,
                    'Operations': 25,
                    'Finance': 15,
                    'HR': 10,
                    'Customer Support': 40,
                    'Product': 25
                }[dept.department_name]
                headcount = int(base_headcount * trend * region_mult * np.random.uniform(0.9, 1.1))
                
                # Profit
                profit = revenue - opex - capex
                
                # Budget (set at beginning of year, with some variance)
                budget_key = (month.year, dept.department_id, region.region_id)
                if month.month == 1:
                    budget_revenue = revenue * np.random.uniform(0.95, 1.05)
                    budget_cache[budget_key] = budget_revenue
                else:
                    # Budget stays constant for the year
                    budget_revenue = budget_cache.get(budget_key, revenue)
                
                # Forecast (updated monthly, closer to actual)
                forecast_revenue = revenue * np.random.uniform(0.98, 1.02)
                
                records.append({
                    'date': month,
                    'date_key': month.strftime('%Y%m%d'),
                    'department_id': dept.department_id,
                    'region_id': region.region_id,
                    'revenue': round(revenue, 2),
                    'opex': round(opex, 2),
                    'capex': round(capex, 2),
                    'headcount': headcount,
                    'profit': round(profit, 2),
                    'budget': round(budget_revenue, 2),
                    'forecast': round(forecast_revenue, 2)
                })
    
    df = pd.DataFrame(records)
    return df

def generate_fact_operations(dim_date, dim_department, dim_region):
    """Generate operations fact table with SLA, tickets, and utilization metrics."""
    records = []
    backlog_cache = {}  # Cache backlogs by (dept_id, region_id)
    
    for month in MONTHS:
        for dept in dim_department.itertuples():
            for region in dim_region.itertuples():
                # Base metrics vary by department
                base_tickets = {
                    'Engineering': 150,
                    'Sales': 80,
                    'Marketing': 60,
                    'Operations': 200,
                    'Finance': 40,
                    'HR': 30,
                    'Customer Support': 500,
                    'Product': 100
                }[dept.department_name]
                
                # Regional variation
                region_mult = {
                    'North America': 1.3,
                    'Europe': 1.0,
                    'Asia Pacific': 0.8,
                    'Latin America': 0.6
                }[region.region_name]
                
                # Trend over time
                months_from_start = (month.year - START_DATE.year) * 12 + (month.month - START_DATE.month)
                trend = 1 + (months_from_start * 0.005)  # Slight growth
                
                tickets_resolved = int(base_tickets * region_mult * trend * np.random.uniform(0.9, 1.1))
                
                # SLA breaches (typically 2-8% of tickets)
                sla_breach_rate = np.random.uniform(0.02, 0.08)
                sla_breaches = int(tickets_resolved * sla_breach_rate)
                
                # Cycle time (days) - varies by department
                base_cycle_time = {
                    'Engineering': 5.0,
                    'Sales': 2.0,
                    'Marketing': 3.0,
                    'Operations': 4.0,
                    'Finance': 1.5,
                    'HR': 2.5,
                    'Customer Support': 1.0,
                    'Product': 6.0
                }[dept.department_name]
                cycle_time = base_cycle_time * np.random.uniform(0.8, 1.3)
                
                # Utilization (percentage) - typically 70-95%
                utilization = np.random.uniform(70, 95)
                
                # Backlog (carries over, with some randomness)
                backlog_key = (dept.department_id, region.region_id)
                if month == MONTHS[0]:
                    backlog = int(tickets_resolved * np.random.uniform(0.1, 0.3))
                else:
                    # Previous backlog + new tickets - resolved
                    prev_backlog = backlog_cache.get(backlog_key, 0)
                    new_tickets = int(tickets_resolved * np.random.uniform(1.0, 1.2))
                    backlog = max(0, int(prev_backlog + new_tickets - tickets_resolved))
                
                backlog_cache[backlog_key] = backlog
                
                records.append({
                    'date': month,
                    'date_key': month.strftime('%Y%m%d'),
                    'department_id': dept.department_id,
                    'region_id': region.region_id,
                    'tickets_resolved': tickets_resolved,
                    'sla_breaches': sla_breaches,
                    'cycle_time': round(cycle_time, 2),
                    'utilization': round(utilization, 2),
                    'backlog': backlog
                })
    
    df = pd.DataFrame(records)
    return df

def save_raw_data(dim_date, dim_department, dim_region, fact_financials, fact_operations):
    """Save raw dimension and fact tables to data/raw/."""
    raw_dir = 'data/raw'
    os.makedirs(raw_dir, exist_ok=True)
    
    dim_date.to_csv(f'{raw_dir}/dim_date.csv', index=False)
    dim_department.to_csv(f'{raw_dir}/dim_department.csv', index=False)
    dim_region.to_csv(f'{raw_dir}/dim_region.csv', index=False)
    fact_financials.to_csv(f'{raw_dir}/fact_financials.csv', index=False)
    fact_operations.to_csv(f'{raw_dir}/fact_operations.csv', index=False)
    
    print(f"✓ Raw data saved to {raw_dir}/")

def create_analytical_tables(dim_date, dim_department, dim_region, fact_financials, fact_operations):
    """Create joined analytical tables for easier analysis."""
    processed_dir = 'data/processed'
    os.makedirs(processed_dir, exist_ok=True)
    
    # Financials analytical table
    financials_analytical = fact_financials.merge(
        dim_date[['date_key', 'year', 'quarter', 'month', 'month_name', 'year_month']],
        on='date_key', how='left'
    ).merge(
        dim_department[['department_id', 'department_name', 'cost_center']],
        on='department_id', how='left'
    ).merge(
        dim_region[['region_id', 'region_name']],
        on='region_id', how='left'
    )
    
    # Add calculated fields
    financials_analytical['profit_margin'] = (financials_analytical['profit'] / financials_analytical['revenue'] * 100).round(2)
    financials_analytical['revenue_variance'] = ((financials_analytical['revenue'] - financials_analytical['budget']) / financials_analytical['budget'] * 100).round(2)
    financials_analytical['forecast_accuracy'] = ((1 - abs(financials_analytical['revenue'] - financials_analytical['forecast']) / financials_analytical['revenue']) * 100).round(2)
    
    # Operations analytical table
    operations_analytical = fact_operations.merge(
        dim_date[['date_key', 'year', 'quarter', 'month', 'month_name', 'year_month']],
        on='date_key', how='left'
    ).merge(
        dim_department[['department_id', 'department_name']],
        on='department_id', how='left'
    ).merge(
        dim_region[['region_id', 'region_name']],
        on='region_id', how='left'
    )
    
    # Add calculated fields
    operations_analytical['sla_breach_rate'] = (operations_analytical['sla_breaches'] / operations_analytical['tickets_resolved'] * 100).round(2)
    operations_analytical['tickets_per_headcount'] = (operations_analytical['tickets_resolved'] / 30).round(2)  # Approximate daily rate
    
    # Combined metrics table (monthly aggregated)
    combined_metrics = financials_analytical.groupby(['year_month', 'department_name', 'region_name']).agg({
        'revenue': 'sum',
        'opex': 'sum',
        'capex': 'sum',
        'profit': 'sum',
        'headcount': 'mean',
        'profit_margin': 'mean',
        'revenue_variance': 'mean'
    }).reset_index()
    
    ops_monthly = operations_analytical.groupby(['year_month', 'department_name', 'region_name']).agg({
        'tickets_resolved': 'sum',
        'sla_breaches': 'sum',
        'cycle_time': 'mean',
        'utilization': 'mean',
        'backlog': 'mean'
    }).reset_index()
    
    combined_metrics = combined_metrics.merge(ops_monthly, on=['year_month', 'department_name', 'region_name'], how='left')
    
    # Save processed tables
    financials_analytical.to_csv(f'{processed_dir}/financials_analytical.csv', index=False)
    operations_analytical.to_csv(f'{processed_dir}/operations_analytical.csv', index=False)
    combined_metrics.to_csv(f'{processed_dir}/combined_metrics_monthly.csv', index=False)
    
    print(f"✓ Processed analytical tables saved to {processed_dir}/")
    
    return financials_analytical, operations_analytical, combined_metrics

def main():
    """Main function to generate all data."""
    print("Generating synthetic finance and operations data...")
    print("=" * 60)
    
    # Generate dimension tables
    print("Generating dimension tables...")
    dim_date = generate_dim_date()
    dim_department = generate_dim_department()
    dim_region = generate_dim_region()
    print(f"  ✓ dim_date: {len(dim_date)} rows")
    print(f"  ✓ dim_department: {len(dim_department)} rows")
    print(f"  ✓ dim_region: {len(dim_region)} rows")
    
    # Generate fact tables
    print("\nGenerating fact tables...")
    fact_financials = generate_fact_financials(dim_date, dim_department, dim_region)
    fact_operations = generate_fact_operations(dim_date, dim_department, dim_region)
    print(f"  ✓ fact_financials: {len(fact_financials)} rows")
    print(f"  ✓ fact_operations: {len(fact_operations)} rows")
    
    # Save raw data
    print("\nSaving raw data...")
    save_raw_data(dim_date, dim_department, dim_region, fact_financials, fact_operations)
    
    # Create and save analytical tables
    print("\nCreating analytical tables...")
    financials_analytical, operations_analytical, combined_metrics = create_analytical_tables(
        dim_date, dim_department, dim_region, fact_financials, fact_operations
    )
    
    print("\n" + "=" * 60)
    print("Data generation complete!")
    print(f"\nSummary:")
    print(f"  - Date range: {START_DATE.strftime('%Y-%m-%d')} to {END_DATE.strftime('%Y-%m-%d')}")
    print(f"  - Departments: {len(DEPARTMENTS)}")
    print(f"  - Regions: {len(REGIONS)}")
    print(f"  - Total financial records: {len(fact_financials):,}")
    print(f"  - Total operations records: {len(fact_operations):,}")
    print(f"\nFiles created:")
    print(f"  - Raw data: data/raw/")
    print(f"  - Processed data: data/processed/")

if __name__ == '__main__':
    main()

