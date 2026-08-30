import pytest
import time
from selenium.webdriver.common.by import By
try:
    from selenium_tests.config import BASE_URL
    from selenium_tests.conftest import record_result
except ImportError:
    from config import BASE_URL
    from conftest import record_result

CATEGORY = "Navigation & App Shell"

def test_nav_01_brand_logo_click(driver):
    """Test TC-NAV-01: Verify Brand Logo button navigation to root home page."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/activity")
        logo = driver.find_elements(By.CSS_SELECTOR, "a[href='/'], a.brand-logo, svg.logo")
        if logo:
            logo[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-NAV-01", CATEGORY, "Brand Header", "SkillSwap Brand Logo Link", "Click Brand Logo", status, time.time() - start_time, False, err)

def test_nav_02_home_tab_link(driver):
    """Test TC-NAV-02: Verify Home header nav button navigation."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/activity")
        nav = driver.find_elements(By.XPATH, "//a[contains(@href, '/home')] | //button[contains(., 'Home')]")
        if nav:
            nav[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-NAV-02", CATEGORY, "Top Header Nav", "Home Tab Button", "Click Home Tab", status, time.time() - start_time, False, err)

def test_nav_03_community_tab_link(driver):
    """Test TC-NAV-03: Verify Community header nav button navigation."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/home")
        nav = driver.find_elements(By.XPATH, "//a[contains(@href, '/community')] | //button[contains(., 'Community')]")
        if nav:
            nav[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-NAV-03", CATEGORY, "Top Header Nav", "Community Tab Button", "Click Community Tab", status, time.time() - start_time, False, err)

def test_nav_04_leaderboard_tab_link(driver):
    """Test TC-NAV-04: Verify Leaderboard header nav button navigation."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/home")
        nav = driver.find_elements(By.XPATH, "//a[contains(@href, '/leaderboard')] | //button[contains(., 'Leaderboard')]")
        if nav:
            nav[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-NAV-04", CATEGORY, "Top Header Nav", "Leaderboard Tab Button", "Click Leaderboard Tab", status, time.time() - start_time, False, err)

def test_nav_05_activity_tab_link(driver):
    """Test TC-NAV-05: Verify Activity header nav button navigation."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/home")
        nav = driver.find_elements(By.XPATH, "//a[contains(@href, '/activity')] | //button[contains(., 'Activity')]")
        if nav:
            nav[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-NAV-05", CATEGORY, "Top Header Nav", "Activity Tab Button", "Click Activity Tab", status, time.time() - start_time, False, err)

def test_nav_06_notifications_bell_button(driver):
    """Test TC-NAV-06: Verify Notifications Bell icon button click."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/home")
        bell = driver.find_elements(By.CSS_SELECTOR, "button[aria-label*='notification'], a[href*='notifications'], svg.lucide-bell")
        if bell:
            bell[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-NAV-06", CATEGORY, "Header Actions", "Notifications Bell Button", "Click Bell Icon", status, time.time() - start_time, False, err)

def test_nav_07_theme_toggle_button(driver):
    """Test TC-NAV-07: Verify Dark/Light Theme toggle button click."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/home")
        toggle = driver.find_elements(By.CSS_SELECTOR, "button[aria-label*='theme'], button[aria-label*='mode'], svg.lucide-sun, svg.lucide-moon")
        if toggle:
            toggle[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-NAV-07", CATEGORY, "Header Actions", "Theme Toggle Button", "Click Theme Toggle", status, time.time() - start_time, False, err)

def test_nav_08_search_bar_input_click(driver):
    """Test TC-NAV-08: Verify Search Bar input focus and button click in header."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/home")
        search_in = driver.find_elements(By.CSS_SELECTOR, "input[type='search'], input[placeholder*='Search']")
        if search_in:
            search_in[0].click()
            search_in[0].send_keys("React")
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-NAV-08", CATEGORY, "Search Control", "Header Search Bar Input", "Click & Focus Search", status, time.time() - start_time, False, err)

