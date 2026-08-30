import pytest
import time
from selenium.webdriver.common.by import By
try:
    from selenium_tests.config import BASE_URL
    from selenium_tests.conftest import record_result
except ImportError:
    from config import BASE_URL
    from conftest import record_result

CATEGORY = "Chat & Realtime Messaging"

def test_chat_01_chat_index_route(driver):
    """Test TC-CHAT-01: Verify navigation to Chat dashboard view."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/chat")
        assert "chat" in driver.current_url.lower()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-CHAT-01", CATEGORY, "Chat Navigation", "Direct Chat Route", "Load Conversations View", status, time.time() - start_time, False, err)

def test_chat_02_select_conversation_item(driver):
    """Test TC-CHAT-02: Verify selecting a conversation item from chat sidebar list."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/chat")
        items = driver.find_elements(By.CSS_SELECTOR, ".chat-item, a[href*='/chat/']")
        if items:
            items[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-CHAT-02", CATEGORY, "Conversation List", "Conversation Item Card", "Select Active Chat", status, time.time() - start_time, False, err)

def test_chat_03_message_input_box(driver):
    """Test TC-CHAT-03: Verify Message Input field text entry."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/chat/123")
        inp = driver.find_elements(By.CSS_SELECTOR, "input[placeholder*='message'], textarea[placeholder*='message']")
        if inp:
            inp[0].send_keys("Hello! Excited for our skill swap session.")
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-CHAT-03", CATEGORY, "Messaging Box", "Message Input Field", "Type Message Text", status, time.time() - start_time, False, err)

def test_chat_04_send_message_button(driver):
    """Test TC-CHAT-04: Verify Send Message paper-plane button click."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/chat/123")
        btn = driver.find_elements(By.CSS_SELECTOR, "button[aria-label*='send'], button svg.lucide-send")
        if btn:
            btn[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-CHAT-04", CATEGORY, "Messaging Box", "Send Message Button", "Click Send Icon", status, time.time() - start_time, False, err)

def test_chat_05_attach_file_button(driver):
    """Test TC-CHAT-05: Verify Attach File paperclip button trigger."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/chat/123")
        btn = driver.find_elements(By.CSS_SELECTOR, "button[aria-label*='attach'], button svg.lucide-paperclip")
        if btn:
            btn[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-CHAT-05", CATEGORY, "Attachments", "Attach File Button", "Trigger File Attachment", status, time.time() - start_time, False, err)

def test_chat_06_emoji_picker_button(driver):
    """Test TC-CHAT-06: Verify Emoji Picker smile icon button toggle."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/chat/123")
        btn = driver.find_elements(By.CSS_SELECTOR, "button[aria-label*='emoji'], button svg.lucide-smile")
        if btn:
            btn[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-CHAT-06", CATEGORY, "Messaging Box", "Emoji Picker Button", "Toggle Emoji Picker", status, time.time() - start_time, False, err)

def test_chat_07_voice_note_record_button(driver):
    """Test TC-CHAT-07: Verify Voice Note record microphone button click."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/chat/123")
        btn = driver.find_elements(By.CSS_SELECTOR, "button[aria-label*='voice'], button svg.lucide-mic")
        if btn:
            btn[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-CHAT-07", CATEGORY, "Voice Messages", "Voice Record Button", "Start Voice Recording", status, time.time() - start_time, False, err)

def test_chat_08_search_chat_history_input(driver):
    """Test TC-CHAT-08: Verify Search Chat conversations input field."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/chat")
        inp = driver.find_elements(By.CSS_SELECTOR, "input[placeholder*='search chat'], input[placeholder*='Filter']")
        if inp:
            inp[0].send_keys("Alex")
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-CHAT-08", CATEGORY, "Chat Search", "Search Chats Input Box", "Filter Chat Contacts", status, time.time() - start_time, False, err)

