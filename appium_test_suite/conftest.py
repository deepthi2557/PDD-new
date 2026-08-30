import time

class MockAppiumTabContext:
    """Simulates multi-tab session handling and context switching for Appium web testing."""
    def __init__(self, tab_id, name):
        self.tab_id = tab_id
        self.name = name
        self.url = "https://pdd-new.vercel.app/"
        self.session_data = {"authenticated": False, "user": None}
        self.local_storage = {}
        self.active = True

class MockAppiumDriver:
    """Appium WebDriver wrapper supporting single & multi-tab web application E2E testing."""
    def __init__(self):
        self.tabs = [MockAppiumTabContext("tab_0", "Main Window")]
        self.current_tab_index = 0
        self.base_url = "https://pdd-new.vercel.app/"
        self.is_logged_in = False
        self.current_user = None

    @property
    def current_tab(self):
        return self.tabs[self.current_tab_index]

    def open_new_tab(self, name="Secondary Tab"):
        new_id = f"tab_{len(self.tabs)}"
        new_tab = MockAppiumTabContext(new_id, name)
        # Sync session state across tabs
        new_tab.session_data = dict(self.current_tab.session_data)
        new_tab.local_storage = dict(self.current_tab.local_storage)
        self.tabs.append(new_tab)
        self.current_tab_index = len(self.tabs) - 1
        return new_id

    def switch_to_tab(self, index):
        if 0 <= index < len(self.tabs):
            self.current_tab_index = index
            return True
        return False

    def close_current_tab(self):
        if len(self.tabs) > 1:
            self.tabs.pop(self.current_tab_index)
            self.current_tab_index = max(0, self.current_tab_index - 1)
            return True
        return False

    def navigate_to(self, path):
        full_url = f"{self.base_url.rstrip('/')}/{path.lstrip('/')}"
        self.current_tab.url = full_url
        return full_url

    def login(self, email, password):
        time.sleep(0.01)
        self.is_logged_in = True
        self.current_user = email
        # Propagate session state to all open tabs
        for tab in self.tabs:
            tab.session_data["authenticated"] = True
            tab.session_data["user"] = email
            tab.local_storage["sb-auth-token"] = f"mock-token-{email}"
        return True

    def logout(self):
        self.is_logged_in = False
        self.current_user = None
        for tab in self.tabs:
            tab.session_data["authenticated"] = False
            tab.session_data["user"] = None
            tab.local_storage.clear()
        return True

def get_appium_driver():
    """Factory function returning initialized Appium Web Driver context."""
    return MockAppiumDriver()
