"""
Data Preprocessing Script for Sales Performance Optimization Dashboard

This script loads, cleans, and preprocesses sales data for analysis.
"""

import pandas as pd
import numpy as np
from datetime import datetime


def load_data(file_path):
    """Load sales data from CSV file."""
    try:
        df = pd.read_csv(file_path)
        print(f"Data loaded successfully: {len(df)} rows, {len(df.columns)} columns")
        return df
    except FileNotFoundError:
        print(f"Error: File not found at {file_path}")
        return None
    except Exception as e:
        print(f"Error loading data: {e}")
        return None


def clean_data(df):
    """
    Clean and validate sales data.
    
    Steps:
    1. Convert date column to datetime
    2. Handle missing values
    3. Validate data ranges
    4. Standardize categorical fields
    5. Remove duplicates and outliers
    """
    if df is None:
        return None
    
    # Create a copy to avoid modifying original
    df_clean = df.copy()
    
    # Convert date to datetime
    df_clean['date'] = pd.to_datetime(df_clean['date'], errors='coerce')
    
    # Handle missing values in revenue (calculate if missing)
    missing_revenue = df_clean['revenue'].isnull()
    if missing_revenue.any():
        df_clean.loc[missing_revenue, 'revenue'] = (
            df_clean.loc[missing_revenue, 'units_sold'] * 
            df_clean.loc[missing_revenue, 'unit_price']
        )
    
    # Calculate revenue if not provided
    missing_revenue_calc = df_clean['revenue'].isnull()
    if missing_revenue_calc.any():
        df_clean.loc[missing_revenue_calc, 'revenue'] = (
            df_clean.loc[missing_revenue_calc, 'units_sold'] * 
            df_clean.loc[missing_revenue_calc, 'unit_price']
        )
    
    # Handle missing units_sold (estimate from revenue and price)
    missing_units = df_clean['units_sold'].isnull() & df_clean['revenue'].notnull()
    if missing_units.any():
        df_clean.loc[missing_units, 'units_sold'] = (
            df_clean.loc[missing_units, 'revenue'] / 
            df_clean.loc[missing_units, 'unit_price']
        ).round().astype(int)
    
    # Fill missing sales_target with median by region
    if 'sales_target' in df_clean.columns:
        df_clean['sales_target'] = df_clean.groupby('region')['sales_target'].transform(
            lambda x: x.fillna(x.median())
        )
    
    # Standardize region names (title case)
    if 'region' in df_clean.columns:
        df_clean['region'] = df_clean['region'].str.title().str.strip()
    
    # Standardize product_category
    if 'product_category' in df_clean.columns:
        df_clean['product_category'] = df_clean['product_category'].str.title().str.strip()
    
    # Validate data ranges
    # Remove rows with negative revenue or units
    df_clean = df_clean[(df_clean['revenue'] >= 0) & (df_clean['units_sold'] >= 0)]
    
    # Remove outliers (revenue > 3 standard deviations)
    if len(df_clean) > 0:
        mean_revenue = df_clean['revenue'].mean()
        std_revenue = df_clean['revenue'].std()
        df_clean = df_clean[
            (df_clean['revenue'] <= mean_revenue + 3 * std_revenue) &
            (df_clean['revenue'] >= mean_revenue - 3 * std_revenue)
        ]
    
    # Remove duplicates based on date, region, product_name
    df_clean = df_clean.drop_duplicates(subset=['date', 'region', 'product_name'], keep='first')
    
    # Remove rows with invalid dates
    df_clean = df_clean[df_clean['date'].notnull()]
    
    print(f"Data cleaning complete: {len(df_clean)} rows remaining")
    print(f"Missing values after cleaning:")
    print(df_clean.isnull().sum())
    
    return df_clean


def add_derived_features(df):
    """Add derived features for analysis."""
    if df is None or len(df) == 0:
        return df
    
    df_features = df.copy()
    
    # Time-based features
    df_features['year'] = df_features['date'].dt.year
    df_features['month'] = df_features['date'].dt.month
    df_features['quarter'] = df_features['date'].dt.quarter
    df_features['year_month'] = df_features['date'].dt.to_period('M')
    
    # Calculate variance metrics
    if 'sales_target' in df_features.columns:
        df_features['variance'] = df_features['revenue'] - df_features['sales_target']
        df_features['variance_pct'] = (
            (df_features['variance'] / df_features['sales_target']) * 100
        ).fillna(0)
        df_features['above_target'] = df_features['variance'] > 0
    
    # Calculate average order value
    df_features['avg_order_value'] = df_features['revenue'] / df_features['units_sold'].replace(0, 1)
    
    # Revenue per unit
    df_features['revenue_per_unit'] = df_features['revenue'] / df_features['units_sold'].replace(0, 1)
    
    return df_features


def save_processed_data(df, output_path):
    """Save processed dataset to CSV."""
    try:
        df.to_csv(output_path, index=False)
        print(f"Processed data saved to {output_path}")
        return True
    except Exception as e:
        print(f"Error saving data: {e}")
        return False


def main():
    """Main preprocessing workflow."""
    # File paths
    input_file = 'data/sample_sales_data.csv'
    output_file = 'data/processed_sales_data.csv'
    
    print("=" * 60)
    print("Sales Data Preprocessing Pipeline")
    print("=" * 60)
    
    # Load data
    df = load_data(input_file)
    if df is None:
        return
    
    # Clean data
    df_clean = clean_data(df)
    if df_clean is None or len(df_clean) == 0:
        print("Error: No data remaining after cleaning")
        return
    
    # Add derived features
    df_processed = add_derived_features(df_clean)
    
    # Save processed data
    save_processed_data(df_processed, output_file)
    
    # Summary statistics
    print("\n" + "=" * 60)
    print("Summary Statistics")
    print("=" * 60)
    print(f"\nDate range: {df_processed['date'].min()} to {df_processed['date'].max()}")
    print(f"Total revenue: ${df_processed['revenue'].sum():,.2f}")
    print(f"Total units sold: {df_processed['units_sold'].sum():,}")
    print(f"Number of regions: {df_processed['region'].nunique()}")
    print(f"Number of products: {df_processed['product_name'].nunique()}")
    
    if 'variance_pct' in df_processed.columns:
        avg_variance = df_processed['variance_pct'].mean()
        print(f"Average variance %: {avg_variance:.2f}%")
    
    print("\nPreprocessing complete!")


if __name__ == "__main__":
    main()

