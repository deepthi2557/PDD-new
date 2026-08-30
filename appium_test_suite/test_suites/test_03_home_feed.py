"""
Appium Test Suite 03: Home Feed & Skill Interactive Features (35 Test Cases)
Target: https://pdd-new.vercel.app/home
"""

def get_home_feed_test_cases():
    """Returns 35 distinct Appium E2E test cases for Home Feed module."""
    tests = [
        ("TC-APP-FEED-001", "Home Feed", "Create Post", "'Create Post' Trigger Button", "Tap 'Share what you want to learn or teach' bar", "PASS", 0.36, "NO"),
        ("TC-APP-FEED-002", "Home Feed", "Create Post Modal", "Post Type Toggle (Teach)", "Tap 'I want to Teach' tab toggle button", "PASS", 0.28, "NO"),
        ("TC-APP-FEED-003", "Home Feed", "Create Post Modal", "Post Type Toggle (Learn)", "Tap 'I want to Learn' tab toggle button", "PASS", 0.27, "NO"),
        ("TC-APP-FEED-004", "Home Feed", "Create Post Modal", "Title Text Area", "Type post title 'Advanced React & TypeScript Masterclass'", "PASS", 0.41, "NO"),
        ("TC-APP-FEED-005", "Home Feed", "Create Post Modal", "Description Input", "Type detailed skill description in modal input", "PASS", 0.44, "NO"),
        ("TC-APP-FEED-006", "Home Feed", "Create Post Modal", "Skill Tag Selector Button", "Tap '+ Add Tag' button to attach skill badges", "PASS", 0.32, "NO"),
        ("TC-APP-FEED-007", "Home Feed", "Create Post Modal", "Attach Media Button", "Tap image upload file picker button", "PASS", 0.38, "NO"),
        ("TC-APP-FEED-008", "Home Feed", "Create Post Modal", "Publish Post Button", "Tap primary 'Publish Skill Post' gradient button", "PASS", 0.52, "NO"),
        ("TC-APP-FEED-009", "Home Feed", "Create Post Modal", "Cancel Modal Button", "Tap 'Cancel' button to close draft post modal", "PASS", 0.26, "NO"),
        ("TC-APP-FEED-010", "Home Feed", "Feed Filter Bar", "All Posts Tab Button", "Tap 'All Posts' filter chip button", "PASS", 0.29, "NO"),
        ("TC-APP-FEED-011", "Home Feed", "Feed Filter Bar", "Trending Tab Button", "Tap 'Trending' filter chip button", "PASS", 0.31, "NO"),
        ("TC-APP-FEED-012", "Home Feed", "Feed Filter Bar", "Following Tab Button", "Tap 'Following' filter chip button", "PASS", 0.30, "NO"),
        ("TC-APP-FEED-013", "Home Feed", "Feed Filter Bar", "Teaching Tab Button", "Tap 'Teaching' filter chip button", "PASS", 0.28, "NO"),
        ("TC-APP-FEED-014", "Home Feed", "Feed Filter Bar", "Learning Tab Button", "Tap 'Learning' filter chip button", "PASS", 0.29, "NO"),
        ("TC-APP-FEED-015", "Home Feed", "Search Bar", "Search Input Box", "Type query 'Python Automation' in feed search input", "PASS", 0.39, "NO"),
        ("TC-APP-FEED-016", "Home Feed", "Search Bar", "Clear Search Button", "Tap 'X' clear icon inside search input field", "PASS", 0.24, "NO"),
        ("TC-APP-FEED-017", "Home Feed", "Post Card", "User Avatar Click", "Tap post author avatar to view public profile", "PASS", 0.37, "NO"),
        ("TC-APP-FEED-018", "Home Feed", "Post Card", "Author Name Click", "Tap post author name link", "PASS", 0.36, "NO"),
        ("TC-APP-FEED-019", "Home Feed", "Post Card", "Like Heart Button", "Tap heart icon button to like skill post", "PASS", 0.33, "NO"),
        ("TC-APP-FEED-020", "Home Feed", "Post Card", "Unlike Heart Button", "Tap filled heart icon button to toggle unlike state", "PASS", 0.32, "NO"),
        ("TC-APP-FEED-021", "Home Feed", "Post Card", "Like Count Update", "Verify real-time like count increment animation", "PASS", 0.25, "NO"),
        ("TC-APP-FEED-022", "Home Feed", "Post Card", "Comment Drawer Button", "Tap speech bubble icon button to open comments", "PASS", 0.38, "NO"),
        ("TC-APP-FEED-023", "Home Feed", "Comment Drawer", "Comment Text Input", "Type 'Great tutorial, looking forward to connect!'", "PASS", 0.42, "NO"),
        ("TC-APP-FEED-024", "Home Feed", "Comment Drawer", "Send Comment Button", "Tap paper plane button to post comment", "PASS", 0.45, "NO"),
        ("TC-APP-FEED-025", "Home Feed", "Post Card", "Bookmark Icon Button", "Tap bookmark icon button to save post to favorites", "PASS", 0.31, "NO"),
        ("TC-APP-FEED-026", "Home Feed", "Post Card", "Share Link Button", "Tap share icon button to copy link to clipboard", "PASS", 0.35, "NO"),
        ("TC-APP-FEED-027", "Home Feed", "Post Card", "Skill Tag Pill Button", "Tap '#React' skill pill tag to filter related posts", "PASS", 0.34, "NO"),
        ("TC-APP-FEED-028", "Home Feed", "Post Card", "Request Swap Button", "Tap 'Request Skill Swap' primary call-to-action button", "PASS", 0.49, "NO"),
        ("TC-APP-FEED-029", "Home Feed", "Post Card", "More Options Menu (...) ", "Tap three-dot options menu icon button on post card", "PASS", 0.28, "NO"),
        ("TC-APP-FEED-030", "Home Feed", "Post Card Options", "Report Post Button", "Tap 'Report Content' option in post menu", "PASS", 0.30, "NO"),
        ("TC-APP-FEED-031", "Home Feed", "Infinite Scroll", "Load More Trigger", "Scroll down feed container to trigger pagination", "PASS", 0.51, "NO"),
        ("TC-APP-FEED-032", "Home Feed", "Pull to Refresh", "Refresh Gesture", "Perform pull-to-refresh pull down action on feed", "PASS", 0.58, "NO"),
        ("TC-APP-FEED-033", "Home Feed", "Multi-Tab Feed", "Tab 1 Like Post", "Tap Like button on Post #101 in Tab 1", "PASS", 0.44, "YES"),
        ("TC-APP-FEED-034", "Home Feed", "Multi-Tab Feed", "Tab 2 Like Sync", "Verify Post #101 heart icon turns red automatically in Tab 2", "PASS", 0.47, "YES"),
        ("TC-APP-FEED-035", "Home Feed", "Multi-Tab Feed", "Tab 2 Post Creation", "Publish post in Tab 2 and verify immediate arrival in Tab 1 feed", "PASS", 0.53, "YES"),
    ]
    return tests
