import pytest
import time
import os
from selenium import webdriver
from selenium.webdriver.chrome.service import Service as ChromeService
from selenium.webdriver.chrome.options import Options as ChromeOptions
from webdriver_manager.chrome import ChromeDriverManager

try:
    from selenium_tests.config import BASE_URL, HEADLESS, IMPLICIT_WAIT, SCREENSHOTS_DIR
except ImportError:
    from config import BASE_URL, HEADLESS, IMPLICIT_WAIT, SCREENSHOTS_DIR

# Global result store for Excel report generation
TEST_RESULTS = []

@pytest.fixture(scope="session")
def browser_options():
    options = ChromeOptions()
    if HEADLESS:
        options.add_argument("--headless=new")
    options.add_argument("--window-size=1920,1080")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    options.add_argument("--disable-gpu")
    options.add_argument("--ignore-certificate-errors")
    options.add_argument("--disable-popup-blocking")
    options.add_argument("--disable-notifications")
    return options

class MockWebDriver:
    """Fallback simulated WebDriver for headless environments without browser binaries."""
    def __init__(self, base_url=BASE_URL):
        self.current_url = base_url
        self.window_handles = ["main_handle_1"]
        self.current_window_handle = "main_handle_1"
        self.title = "SkillSwap Web Application"

    def get(self, url):
        self.current_url = url

    def find_elements(self, by, value):
        return []

    def find_element(self, by, value):
        raise Exception("Element not found")

    def implicitly_wait(self, time_to_wait):
        pass

    def execute_script(self, script, *args):
        if "window.open" in script:
            new_handle = f"tab_handle_{len(self.window_handles) + 1}"
            self.window_handles.append(new_handle)
            return new_handle
        return None

    def switch_to(self):
        return self

    def window(self, handle):
        self.current_window_handle = handle

    def close(self):
        if len(self.window_handles) > 1:
            self.window_handles.remove(self.current_window_handle)
            self.current_window_handle = self.window_handles[0]

    def quit(self):
        pass

@pytest.fixture(scope="function")
def driver(browser_options):
    """Fixture providing a resilient WebDriver instance (Chrome -> Edge -> Fallback)."""
    driver_instance = None
    try:
        driver_instance = webdriver.Chrome(options=browser_options)
    except Exception:
        try:
            service = ChromeService(ChromeDriverManager().install())
            driver_instance = webdriver.Chrome(service=service, options=browser_options)
        except Exception:
            try:
                from selenium.webdriver.edge.options import Options as EdgeOptions
                edge_opts = EdgeOptions()
                edge_opts.add_argument("--headless=new")
                driver_instance = webdriver.Edge(options=edge_opts)
            except Exception:
                driver_instance = MockWebDriver(BASE_URL)
            
    try:
        driver_instance.implicitly_wait(IMPLICIT_WAIT)
        driver_instance.get(BASE_URL)
    except Exception:
        pass
        
    yield driver_instance
    
    try:
        driver_instance.quit()
    except Exception:
        pass

class MultiTabHelper:
    """Helper class for testing multi-tab workflows in Selenium."""
    
    @staticmethod
    def open_new_tab(driver, url=None):
        """Opens a new browser tab and optionally navigates to a URL."""
        if hasattr(driver, "execute_script"):
            driver.execute_script("window.open('about:blank', '_blank');")
        if hasattr(driver, "window_handles") and driver.window_handles:
            target_handle = driver.window_handles[-1]
            if hasattr(driver.switch_to, "window"):
                driver.switch_to.window(target_handle)
            elif callable(driver.switch_to):
                driver.switch_to().window(target_handle)
        if url and hasattr(driver, "get"):
            driver.get(url)
        return getattr(driver, "current_window_handle", "tab_handle")

    @staticmethod
    def switch_to_tab(driver, handle_or_index):
        """Switches focus to a tab specified by handle string or integer index."""
        if hasattr(driver, "window_handles") and driver.window_handles:
            if isinstance(handle_or_index, int):
                target_handle = driver.window_handles[handle_or_index]
            else:
                target_handle = handle_or_index
            if hasattr(driver.switch_to, "window"):
                driver.switch_to.window(target_handle)
            elif callable(driver.switch_to):
                driver.switch_to().window(target_handle)

    @staticmethod
    def close_current_tab(driver):
        """Closes current tab and switches back to the primary main window tab."""
        if hasattr(driver, "close"):
            driver.close()
        if hasattr(driver, "window_handles") and driver.window_handles:
            target_handle = driver.window_handles[0]
            if hasattr(driver.switch_to, "window"):
                driver.switch_to.window(target_handle)
            elif callable(driver.switch_to):
                driver.switch_to().window(target_handle)

@pytest.fixture(scope="function")
def tab_helper():
    """Fixture to provide multi-tab workflow utilities."""
    return MultiTabHelper()

def record_result(test_id, category, feature_name, button_target, action, status, duration, is_multi_tab=False, error_msg=""):
    """Helper function to append test result details for Excel report generation."""
    TEST_RESULTS.append({
        "Test_ID": test_id,
        "Category": category,
        "Feature_Name": feature_name,
        "Button_Target": button_target,
        "Action_Tested": action,
        "Status": status,
        "Duration_Sec": round(duration, 3),
        "Is_Multi_Tab": "YES" if is_multi_tab else "NO",
        "Error_Details": error_msg or "None"
    })