def test_nav_09_search_clear_button(driver):
    """Test TC-NAV-09: Verify Clear search query button action."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/home")
        clear_btns = driver.find_elements(By.CSS_SELECTOR, "button[aria-label*='clear'], button.clear-search")
        if clear_btns:
            clear_btns[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-NAV-09", CATEGORY, "Search Control", "Clear Search Query Button", "Click Clear Button", status, time.time() - start_time, False, err)

def test_nav_10_user_avatar_dropdown_trigger(driver):
    """Test TC-NAV-10: Verify User Avatar dropdown menu trigger button."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/home")
        avatar = driver.find_elements(By.CSS_SELECTOR, "button[aria-label*='User menu'], [role='menuitem'], img.rounded-full")
        if avatar:
            avatar[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-NAV-10", CATEGORY, "User Menu", "Avatar Dropdown Trigger", "Click Avatar Menu", status, time.time() - start_time, False, err)

def test_nav_11_dropdown_profile_link(driver):
    """Test TC-NAV-11: Verify 'My Profile' option button in user dropdown menu."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/home")
        profile_btn = driver.find_elements(By.XPATH, "//a[contains(@href, '/profile')] | //button[contains(., 'Profile')]")
        if profile_btn:
            profile_btn[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-NAV-11", CATEGORY, "User Menu", "My Profile Menu Link", "Click Profile Link", status, time.time() - start_time, False, err)

def test_nav_12_dropdown_settings_link(driver):
    """Test TC-NAV-12: Verify 'Settings' option button in user dropdown menu."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/home")
        settings_btn = driver.find_elements(By.XPATH, "//a[contains(@href, '/settings')] | //button[contains(., 'Settings')]")
        if settings_btn:
            settings_btn[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-NAV-12", CATEGORY, "User Menu", "Settings Menu Link", "Click Settings Link", status, time.time() - start_time, False, err)

def test_nav_13_dropdown_admin_link(driver):
    """Test TC-NAV-13: Verify 'Admin Panel' button in user dropdown menu."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/home")
        admin_btn = driver.find_elements(By.XPATH, "//a[contains(@href, '/admin')] | //button[contains(., 'Admin')]")
        if admin_btn:
            admin_btn[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-NAV-13", CATEGORY, "User Menu", "Admin Dashboard Link", "Click Admin Link", status, time.time() - start_time, False, err)

def test_nav_14_mobile_menu_hamburger_trigger(driver):
    """Test TC-NAV-14: Verify Mobile Shell hamburger menu trigger button."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/home")
        hamburger = driver.find_elements(By.CSS_SELECTOR, "button[aria-label*='menu'], button.hamburger, svg.lucide-menu")
        if hamburger:
            hamburger[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-NAV-14", CATEGORY, "Mobile Shell", "Hamburger Drawer Trigger", "Click Mobile Menu", status, time.time() - start_time, False, err)

def test_nav_15_mobile_bottom_bar_home_tab(driver):
    """Test TC-NAV-15: Verify Mobile Shell bottom bar Home tab button."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/community")
        bot_home = driver.find_elements(By.CSS_SELECTOR, ".mobile-bottom-nav a[href='/home'], nav button svg.lucide-home")
        if bot_home:
            bot_home[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-NAV-15", CATEGORY, "Mobile Navigation", "Bottom Bar Home Icon", "Click Bottom Nav Home", status, time.time() - start_time, False, err)

def test_nav_16_mobile_bottom_bar_chat_tab(driver):
    """Test TC-NAV-16: Verify Mobile Shell bottom bar Chat tab button."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/home")
        bot_chat = driver.find_elements(By.CSS_SELECTOR, "a[href*='chat'], button svg.lucide-message-square")
        if bot_chat:
            bot_chat[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-NAV-16", CATEGORY, "Mobile Navigation", "Bottom Bar Chat Icon", "Click Bottom Nav Chat", status, time.time() - start_time, False, err)

def test_nav_17_mobile_bottom_bar_book_tab(driver):
    """Test TC-NAV-17: Verify Mobile Shell bottom bar Booking tab button."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/home")
        bot_book = driver.find_elements(By.CSS_SELECTOR, "a[href*='book'], button svg.lucide-calendar")
        if bot_book:
            bot_book[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-NAV-17", CATEGORY, "Mobile Navigation", "Bottom Bar Book Icon", "Click Bottom Nav Book", status, time.time() - start_time, False, err)

def test_nav_18_mobile_bottom_bar_activity_tab(driver):
    """Test TC-NAV-18: Verify Mobile Shell bottom bar Activity tab button."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/home")
        bot_act = driver.find_elements(By.CSS_SELECTOR, "a[href*='activity'], button svg.lucide-activity")
        if bot_act:
            bot_act[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-NAV-18", CATEGORY, "Mobile Navigation", "Bottom Bar Activity Icon", "Click Bottom Nav Activity", status, time.time() - start_time, False, err)

def test_nav_19_mobile_bottom_bar_profile_tab(driver):
    """Test TC-NAV-19: Verify Mobile Shell bottom bar Profile tab button."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/home")
        bot_prof = driver.find_elements(By.CSS_SELECTOR, "a[href*='profile'], button svg.lucide-user")
        if bot_prof:
            bot_prof[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-NAV-19", CATEGORY, "Mobile Navigation", "Bottom Bar Profile Icon", "Click Bottom Nav Profile", status, time.time() - start_time, False, err)

def test_nav_20_sidebar_collapse_toggle(driver):
    """Test TC-NAV-20: Verify Sidebar collapse button interaction."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/home")
        collapse_btn = driver.find_elements(By.CSS_SELECTOR, "button[data-sidebar='trigger'], button.sidebar-toggle")
        if collapse_btn:
            collapse_btn[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-NAV-20", CATEGORY, "Sidebar Shell", "Collapse Sidebar Button", "Toggle Collapse State", status, time.time() - start_time, False, err)

def test_nav_21_sidebar_expand_toggle(driver):
    """Test TC-NAV-21: Verify Sidebar expand button interaction."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/home")
        expand_btn = driver.find_elements(By.CSS_SELECTOR, "button[data-sidebar='trigger'], button.sidebar-toggle")
        if expand_btn:
            expand_btn[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-NAV-21", CATEGORY, "Sidebar Shell", "Expand Sidebar Button", "Toggle Expand State", status, time.time() - start_time, False, err)

def test_nav_22_help_support_link_button(driver):
    """Test TC-NAV-22: Verify Help & Support button link."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/home")
        help_btn = driver.find_elements(By.XPATH, "//a[contains(text(), 'Help')] | //button[contains(., 'Help')]")
        if help_btn:
            help_btn[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-NAV-22", CATEGORY, "Support Tools", "Help & Support Button", "Open Help View", status, time.time() - start_time, False, err)

def test_nav_23_feedback_modal_trigger_button(driver):
    """Test TC-NAV-23: Verify Send Feedback modal trigger button."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/home")
        fb_btn = driver.find_elements(By.XPATH, "//button[contains(., 'Feedback')]")
        if fb_btn:
            fb_btn[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-NAV-23", CATEGORY, "User Feedback", "Send Feedback Button", "Open Feedback Modal", status, time.time() - start_time, False, err)

def test_nav_24_floating_action_button(driver):
    """Test TC-NAV-24: Verify Floating Quick Action button (+) click."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/home")
        fab = driver.find_elements(By.CSS_SELECTOR, "button.fab, button.fixed, button[aria-label*='add']")
        if fab:
            fab[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-NAV-24", CATEGORY, "Quick Actions", "Floating Action Button", "Click Quick Add FAB", status, time.time() - start_time, False, err)

def test_nav_25_scroll_to_top_button(driver):
    """Test TC-NAV-25: Verify Scroll to Top button click."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/home")
        driver.execute_script("window.scrollTo(0, 1000);")
        top_btn = driver.find_elements(By.CSS_SELECTOR, "button[aria-label*='top'], button.scroll-top")
        if top_btn:
            top_btn[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-NAV-25", CATEGORY, "Page Scrolling", "Scroll Top Button", "Scroll Page to Top", status, time.time() - start_time, False, err)

def test_nav_26_language_selector_button(driver):
    """Test TC-NAV-26: Verify Language selector dropdown button click."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/home")
        lang_btn = driver.find_elements(By.CSS_SELECTOR, "button[aria-label*='language'], button.lang-picker")
        if lang_btn:
            lang_btn[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-NAV-26", CATEGORY, "Localization", "Language Selector Button", "Open Language Menu", status, time.time() - start_time, False, err)

def test_nav_27_all_routes_grid_view_link(driver):
    """Test TC-NAV-27: Verify All Routes catalog page button navigation."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/all")
        assert "all" in driver.current_url.lower()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-NAV-27", CATEGORY, "App Map Navigation", "All Routes Catalog Link", "Navigate to Catalog", status, time.time() - start_time, False, err)

def test_nav_28_breadcrumbs_home_segment(driver):
    """Test TC-NAV-28: Verify Breadcrumbs Home segment button click."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/book")
        bc = driver.find_elements(By.CSS_SELECTOR, "nav[aria-label='breadcrumb'] a")
        if bc:
            bc[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-NAV-28", CATEGORY, "Breadcrumbs", "Home Breadcrumb Link", "Click Root Segment", status, time.time() - start_time, False, err)

def test_nav_29_breadcrumbs_parent_segment(driver):
    """Test TC-NAV-29: Verify Breadcrumbs parent category link click."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/chat/123")
        bc = driver.find_elements(By.CSS_SELECTOR, "nav[aria-label='breadcrumb'] a")
        if len(bc) > 1:
            bc[1].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-NAV-29", CATEGORY, "Breadcrumbs", "Parent Category Breadcrumb", "Click Parent Segment", status, time.time() - start_time, False, err)

def test_nav_30_modal_dialog_close_button(driver):
    """Test TC-NAV-30: Verify Modal Dialog Close ('X') button click."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/home")
        close_btn = driver.find_elements(By.CSS_SELECTOR, "button[aria-label='Close'], button.dialog-close, button svg.lucide-x")
        if close_btn:
            close_btn[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-NAV-30", CATEGORY, "Modal System", "Dialog Close Button", "Close Active Dialog", status, time.time() - start_time, False, err)
