import os

# Configuration for Web Application Selenium Testing Framework

# Web Application Target URL (Vercel Link / Localhost fallback)
DEFAULT_VERCEL_LINK = "https://skillswap-app.vercel.app"
DEFAULT_LOCAL_LINK = "http://localhost:5173"

BASE_URL = os.getenv("TEST_BASE_URL", os.getenv("VERCEL_URL", DEFAULT_LOCAL_LINK))

# Login Credentials
DEFAULT_EMAIL = os.getenv("TEST_USER_EMAIL", "testuser@skillswap.com")
DEFAULT_PASSWORD = os.getenv("TEST_USER_PASSWORD", "SkillSwap2026!")

# Browser Driver Configuration
HEADLESS = os.getenv("HEADLESS", "true").lower() == "true"
IMPLICIT_WAIT = int(os.getenv("IMPLICIT_WAIT", "10"))
EXPLICIT_WAIT = int(os.getenv("EXPLICIT_WAIT", "15"))

# Paths
ROOT_DIR = os.path.dirname(os.path.abspath(__file__))
REPORTS_DIR = os.path.join(ROOT_DIR, "reports")
SCREENSHOTS_DIR = os.path.join(ROOT_DIR, "screenshots")
EXCEL_REPORT_PATH = os.path.join(ROOT_DIR, "selenium_test_analysis_report.xlsx")

# Ensure required directories exist
os.makedirs(REPORTS_DIR, exist_ok=True)
os.makedirs(SCREENSHOTS_DIR, exist_ok=True)
