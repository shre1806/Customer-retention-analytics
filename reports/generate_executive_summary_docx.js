const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, Header, Footer,
        AlignmentType, LevelFormat, TableOfContents, HeadingLevel, BorderStyle, WidthType,
        ShadingType, PageNumber, PageBreak, TabStopType, TabStopPosition } = require("docx");
const fs = require("fs");

const NAVY = "1F3864";
const ACCENT = "D85A30";
const GRAY = "5F5E5A";
const LIGHTGRAY = "F1EFE8";
const border = { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" };
const borders = { top: border, bottom: border, left: border, right: border };

function cell(text, opts = {}) {
  const { width, bold = false, fill = null, align = AlignmentType.LEFT, color = "000000", size = 21 } = opts;
  return new TableCell({
    borders,
    width: { size: width, type: WidthType.DXA },
    shading: fill ? { fill, type: ShadingType.CLEAR } : undefined,
    margins: { top: 80, bottom: 80, left: 120, right: 120 },
    children: [new Paragraph({
      alignment: align,
      children: [new TextRun({ text, bold, color, size })]
    })]
  });
}

function bullet(text, level = 0) {
  return new Paragraph({
    numbering: { reference: "bullets", level },
    children: [new TextRun({ text, size: 22 })]
  });
}

function para(text, opts = {}) {
  const { bold = false, size = 22, color = "000000", spacingAfter = 160, italics = false } = opts;
  return new Paragraph({
    spacing: { after: spacingAfter },
    children: [new TextRun({ text, bold, size, color, italics })]
  });
}

function h1(text) {
  return new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun(text)] });
}
function h2(text) {
  return new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun(text)] });
}

const COLW = [3120, 3120, 3120]; // sums to 9360

