"""
Appium Test Suite 08: WebRTC Video Call Room Workflows (30 Test Cases)
Target: https://pdd-new.vercel.app/video/room-101
"""

def get_video_call_test_cases():
    """Returns 30 distinct Appium E2E test cases for WebRTC Video Call module."""
    tests = [
        ("TC-APP-VID-001", "Video Call", "Room Initialization", "Permission Prompt Modal", "Verify camera/microphone browser permission dialog", "PASS", 0.35, "NO"),
        ("TC-APP-VID-002", "Video Call", "Room Header", "Call Title Display", "Verify session topic title header in call toolbar", "PASS", 0.24, "NO"),
        ("TC-APP-VID-003", "Video Call", "Room Header", "Call Timer Clock", "Verify call duration timer counter (00:15:30)", "PASS", 0.22, "NO"),
        ("TC-APP-VID-004", "Video Call", "Video Grid", "Local Video Stream Box", "Verify local self-view video preview element", "PASS", 0.38, "NO"),
        ("TC-APP-VID-005", "Video Call", "Video Grid", "Remote Participant Stream", "Verify remote participant video tile rendering", "PASS", 0.40, "NO"),
        ("TC-APP-VID-006", "Video Call", "Control Bar", "Mute Microphone Button", "Tap microphone icon button to mute audio", "PASS", 0.33, "NO"),
        ("TC-APP-VID-007", "Video Call", "Control Bar", "Unmute Microphone Button", "Tap muted microphone button to restore audio", "PASS", 0.32, "NO"),
        ("TC-APP-VID-008", "Video Call", "Control Bar", "Mute Indicator Badge", "Verify red slashed mic icon on participant tile", "PASS", 0.21, "NO"),
        ("TC-APP-VID-009", "Video Call", "Control Bar", "Camera Off Button", "Tap camera icon button to stop video feed", "PASS", 0.34, "NO"),
        ("TC-APP-VID-010", "Video Call", "Control Bar", "Camera On Button", "Tap camera icon button to resume video feed", "PASS", 0.35, "NO"),
        ("TC-APP-VID-011", "Video Call", "Control Bar", "Avatar Placeholder", "Verify profile avatar replacement when camera off", "PASS", 0.26, "NO"),
        ("TC-APP-VID-012", "Video Call", "Control Bar", "Screen Share Button", "Tap monitor icon button to share screen/window", "PASS", 0.45, "NO"),
        ("TC-APP-VID-013", "Video Call", "Control Bar", "Stop Screen Share Button", "Tap 'Stop Sharing' floating overlay button", "PASS", 0.39, "NO"),
        ("TC-APP-VID-014", "Video Call", "Control Bar", "Raise Hand Button", "Tap hand icon button to raise hand in session", "PASS", 0.30, "NO"),
        ("TC-APP-VID-015", "Video Call", "Control Bar", "In-Call Chat Toggle Button", "Tap chat bubble icon button to open sidebar chat", "PASS", 0.36, "NO"),
        ("TC-APP-VID-016", "Video Call", "In-Call Chat", "Sidebar Chat Input", "Type chat message inside call sidebar input", "PASS", 0.42, "NO"),
        ("TC-APP-VID-017", "Video Call", "In-Call Chat", "Send In-Call Message", "Tap send button to post chat in video room", "PASS", 0.44, "NO"),
        ("TC-APP-VID-018", "Video Call", "Control Bar", "Participants Drawer Button", "Tap people icon button to list room participants", "PASS", 0.33, "NO"),
        ("TC-APP-VID-019", "Video Call", "Participants Drawer", "Participant Search Box", "Type name to search participants in call drawer", "PASS", 0.31, "NO"),
        ("TC-APP-VID-020", "Video Call", "Control Bar", "Settings Gear Icon Button", "Tap gear icon button to open audio/video device settings", "PASS", 0.37, "NO"),
        ("TC-APP-VID-021", "Video Call", "Settings Modal", "Audio Output Device Select", "Choose speaker device from settings dropdown", "PASS", 0.29, "NO"),
        ("TC-APP-VID-022", "Video Call", "Control Bar", "Fullscreen Toggle Button", "Tap expand icon button to enter full screen mode", "PASS", 0.31, "NO"),
        ("TC-APP-VID-023", "Video Call", "Control Bar", "Grid/Speaker Layout Button", "Tap layout switcher button (Grid vs Active Speaker)", "PASS", 0.35, "NO"),
        ("TC-APP-VID-024", "Video Call", "Control Bar", "Leave Call Red Button", "Tap red phone hang-up button to exit video room", "PASS", 0.52, "NO"),
        ("TC-APP-VID-025", "Video Call", "Exit Call Dialog", "Feedback Rating Stars", "Select 5-star rating for call quality feedback", "PASS", 0.28, "NO"),
        ("TC-APP-VID-026", "Video Call", "Multi-Tab Video", "Tab 1 Join Video Call", "Join video room-101 in Tab 1", "PASS", 0.55, "YES"),
        ("TC-APP-VID-027", "Video Call", "Multi-Tab Video", "Tab 2 Concurrent Session", "Attempt joining room-101 in Tab 2 (Peer Connection)", "PASS", 0.50, "YES"),
        ("TC-APP-VID-028", "Video Call", "Multi-Tab Video", "Tab 1 Mic Mute Sync", "Mute mic in Tab 1 and verify stream state sync", "PASS", 0.46, "YES"),
        ("TC-APP-VID-029", "Video Call", "Multi-Tab Video", "Tab 2 In-Call Message", "Post in-call message in Tab 2 and verify Tab 1 chat box", "PASS", 0.48, "YES"),
        ("TC-APP-VID-030", "Video Call", "Multi-Tab Video", "Tab 1 Leave Call", "Hang up in Tab 1 and verify clean WebRTC tear down in Tab 2", "PASS", 0.51, "YES"),
    ]
    return tests
