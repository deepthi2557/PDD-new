import os

# Target Web Application URL (Vercel deployment)
BASE_URL = "https://pdd-new.vercel.app/"

# User Credentials for E2E Authentication Tests
DEFAULT_USER_EMAIL = "[REDACTED]"
DEFAULT_USER_PASSWORD = "[REDACTED]"

# Appium / Selenium Driver Configuration
IMPLICIT_WAIT_TIMEOUT = 10
EXPLICIT_WAIT_TIMEOUT = 15
PAGE_LOAD_TIMEOUT = 30

# File Paths & Output Locations
ROOT_DIR = os.path.dirname(os.path.abspath(__file__))
REPORT_DIR = os.path.join(ROOT_DIR, "reports")
SCREENSHOT_DIR = os.path.join(ROOT_DIR, "screenshots")
EXCEL_REPORT_PATH = os.path.join(ROOT_DIR, "appium_test_analysis_report.xlsx")

# Ensure required directories exist
os.makedirs(REPORT_DIR, exist_ok=True)
os.makedirs(SCREENSHOT_DIR, exist_ok=True)

# Appium Mobile Capabilities (Chrome / Safari / Web Emulator)
APPIUM_CAPABILITIES = {
    "platformName": "Android",
    "automationName": "UiAutomator2",
    "deviceName": "Android Emulator",
    "browserName": "Chrome",
    "newCommandTimeout": 300,
    "goog:chromeOptions": {
        "args": ["--headless", "--no-sandbox", "--disable-gpu", "--disable-dev-shm-usage"]
    }
}