const doc = new Document({
  styles: {
    default: { document: { run: { font: "Arial", size: 22, color: "1A1A1A" } } },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 32, bold: true, font: "Arial", color: NAVY },
        paragraph: { spacing: { before: 360, after: 200 }, outlineLevel: 0,
          border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: ACCENT, space: 4 } } } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 26, bold: true, font: "Arial", color: NAVY },
        paragraph: { spacing: { before: 280, after: 140 }, outlineLevel: 1 } },
      { id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 23, bold: true, font: "Arial", color: GRAY },
        paragraph: { spacing: { before: 200, after: 100 }, outlineLevel: 2 } },
    ]
  },
  numbering: {
    config: [
      { reference: "bullets",
        levels: [
          { level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 460, hanging: 260 } } } },
          { level: 1, format: LevelFormat.BULLET, text: "–", alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 920, hanging: 260 } } } },
        ] },
    ]
  },
  sections: [
    // COVER PAGE
    {
      properties: {
        page: { size: { width: 12240, height: 15840 }, margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } }
      },
      children: [
        new Paragraph({ spacing: { before: 2400 }, children: [] }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 200 },
          children: [new TextRun({ text: "EXECUTIVE SUMMARY", bold: true, size: 24, color: ACCENT, font: "Arial" })]
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 300 },
          children: [new TextRun({ text: "Customer Engagement & Product Utilization Analytics", bold: true, size: 44, color: NAVY, font: "Arial" })]
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 800 },
          children: [new TextRun({ text: "A Data-Driven Retention Strategy", size: 28, color: GRAY, font: "Arial" })]
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 100 },
          children: [new TextRun({ text: "Prepared for: European Retail Banking Division", size: 22, color: GRAY })]
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 100 },
          children: [new TextRun({ text: "Dataset: 10,000 customer records", size: 22, color: GRAY })]
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: "June 2026", size: 22, color: GRAY })]
        }),
        new Paragraph({ children: [new PageBreak()] }),
      ]
    },
    // TOC PAGE
    {
      properties: { page: { size: { width: 12240, height: 15840 }, margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } } },
      children: [
        h1("Table of Contents"),
        new TableOfContents("Table of Contents", { hyperlink: true, headingStyleRange: "1-2" }),
        new Paragraph({ children: [new PageBreak()] }),
      ]
    },
    // MAIN CONTENT
    {
      properties: {
        page: { size: { width: 12240, height: 15840 }, margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } }
      },
      headers: {
        default: new Header({
          children: [new Paragraph({
            tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
            children: [
              new TextRun({ text: "Customer Retention Analytics", size: 16, color: GRAY }),
              new TextRun({ text: "\tExecutive Summary", size: 16, color: GRAY }),
            ]
          })]
        })
      },
      footers: {
        default: new Footer({
          children: [new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: "Page ", size: 16, color: GRAY }), new TextRun({ children: [PageNumber.CURRENT], size: 16, color: GRAY })]
          })]
        })
      },
      children: [

        h1("1. Overview"),
        para("This report summarizes a customer engagement and product utilization analysis conducted on a 10,000-record European retail banking dataset, with the goal of identifying drivers of customer churn and recommending a targeted retention strategy."),
        para("Of the 10,000 customers analyzed, 2,037 (20.4%) had churned at the time of data collection. The analysis identified clear, actionable patterns behind this churn \u2014 driven primarily by customer age, geography, product holdings, and engagement levels \u2014 and translates these findings into a segmented, prioritized retention plan."),

        h2("1.1 Key headline figures"),
        new Table({
          width: { size: 9360, type: WidthType.DXA },
          columnWidths: COLW,
          rows: [
            new TableRow({ children: [
              cell("Metric", { width: COLW[0], bold: true, fill: NAVY, color: "FFFFFF" }),
              cell("Value", { width: COLW[1], bold: true, fill: NAVY, color: "FFFFFF" }),
              cell("Implication", { width: COLW[2], bold: true, fill: NAVY, color: "FFFFFF" }),
            ]}),
            new TableRow({ children: [
              cell("Overall churn rate", { width: COLW[0] }),
              cell("20.4%", { width: COLW[1], bold: true, color: ACCENT }),
              cell("1 in 5 customers leaves", { width: COLW[2] }),
            ]}),
            new TableRow({ children: [
              cell("Highest-risk segment churn", { width: COLW[0] }),
              cell("45.4%", { width: COLW[1], bold: true, color: ACCENT }),
              cell("3,031 customers at acute risk", { width: COLW[2] }),
            ]}),
            new TableRow({ children: [
              cell("Lowest-risk segment churn", { width: COLW[0] }),
              cell("3.2%", { width: COLW[1], bold: true, color: "27500A" }),
              cell("1,740 loyal customers", { width: COLW[2] }),
            ]}),
            new TableRow({ children: [
              cell("Germany churn rate", { width: COLW[0] }),
              cell("32.4%", { width: COLW[1], bold: true, color: ACCENT }),
              cell("2x France/Spain", { width: COLW[2] }),
            ]}),
            new TableRow({ children: [
              cell("3\u20134 product holders churn", { width: COLW[0] }),
              cell("83\u2013100%", { width: COLW[1], bold: true, color: ACCENT }),
              cell("Likely overselling/mismatch", { width: COLW[2] }),
            ]}),
          ]
        }),

        h1("2. Methodology"),
        para("The analysis followed a five-phase approach:"),
        bullet("Exploratory data analysis (EDA) across all customer attributes to identify univariate churn patterns"),
        bullet("Feature analysis using correlation statistics and a Random Forest model to rank churn predictors"),
        bullet("Customer segmentation using a composite risk score to classify customers into High, Medium, and Low risk tiers"),
        bullet("Retention strategy design mapping specific interventions to each risk segment"),
        bullet("Executive reporting to consolidate findings into actionable recommendations (this document)"),

        h1("3. Key Findings"),

        h2("3.1 Top predictors of churn"),
        para("A Random Forest model was used to rank features by their contribution to predicting churn. Age emerged as the single strongest predictor, followed by estimated salary, credit score, account balance, and number of products held."),
        new Table({
          width: { size: 9360, type: WidthType.DXA },
          columnWidths: [4680, 2340, 2340],
          rows: [
            new TableRow({ children: [
              cell("Feature", { width: 4680, bold: true, fill: NAVY, color: "FFFFFF" }),
              cell("Importance", { width: 2340, bold: true, fill: NAVY, color: "FFFFFF", align: AlignmentType.CENTER }),
              cell("Direction", { width: 2340, bold: true, fill: NAVY, color: "FFFFFF", align: AlignmentType.CENTER }),
            ]}),
            new TableRow({ children: [cell("Age", {width:4680}), cell("24.0%", {width:2340, align: AlignmentType.CENTER}), cell("Older = higher risk", {width:2340, align: AlignmentType.CENTER})]}),
            new TableRow({ children: [cell("Estimated salary", {width:4680}), cell("14.8%", {width:2340, align: AlignmentType.CENTER}), cell("Minor effect", {width:2340, align: AlignmentType.CENTER})]}),
            new TableRow({ children: [cell("Credit score", {width:4680}), cell("14.5%", {width:2340, align: AlignmentType.CENTER}), cell("Minor effect", {width:2340, align: AlignmentType.CENTER})]}),
            new TableRow({ children: [cell("Account balance", {width:4680}), cell("14.0%", {width:2340, align: AlignmentType.CENTER}), cell("Higher = higher risk", {width:2340, align: AlignmentType.CENTER})]}),
            new TableRow({ children: [cell("Number of products", {width:4680}), cell("13.1%", {width:2340, align: AlignmentType.CENTER}), cell("Non-linear (see 3.3)", {width:2340, align: AlignmentType.CENTER})]}),
            new TableRow({ children: [cell("Tenure", {width:4680}), cell("8.1%", {width:2340, align: AlignmentType.CENTER}), cell("Minor effect", {width:2340, align: AlignmentType.CENTER})]}),
            new TableRow({ children: [cell("Active membership", {width:4680}), cell("4.0%", {width:2340, align: AlignmentType.CENTER}), cell("Inactive = higher risk", {width:2340, align: AlignmentType.CENTER})]}),
            new TableRow({ children: [cell("Geography", {width:4680}), cell("3.7%", {width:2340, align: AlignmentType.CENTER}), cell("Germany = higher risk", {width:2340, align: AlignmentType.CENTER})]}),
          ]
        }),

        h2("3.2 Geography and demographics"),
        bullet("Germany shows a 32.4% churn rate \u2014 roughly double France (16.2%) and Spain (16.7%) \u2014 suggesting either local competitive pressure or service gaps specific to the German market."),
        bullet("Customers aged 50\u201360 show the highest churn of any age band at 56.2%, with the 40\u201350 band also elevated at 34.0%. Customers under 40 are comparatively stable (under 13%)."),
        bullet("Female customers churn at 25.1% versus 16.5% for male customers, a gap worth further qualitative investigation."),

        h2("3.3 Product holdings: a critical anomaly"),
        para("The relationship between number of products and churn is sharply non-linear and represents the most actionable finding in this analysis:"),
        bullet("Customers with exactly 2 products are the most loyal group in the entire dataset \u2014 only 7.6% churn."),
        bullet("Customers with 1 product churn at 27.7%, suggesting under-engagement."),
        bullet("Customers with 3 products churn at 82.7%, and customers with 4 products churn at 100%."),
        para("This pattern strongly suggests that customers holding 3+ products have been oversold or mis-sold products that do not fit their needs, rather than that more products inherently increase loyalty. This is the single highest-leverage fix available in this dataset.", { italics: true, color: GRAY, size: 21 }),

        h2("3.4 Engagement and balance"),
        bullet("Inactive members churn at 26.9% versus 14.3% for active members \u2014 engagement is a strong retention lever."),
        bullet("Low-balance customers (\u20ac1\u201350k) show the highest churn within the balance dimension (34.7%), while zero-balance customers are comparatively stable (13.8%), likely reflecting different usage patterns (e.g., non-savings relationships)."),
        bullet("Credit score shows minimal predictive value for churn (19.5\u201323.7% range across all bands) and is not a useful targeting variable for retention efforts."),

        new Paragraph({ children: [new PageBreak()] }),

        h1("4. Customer Segmentation"),
        para("A composite risk score (0\u201312) was constructed from the key predictors \u2014 age, number of products, geography, activity status, gender, and balance \u2014 and used to classify all 10,000 customers into three actionable tiers."),

        new Table({
          width: { size: 9360, type: WidthType.DXA },
          columnWidths: [2340, 2340, 2340, 2340],
          rows: [
            new TableRow({ children: [
              cell("Segment", { width: 2340, bold: true, fill: NAVY, color: "FFFFFF" }),
              cell("Customers", { width: 2340, bold: true, fill: NAVY, color: "FFFFFF", align: AlignmentType.CENTER }),
              cell("% of base", { width: 2340, bold: true, fill: NAVY, color: "FFFFFF", align: AlignmentType.CENTER }),
              cell("Churn rate", { width: 2340, bold: true, fill: NAVY, color: "FFFFFF", align: AlignmentType.CENTER }),
            ]}),
            new TableRow({ children: [
              cell("High risk", { width: 2340, bold: true, color: ACCENT }),
              cell("3,031", { width: 2340, align: AlignmentType.CENTER }),
              cell("30.3%", { width: 2340, align: AlignmentType.CENTER }),
              cell("45.4%", { width: 2340, align: AlignmentType.CENTER, bold: true, color: ACCENT }),
            ]}),
            new TableRow({ children: [
              cell("Medium risk", { width: 2340, bold: true, color: "854F0B" }),
              cell("5,229", { width: 2340, align: AlignmentType.CENTER }),
              cell("52.3%", { width: 2340, align: AlignmentType.CENTER }),
              cell("11.6%", { width: 2340, align: AlignmentType.CENTER, bold: true, color: "854F0B" }),
            ]}),
            new TableRow({ children: [
              cell("Low risk", { width: 2340, bold: true, color: "27500A" }),
              cell("1,740", { width: 2340, align: AlignmentType.CENTER }),
              cell("17.4%", { width: 2340, align: AlignmentType.CENTER }),
              cell("3.2%", { width: 2340, align: AlignmentType.CENTER, bold: true, color: "27500A" }),
            ]}),
          ]
        }),

        h2("4.1 Segment profiles"),
        para("High risk (3,031 customers): ", { bold: true, spacingAfter: 40 }),
        para("Average age 43.4; 59% based in Germany; 62% female; only 23.1% are active members; average balance \u20ac109,608. This segment combines acute disengagement with high-value accounts \u2014 the greatest revenue exposure in the portfolio.", { size: 21, color: GRAY }),
        para("Medium risk (5,229 customers): ", { bold: true, spacingAfter: 40 }),
        para("Average age 38.3; 14% in Germany; 55% active. The largest segment and the most cost-effective to influence \u2014 modest engagement nudges can shift many of these customers into the low-risk tier.", { size: 21, color: GRAY }),
        para("Low risk (1,740 customers): ", { bold: true, spacingAfter: 40 }),
        para("Average age 33.2; 0% in Germany; 92% active; lower average balance (\u20ac24,765). This is the loyal core of the customer base and an opportunity for wallet-share growth and referrals.", { size: 21, color: GRAY }),

        new Paragraph({ children: [new PageBreak()] }),

        h1("5. Retention Strategy & Recommendations"),

        h2("5.1 High-risk segment \u2014 critical priority"),
        bullet("Launch proactive relationship-manager outreach to Germany-based, inactive, 40\u201360 age-band customers within 30 days (the highest-concentration sub-segment, at 61.2% churn)."),
        bullet("Conduct a product audit for all customers holding 3\u20134 products and offer simplified, right-fit bundles \u2014 this single fix addresses the largest identified anomaly in the data."),
        bullet("Offer targeted retention incentives (fee waivers, preferential rates) to high-balance customers in this segment, weighing offer cost against the cost of account loss."),
        bullet("Run a Germany-specific retention campaign to investigate and address local competitive or service factors."),

        h2("5.2 Medium-risk segment \u2014 high priority"),
        bullet("Deploy re-engagement email and app-notification campaigns targeting the 45.4% of this segment that is currently inactive."),
        bullet("Introduce a personalized second-product nudge for single-product customers, leveraging the strong loyalty signal seen in 2-product holders (7.6% churn)."),
        bullet("Offer financial health check-ins, particularly ahead of the age-50 risk inflection point."),
        bullet("Introduce loyalty tiers to give status-driven customers a reason to remain engaged."),

        h2("5.3 Low-risk segment \u2014 sustain and grow"),
        bullet("Launch a referral program to convert this loyal, highly active base into a customer-acquisition channel."),
        bullet("Introduce premium savings or investment products to grow wallet share, given this segment's comparatively low average balance."),
        bullet("Set up automated monitoring for early risk signals (declining activity, approaching age 40) to catch drift before customers migrate into the medium-risk tier."),

        h1("6. Implementation Timeline"),
        new Table({
          width: { size: 9360, type: WidthType.DXA },
          columnWidths: [1560, 7800],
          rows: [
            new TableRow({ children: [
              cell("Timing", { width: 1560, bold: true, fill: NAVY, color: "FFFFFF" }),
              cell("Action", { width: 7800, bold: true, fill: NAVY, color: "FFFFFF" }),
            ]}),
            new TableRow({ children: [cell("Month 1", {width:1560, bold:true}), cell("Identify and contact all high-risk customers, prioritizing the Germany + inactive + age 40\u201360 group (565 customers, 61.2% churn).", {width:7800})]}),
            new TableRow({ children: [cell("Month 1\u20132", {width:1560, bold:true}), cell("Launch product audit and simplification offer for the 326 customers holding 3\u20134 products.", {width:7800})]}),
            new TableRow({ children: [cell("Month 2", {width:1560, bold:true}), cell("Roll out re-engagement campaign to inactive medium-risk customers.", {width:7800})]}),
            new TableRow({ children: [cell("Month 2\u20133", {width:1560, bold:true}), cell("Deploy second-product upsell flow for single-product medium-risk customers.", {width:7800})]}),
            new TableRow({ children: [cell("Month 3", {width:1560, bold:true}), cell("Launch referral and loyalty programs for the low-risk customer base.", {width:7800})]}),
            new TableRow({ children: [cell("Ongoing", {width:1560, bold:true}), cell("Re-score all customers monthly and re-assign segments dynamically as behavior changes.", {width:7800})]}),
          ]
        }),

        h1("7. Success Metrics (KPIs)"),
        new Table({
          width: { size: 9360, type: WidthType.DXA },
          columnWidths: [4680, 2340, 2340],
          rows: [
            new TableRow({ children: [
              cell("KPI", { width: 4680, bold: true, fill: NAVY, color: "FFFFFF" }),
              cell("Current", { width: 2340, bold: true, fill: NAVY, color: "FFFFFF", align: AlignmentType.CENTER }),
              cell("Target", { width: 2340, bold: true, fill: NAVY, color: "FFFFFF", align: AlignmentType.CENTER }),
            ]}),
            new TableRow({ children: [cell("Overall churn rate", {width:4680}), cell("20.4%", {width:2340, align:AlignmentType.CENTER}), cell("< 14%", {width:2340, align:AlignmentType.CENTER, bold:true})]}),
            new TableRow({ children: [cell("High-risk segment churn", {width:4680}), cell("45.4%", {width:2340, align:AlignmentType.CENTER}), cell("< 30%", {width:2340, align:AlignmentType.CENTER, bold:true})]}),
            new TableRow({ children: [cell("Active member rate", {width:4680}), cell("51.5%", {width:2340, align:AlignmentType.CENTER}), cell("> 65%", {width:2340, align:AlignmentType.CENTER, bold:true})]}),
            new TableRow({ children: [cell("Average products per customer", {width:4680}), cell("1.53", {width:2340, align:AlignmentType.CENTER}), cell("> 1.8", {width:2340, align:AlignmentType.CENTER, bold:true})]}),
            new TableRow({ children: [cell("Germany churn rate", {width:4680}), cell("32.4%", {width:2340, align:AlignmentType.CENTER}), cell("< 22%", {width:2340, align:AlignmentType.CENTER, bold:true})]}),
            new TableRow({ children: [cell("High-risk outreach response rate", {width:4680}), cell("\u2014", {width:2340, align:AlignmentType.CENTER}), cell("> 35%", {width:2340, align:AlignmentType.CENTER, bold:true})]}),
            new TableRow({ children: [cell("Product upsell conversion (medium risk)", {width:4680}), cell("\u2014", {width:2340, align:AlignmentType.CENTER}), cell("> 15%", {width:2340, align:AlignmentType.CENTER, bold:true})]}),
            new TableRow({ children: [cell("Referral rate (low risk)", {width:4680}), cell("\u2014", {width:2340, align:AlignmentType.CENTER}), cell("5%", {width:2340, align:AlignmentType.CENTER, bold:true})]}),
          ]
        }),

        h1("8. Conclusion"),
        para("This analysis demonstrates that customer churn at this institution is concentrated and predictable rather than random. A small number of clear factors \u2014 age, geography, product fit, and engagement \u2014 account for the majority of churn risk, and the data points to specific, addressable root causes rather than broad-based dissatisfaction."),
        para("The product-holding anomaly (3\u20134 products correlating with 83\u2013100% churn) and the Germany concentration (59% of all high-risk customers) represent the two highest-leverage opportunities. Addressing these through the phased plan above, combined with ongoing monthly re-scoring, provides a realistic path to reducing overall churn from 20.4% toward the 14% target within the next 2\u20133 quarters."),
      ]
    }
  ]
});

Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync("/home/claude/report/Customer_Retention_Executive_Summary.docx", buffer);
  console.log("done");
});