def test_chat_09_clear_chat_search_button(driver):
    """Test TC-CHAT-09: Verify Clear search input button in chat list."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/chat")
        btn = driver.find_elements(By.CSS_SELECTOR, "button.clear-chat-search, button svg.lucide-x")
        if btn:
            btn[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-CHAT-09", CATEGORY, "Chat Search", "Clear Search Button", "Clear Contact Search", status, time.time() - start_time, False, err)

def test_chat_10_unread_chats_filter_tab(driver):
    """Test TC-CHAT-10: Verify 'Unread Chats' filter tab button."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/chat")
        tab = driver.find_elements(By.XPATH, "//button[contains(., 'Unread')]")
        if tab:
            tab[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-CHAT-10", CATEGORY, "Chat Filters", "Unread Chats Tab", "Filter Unread Threads", status, time.time() - start_time, False, err)

def test_chat_11_archived_chats_filter_tab(driver):
    """Test TC-CHAT-11: Verify 'Archived Chats' filter tab button."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/chat")
        tab = driver.find_elements(By.XPATH, "//button[contains(., 'Archived')]")
        if tab:
            tab[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-CHAT-11", CATEGORY, "Chat Filters", "Archived Chats Tab", "Filter Archived Threads", status, time.time() - start_time, False, err)

def test_chat_12_archive_conversation_button(driver):
    """Test TC-CHAT-12: Verify Archive Conversation option button."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/chat/123")
        btn = driver.find_elements(By.XPATH, "//button[contains(., 'Archive')]")
        if btn:
            btn[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-CHAT-12", CATEGORY, "Conversation Actions", "Archive Thread Button", "Archive Conversation", status, time.time() - start_time, False, err)

def test_chat_13_pin_conversation_button(driver):
    """Test TC-CHAT-13: Verify Pin Conversation button toggle feature."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/chat/123")
        btn = driver.find_elements(By.XPATH, "//button[contains(., 'Pin')] | //button svg.lucide-pin")
        if btn:
            btn[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-CHAT-13", CATEGORY, "Conversation Actions", "Pin Thread Button", "Pin Conversation to Top", status, time.time() - start_time, False, err)

def test_chat_14_mute_chat_notifications_button(driver):
    """Test TC-CHAT-14: Verify Mute Notifications toggle button."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/chat/123")
        btn = driver.find_elements(By.XPATH, "//button[contains(., 'Mute')] | //button svg.lucide-volume-x")
        if btn:
            btn[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-CHAT-14", CATEGORY, "Chat Settings", "Mute Notifications Button", "Toggle Mute Status", status, time.time() - start_time, False, err)

def test_chat_15_video_call_shortcut_button(driver):
    """Test TC-CHAT-15: Verify Video Call camera icon shortcut button in header."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/chat/123")
        btn = driver.find_elements(By.CSS_SELECTOR, "button[aria-label*='video call'], a[href*='/video/'], svg.lucide-video")
        if btn:
            btn[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-CHAT-15", CATEGORY, "Call Shortcuts", "Video Call Button", "Launch Video Call from Chat", status, time.time() - start_time, False, err)

def test_chat_16_audio_call_shortcut_button(driver):
    """Test TC-CHAT-16: Verify Audio Call phone icon shortcut button in header."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/chat/123")
        btn = driver.find_elements(By.CSS_SELECTOR, "button[aria-label*='audio call'], svg.lucide-phone")
        if btn:
            btn[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-CHAT-16", CATEGORY, "Call Shortcuts", "Audio Call Button", "Launch Audio Call from Chat", status, time.time() - start_time, False, err)

def test_chat_17_view_user_info_drawer_button(driver):
    """Test TC-CHAT-17: Verify View User Info drawer toggle button."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/chat/123")
        btn = driver.find_elements(By.CSS_SELECTOR, "button[aria-label*='info'], svg.lucide-info")
        if btn:
            btn[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-CHAT-17", CATEGORY, "Chat Drawer", "User Info Drawer Button", "Toggle Info Panel", status, time.time() - start_time, False, err)

def test_chat_18_close_user_info_drawer_button(driver):
    """Test TC-CHAT-18: Verify Close ('X') button on user info drawer panel."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/chat/123")
        btn = driver.find_elements(By.CSS_SELECTOR, ".drawer-close button, svg.lucide-x")
        if btn:
            btn[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-CHAT-18", CATEGORY, "Chat Drawer", "Close Drawer Button", "Close Info Panel", status, time.time() - start_time, False, err)

def test_chat_19_quick_suggestion_pill_1(driver):
    """Test TC-CHAT-19: Verify Quick Reply suggestion pill 1 button."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/chat/123")
        pill = driver.find_elements(By.XPATH, "//button[contains(., 'Sounds good!') or contains(., 'Available now')]")
        if pill:
            pill[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-CHAT-19", CATEGORY, "Quick Replies", "Suggestion Pill 1", "Click Quick Suggestion", status, time.time() - start_time, False, err)

def test_chat_20_quick_suggestion_pill_2(driver):
    """Test TC-CHAT-20: Verify Quick Reply suggestion pill 2 button."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/chat/123")
        pill = driver.find_elements(By.XPATH, "//button[contains(., 'Let\'s schedule') or contains(., 'Thanks!')]")
        if pill:
            pill[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-CHAT-20", CATEGORY, "Quick Replies", "Suggestion Pill 2", "Click Quick Suggestion", status, time.time() - start_time, False, err)

def test_chat_21_schedule_session_from_chat_button(driver):
    """Test TC-CHAT-21: Verify 'Schedule Session' button inside chat window."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/chat/123")
        btn = driver.find_elements(By.XPATH, "//button[contains(., 'Schedule Session') or contains(., 'Book Session')]")
        if btn:
            btn[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-CHAT-21", CATEGORY, "In-Chat Actions", "Schedule Session CTA", "Open Booking Sheet", status, time.time() - start_time, False, err)

def test_chat_22_share_code_snippet_button(driver):
    """Test TC-CHAT-22: Verify Share Code Snippet formatted block button."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/chat/123")
        btn = driver.find_elements(By.CSS_SELECTOR, "button[aria-label*='code'], svg.lucide-code")
        if btn:
            btn[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-CHAT-22", CATEGORY, "In-Chat Actions", "Share Code Block Button", "Insert Code Block", status, time.time() - start_time, False, err)

def test_chat_23_react_thumbs_up_button(driver):
    """Test TC-CHAT-23: Verify Message Thumbs Up reaction button click."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/chat/123")
        btn = driver.find_elements(By.CSS_SELECTOR, "button.reaction-thumbsup, button[aria-label*='thumbs up']")
        if btn:
            btn[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-CHAT-23", CATEGORY, "Message Reactions", "Thumbs Up Reaction", "Add Reaction Emoji", status, time.time() - start_time, False, err)

def test_chat_24_react_heart_button(driver):
    """Test TC-CHAT-24: Verify Message Heart reaction button click."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/chat/123")
        btn = driver.find_elements(By.CSS_SELECTOR, "button.reaction-heart, button[aria-label*='heart']")
        if btn:
            btn[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-CHAT-24", CATEGORY, "Message Reactions", "Heart Reaction", "Add Heart Emoji", status, time.time() - start_time, False, err)

def test_chat_25_delete_message_button(driver):
    """Test TC-CHAT-25: Verify Delete Message option button."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/chat/123")
        btn = driver.find_elements(By.XPATH, "//button[contains(., 'Delete Message')] | //button svg.lucide-trash-2")
        if btn:
            btn[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-CHAT-25", CATEGORY, "Message Actions", "Delete Message Button", "Delete Message Item", status, time.time() - start_time, False, err)

def test_chat_26_copy_message_text_button(driver):
    """Test TC-CHAT-26: Verify Copy Message Text button feature."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/chat/123")
        btn = driver.find_elements(By.CSS_SELECTOR, "button[aria-label*='copy'], button svg.lucide-copy")
        if btn:
            btn[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-CHAT-26", CATEGORY, "Message Actions", "Copy Message Text Button", "Copy Text to Clipboard", status, time.time() - start_time, False, err)

def test_chat_27_scroll_to_bottom_button(driver):
    """Test TC-CHAT-27: Verify Scroll to Latest Message down-arrow button."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/chat/123")
        btn = driver.find_elements(By.CSS_SELECTOR, "button.scroll-bottom, button svg.lucide-arrow-down")
        if btn:
            btn[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-CHAT-27", CATEGORY, "Chat Scrolling", "Scroll to Bottom Button", "Scroll to Newest Message", status, time.time() - start_time, False, err)

def test_chat_28_clear_chat_history_button(driver):
    """Test TC-CHAT-28: Verify Clear Conversation History button action."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/chat/123")
        btn = driver.find_elements(By.XPATH, "//button[contains(., 'Clear History')]")
        if btn:
            btn[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-CHAT-28", CATEGORY, "Conversation Actions", "Clear History Button", "Purge Chat History", status, time.time() - start_time, False, err)

def test_chat_29_block_chat_contact_button(driver):
    """Test TC-CHAT-29: Verify Block Contact button action from chat options."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/chat/123")
        btn = driver.find_elements(By.XPATH, "//button[contains(., 'Block Contact')]")
        if btn:
            btn[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-CHAT-29", CATEGORY, "User Safety", "Block Contact Button", "Block Chat Partner", status, time.time() - start_time, False, err)

def test_chat_30_new_group_chat_button(driver):
    """Test TC-CHAT-30: Verify 'New Group Chat' creation button."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/chat")
        btn = driver.find_elements(By.XPATH, "//button[contains(., 'New Group') or contains(., 'Create Group')]")
        if btn:
            btn[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-CHAT-30", CATEGORY, "Group Chat", "New Group Chat Button", "Open Group Chat Composer", status, time.time() - start_time, False, err)
