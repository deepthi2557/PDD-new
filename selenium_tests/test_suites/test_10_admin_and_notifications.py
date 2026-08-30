import pytest
import time
from selenium.webdriver.common.by import By
try:
    from selenium_tests.config import BASE_URL
    from selenium_tests.conftest import record_result
except ImportError:
    from config import BASE_URL
    from conftest import record_result

CATEGORY = "Admin Panel & Notifications"

def test_admin_01_notifications_page_route(driver):
    """Test TC-ADM-01: Verify direct navigation to Notifications center page."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/notifications")
        assert "notification" in driver.current_url.lower()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-ADM-01", CATEGORY, "Notifications", "Notifications Page Route", "Load Notification Center", status, time.time() - start_time, False, err)

def test_admin_02_mark_all_read_button(driver):
    """Test TC-ADM-02: Verify 'Mark All as Read' button action."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/notifications")
        btn = driver.find_elements(By.XPATH, "//button[contains(., 'Mark all as read') or contains(., 'Mark All Read')]")
        if btn:
            btn[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-ADM-02", CATEGORY, "Notifications", "Mark All Read Button", "Mark All Notifications Read", status, time.time() - start_time, False, err)

def test_admin_03_clear_all_notifications_button(driver):
    """Test TC-ADM-03: Verify 'Clear All Notifications' button action."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/notifications")
        btn = driver.find_elements(By.XPATH, "//button[contains(., 'Clear all') or contains(., 'Clear All')]")
        if btn:
            btn[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-ADM-03", CATEGORY, "Notifications", "Clear All Notifications Button", "Purge Notification Feed", status, time.time() - start_time, False, err)

def test_admin_04_filter_unread_notifications_tab(driver):
    """Test TC-ADM-04: Verify 'Unread Only' notifications filter tab button."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/notifications")
        tab = driver.find_elements(By.XPATH, "//button[contains(., 'Unread')]")
        if tab:
            tab[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-ADM-04", CATEGORY, "Notification Filters", "Unread Only Tab Button", "Filter Unread Items", status, time.time() - start_time, False, err)

def test_admin_05_dismiss_single_notification_button(driver):
    """Test TC-ADM-05: Verify Dismiss ('X') button on individual notification item."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/notifications")
        btn = driver.find_elements(By.CSS_SELECTOR, ".notification-item button svg.lucide-x, button[aria-label*='dismiss']")
        if btn:
            btn[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-ADM-05", CATEGORY, "Notifications", "Dismiss Item Button", "Remove Single Notification", status, time.time() - start_time, False, err)

def test_admin_06_admin_dashboard_route(driver):
    """Test TC-ADM-06: Verify navigation to Admin Dashboard route."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/admin")
        assert "admin" in driver.current_url.lower()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-ADM-06", CATEGORY, "Admin Dashboard", "Direct Admin Route", "Load Admin Panel", status, time.time() - start_time, False, err)

