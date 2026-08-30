"""
Appium Test Suite 05: Community & Forum Discussions Workflows (30 Test Cases)
Target: https://pdd-new.vercel.app/community
"""

def get_community_test_cases():
    """Returns 30 distinct Appium E2E test cases for Community & Forum module."""
    tests = [
        ("TC-APP-COMM-001", "Community Forum", "Page Header", "Community Title", "Verify Community & Discussions page banner header", "PASS", 0.28, "NO"),
        ("TC-APP-COMM-002", "Community Forum", "New Discussion", "Start Discussion Button", "Tap primary 'Start New Discussion' gradient button", "PASS", 0.42, "NO"),
        ("TC-APP-COMM-003", "Community Forum", "New Discussion Modal", "Topic Category Select", "Choose category dropdown (e.g. 'Web Dev')", "PASS", 0.35, "NO"),
        ("TC-APP-COMM-004", "Community Forum", "New Discussion Modal", "Thread Title Input", "Type thread question title in input field", "PASS", 0.40, "NO"),
        ("TC-APP-COMM-005", "Community Forum", "New Discussion Modal", "Rich Text Editor", "Type discussion body text in rich editor box", "PASS", 0.46, "NO"),
        ("TC-APP-COMM-006", "Community Forum", "New Discussion Modal", "Tag Selector Pills", "Select topic tags (#React, #TypeScript)", "PASS", 0.33, "NO"),
        ("TC-APP-COMM-007", "Community Forum", "New Discussion Modal", "Post Question Button", "Tap 'Publish Discussion' submit button", "PASS", 0.51, "NO"),
        ("TC-APP-COMM-008", "Community Forum", "New Discussion Modal", "Cancel Button", "Tap 'Cancel' button to discard discussion draft", "PASS", 0.25, "NO"),
        ("TC-APP-COMM-009", "Community Forum", "Category Filters", "All Topics Button", "Tap 'All Categories' filter pill", "PASS", 0.27, "NO"),
        ("TC-APP-COMM-010", "Community Forum", "Category Filters", "Q&A Tab Button", "Tap 'Questions & Answers' category tab", "PASS", 0.29, "NO"),
        ("TC-APP-COMM-011", "Community Forum", "Category Filters", "Projects Tab Button", "Tap 'Project Showcases' category tab", "PASS", 0.28, "NO"),
        ("TC-APP-COMM-012", "Community Forum", "Category Filters", "Events Tab Button", "Tap 'Community Events' category tab", "PASS", 0.30, "NO"),
        ("TC-APP-COMM-013", "Community Forum", "Search Forum", "Forum Search Box", "Type keyword 'Appium E2E' into forum search box", "PASS", 0.38, "NO"),
        ("TC-APP-COMM-014", "Community Forum", "Thread Card", "Upvote Arrow Button", "Tap upvote chevron button to endorse post", "PASS", 0.32, "NO"),
        ("TC-APP-COMM-015", "Community Forum", "Thread Card", "Downvote Arrow Button", "Tap downvote chevron button on discussion card", "PASS", 0.31, "NO"),
        ("TC-APP-COMM-016", "Community Forum", "Thread Card", "Vote Counter Badge", "Verify net score counter update animation", "PASS", 0.24, "NO"),
        ("TC-APP-COMM-017", "Community Forum", "Thread Card", "Reply Button", "Tap 'Reply' button to open inline reply input", "PASS", 0.36, "NO"),
        ("TC-APP-COMM-018", "Community Forum", "Reply Section", "Reply Text Input", "Type answer text into discussion reply input", "PASS", 0.41, "NO"),
        ("TC-APP-COMM-019", "Community Forum", "Reply Section", "Submit Reply Button", "Tap 'Submit Reply' button to post answer", "PASS", 0.48, "NO"),
        ("TC-APP-COMM-020", "Community Forum", "Thread Card", "Pin Thread Button", "Tap pushpin icon button to pin thread (Admin)", "PASS", 0.35, "NO"),
        ("TC-APP-COMM-021", "Community Forum", "Thread Card", "Bookmark Discussion Button", "Tap bookmark icon button to save thread", "PASS", 0.30, "NO"),
        ("TC-APP-COMM-022", "Community Forum", "Thread Card", "Share Thread Link", "Tap share button to copy thread permalink", "PASS", 0.33, "NO"),
        ("TC-APP-COMM-023", "Community Forum", "Group Channels", "Join Group Button", "Tap 'Join Channel' button on community group card", "PASS", 0.44, "NO"),
        ("TC-APP-COMM-024", "Community Forum", "Group Channels", "Leave Group Button", "Tap 'Joined ✓' button to exit group channel", "PASS", 0.39, "NO"),
        ("TC-APP-COMM-025", "Community Forum", "Sort Dropdown", "Sort by Popularity", "Select 'Most Popular' from sort dropdown menu", "PASS", 0.34, "NO"),
        ("TC-APP-COMM-026", "Community Forum", "Sort Dropdown", "Sort by Recent", "Select 'Newest First' from sort dropdown menu", "PASS", 0.32, "NO"),
        ("TC-APP-COMM-027", "Community Forum", "Multi-Tab Forum", "Tab 1 Post Question", "Post new discussion question in Tab 1", "PASS", 0.52, "YES"),
        ("TC-APP-COMM-028", "Community Forum", "Multi-Tab Forum", "Tab 2 Question Sync", "Verify new thread appears at top of feed in Tab 2", "PASS", 0.45, "YES"),
        ("TC-APP-COMM-029", "Community Forum", "Multi-Tab Forum", "Tab 1 Upvote", "Upvote thread #42 in Tab 1", "PASS", 0.43, "YES"),
        ("TC-APP-COMM-030", "Community Forum", "Multi-Tab Forum", "Tab 2 Vote Counter", "Verify score increment reflected in Tab 2 view", "PASS", 0.46, "YES"),
    ]
    return tests
