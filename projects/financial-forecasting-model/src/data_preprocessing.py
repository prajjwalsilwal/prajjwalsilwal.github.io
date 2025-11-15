"""
Data Preprocessing Script for Financial Forecasting Model

This script loads, cleans, and preprocesses financial data for forecasting.
"""

import pandas as pd
import numpy as np
from datetime import datetime


def load_data(file_path):
    """Load financial data from CSV file."""
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
    Clean and validate financial data.
    
    Steps:
    1. Convert date column to datetime
    2. Handle missing values
    3. Validate data ranges
    4. Standardize categories and scenarios
    """
    if df is None:
        return None
    
    # Create a copy to avoid modifying original
    df_clean = df.copy()
    
    # Convert date to datetime
    df_clean['date'] = pd.to_datetime(df_clean['date'], errors='coerce')
    
    # Handle missing values in sales
    if 'actual_sales' in df_clean.columns:
        df_clean['actual_sales'] = pd.to_numeric(df_clean['actual_sales'], errors='coerce')
        # Fill missing with forward fill or median
        df_clean['actual_sales'] = df_clean['actual_sales'].fillna(
            method='ffill'
        ).fillna(df_clean['actual_sales'].median())
    
    if 'forecast_sales' in df_clean.columns:
        df_clean['forecast_sales'] = pd.to_numeric(df_clean['forecast_sales'], errors='coerce')
        df_clean['forecast_sales'] = df_clean['forecast_sales'].fillna(
            method='ffill'
        ).fillna(df_clean['forecast_sales'].median())
    
    # Handle missing values in expenses
    if 'actual_expenses' in df_clean.columns:
        df_clean['actual_expenses'] = pd.to_numeric(df_clean['actual_expenses'], errors='coerce')
        df_clean['actual_expenses'] = df_clean['actual_expenses'].fillna(
            method='ffill'
        ).fillna(df_clean['actual_expenses'].median())
    
    if 'forecast_expenses' in df_clean.columns:
        df_clean['forecast_expenses'] = pd.to_numeric(df_clean['forecast_expenses'], errors='coerce')
        df_clean['forecast_expenses'] = df_clean['forecast_expenses'].fillna(
            method='ffill'
        ).fillna(df_clean['forecast_expenses'].median())
    
    # Standardize category names
    if 'category' in df_clean.columns:
        df_clean['category'] = df_clean['category'].str.title().str.strip()
    
    # Standardize scenario names
    if 'scenario' in df_clean.columns:
        df_clean['scenario'] = df_clean['scenario'].str.title().str.strip()
    
    # Remove rows with invalid dates
    df_clean = df_clean[df_clean['date'].notnull()]
    
    # Sort by date
    df_clean = df_clean.sort_values('date')
    
    # Validate data ranges (no negative sales/expenses)
    if 'actual_sales' in df_clean.columns:
        df_clean = df_clean[df_clean['actual_sales'] >= 0]
    if 'actual_expenses' in df_clean.columns:
        df_clean = df_clean[df_clean['actual_expenses'] >= 0]
    
    print(f"Data cleaning complete: {len(df_clean)} rows remaining")
    print(f"Missing values after cleaning:")
    print(df_clean.isnull().sum())
    
    return df_clean


def add_derived_features(df):
    """Add derived features for forecasting."""
    if df is None or len(df) == 0:
        return df
    
    df_features = df.copy()
    
    # Time-based features
    df_features['year'] = df_features['date'].dt.year
    df_features['month'] = df_features['date'].dt.month
    df_features['quarter'] = df_features['date'].dt.quarter
    df_features['year_month'] = df_features['date'].dt.to_period('M')
    
    # Create time index (1, 2, 3, ...)
    df_features = df_features.sort_values('date')
    df_features['time_index'] = range(1, len(df_features) + 1)
    
    # Calculate variance metrics (if both actual and forecast exist)
    if 'actual_sales' in df_features.columns and 'forecast_sales' in df_features.columns:
        df_features['sales_variance'] = (
            df_features['actual_sales'] - df_features['forecast_sales']
        )
        df_features['sales_variance_pct'] = (
            (df_features['sales_variance'] / df_features['forecast_sales'].replace(0, 1)) * 100
        ).fillna(0)
    
    if 'actual_expenses' in df_features.columns and 'forecast_expenses' in df_features.columns:
        df_features['expenses_variance'] = (
            df_features['actual_expenses'] - df_features['forecast_expenses']
        )
        df_features['expenses_variance_pct'] = (
            (df_features['expenses_variance'] / df_features['forecast_expenses'].replace(0, 1)) * 100
        ).fillna(0)
    
    # Lag features (previous period values)
    if 'actual_sales' in df_features.columns:
        df_features['sales_lag1'] = df_features['actual_sales'].shift(1)
        df_features['sales_lag3'] = df_features['actual_sales'].shift(3)
    
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
    input_file = 'data/sample_financial_data.csv'
    output_file = 'data/processed_financial_data.csv'
    
    print("=" * 60)
    print("Financial Data Preprocessing Pipeline")
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
    save_processed_data(df_processed, output_path)
    
    # Summary statistics
    print("\n" + "=" * 60)
    print("Summary Statistics")
    print("=" * 60)
    print(f"\nDate range: {df_processed['date'].min()} to {df_processed['date'].max()}")
    
    if 'actual_sales' in df_processed.columns:
        sales_df = df_processed[df_processed['category'] == 'Sales']
        if len(sales_df) > 0:
            print(f"\nSales Data:")
            print(f"  Average monthly sales: ${sales_df['actual_sales'].mean():,.2f}")
            print(f"  Total sales: ${sales_df['actual_sales'].sum():,.2f}")
    
    if 'actual_expenses' in df_processed.columns:
        expenses_df = df_processed[df_processed['category'] == 'Sales']  # Expenses are in same rows
        if len(expenses_df) > 0:
            print(f"\nExpenses Data:")
            print(f"  Average monthly expenses: ${expenses_df['actual_expenses'].mean():,.2f}")
            print(f"  Total expenses: ${expenses_df['actual_expenses'].sum():,.2f}")
    
    print(f"\nNumber of scenarios: {df_processed['scenario'].nunique()}")
    print(f"Scenarios: {', '.join(df_processed['scenario'].unique())}")
    
    print("\nPreprocessing complete!")


if __name__ == "__main__":
    main()

