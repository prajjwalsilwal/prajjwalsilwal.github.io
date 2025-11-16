"""
Finance & Operations Command Center Dashboard
Executive-ready Streamlit dashboard for financial and operational analytics.
"""

import streamlit as st
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from pathlib import Path
from datetime import datetime

# Page configuration - full width and minimal
st.set_page_config(
    page_title="Finance & Operations Command Center",
    page_icon="📊",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Set matplotlib style for minimal charts
plt.style.use('default')
sns.set_style("whitegrid", {'axes.grid': True, 'grid.color': '.9', 'grid.alpha': 0.5})

# Custom CSS for minimal, clean layout with reduced padding
st.markdown("""
    <style>
    /* Remove default padding and margins for clean layout */
    .main .block-container {
        padding-top: 1rem;
        padding-bottom: 1rem;
        padding-left: 2rem;
        padding-right: 2rem;
        max-width: 100%;
    }
    
    /* Remove padding from element containers */
    .element-container {
        padding: 0 !important;
        margin: 0 !important;
    }
    
    /* Remove padding from columns */
    [data-testid="column"] {
        padding: 0.25rem !important;
    }
    
    /* Minimal metric card styling */
    div[data-testid="stMetricContainer"] {
        background: linear-gradient(135deg, #f0f4ff 0%, #e0e7ff 50%, #c7d2fe 100%);
        padding: 1rem !important;
        border-radius: 0.5rem;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
        border-left: 3px solid #667eea;
        margin: 0.25rem !important;
    }
    
    /* Text color fixes */
    .stMarkdown, .stText, p, div, span, label {
        color: #1f2937 !important;
    }
    
    /* Headers - minimal styling */
    h1 {
        color: #1f2937 !important;
        font-weight: 700 !important;
        margin-bottom: 0.5rem !important;
        padding-bottom: 0.25rem !important;
    }
    
    h2 {
        color: #1e40af !important;
        font-weight: 700 !important;
        border-bottom: 2px solid #e5e7eb;
        padding-bottom: 0.5rem;
        margin-top: 1.5rem !important;
        margin-bottom: 0.75rem !important;
    }
    
    h3 {
        color: #374151 !important;
        font-weight: 600 !important;
        margin-top: 1rem !important;
        margin-bottom: 0.5rem !important;
    }
    
    /* Metric values */
    [data-testid="stMetricValue"] {
        color: #1e293b !important;
        font-weight: 700 !important;
        font-size: 1.75rem !important;
    }
    
    [data-testid="stMetricLabel"] {
        color: #475569 !important;
        font-weight: 600 !important;
        font-size: 0.9rem !important;
    }
    
    [data-testid="stMetricDelta"] {
        color: #059669 !important;
        font-weight: 600 !important;
    }
    
    /* Sidebar - minimal */
    .css-1d391kg {
        background: linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%);
    }
    
    /* Divider - minimal */
    hr {
        border-color: #e5e7eb;
        margin: 1rem 0 !important;
        border-width: 1px;
    }
    
    /* Remove extra spacing from markdown */
    .stMarkdown {
        margin: 0 !important;
    }
    
    /* Chart containers - no padding */
    [data-testid="stPyplotGlobalKeys"] {
        padding: 0 !important;
        margin: 0 !important;
    }
    
    /* Subheader styling */
    .css-10trblm {
        color: #1f2937 !important;
        font-weight: 600 !important;
        margin-bottom: 0.5rem !important;
    }
    
    /* Labels */
    label {
        color: #1f2937 !important;
        font-weight: 600 !important;
    }
    
    /* Sidebar text */
    [data-testid="stSidebar"] h1, [data-testid="stSidebar"] h2, [data-testid="stSidebar"] h3 {
        color: #1f2937 !important;
    }
    
    /* Footer */
    footer {
        color: #6b7280 !important;
    }
    
    /* Remove Streamlit default padding */
    section[data-testid="stSidebar"] {
        padding-top: 1rem;
    }
    
    /* Ensure full width responsiveness */
    .stApp > header {
        background-color: transparent;
    }
    
    /* Minimal alert styling */
    .stAlert {
        padding: 0.75rem !important;
        margin: 0.5rem 0 !important;
    }
    </style>
""", unsafe_allow_html=True)

# Create images directory if it doesn't exist
Path('../images').mkdir(exist_ok=True)

def create_figure(figsize=(10, 5), tight=True):
    """Create a matplotlib figure with minimal margins."""
    fig, ax = plt.subplots(figsize=figsize)
    if tight:
        # Minimal margins for clean, space-efficient charts
        plt.subplots_adjust(left=0.12, right=0.98, top=0.92, bottom=0.18)
    return fig, ax

@st.cache_data
def load_data():
    """Load and cache processed data."""
    try:
        financials = pd.read_csv('data/processed/financials_analytical.csv')
        operations = pd.read_csv('data/processed/operations_analytical.csv')
        
        # Convert date columns
        financials['date'] = pd.to_datetime(financials['date'])
        operations['date'] = pd.to_datetime(operations['date'])
        
        return financials, operations
    except FileNotFoundError:
        st.error("Data files not found. Please run `python data/finance_data_generator.py` first.")
        st.stop()

def main():
    """Main dashboard function."""
    # Title - minimal spacing
    st.title("📊 Finance & Operations Command Center")
    st.markdown("<br>", unsafe_allow_html=True)
    
    # Load data
    financials, operations = load_data()
    
    # Sidebar filters
    st.sidebar.header("🔍 Filters")
    
    # Date range filter
    min_date = financials['date'].min().date()
    max_date = financials['date'].max().date()
    date_range = st.sidebar.date_input(
        "Date Range",
        value=(min_date, max_date),
        min_value=min_date,
        max_value=max_date
    )
    
    if isinstance(date_range, tuple) and len(date_range) == 2:
        start_date, end_date = date_range
    else:
        start_date, end_date = min_date, max_date
    
    # Department filter
    departments = ['All'] + sorted(financials['department_name'].unique().tolist())
    selected_dept = st.sidebar.selectbox("Department", departments)
    
    # Region filter
    regions = ['All'] + sorted(financials['region_name'].unique().tolist())
    selected_region = st.sidebar.selectbox("Region", regions)
    
    # Apply filters
    filtered_financials = financials[
        (financials['date'].dt.date >= start_date) & 
        (financials['date'].dt.date <= end_date)
    ]
    
    if selected_dept != 'All':
        filtered_financials = filtered_financials[filtered_financials['department_name'] == selected_dept]
    
    if selected_region != 'All':
        filtered_financials = filtered_financials[filtered_financials['region_name'] == selected_region]
    
    filtered_operations = operations[
        (operations['date'].dt.date >= start_date) & 
        (operations['date'].dt.date <= end_date)
    ]
    
    if selected_dept != 'All':
        filtered_operations = filtered_operations[filtered_operations['department_name'] == selected_dept]
    
    if selected_region != 'All':
        filtered_operations = filtered_operations[filtered_operations['region_name'] == selected_region]
    
    # Calculate KPIs
    total_revenue = filtered_financials['revenue'].sum()
    total_profit = filtered_financials['profit'].sum()
    profit_margin = (total_profit / total_revenue * 100) if total_revenue > 0 else 0
    total_opex = filtered_financials['opex'].sum()
    avg_variance = filtered_financials['revenue_variance'].mean()
    
    # Display KPI cards
    st.header("📈 Key Performance Indicators")
    col1, col2, col3, col4, col5 = st.columns(5)
    
    with col1:
        st.metric(
            label="Total Revenue",
            value=f"${total_revenue/1e6:.1f}M",
            delta=f"{((filtered_financials['revenue'].sum() - financials['revenue'].sum() * 0.8) / (financials['revenue'].sum() * 0.8) * 100):.1f}%"
        )
    
    with col2:
        st.metric(
            label="Total Profit",
            value=f"${total_profit/1e6:.1f}M",
            delta=f"{profit_margin:.1f}% margin"
        )
    
    with col3:
        st.metric(
            label="Profit Margin",
            value=f"{profit_margin:.2f}%",
            delta=f"{(profit_margin - 20):.1f}% vs target"
        )
    
    with col4:
        st.metric(
            label="Total OPEX",
            value=f"${total_opex/1e6:.1f}M",
            delta=f"{(total_opex/total_revenue*100):.1f}% of revenue"
        )
    
    with col5:
        st.metric(
            label="Revenue Variance",
            value=f"{avg_variance:.2f}%",
            delta="vs Budget"
        )
    
    st.markdown("<br>", unsafe_allow_html=True)
    
    # Time series charts
    st.header("📉 Time Series Analysis")
    
    # Aggregate by month for time series
    monthly_financials = filtered_financials.groupby('year_month').agg({
        'revenue': 'sum',
        'opex': 'sum',
        'capex': 'sum',
        'profit': 'sum'
    }).reset_index()
    monthly_financials['year_month'] = pd.to_datetime(monthly_financials['year_month'])
    
    col1, col2 = st.columns(2)
    
    with col1:
        st.subheader("Revenue & Expenses Over Time")
        fig, ax = create_figure(figsize=(10, 5))
        ax.plot(monthly_financials['year_month'], monthly_financials['revenue'] / 1e6, 
                label='Revenue', linewidth=2, marker='o', markersize=3)
        ax.plot(monthly_financials['year_month'], monthly_financials['opex'] / 1e6, 
                label='OPEX', linewidth=2, marker='s', markersize=3)
        ax.plot(monthly_financials['year_month'], monthly_financials['capex'] / 1e6, 
                label='CAPEX', linewidth=2, marker='^', markersize=3)
        ax.set_xlabel('Date', fontsize=10)
        ax.set_ylabel('Amount (Millions USD)', fontsize=10)
        ax.set_title('Revenue vs Expenses Trend', fontsize=11, fontweight='bold')
        ax.legend(fontsize=9, loc='best', framealpha=0.9)
        ax.grid(True, alpha=0.3, linestyle='--')
        plt.xticks(rotation=45, fontsize=9)
        plt.yticks(fontsize=9)
        st.pyplot(fig, use_container_width=True)
        plt.close()
    
    with col2:
        st.subheader("Profit Trend Over Time")
        fig, ax = create_figure(figsize=(10, 5))
        ax.plot(monthly_financials['year_month'], monthly_financials['profit'] / 1e6, 
                label='Profit', linewidth=2.5, marker='d', markersize=4, color='#2ecc71')
        ax.fill_between(monthly_financials['year_month'], 0, monthly_financials['profit'] / 1e6, 
                        alpha=0.25, color='#2ecc71')
        ax.set_xlabel('Date', fontsize=10)
        ax.set_ylabel('Profit (Millions USD)', fontsize=10)
        ax.set_title('Profit Trend', fontsize=11, fontweight='bold')
        ax.grid(True, alpha=0.3, linestyle='--')
        plt.xticks(rotation=45, fontsize=9)
        plt.yticks(fontsize=9)
        st.pyplot(fig, use_container_width=True)
        plt.close()
    
    st.markdown("<br>", unsafe_allow_html=True)
    
    # Department and Region comparisons
    st.header("🏢 Department & Region Performance")
    
    col1, col2 = st.columns(2)
    
    with col1:
        st.subheader("Revenue by Department")
        dept_revenue = filtered_financials.groupby('department_name')['revenue'].sum().sort_values(ascending=False)
        fig, ax = create_figure(figsize=(10, 5))
        colors = plt.cm.plasma(np.linspace(0, 1, len(dept_revenue)))
        bars = ax.bar(dept_revenue.index, dept_revenue.values / 1e6, color=colors, edgecolor='white', linewidth=0.5)
        ax.set_xlabel('Department', fontsize=10)
        ax.set_ylabel('Revenue (Millions USD)', fontsize=10)
        ax.set_title('Total Revenue by Department', fontsize=11, fontweight='bold')
        ax.tick_params(axis='x', rotation=45, labelsize=9)
        ax.tick_params(axis='y', labelsize=9)
        ax.grid(True, alpha=0.3, axis='y', linestyle='--')
        # Add value labels
        for bar in bars:
            height = bar.get_height()
            ax.text(bar.get_x() + bar.get_width()/2., height,
                   f'${height:.1f}M', ha='center', va='bottom', fontsize=8, fontweight='bold')
        st.pyplot(fig, use_container_width=True)
        plt.close()
    
    with col2:
        st.subheader("Revenue by Region")
        region_revenue = filtered_financials.groupby('region_name')['revenue'].sum().sort_values(ascending=False)
        fig, ax = create_figure(figsize=(10, 5))
        colors = plt.cm.viridis(np.linspace(0, 1, len(region_revenue)))
        bars = ax.bar(region_revenue.index, region_revenue.values / 1e6, color=colors, edgecolor='white', linewidth=0.5)
        ax.set_xlabel('Region', fontsize=10)
        ax.set_ylabel('Revenue (Millions USD)', fontsize=10)
        ax.set_title('Total Revenue by Region', fontsize=11, fontweight='bold')
        ax.tick_params(axis='x', labelsize=9)
        ax.tick_params(axis='y', labelsize=9)
        ax.grid(True, alpha=0.3, axis='y', linestyle='--')
        # Add value labels
        for bar in bars:
            height = bar.get_height()
            ax.text(bar.get_x() + bar.get_width()/2., height,
                   f'${height:.1f}M', ha='center', va='bottom', fontsize=8, fontweight='bold')
        st.pyplot(fig, use_container_width=True)
        plt.close()
    
    st.markdown("<br>", unsafe_allow_html=True)
    
    # Variance analysis
    st.header("📊 Variance Analysis: Actual vs Budget vs Forecast")
    
    # Aggregate by quarter
    filtered_financials['quarter'] = filtered_financials['date'].dt.to_period('Q').astype(str)
    quarterly_variance = filtered_financials.groupby('quarter').agg({
        'revenue': 'sum',
        'budget': 'sum',
        'forecast': 'sum'
    }).reset_index()
    
    quarterly_variance['actual_vs_budget'] = ((quarterly_variance['revenue'] - quarterly_variance['budget']) / 
                                              quarterly_variance['budget'] * 100).round(2)
    
    col1, col2 = st.columns(2)
    
    with col1:
        st.subheader("Revenue Comparison")
        fig, ax = create_figure(figsize=(10, 5))
        x = range(len(quarterly_variance))
        width = 0.25
        ax.bar([i - width for i in x], quarterly_variance['revenue'] / 1e6, width, 
               label='Actual', color='#2ecc71', edgecolor='white', linewidth=0.5)
        ax.bar(x, quarterly_variance['budget'] / 1e6, width, 
               label='Budget', color='#3498db', edgecolor='white', linewidth=0.5)
        ax.bar([i + width for i in x], quarterly_variance['forecast'] / 1e6, width, 
               label='Forecast', color='#e74c3c', edgecolor='white', linewidth=0.5)
        ax.set_xlabel('Quarter', fontsize=10)
        ax.set_ylabel('Revenue (Millions USD)', fontsize=10)
        ax.set_title('Actual vs Budget vs Forecast', fontsize=11, fontweight='bold')
        ax.set_xticks(x)
        ax.set_xticklabels(quarterly_variance['quarter'], rotation=45, fontsize=9)
        ax.tick_params(axis='y', labelsize=9)
        ax.legend(fontsize=9, loc='best', framealpha=0.9)
        ax.grid(True, alpha=0.3, axis='y', linestyle='--')
        st.pyplot(fig, use_container_width=True)
        plt.close()
    
    with col2:
        st.subheader("Variance Percentage")
        fig, ax = create_figure(figsize=(10, 5))
        bars = ax.bar(quarterly_variance['quarter'], quarterly_variance['actual_vs_budget'], 
                     color=['#2ecc71' if x >= 0 else '#e74c3c' for x in quarterly_variance['actual_vs_budget']],
                     edgecolor='white', linewidth=0.5)
        ax.axhline(y=0, color='black', linestyle='-', linewidth=1.5)
        ax.set_xlabel('Quarter', fontsize=10)
        ax.set_ylabel('Variance (%)', fontsize=10)
        ax.set_title('Revenue Variance vs Budget', fontsize=11, fontweight='bold')
        ax.tick_params(axis='x', rotation=45, labelsize=9)
        ax.tick_params(axis='y', labelsize=9)
        ax.grid(True, alpha=0.3, axis='y', linestyle='--')
        # Add value labels
        for bar in bars:
            height = bar.get_height()
            ax.text(bar.get_x() + bar.get_width()/2., height,
                   f'{height:.1f}%', ha='center', 
                   va='bottom' if height >= 0 else 'top', fontsize=8, fontweight='bold')
        st.pyplot(fig, use_container_width=True)
        plt.close()
    
    st.markdown("<br>", unsafe_allow_html=True)
    
    # Operations KPIs
    st.header("⚙️ Operations KPIs")
    
    ops_summary = filtered_operations.groupby('year_month').agg({
        'tickets_resolved': 'sum',
        'sla_breaches': 'sum',
        'cycle_time': 'mean',
        'utilization': 'mean'
    }).reset_index()
    ops_summary['year_month'] = pd.to_datetime(ops_summary['year_month'])
    ops_summary['sla_breach_rate'] = (ops_summary['sla_breaches'] / ops_summary['tickets_resolved'] * 100).round(2)
    
    col1, col2, col3, col4 = st.columns(4)
    
    with col1:
        st.metric("Total Tickets", f"{filtered_operations['tickets_resolved'].sum():,}")
    with col2:
        st.metric("SLA Breach Rate", f"{ops_summary['sla_breach_rate'].mean():.2f}%")
    with col3:
        st.metric("Avg Cycle Time", f"{filtered_operations['cycle_time'].mean():.2f} days")
    with col4:
        st.metric("Avg Utilization", f"{filtered_operations['utilization'].mean():.2f}%")
    
    # Operations charts
    col1, col2 = st.columns(2)
    
    with col1:
        st.subheader("SLA Breach Rate Trend")
        fig, ax = create_figure(figsize=(10, 5))
        ax.plot(ops_summary['year_month'], ops_summary['sla_breach_rate'], 
                marker='o', linewidth=2, color='#e74c3c', markersize=4)
        ax.axhline(y=5, color='orange', linestyle='--', linewidth=1.5, label='Target (5%)', alpha=0.7)
        ax.set_xlabel('Date', fontsize=10)
        ax.set_ylabel('SLA Breach Rate (%)', fontsize=10)
        ax.set_title('SLA Breach Rate Over Time', fontsize=11, fontweight='bold')
        ax.legend(fontsize=9, loc='best', framealpha=0.9)
        ax.grid(True, alpha=0.3, linestyle='--')
        plt.xticks(rotation=45, fontsize=9)
        plt.yticks(fontsize=9)
        st.pyplot(fig, use_container_width=True)
        plt.close()
    
    with col2:
        st.subheader("Utilization Trend")
        fig, ax = create_figure(figsize=(10, 5))
        ax.plot(ops_summary['year_month'], ops_summary['utilization'], 
                marker='^', linewidth=2, color='#2ecc71', markersize=4)
        ax.axhline(y=85, color='orange', linestyle='--', linewidth=1.5, label='Target (85%)', alpha=0.7)
        ax.set_xlabel('Date', fontsize=10)
        ax.set_ylabel('Utilization (%)', fontsize=10)
        ax.set_title('Utilization Over Time', fontsize=11, fontweight='bold')
        ax.legend(fontsize=9, loc='best', framealpha=0.9)
        ax.grid(True, alpha=0.3, linestyle='--')
        plt.xticks(rotation=45, fontsize=9)
        plt.yticks(fontsize=9)
        st.pyplot(fig, use_container_width=True)
        plt.close()
    
    # Footer - minimal
    st.markdown("<br>", unsafe_allow_html=True)
    st.markdown("<p style='text-align: center; color: #6b7280; font-size: 0.9rem;'>Finance & Operations Command Center | Generated with Python, Pandas, and Streamlit</p>", unsafe_allow_html=True)

if __name__ == "__main__":
    main()

