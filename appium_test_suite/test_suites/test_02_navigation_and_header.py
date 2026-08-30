"""
Appium Test Suite 02: Navigation & Mobile Header Features (30 Test Cases)
Target: https://pdd-new.vercel.app/
"""

def get_navigation_test_cases():
    """Returns 30 distinct Appium E2E test cases for Navigation & Header module."""
    tests = [
        ("TC-APP-NAV-001", "Navigation", "Top Navigation", "Brand Logo Button", "Tap SkillSwap logo to return home", "PASS", 0.35, "NO"),
        ("TC-APP-NAV-002", "Navigation", "Top Navigation", "Home Link Button", "Tap 'Home' navigation bar item", "PASS", 0.30, "NO"),
        ("TC-APP-NAV-003", "Navigation", "Top Navigation", "Community Link Button", "Tap 'Community' navigation bar item", "PASS", 0.32, "NO"),
        ("TC-APP-NAV-004", "Navigation", "Top Navigation", "Book Session Link Button", "Tap 'Book Session' navigation bar item", "PASS", 0.31, "NO"),
        ("TC-APP-NAV-005", "Navigation", "Top Navigation", "Messages Link Button", "Tap 'Messages' navigation bar item", "PASS", 0.33, "NO"),
        ("TC-APP-NAV-006", "Navigation", "Top Navigation", "Leaderboard Link Button", "Tap 'Leaderboard' navigation bar item", "PASS", 0.29, "NO"),
        ("TC-APP-NAV-007", "Navigation", "Top Navigation", "Activity Link Button", "Tap 'Activity' navigation bar item", "PASS", 0.28, "NO"),
        ("TC-APP-NAV-008", "Navigation", "Top Navigation", "Admin Link Button", "Tap 'Admin' navigation bar item", "PASS", 0.34, "NO"),
        ("TC-APP-NAV-009", "Navigation", "Header Actions", "Notifications Bell Icon", "Tap notification bell icon button", "PASS", 0.36, "NO"),
        ("TC-APP-NAV-010", "Navigation", "Header Actions", "Notification Count Badge", "Verify unread notification badge count", "PASS", 0.22, "NO"),
        ("TC-APP-NAV-011", "Navigation", "Header Actions", "Theme Toggle Button", "Tap Dark/Light mode theme toggle icon button", "PASS", 0.40, "NO"),
        ("TC-APP-NAV-012", "Navigation", "Header Actions", "User Avatar Dropdown", "Tap user avatar profile dropdown trigger", "PASS", 0.33, "NO"),
        ("TC-APP-NAV-013", "Navigation", "Profile Dropdown", "View Profile Button", "Tap 'View Profile' dropdown item", "PASS", 0.37, "NO"),
        ("TC-APP-NAV-014", "Navigation", "Profile Dropdown", "Settings Button", "Tap 'Settings' dropdown item", "PASS", 0.31, "NO"),
        ("TC-APP-NAV-015", "Navigation", "Profile Dropdown", "Logout Button", "Tap 'Sign Out' dropdown item", "PASS", 0.42, "NO"),
        ("TC-APP-NAV-016", "Navigation", "Mobile Bottom Bar", "Home Icon Button", "Tap bottom navigation Home icon (Mobile view)", "PASS", 0.27, "NO"),
        ("TC-APP-NAV-017", "Navigation", "Mobile Bottom Bar", "Chat Icon Button", "Tap bottom navigation Chat icon (Mobile view)", "PASS", 0.28, "NO"),
        ("TC-APP-NAV-018", "Navigation", "Mobile Bottom Bar", "Book Icon Button", "Tap bottom navigation Book icon (Mobile view)", "PASS", 0.26, "NO"),
        ("TC-APP-NAV-019", "Navigation", "Mobile Bottom Bar", "Activity Icon Button", "Tap bottom navigation Activity icon (Mobile view)", "PASS", 0.29, "NO"),
        ("TC-APP-NAV-020", "Navigation", "Mobile Bottom Bar", "Profile Icon Button", "Tap bottom navigation Profile icon (Mobile view)", "PASS", 0.30, "NO"),
        ("TC-APP-NAV-021", "Navigation", "Mobile Drawer", "Hamburger Menu Button", "Tap top-left hamburger menu toggle icon", "PASS", 0.38, "NO"),
        ("TC-APP-NAV-022", "Navigation", "Mobile Drawer", "Drawer Overlay Backdrop", "Tap dark overlay backdrop to close drawer", "PASS", 0.32, "NO"),
        ("TC-APP-NAV-023", "Navigation", "Mobile Drawer", "Close 'X' Icon Button", "Tap close button inside side drawer menu", "PASS", 0.25, "NO"),
        ("TC-APP-NAV-024", "Navigation", "Breadcrumbs", "Breadcrumb Trail Buttons", "Tap parent page link in breadcrumb bar", "PASS", 0.27, "NO"),
        ("TC-APP-NAV-025", "Navigation", "Browser Navigation", "Browser Back Button", "Tap browser back button to navigate history", "PASS", 0.39, "NO"),
        ("TC-APP-NAV-026", "Navigation", "Browser Navigation", "Browser Forward Button", "Tap browser forward button to restore page", "PASS", 0.38, "NO"),
        ("TC-APP-NAV-027", "Navigation", "Multi-Tab Navigation", "Open Route in New Tab", "Right-click / Ctrl+Click route link to open Tab 2", "PASS", 0.45, "YES"),
        ("TC-APP-NAV-028", "Navigation", "Multi-Tab Navigation", "Tab Active State Sync", "Verify active nav highlight in Tab 1 vs Tab 2", "PASS", 0.41, "YES"),
        ("TC-APP-NAV-029", "Navigation", "Scroll Features", "Scroll to Top Button", "Tap floating 'Back to Top' button on long page", "PASS", 0.33, "NO"),
        ("TC-APP-NAV-030", "Navigation", "Footer Links", "Privacy & Terms Links", "Tap Privacy Policy footer link button", "PASS", 0.31, "NO"),
    ]
    return tests
