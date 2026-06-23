"""
Phase 3: Customer Segmentation & Risk Scoring
Customer Engagement & Product Utilization Analytics for Retention Strategy

Builds a composite risk score (0-12) from the key churn predictors
identified in Phase 2, then classifies every customer into a
Low / Medium / High risk segment.
"""

import pandas as pd

DATA_PATH = "data/European_Bank.csv"


def load_data(path: str = DATA_PATH) -> pd.DataFrame:
    return pd.read_csv(path)


def age_risk(age: int) -> int:
    if age < 30:
        return 0
    elif age < 40:
        return 1
    elif age < 50:
        return 2
    elif age < 60:
        return 3
    else:
        return 2


def product_risk(n: int) -> int:
    if n == 2:
        return 0
    elif n == 1:
        return 1
    else:  # 3 or 4 products
        return 3


def add_risk_score(df: pd.DataFrame) -> pd.DataFrame:
    df = df.copy()
    df["age_risk"] = df["Age"].apply(age_risk)
    df["prod_risk"] = df["NumOfProducts"].apply(product_risk)
    df["geo_risk"] = (df["Geography"] == "Germany").astype(int) * 2
    df["inactive_risk"] = (df["IsActiveMember"] == 0).astype(int) * 2
    df["gender_risk"] = (df["Gender"] == "Female").astype(int)
    df["balance_risk"] = pd.cut(
        df["Balance"], bins=[-1, 1, 50000, 300000], labels=[0, 2, 1]
    ).astype(int)

    df["risk_score"] = (
        df["age_risk"] + df["prod_risk"] + df["geo_risk"]
        + df["inactive_risk"] + df["gender_risk"] + df["balance_risk"]
    )
    return df


def assign_segment(score: int) -> str:
    if score <= 2:
        return "Low Risk"
    elif score <= 5:
        return "Medium Risk"
    else:
        return "High Risk"


def segment_profiles(df: pd.DataFrame) -> pd.DataFrame:
    return df.groupby("segment").agg(
        count=("Exited", "count"),
        actual_churn_rate=("Exited", "mean"),
        avg_age=("Age", "mean"),
        avg_balance=("Balance", "mean"),
        avg_products=("NumOfProducts", "mean"),
        avg_tenure=("Tenure", "mean"),
        avg_salary=("EstimatedSalary", "mean"),
        active_pct=("IsActiveMember", "mean"),
    ).round(3)


def main():
    df = load_data()
    df = add_risk_score(df)
    df["segment"] = df["risk_score"].apply(assign_segment)

    print("=" * 60)
    print("SEGMENT DISTRIBUTION & PROFILES")
    print("=" * 60)
    print(segment_profiles(df))

    print("\n" + "=" * 60)
    print("RISK SCORE -> ACTUAL CHURN RATE")
    print("=" * 60)
    print(df.groupby("risk_score")["Exited"].agg(["mean", "count"]).round(3))

    print("\n" + "=" * 60)
    print("SEGMENT COUNTS")
    print("=" * 60)
    print(df["segment"].value_counts())

    # Persist scored dataset for downstream use (e.g. dashboards, CRM export)
    out_path = "data/customers_with_risk_scores.csv"
    df.to_csv(out_path, index=False)
    print(f"\nScored dataset written to {out_path}")


if __name__ == "__main__":
    main()
