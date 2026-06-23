# Customer Engagement & Product Utilization Analytics for Retention Strategy

A data-driven churn analysis and retention strategy built on a 10,000-record
European retail banking dataset. The project moves through four phases:
exploratory data analysis, feature analysis, customer segmentation/risk
scoring, and a final retention strategy with an executive summary report.

## Headline findings

- **Overall churn rate: 20.4%** (2,037 of 10,000 customers)
- **Germany churns at 32.4%** — roughly double France (16.2%) and Spain (16.7%)
- **Age is the strongest predictor of churn** (Random Forest importance: 24%); the 50-60 age band churns at 56.2%
- **Product holdings show a sharp anomaly**: customers with 2 products churn at only 7.6%, while customers with 3-4 products churn at 83-100% — a likely sign of overselling/product mismatch
- **Inactive members churn nearly 2x more** than active members (26.9% vs 14.3%)

See [`reports/phase4_retention_strategy.md`](reports/phase4_retention_strategy.md) and
[`reports/Customer_Retention_Executive_Summary.docx`](reports/Customer_Retention_Executive_Summary.docx)
for the full write-up and action plan.

## Repository structure

```
.
├── data/
│   └── European_Bank.csv              # raw dataset (10,000 rows, 14 columns)
├── src/
│   ├── phase1_eda.py                  # exploratory data analysis
│   ├── phase2_feature_analysis.py     # correlation + Random Forest feature importance
│   └── phase3_segmentation.py         # risk scoring & Low/Medium/High segmentation
├── reports/
│   ├── phase4_retention_strategy.md   # segment-by-segment action plan, timeline, KPIs
│   ├── generate_executive_summary_docx.js  # script that builds the Word report
│   └── Customer_Retention_Executive_Summary.docx  # final stakeholder-ready report
├── requirements.txt
└── README.md
```

## Dataset

| Column | Description |
|---|---|
| `CreditScore` | Customer's credit score |
| `Geography` | Country (France, Spain, Germany) |
| `Gender` | Male / Female |
| `Age` | Customer age |
| `Tenure` | Years with the bank |
| `Balance` | Account balance |
| `NumOfProducts` | Number of bank products held |
| `HasCrCard` | Has a credit card (1/0) |
| `IsActiveMember` | Active member (1/0) |
| `EstimatedSalary` | Annual salary estimate |
| `Exited` | Target variable — churned (1) or retained (0) |

## Running the analysis

```bash
pip install -r requirements.txt

python src/phase1_eda.py
python src/phase2_feature_analysis.py
python src/phase3_segmentation.py
```

`phase3_segmentation.py` writes a scored dataset to
`data/customers_with_risk_scores.csv`, adding a `risk_score` (0-12) and
`segment` (Low/Medium/High Risk) column to every customer record.

To regenerate the Word executive summary:

```bash
npm install -g docx
node reports/generate_executive_summary_docx.js
```

## Methodology

1. **EDA** — break down churn rate across every customer attribute to find where the problem concentrates
2. **Feature analysis** — point-biserial correlation and a Random Forest model rank which factors most strongly predict churn
3. **Segmentation** — a composite 0-12 risk score built from the top predictors classifies every customer into Low / Medium / High risk
4. **Retention strategy** — segment-specific interventions, a 90-day rollout timeline, and KPIs to track success

## License

MIT
