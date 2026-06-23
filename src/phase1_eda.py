"""
Phase 1: Exploratory Data Analysis
Customer Engagement & Product Utilization Analytics for Retention Strategy

Loads the European Bank dataset and breaks down churn rate across every
key customer attribute: geography, gender, age, tenure, balance,
number of products, activity status, and credit score.
"""

import pandas as pd

DATA_PATH = "data/European_Bank.csv"


def load_data(path: str = DATA_PATH) -> pd.DataFrame:
    df = pd.read_csv(path)
    return df


def overall_churn(df: pd.DataFrame) -> None:
    rate = df["Exited"].mean()
    print(f"Total customers: {len(df)}")
    print(f"Churn rate: {rate:.2%}")
    print(f"Churned: {df['Exited'].sum()} | Retained: {(df['Exited'] == 0).sum()}")


def churn_by(df: pd.DataFrame, column: str) -> pd.DataFrame:
    return df.groupby(column)["Exited"].agg(["sum", "count", "mean"]).round(3)


def add_buckets(df: pd.DataFrame) -> pd.DataFrame:
    df = df.copy()
    df["AgeGroup"] = pd.cut(
        df["Age"], bins=[0, 30, 40, 50, 60, 100],
        labels=["<30", "30-40", "40-50", "50-60", "60+"]
    )
    df["BalanceBucket"] = pd.cut(
        df["Balance"], bins=[-1, 1, 50000, 100000, 150000, 300000],
        labels=["Zero", "Low", "Mid", "High", "Very High"]
    )
    df["CreditBucket"] = pd.cut(
        df["CreditScore"], bins=[299, 499, 599, 699, 799, 851],
        labels=["Poor", "Fair", "Good", "Very Good", "Excellent"]
    )
    return df


def main():
    df = load_data()
    print("=" * 60)
    print("OVERALL CHURN SUMMARY")
    print("=" * 60)
    overall_churn(df)

    df = add_buckets(df)

    dimensions = [
        "Geography", "Gender", "NumOfProducts", "IsActiveMember",
        "HasCrCard", "AgeGroup", "Tenure", "BalanceBucket", "CreditBucket",
    ]

    for dim in dimensions:
        print("\n" + "=" * 60)
        print(f"CHURN BY {dim.upper()}")
        print("=" * 60)
        print(churn_by(df, dim))


if __name__ == "__main__":
    main()
