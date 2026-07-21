"""
Sales Analysis Script for Sales Performance Optimization Dashboard

This script performs sales analysis including regional, product, and time-based aggregations.
"""

import pandas as pd
import numpy as np
from datetime import datetime


def load_processed_data(file_path='data/processed_sales_data.csv'):
    """Load processed sales data."""
    try:
        df = pd.read_csv(file_path)
        df['date'] = pd.to_datetime(df['date'])
        print(f"Processed data loaded: {len(df)} rows")
        return df
    except FileNotFoundError:
        print(f"Warning: Processed data not found at {file_path}. Loading raw data...")
        df = pd.read_csv('data/sample_sales_data.csv')
        df['date'] = pd.to_datetime(df['date'])
        return df
    except Exception as e:
        print(f"Error loading data: {e}")
        return None


def calculate_overall_kpis(df):
    """Calculate overall KPIs."""
    kpis = {
        'total_revenue': df['revenue'].sum(),
        'total_target': df['sales_target'].sum() if 'sales_target' in df.columns else 0,
        'total_units': df['units_sold'].sum(),
        'transaction_count': len(df),
        'avg_order_value': df['revenue'].mean()
    }
    
    if 'sales_target' in df.columns and kpis['total_target'] > 0:
        kpis['variance'] = kpis['total_revenue'] - kpis['total_target']
        kpis['variance_pct'] = (kpis['variance'] / kpis['total_target']) * 100
    else:
        kpis['variance'] = 0
        kpis['variance_pct'] = 0
    
    return kpis


def analyze_regional_performance(df):
    """Analyze sales performance by region."""
    regional_stats = df.groupby('region').agg({
        'revenue': 'sum',
        'sales_target': 'sum' if 'sales_target' in df.columns else lambda x: 0,
        'units_sold': 'sum',
        'product_name': 'count'
    }).rename(columns={'product_name': 'transaction_count'})
    
    if 'sales_target' in df.columns:
        regional_stats['variance'] = regional_stats['revenue'] - regional_stats['sales_target']
        regional_stats['variance_pct'] = (
            (regional_stats['variance'] / regional_stats['sales_target']) * 100
        ).fillna(0)
    
    regional_stats['avg_order_value'] = (
        regional_stats['revenue'] / regional_stats['transaction_count']
    )
    
    return regional_stats.sort_values('revenue', ascending=False)


def analyze_product_category_performance(df):
    """Analyze sales performance by product category."""
    category_stats = df.groupby('product_category').agg({
        'revenue': 'sum',
        'units_sold': 'sum',
        'product_name': 'nunique'
    }).rename(columns={'product_name': 'unique_products'})
    
    category_stats['revenue_per_product'] = (
        category_stats['revenue'] / category_stats['unique_products']
    )
    
    return category_stats.sort_values('revenue', ascending=False)


def analyze_time_trends(df):
    """Analyze sales trends over time."""
    df['year_month'] = df['date'].dt.to_period('M')
    
    monthly_stats = df.groupby('year_month').agg({
        'revenue': 'sum',
        'sales_target': 'sum' if 'sales_target' in df.columns else lambda x: 0,
        'units_sold': 'sum'
    }).reset_index()
    
    monthly_stats['year_month_str'] = monthly_stats['year_month'].astype(str)
    
    return monthly_stats


def get_top_products(df, n=10):
    """Get top N products by revenue."""
    top_products = df.groupby('product_name').agg({
        'revenue': 'sum',
        'units_sold': 'sum',
        'region': 'nunique'
    }).rename(columns={'region': 'regions_sold_in'})
    
    return top_products.sort_values('revenue', ascending=False).head(n)


def generate_summary_report(df):
    """Generate a comprehensive summary report."""
    print("=" * 60)
    print("SALES PERFORMANCE ANALYSIS REPORT")
    print("=" * 60)
    
    # Overall KPIs
    kpis = calculate_overall_kpis(df)
    print("\n=== OVERALL KPIs ===")
    print(f"Total Revenue: ${kpis['total_revenue']:,.2f}")
    if kpis['total_target'] > 0:
        print(f"Total Sales Target: ${kpis['total_target']:,.2f}")
        print(f"Variance: ${kpis['variance']:,.2f} ({kpis['variance_pct']:.2f}%)")
    print(f"Total Units Sold: {kpis['total_units']:,}")
    print(f"Average Order Value: ${kpis['avg_order_value']:,.2f}")
    print(f"Transaction Count: {kpis['transaction_count']:,}")
    
    # Regional Performance
    regional_stats = analyze_regional_performance(df)
    print("\n=== REGIONAL PERFORMANCE ===")
    print(regional_stats.to_string())
    
    # Product Category Performance
    category_stats = analyze_product_category_performance(df)
    print("\n=== PRODUCT CATEGORY PERFORMANCE ===")
    print(category_stats.to_string())
    
    # Top Products
    top_products = get_top_products(df, n=10)
    print("\n=== TOP 10 PRODUCTS BY REVENUE ===")
    print(top_products.to_string())
    
    # Time Trends
    monthly_stats = analyze_time_trends(df)
    print("\n=== MONTHLY TRENDS ===")
    print(monthly_stats.to_string())
    
    return {
        'kpis': kpis,
        'regional_stats': regional_stats,
        'category_stats': category_stats,
        'top_products': top_products,
        'monthly_stats': monthly_stats
    }


def main():
    """Main analysis workflow."""
    print("Starting Sales Analysis...")
    
    # Load data
    df = load_processed_data()
    if df is None:
        print("Error: Could not load data")
        return
    
    # Generate report
    results = generate_summary_report(df)
    
    print("\n" + "=" * 60)
    print("Analysis complete!")
    print("=" * 60)


if __name__ == "__main__":
    main()

