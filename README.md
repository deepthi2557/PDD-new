# 🚀 PDD SkillSwap Platform — Automated Testing & CI/CD Pipeline

[![Flutter CI/CD Pipeline](https://github.com/deepthi2557/PDD-new/actions/workflows/ci.yml/badge.svg)](https://github.com/deepthi2557/PDD-new/actions/workflows/ci.yml)
[![Selenium E2E Tests](https://github.com/deepthi2557/PDD-new/actions/workflows/selenium.yml/badge.svg)](https://github.com/deepthi2557/PDD-new/actions/workflows/selenium.yml)
[![Appium E2E Tests](https://github.com/deepthi2557/PDD-new/actions/workflows/appium.yml/badge.svg)](https://github.com/deepthi2557/PDD-new/actions/workflows/appium.yml)
[![Test Pass Rate](https://img.shields.io/badge/Test%20Pass%20Rate-100%25-brightgreen)](https://github.com/deepthi2557/PDD-new/actions)
[![Total Test Actions](https://img.shields.io/badge/Total%20Test%20Actions-706-blue)](https://github.com/deepthi2557/PDD-new/actions)

---

## 📥 Direct Download Hyperlinks (Excel & CSV Reports)

Click any of the links below to download the latest testing reports directly from GitHub:

| Report Type | Format | Test Scope | Direct Download Link |
| :--- | :---: | :--- | :---: |
| **Master Testing Report** | `.xlsx` | All 706 Actions (Selenium, Appium, Load, SAST) | [⬇️ **Download Master Excel Report**](https://github.com/deepthi2557/PDD-new/raw/main/github_testing_actions_master_report.xlsx) |
| **Combined Actions (Selenium + Appium)** | `.csv` | 690 UI Actions (Browser + Mobile) | [⬇️ **Download Combined CSV**](https://github.com/deepthi2557/PDD-new/raw/main/selenium_and_appium_tested_actions.csv) |
| **Selenium Web Actions** | `.csv` | 345 Automated Web E2E Actions | [⬇️ **Download Selenium CSV**](https://github.com/deepthi2557/PDD-new/raw/main/selenium_tested_actions.csv) |
| **Appium Mobile Actions** | `.csv` | 345 Automated Mobile E2E Actions | [⬇️ **Download Appium CSV**](https://github.com/deepthi2557/PDD-new/raw/main/appium_tested_actions.csv) |

---

## ⚡ How to Download Reports Directly from GitHub Actions

Whenever a workflow runs on GitHub, the complete Excel workbook and CSV exports are packaged as workflow artifacts.

1. Navigate to the **[GitHub Actions Tab](https://github.com/deepthi2557/PDD-new/actions)**.
2. Select the latest workflow run (e.g., **`Flutter CI/CD Pipeline`**).
3. Scroll down to the **Artifacts** section at the bottom of the page.
4. Click on **`github-testing-actions-master-report`** to download the complete archive containing:
   - `github_testing_actions_master_report.xlsx` (Full 7-tab styled workbook)
   - `selenium_tested_actions.csv`
   - `appium_tested_actions.csv`
   - `selenium_and_appium_tested_actions.csv`

---

## 📊 Quality Assurance & Testing Breakdown

| Testing Suite | Framework | Target / Route | Total Actions | Pass Rate | Status |
| :--- | :--- | :--- | :---: | :---: | :---: |
| **Selenium E2E Web Tests** | Python 3.12 + Selenium WebDriver | Chrome / `https://pdd-new.vercel.app/` | 345 | 100.0% | ✅ PASSED |
| **Appium Mobile E2E Tests** | Python 3.12 + Appium WebDriver | Mobile Viewport / Multi-Screen | 345 | 100.0% | ✅ PASSED |
| **Load & Stress Performance** | Python Async Multi-User Benchmark | 8 Key Routes (RPS & Latency) | 8 | 100.0% | ✅ PASSED |
| **Static Security SAST Scan** | OWASP Top 10 SAST Engine | Whole Codebase / Token Security | 8 | 100.0% | ✅ PASSED |
| **Frontend Bundle Build** | Node.js 20 + Vite / npm | `Frontend/dist` | 1 | 100.0% | ✅ PASSED |

**Total Quality Assurance Test Actions:** **706 Automated Actions (100% Passed)**

---

## 🛠️ Local Generation & Export

To re-generate or update the Excel and CSV reports locally:

```powershell
# Generate the Master Excel Report:
python generate_github_testing_actions_excel.py

# Export Selenium & Appium actions to CSV:
python export_tests_to_csv.py
```

