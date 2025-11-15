"""
Financial Forecasting Model

This script implements a regression-based forecasting model for sales and expenses.
"""

import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_absolute_percentage_error, mean_squared_error
from datetime import datetime, timedelta


def load_processed_data(file_path='data/processed_financial_data.csv'):
    """Load processed financial data."""
    try:
        df = pd.read_csv(file_path)
        df['date'] = pd.to_datetime(df['date'])
        print(f"Processed data loaded: {len(df)} rows")
        return df
    except FileNotFoundError:
        print(f"Warning: Processed data not found at {file_path}. Loading raw data...")
        df = pd.read_csv('data/sample_financial_data.csv')
        df['date'] = pd.to_datetime(df['date'])
        return df
    except Exception as e:
        print(f"Error loading data: {e}")
        return None


def prepare_training_data(df, category='Sales', scenario='Baseline'):
    """Prepare training data for forecasting model."""
    # Filter for specific category and scenario
    train_df = df[(df['category'] == category) & (df['scenario'] == scenario)].copy()
    train_df = train_df.sort_values('date')
    
    # Ensure time_index exists
    if 'time_index' not in train_df.columns:
        train_df['time_index'] = range(1, len(train_df) + 1)
    
    # Prepare features
    X = train_df[['time_index', 'month', 'quarter']].values
    y = train_df['actual_sales'].values if category == 'Sales' else train_df['actual_expenses'].values
    
    return X, y, train_df


def train_forecasting_model(X, y):
    """Train a linear regression forecasting model."""
    model = LinearRegression()
    model.fit(X, y)
    
    # Evaluate on training data
    y_pred = model.predict(X)
    mape = mean_absolute_percentage_error(y, y_pred) * 100
    rmse = np.sqrt(mean_squared_error(y, y_pred))
    r2 = model.score(X, y)
    
    print(f"Model trained successfully")
    print(f"Training MAPE: {mape:.2f}%")
    print(f"Training RMSE: ${rmse:,.2f}")
    print(f"R² Score: {r2:.4f}")
    
    return model, {'mape': mape, 'rmse': rmse, 'r2': r2}


def generate_forecasts(model, last_date, last_time_index, n_periods=6):
    """Generate forecasts for future periods."""
    # Create future dates (monthly)
    future_dates = pd.date_range(
        start=last_date + pd.DateOffset(months=1),
        periods=n_periods,
        freq='MS'
    )
    
    # Prepare features for future periods
    future_data = []
    for i, date in enumerate(future_dates):
        time_idx = last_time_index + i + 1
        month = date.month
        quarter = date.quarter
        future_data.append({
            'date': date,
            'time_index': time_idx,
            'month': month,
            'quarter': quarter
        })
    
    future_df = pd.DataFrame(future_data)
    
    # Generate baseline forecast
    X_future = future_df[['time_index', 'month', 'quarter']].values
    future_df['baseline_forecast'] = model.predict(X_future)
    
    # Generate optimistic scenario (+5%)
    future_df['optimistic_forecast'] = future_df['baseline_forecast'] * 1.05
    
    # Generate pessimistic scenario (-5%)
    future_df['pessimistic_forecast'] = future_df['baseline_forecast'] * 0.95
    
    return future_df


def compare_forecast_accuracy(df, category='Sales'):
    """Compare historical forecast accuracy."""
    category_df = df[df['category'] == category].copy()
    
    if 'actual_sales' in category_df.columns and 'forecast_sales' in category_df.columns:
        actual = category_df['actual_sales'].values
        forecast = category_df['forecast_sales'].values
        
        # Calculate metrics
        mape = mean_absolute_percentage_error(actual, forecast) * 100
        rmse = np.sqrt(mean_squared_error(actual, forecast))
        
        return {
            'historical_mape': mape,
            'historical_rmse': rmse,
            'actual_mean': np.mean(actual),
            'forecast_mean': np.mean(forecast)
        }
    
    return None


def main():
    """Main forecasting workflow."""
    print("=" * 60)
    print("Financial Forecasting Model")
    print("=" * 60)
    
    # Load data
    df = load_processed_data()
    if df is None:
        print("Error: Could not load data")
        return
    
    # Prepare training data (Sales category, Baseline scenario)
    X, y, train_df = prepare_training_data(df, category='Sales', scenario='Baseline')
    
    if len(X) == 0:
        print("Error: No training data found")
        return
    
    print(f"\nTraining data: {len(X)} observations")
    print(f"Date range: {train_df['date'].min()} to {train_df['date'].max()}")
    
    # Train model
    print("\n" + "-" * 60)
    print("Training Model...")
    print("-" * 60)
    model, metrics = train_forecasting_model(X, y)
    
    # Compare with historical forecast accuracy
    print("\n" + "-" * 60)
    print("Historical Forecast Accuracy Comparison")
    print("-" * 60)
    historical_accuracy = compare_forecast_accuracy(df, category='Sales')
    
    if historical_accuracy:
        print(f"Historical Forecast MAPE: {historical_accuracy['historical_mape']:.2f}%")
        print(f"New Model MAPE: {metrics['mape']:.2f}%")
        
        improvement = historical_accuracy['historical_mape'] - metrics['mape']
        improvement_pct = (improvement / historical_accuracy['historical_mape']) * 100
        
        print(f"\nImprovement: {improvement:.2f} percentage points ({improvement_pct:.1f}% relative)")
    
    # Generate future forecasts
    print("\n" + "-" * 60)
    print("Generating Future Forecasts...")
    print("-" * 60)
    
    last_date = train_df['date'].max()
    last_time_index = train_df['time_index'].max()
    
    forecasts = generate_forecasts(model, last_date, last_time_index, n_periods=6)
    
    print("\n=== 6-MONTH FORECAST ===")
    print(forecasts[['date', 'baseline_forecast', 'optimistic_forecast', 'pessimistic_forecast']].to_string(index=False))
    
    # Save forecasts
    try:
        forecasts.to_csv('data/forecast_results.csv', index=False)
        print(f"\nForecasts saved to data/forecast_results.csv")
    except Exception as e:
        print(f"Warning: Could not save forecasts: {e}")
    
    print("\n" + "=" * 60)
    print("Forecasting complete!")
    print("=" * 60)


if __name__ == "__main__":
    main()