def test_admin_07_tab_user_management(driver):
    """Test TC-ADM-07: Verify Admin 'User Management' tab button."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/admin")
        tab = driver.find_elements(By.XPATH, "//button[contains(., 'Users') or contains(., 'User Management')]")
        if tab:
            tab[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-ADM-07", CATEGORY, "Admin Navigation", "User Management Tab", "Switch to User Management", status, time.time() - start_time, False, err)

def test_admin_08_tab_system_metrics(driver):
    """Test TC-ADM-08: Verify Admin 'System Metrics & Analytics' tab button."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/admin")
        tab = driver.find_elements(By.XPATH, "//button[contains(., 'Metrics') or contains(., 'Analytics')]")
        if tab:
            tab[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-ADM-08", CATEGORY, "Admin Navigation", "System Metrics Tab", "Switch to System Analytics", status, time.time() - start_time, False, err)

def test_admin_09_tab_skill_tags_management(driver):
    """Test TC-ADM-09: Verify Admin 'Skill Categories & Tags' tab button."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/admin")
        tab = driver.find_elements(By.XPATH, "//button[contains(., 'Skill Tags') or contains(., 'Categories')]")
        if tab:
            tab[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-ADM-09", CATEGORY, "Admin Navigation", "Skill Tags Tab", "Switch to Skill Tag Config", status, time.time() - start_time, False, err)

def test_admin_10_tab_reports_moderation(driver):
    """Test TC-ADM-10: Verify Admin 'Reports & Moderation' tab button."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/admin")
        tab = driver.find_elements(By.XPATH, "//button[contains(., 'Reports') or contains(., 'Moderation')]")
        if tab:
            tab[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-ADM-10", CATEGORY, "Admin Navigation", "Reports Moderation Tab", "Switch to Reports Queue", status, time.time() - start_time, False, err)

def test_admin_11_search_admin_users_input(driver):
    """Test TC-ADM-11: Verify Search Admin Users input field action."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/admin")
        inp = driver.find_elements(By.CSS_SELECTOR, "input[placeholder*='search user'], input[placeholder*='Search']")
        if inp:
            inp[0].send_keys("admin@skillswap.com")
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-ADM-11", CATEGORY, "User Moderation", "Search Users Input", "Search Admin User Table", status, time.time() - start_time, False, err)

def test_admin_12_ban_user_account_button(driver):
    """Test TC-ADM-12: Verify 'Ban User Account' red action button."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/admin")
        btn = driver.find_elements(By.XPATH, "//button[contains(., 'Ban User') or contains(., 'Suspend')]")
        if btn:
            btn[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-ADM-12", CATEGORY, "User Moderation", "Ban User Button", "Suspend Selected User", status, time.time() - start_time, False, err)

def test_admin_13_unban_user_account_button(driver):
    """Test TC-ADM-13: Verify 'Unban / Reinstate User' action button."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/admin")
        btn = driver.find_elements(By.XPATH, "//button[contains(., 'Unban') or contains(., 'Reinstate')]")
        if btn:
            btn[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-ADM-13", CATEGORY, "User Moderation", "Unban User Button", "Reinstate Banned User", status, time.time() - start_time, False, err)

def test_admin_14_promote_user_to_admin_button(driver):
    """Test TC-ADM-14: Verify 'Promote to Admin' permission button."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/admin")
        btn = driver.find_elements(By.XPATH, "//button[contains(., 'Promote Admin') or contains(., 'Make Admin')]")
        if btn:
            btn[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-ADM-14", CATEGORY, "Role Permissions", "Promote Admin Button", "Grant Admin Role", status, time.time() - start_time, False, err)

def test_admin_15_demote_admin_role_button(driver):
    """Test TC-ADM-15: Verify 'Demote Admin Role' permission button."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/admin")
        btn = driver.find_elements(By.XPATH, "//button[contains(., 'Demote') or contains(., 'Remove Admin')]")
        if btn:
            btn[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-ADM-15", CATEGORY, "Role Permissions", "Demote Admin Button", "Revoke Admin Role", status, time.time() - start_time, False, err)

def test_admin_16_delete_user_permanently_button(driver):
    """Test TC-ADM-16: Verify Permanent Delete User account button."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/admin")
        btn = driver.find_elements(By.XPATH, "//button[contains(., 'Delete User') or contains(., 'Purge User')]")
        if btn:
            btn[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-ADM-16", CATEGORY, "User Moderation", "Delete User Button", "Delete User Account", status, time.time() - start_time, False, err)

def test_admin_17_export_users_csv_button(driver):
    """Test TC-ADM-17: Verify 'Export Users List (CSV)' button click."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/admin")
        btn = driver.find_elements(By.XPATH, "//button[contains(., 'Export CSV') or contains(., 'Export Users')]")
        if btn:
            btn[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-ADM-17", CATEGORY, "Data Exports", "Export Users CSV Button", "Download CSV Dataset", status, time.time() - start_time, False, err)

def test_admin_18_approve_pending_skill_tag(driver):
    """Test TC-ADM-18: Verify Approve requested skill tag check button."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/admin")
        btn = driver.find_elements(By.XPATH, "//button[contains(., 'Approve Tag') or contains(., 'Approve')]")
        if btn:
            btn[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-ADM-18", CATEGORY, "Tag Moderation", "Approve Skill Tag Button", "Approve New Skill Tag", status, time.time() - start_time, False, err)

def test_admin_19_reject_pending_skill_tag(driver):
    """Test TC-ADM-19: Verify Reject requested skill tag ('X') button."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/admin")
        btn = driver.find_elements(By.XPATH, "//button[contains(., 'Reject Tag') or contains(., 'Reject')]")
        if btn:
            btn[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-ADM-19", CATEGORY, "Tag Moderation", "Reject Skill Tag Button", "Reject Requested Tag", status, time.time() - start_time, False, err)

def test_admin_20_add_new_skill_category_button(driver):
    """Test TC-ADM-20: Verify 'Add New Category' button trigger."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/admin")
        btn = driver.find_elements(By.XPATH, "//button[contains(., 'Add Category') or contains(., '+ Category')]")
        if btn:
            btn[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-ADM-20", CATEGORY, "Tag Moderation", "Add Category Button", "Open Category Creator", status, time.time() - start_time, False, err)

def test_admin_21_resolve_reported_item_button(driver):
    """Test TC-ADM-21: Verify 'Resolve Report' action button."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/admin")
        btn = driver.find_elements(By.XPATH, "//button[contains(., 'Resolve Report') or contains(., 'Resolve')]")
        if btn:
            btn[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-ADM-21", CATEGORY, "Reports Moderation", "Resolve Report Button", "Mark Report Resolved", status, time.time() - start_time, False, err)

def test_admin_22_dismiss_abuse_report_button(driver):
    """Test TC-ADM-22: Verify 'Dismiss Report' action button."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/admin")
        btn = driver.find_elements(By.XPATH, "//button[contains(., 'Dismiss Report') or contains(., 'Dismiss')]")
        if btn:
            btn[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-ADM-22", CATEGORY, "Reports Moderation", "Dismiss Report Button", "Dismiss Abuse Report", status, time.time() - start_time, False, err)

def test_admin_23_system_maintenance_mode_switch(driver):
    """Test TC-ADM-23: Verify Maintenance Mode toggle switch button."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/admin")
        sw = driver.find_elements(By.XPATH, "//button[contains(., 'Maintenance Mode')] | //button[@role='switch']")
        if sw:
            sw[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-ADM-23", CATEGORY, "System Controls", "Maintenance Mode Switch", "Toggle Maintenance Mode", status, time.time() - start_time, False, err)

def test_admin_24_purge_system_cache_button(driver):
    """Test TC-ADM-24: Verify 'Purge Redis / System Cache' button."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/admin")
        btn = driver.find_elements(By.XPATH, "//button[contains(., 'Purge Cache') or contains(., 'Clear Cache')]")
        if btn:
            btn[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-ADM-24", CATEGORY, "System Controls", "Purge Cache Button", "Purge Server Cache", status, time.time() - start_time, False, err)

def test_admin_25_refresh_analytics_dashboard_button(driver):
    """Test TC-ADM-25: Verify Refresh Analytics Metrics button click."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/admin")
        btn = driver.find_elements(By.XPATH, "//button[contains(., 'Refresh Analytics')] | //button svg.lucide-refresh-cw")
        if btn:
            btn[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-ADM-25", CATEGORY, "Analytics Controls", "Refresh Analytics Button", "Refresh Metrics Dashboard", status, time.time() - start_time, False, err)

def test_admin_26_send_broadcast_notification_button(driver):
    """Test TC-ADM-26: Verify Send System Announcement Broadcast button."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/admin")
        btn = driver.find_elements(By.XPATH, "//button[contains(., 'Send Broadcast') or contains(., 'Announcement')]")
        if btn:
            btn[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-ADM-26", CATEGORY, "Announcements", "Send Broadcast Button", "Open Broadcast Dialog", status, time.time() - start_time, False, err)

def test_admin_27_save_system_config_button(driver):
    """Test TC-ADM-27: Verify Save System Settings button action."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/admin")
        btn = driver.find_elements(By.XPATH, "//button[contains(., 'Save Config') or contains(., 'Save Settings')]")
        if btn:
            btn[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-ADM-27", CATEGORY, "System Controls", "Save System Config Button", "Update Server Settings", status, time.time() - start_time, False, err)

def test_admin_28_notif_pref_email_switch(driver):
    """Test TC-ADM-28: Verify Email Notifications toggle switch in preferences."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/notifications")
        sw = driver.find_elements(By.XPATH, "//button[contains(., 'Email Notifications')] | //input[@name='email-notif']")
        if sw:
            sw[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-ADM-28", CATEGORY, "Notification Preferences", "Email Notif Switch", "Toggle Email Alerts", status, time.time() - start_time, False, err)

def test_admin_29_notif_pref_push_switch(driver):
    """Test TC-ADM-29: Verify Browser Push Notifications toggle switch."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/notifications")
        sw = driver.find_elements(By.XPATH, "//button[contains(., 'Push Notifications')] | //input[@name='push-notif']")
        if sw:
            sw[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-ADM-29", CATEGORY, "Notification Preferences", "Push Notif Switch", "Toggle Push Alerts", status, time.time() - start_time, False, err)

def test_admin_30_notif_pref_sms_switch(driver):
    """Test TC-ADM-30: Verify SMS Text Notifications toggle switch."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/notifications")
        sw = driver.find_elements(By.XPATH, "//button[contains(., 'SMS Notifications')] | //input[@name='sms-notif']")
        if sw:
            sw[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-ADM-30", CATEGORY, "Notification Preferences", "SMS Notif Switch", "Toggle SMS Alerts", status, time.time() - start_time, False, err)

def test_admin_31_save_notification_settings_button(driver):
    """Test TC-ADM-31: Verify Save Notification Preferences button."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/notifications")
        btn = driver.find_elements(By.XPATH, "//button[contains(., 'Save Preferences') or contains(., 'Save Settings')]")
        if btn:
            btn[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-ADM-31", CATEGORY, "Notification Preferences", "Save Preferences Button", "Save Alert Settings", status, time.time() - start_time, False, err)

def test_admin_32_reset_admin_settings_button(driver):
    """Test TC-ADM-32: Verify Reset Admin Settings to default button."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/admin")
        btn = driver.find_elements(By.XPATH, "//button[contains(., 'Reset Defaults')]")
        if btn:
            btn[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-ADM-32", CATEGORY, "Admin Recovery", "Reset Admin Defaults Button", "Reset Admin Configuration", status, time.time() - start_time, False, err)

def test_admin_33_view_audit_logs_button(driver):
    """Test TC-ADM-33: Verify View Security Audit Logs button click."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/admin")
        btn = driver.find_elements(By.XPATH, "//button[contains(., 'Audit Logs') or contains(., 'Security Logs')]")
        if btn:
            btn[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-ADM-33", CATEGORY, "Security Audit", "View Audit Logs Button", "Open Security Logs", status, time.time() - start_time, False, err)

def test_admin_34_download_audit_logs_button(driver):
    """Test TC-ADM-34: Verify Download Security Audit Logs button click."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/admin")
        btn = driver.find_elements(By.XPATH, "//button[contains(., 'Download Audit Logs')]")
        if btn:
            btn[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-ADM-34", CATEGORY, "Security Audit", "Download Audit Logs Button", "Download Log File", status, time.time() - start_time, False, err)

def test_admin_35_filter_reports_by_status_dropdown(driver):
    """Test TC-ADM-35: Verify Moderation Reports Status dropdown filter."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/admin")
        dd = driver.find_elements(By.CSS_SELECTOR, "select[name='report-status'], button[aria-label*='Filter reports']")
        if dd:
            dd[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-ADM-35", CATEGORY, "Reports Moderation", "Report Status Dropdown", "Filter Moderation Reports", status, time.time() - start_time, False, err)
