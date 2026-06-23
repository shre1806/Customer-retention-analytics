"""
Phase 2: Feature Analysis
Customer Engagement & Product Utilization Analytics for Retention Strategy

Quantifies which customer attributes most strongly predict churn using
point-biserial correlation and a Random Forest feature importance ranking.
"""

import pandas as pd
from scipy import stats
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder

DATA_PATH = "data/European_Bank.csv"


def load_data(path: str = DATA_PATH) -> pd.DataFrame:
    df = pd.read_csv(path)
    df["Geography_Germany"] = (df["Geography"] == "Germany").astype(int)
    df["Geography_Spain"] = (df["Geography"] == "Spain").astype(int)
    df["Gender_Female"] = (df["Gender"] == "Female").astype(int)
    return df


def correlation_report(df: pd.DataFrame) -> None:
    cols = [
        "CreditScore", "Age", "Tenure", "Balance", "NumOfProducts",
        "HasCrCard", "IsActiveMember", "EstimatedSalary",
        "Geography_Germany", "Geography_Spain", "Gender_Female",
    ]
    print("=" * 60)
    print("POINT-BISERIAL CORRELATION WITH CHURN (Exited)")
    print("=" * 60)
    for col in cols:
        corr, pval = stats.pointbiserialr(df[col], df["Exited"])
        print(f"{col:>20s}: r = {corr:+.4f}   p = {pval:.4f}")


def feature_importance(df: pd.DataFrame) -> pd.Series:
    df = df.copy()
    df["Gender_enc"] = LabelEncoder().fit_transform(df["Gender"])
    df["Geo_enc"] = LabelEncoder().fit_transform(df["Geography"])

    features = [
        "CreditScore", "Age", "Tenure", "Balance", "NumOfProducts",
        "HasCrCard", "IsActiveMember", "EstimatedSalary",
        "Gender_enc", "Geo_enc",
    ]
    X = df[features]
    y = df["Exited"]

    rf = RandomForestClassifier(n_estimators=100, random_state=42)
    rf.fit(X, y)

    importances = pd.Series(rf.feature_importances_, index=features)
    return importances.sort_values(ascending=False)


def high_low_risk_combos(df: pd.DataFrame) -> None:
    print("\n" + "=" * 60)
    print("HIGH/LOW RISK COMBINATIONS")
    print("=" * 60)

    high_mask = (
        (df["Geography"] == "Germany")
        & (df["IsActiveMember"] == 0)
        & (df["Age"].between(40, 60))
    )
    print(
        f"Germany + Inactive + Age 40-60: "
        f"n={high_mask.sum()}, churn={df[high_mask]['Exited'].mean():.1%}"
    )

    low_mask = (df["IsActiveMember"] == 1) & (df["NumOfProducts"] == 2)
    print(
        f"Active + 2 products:            "
        f"n={low_mask.sum()}, churn={df[low_mask]['Exited'].mean():.1%}"
    )


def profile_comparison(df: pd.DataFrame) -> pd.DataFrame:
    cols = [
        "Age", "Balance", "NumOfProducts", "CreditScore",
        "Tenure", "IsActiveMember", "EstimatedSalary",
    ]
    return df.groupby("Exited")[cols].mean().round(2)


def main():
    df = load_data()
    correlation_report(df)

    print("\n" + "=" * 60)
    print("RANDOM FOREST FEATURE IMPORTANCE")
    print("=" * 60)
    importances = feature_importance(df)
    for feat, imp in importances.items():
        print(f"{feat:>20s}: {imp:.4f}")

    high_low_risk_combos(df)

    print("\n" + "=" * 60)
    print("CHURNED VS RETAINED: AVERAGE PROFILE")
    print("=" * 60)
    print(profile_comparison(df))


if __name__ == "__main__":
    main()
