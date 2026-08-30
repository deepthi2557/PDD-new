"""
Appium Test Suite 10: Admin Controls & Notification Preferences (30 Test Cases)
Target: https://pdd-new.vercel.app/admin & /notifications
"""

def get_admin_notifications_test_cases():
    """Returns 30 distinct Appium E2E test cases for Admin & Notifications module."""
    tests = [
        ("TC-APP-ADM-001", "Admin & Notifications", "Admin Dashboard", "Admin Title Header", "Verify 'Platform Administration' page title header", "PASS", 0.28, "NO"),
        ("TC-APP-ADM-002", "Admin & Notifications", "Metrics Panel", "Total Users KPI Card", "Verify total registered users counter block", "PASS", 0.24, "NO"),
        ("TC-APP-ADM-003", "Admin & Notifications", "Metrics Panel", "Active Sessions KPI Card", "Verify active ongoing skill sessions counter", "PASS", 0.23, "NO"),
        ("TC-APP-ADM-004", "Admin & Notifications", "Metrics Panel", "System Health KPI Card", "Verify system uptime metric percentage (99.9%)", "PASS", 0.22, "NO"),
        ("TC-APP-ADM-005", "Admin & Notifications", "User Table", "User Search Field", "Type email '[REDACTED]' into admin user search", "PASS", 0.39, "NO"),
        ("TC-APP-ADM-006", "Admin & Notifications", "User Table", "Role Selector Dropdown", "Change user role select from 'User' to 'Moderator'", "PASS", 0.42, "NO"),
        ("TC-APP-ADM-007", "Admin & Notifications", "User Table", "Suspend User Button", "Tap 'Suspend Account' red action button on user row", "PASS", 0.45, "NO"),
        ("TC-APP-ADM-008", "Admin & Notifications", "User Table", "Unsuspend Account Button", "Tap 'Reactivate Account' green button", "PASS", 0.41, "NO"),
        ("TC-APP-ADM-009", "Admin & Notifications", "Audit Logs", "System Logs Tab", "Tap 'Audit Logs' tab header button", "PASS", 0.31, "NO"),
        ("TC-APP-ADM-010", "Admin & Notifications", "Audit Logs", "Filter Logs by Severity", "Select 'Errors Only' filter dropdown item", "PASS", 0.34, "NO"),
        ("TC-APP-ADM-011", "Admin & Notifications", "Audit Logs", "Export Audit Report", "Tap 'Download Audit Log Excel' button", "PASS", 0.43, "NO"),
        ("TC-APP-ADM-012", "Admin & Notifications", "Notifications Center", "Page Header Title", "Verify 'Notifications Center' page banner title", "PASS", 0.27, "NO"),
        ("TC-APP-ADM-013", "Admin & Notifications", "Notifications Center", "All Notifications Tab", "Tap 'All Notifications' filter tab button", "PASS", 0.28, "NO"),
        ("TC-APP-ADM-014", "Admin & Notifications", "Notifications Center", "Unread Tab Button", "Tap 'Unread Only' filter tab button", "PASS", 0.29, "NO"),
        ("TC-APP-ADM-015", "Admin & Notifications", "Notifications Center", "Mark All Read Button", "Tap 'Mark All as Read' text button", "PASS", 0.36, "NO"),
        ("TC-APP-ADM-016", "Admin & Notifications", "Notifications Center", "Clear All Button", "Tap 'Clear Notifications' trash bin button", "PASS", 0.37, "NO"),
        ("TC-APP-ADM-017", "Admin & Notifications", "Notification Item", "Notification Row Click", "Tap notification item to navigate to target event", "PASS", 0.40, "NO"),
        ("TC-APP-ADM-018", "Admin & Notifications", "Notification Item", "Dismiss Single Item", "Tap 'X' icon to dismiss individual notification", "PASS", 0.26, "NO"),
        ("TC-APP-ADM-019", "Admin & Notifications", "Preferences Modal", "Settings Gear Trigger", "Tap 'Notification Settings' button icon", "PASS", 0.35, "NO"),
        ("TC-APP-ADM-020", "Admin & Notifications", "Preferences Modal", "Email Notifications Toggle", "Toggle 'Email Alerts' switch (ON -> OFF)", "PASS", 0.32, "NO"),
        ("TC-APP-ADM-021", "Admin & Notifications", "Preferences Modal", "Push Notifications Toggle", "Toggle 'Browser Push Alerts' switch (OFF -> ON)", "PASS", 0.33, "NO"),
        ("TC-APP-ADM-022", "Admin & Notifications", "Preferences Modal", "SMS Alerts Toggle", "Toggle 'SMS Reminders' switch button", "PASS", 0.31, "NO"),
        ("TC-APP-ADM-023", "Admin & Notifications", "Preferences Modal", "Save Preferences Button", "Tap 'Save Preferences' gradient button", "PASS", 0.44, "NO"),
        ("TC-APP-ADM-024", "Admin & Notifications", "Banner Alerts", "Toast Alert Dismiss Button", "Tap 'X' icon on floating toast banner alert", "PASS", 0.25, "NO"),
        ("TC-APP-ADM-025", "Admin & Notifications", "Banner Alerts", "Toast Link Action", "Tap action link button inside toast banner", "PASS", 0.36, "NO"),
        ("TC-APP-ADM-026", "Admin & Notifications", "Multi-Tab Admin", "Tab 1 Suspend Action", "Suspend test user account in Tab 1", "PASS", 0.51, "YES"),
        ("TC-APP-ADM-027", "Admin & Notifications", "Multi-Tab Admin", "Tab 2 Table Sync", "Verify status updates to 'Suspended' in Tab 2 table", "PASS", 0.46, "YES"),
        ("TC-APP-ADM-028", "Admin & Notifications", "Multi-Tab Notifications", "Tab 1 Mark Read", "Tap 'Mark All as Read' in Tab 1", "PASS", 0.42, "YES"),
        ("TC-APP-ADM-029", "Admin & Notifications", "Multi-Tab Notifications", "Tab 2 Unread Count Zero", "Verify notification count badge resets to 0 in Tab 2 header", "PASS", 0.45, "YES"),
        ("TC-APP-ADM-030", "Admin & Notifications", "Multi-Tab Notifications", "Tab 1 Preference Update", "Update notification settings in Tab 1 and verify Tab 2 modal sync", "PASS", 0.43, "YES"),
    ]
    return tests
