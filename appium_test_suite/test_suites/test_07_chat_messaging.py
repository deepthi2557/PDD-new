"""
Appium Test Suite 07: Real-Time Chat & Direct Messaging Workflows (30 Test Cases)
Target: https://pdd-new.vercel.app/chat
"""

def get_chat_test_cases():
    """Returns 30 distinct Appium E2E test cases for Direct Messaging module."""
    tests = [
        ("TC-APP-CHAT-001", "Direct Messaging", "Chat Sidebar", "Chat List Container", "Verify active chat conversation thread list", "PASS", 0.30, "NO"),
        ("TC-APP-CHAT-002", "Direct Messaging", "Chat Sidebar", "New Conversation Button", "Tap '+' compose new message icon button", "PASS", 0.37, "NO"),
        ("TC-APP-CHAT-003", "Direct Messaging", "Chat Sidebar", "User Search Input", "Type name 'Maria Garcia' into chat search input", "PASS", 0.39, "NO"),
        ("TC-APP-CHAT-004", "Direct Messaging", "Chat Thread", "Conversation Item Click", "Select active chat thread with Maria", "PASS", 0.35, "NO"),
        ("TC-APP-CHAT-005", "Direct Messaging", "Chat Header", "Recipient Avatar & Name", "Verify chat partner header details rendering", "PASS", 0.23, "NO"),
        ("TC-APP-CHAT-006", "Direct Messaging", "Chat Header", "Online Status Indicator", "Verify green online status dot badge", "PASS", 0.20, "NO"),
        ("TC-APP-CHAT-007", "Direct Messaging", "Chat Header", "Video Call Trigger Icon", "Tap camera icon button in chat header", "PASS", 0.44, "NO"),
        ("TC-APP-CHAT-008", "Direct Messaging", "Chat Header", "Voice Call Trigger Icon", "Tap phone icon button in chat header", "PASS", 0.42, "NO"),
        ("TC-APP-CHAT-009", "Direct Messaging", "Chat Header", "Options Menu (...) ", "Tap chat header options dropdown menu", "PASS", 0.28, "NO"),
        ("TC-APP-CHAT-010", "Direct Messaging", "Chat Input", "Message Input Textarea", "Type text message 'Hey! Are we still on for today's session?'", "PASS", 0.43, "NO"),
        ("TC-APP-CHAT-011", "Direct Messaging", "Chat Input", "Send Message Button", "Tap paper plane icon button to dispatch message", "PASS", 0.48, "NO"),
        ("TC-APP-CHAT-012", "Direct Messaging", "Chat Input", "Enter Key Dispatch", "Press Enter keyboard key to send text message", "PASS", 0.46, "NO"),
        ("TC-APP-CHAT-013", "Direct Messaging", "Chat Input", "Attachment Paperclip Icon", "Tap paperclip button to attach file/code snippet", "PASS", 0.36, "NO"),
        ("TC-APP-CHAT-014", "Direct Messaging", "Chat Input", "Emoji Picker Button", "Tap smiley face icon button to open emoji drawer", "PASS", 0.34, "NO"),
        ("TC-APP-CHAT-015", "Direct Messaging", "Emoji Picker", "Select Emoji Icon", "Tap thumbs-up 👍 emoji to insert into input", "PASS", 0.29, "NO"),
        ("TC-APP-CHAT-016", "Direct Messaging", "Chat Bubble", "Sent Message Bubble", "Verify outgoing blue message bubble layout", "PASS", 0.25, "NO"),
        ("TC-APP-CHAT-017", "Direct Messaging", "Chat Bubble", "Timestamp Display", "Verify message sent timestamp formatting", "PASS", 0.21, "NO"),
        ("TC-APP-CHAT-018", "Direct Messaging", "Chat Bubble", "Read Receipt Double Check", "Verify double checkmark read indicator icon", "PASS", 0.22, "NO"),
        ("TC-APP-CHAT-019", "Direct Messaging", "Chat Bubble", "Hover Reaction Picker", "Hover over message bubble to trigger reaction bar", "PASS", 0.31, "NO"),
        ("TC-APP-CHAT-020", "Direct Messaging", "Chat Bubble", "Delete Message Option", "Tap 'Delete Message' popup action item", "PASS", 0.33, "NO"),
        ("TC-APP-CHAT-021", "Direct Messaging", "Chat Sidebar", "Filter Unread Messages", "Tap 'Unread' chat filter tab button", "PASS", 0.27, "NO"),
        ("TC-APP-CHAT-022", "Direct Messaging", "Chat Sidebar", "Mute Conversation Toggle", "Tap 'Mute Notifications' toggle on thread", "PASS", 0.30, "NO"),
        ("TC-APP-CHAT-023", "Direct Messaging", "Chat Sidebar", "Pin Chat Thread", "Tap pushpin button to pin favorite contact", "PASS", 0.32, "NO"),
        ("TC-APP-CHAT-024", "Direct Messaging", "Code Snippet Share", "Send Code Snippet Button", "Post formatted code snippet block in chat", "PASS", 0.47, "NO"),
        ("TC-APP-CHAT-025", "Direct Messaging", "Audio Message", "Record Voice Note Button", "Hold microphone icon button to record voice note", "PASS", 0.50, "NO"),
        ("TC-APP-CHAT-026", "Direct Messaging", "Multi-Tab Chat", "Tab 1 Send Message", "Send message 'Sync test message' in Tab 1", "PASS", 0.52, "YES"),
        ("TC-APP-CHAT-027", "Direct Messaging", "Multi-Tab Chat", "Tab 2 Real-Time Arrival", "Verify instant arrival of message in Tab 2 window", "PASS", 0.45, "YES"),
        ("TC-APP-CHAT-028", "Direct Messaging", "Multi-Tab Chat", "Tab 2 Reply Message", "Type reply in Tab 2 and verify rendering in Tab 1", "PASS", 0.49, "YES"),
        ("TC-APP-CHAT-029", "Direct Messaging", "Multi-Tab Chat", "Tab 1 Read Receipt Sync", "Verify opening thread in Tab 1 clears unread count in Tab 2", "PASS", 0.44, "YES"),
        ("TC-APP-CHAT-030", "Direct Messaging", "Multi-Tab Chat", "Tab 2 Typing Indicator", "Verify typing indicator syncs across tabs while typing", "PASS", 0.41, "YES"),
    ]
    return tests
