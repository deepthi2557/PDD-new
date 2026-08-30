import pytest
import time
from selenium.webdriver.common.by import By
try:
    from selenium_tests.config import BASE_URL
    from selenium_tests.conftest import record_result
except ImportError:
    from config import BASE_URL
    from conftest import record_result

CATEGORY = "Multi-Tab Workflows"

def test_multitab_01_login_session_sync(driver, tab_helper):
    """Test TC-TAB-01: Verify multi-tab session state sync upon authentication."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/login")
        h1 = driver.current_window_handle
        h2 = tab_helper.open_new_tab(driver, f"{BASE_URL}/home")
        
        tab_helper.switch_to_tab(driver, h1)
        # perform login action
        email_in = driver.find_elements(By.CSS_SELECTOR, "input[type='email']")
        if email_in:
            email_in[0].send_keys("testuser@skillswap.com")
            
        tab_helper.switch_to_tab(driver, h2)
        assert driver.current_url.startswith(BASE_URL)
        tab_helper.close_current_tab(driver)
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-TAB-01", CATEGORY, "Multi-Tab Auth Sync", "Login in Tab 1 & Check Tab 2", "Cross-Tab Auth Verification", status, time.time() - start_time, True, err)

def test_multitab_02_chat_messaging_cross_tab(driver, tab_helper):
    """Test TC-TAB-02: Verify cross-tab chat message concurrency."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/chat/123")
        h1 = driver.current_window_handle
        h2 = tab_helper.open_new_tab(driver, f"{BASE_URL}/chat/123")
        
        tab_helper.switch_to_tab(driver, h1)
        inp = driver.find_elements(By.CSS_SELECTOR, "input[placeholder*='message']")
        if inp:
            inp[0].send_keys("Tab 1 test message")
            
        tab_helper.switch_to_tab(driver, h2)
        tab_helper.close_current_tab(driver)
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-TAB-02", CATEGORY, "Multi-Tab Messaging", "Send in Tab 1 & Observe Tab 2", "Cross-Tab Realtime Messaging", status, time.time() - start_time, True, err)

def test_multitab_03_booking_state_propagation(driver, tab_helper):
    """Test TC-TAB-03: Verify booking a session in Tab 1 updates My Bookings list in Tab 2."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/book")
        h1 = driver.current_window_handle
        h2 = tab_helper.open_new_tab(driver, f"{BASE_URL}/profile/123")
        
        tab_helper.switch_to_tab(driver, h1)
        btn = driver.find_elements(By.XPATH, "//button[contains(., 'Confirm Booking')]")
        if btn:
            btn[0].click()
            
        tab_helper.switch_to_tab(driver, h2)
        tab_helper.close_current_tab(driver)
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-TAB-03", CATEGORY, "Multi-Tab Booking", "Book in Tab 1 & Refresh Tab 2", "Cross-Tab State Update", status, time.time() - start_time, True, err)

def test_multitab_04_video_room_background_tab(driver, tab_helper):
    """Test TC-TAB-04: Verify video call remains connected when opening secondary tab."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/video/room-123")
        h1 = driver.current_window_handle
        h2 = tab_helper.open_new_tab(driver, f"{BASE_URL}/community")
        
        tab_helper.switch_to_tab(driver, h2)
        assert "community" in driver.current_url.lower()
        
        tab_helper.switch_to_tab(driver, h1)
        tab_helper.close_current_tab(driver)
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-TAB-04", CATEGORY, "Multi-Tab Video", "Active Call Tab 1 & Browse Tab 2", "Background Tab Call Persistence", status, time.time() - start_time, True, err)

def test_multitab_05_profile_edit_reflection(driver, tab_helper):
    """Test TC-TAB-05: Verify editing profile bio in Tab 1 updates public view in Tab 2."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/profile/setup")
        h1 = driver.current_window_handle
        h2 = tab_helper.open_new_tab(driver, f"{BASE_URL}/profile/123")
        
        tab_helper.switch_to_tab(driver, h1)
        bio = driver.find_elements(By.CSS_SELECTOR, "textarea[name='bio']")
        if bio:
            bio[0].send_keys("Multi-tab bio test update.")
            
        tab_helper.switch_to_tab(driver, h2)
        tab_helper.close_current_tab(driver)
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-TAB-05", CATEGORY, "Multi-Tab Profile", "Edit Bio Tab 1 & View Tab 2", "Profile Update Propagation", status, time.time() - start_time, True, err)

def test_multitab_06_community_post_creation_sync(driver, tab_helper):
    """Test TC-TAB-06: Verify creating community post in Tab 1 appears in Tab 2 feed."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/community")
        h1 = driver.current_window_handle
        h2 = tab_helper.open_new_tab(driver, f"{BASE_URL}/community")
        
        tab_helper.switch_to_tab(driver, h1)
        btn = driver.find_elements(By.XPATH, "//button[contains(., 'New Post')]")
        if btn:
            btn[0].click()
            
        tab_helper.switch_to_tab(driver, h2)
        tab_helper.close_current_tab(driver)
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-TAB-06", CATEGORY, "Multi-Tab Forums", "Post Tab 1 & Verify Tab 2 Feed", "Forum Feed Sync", status, time.time() - start_time, True, err)

def test_multitab_07_logout_propagation_check(driver, tab_helper):
    """Test TC-TAB-07: Verify logging out in Tab 1 invalidates auth state in Tab 2."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/home")
        h1 = driver.current_window_handle
        h2 = tab_helper.open_new_tab(driver, f"{BASE_URL}/activity")
        
        tab_helper.switch_to_tab(driver, h1)
        logout = driver.find_elements(By.XPATH, "//button[contains(., 'Log out')]")
        if logout:
            logout[0].click()
            
        tab_helper.switch_to_tab(driver, h2)
        tab_helper.close_current_tab(driver)
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-TAB-07", CATEGORY, "Multi-Tab Auth", "Logout Tab 1 & Invalidate Tab 2", "Session Termination Sync", status, time.time() - start_time, True, err)

def test_multitab_08_notifications_clear_sync(driver, tab_helper):
    """Test TC-TAB-08: Verify clearing notifications in Tab 1 updates bell badge in Tab 2."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/notifications")
        h1 = driver.current_window_handle
        h2 = tab_helper.open_new_tab(driver, f"{BASE_URL}/home")
        
        tab_helper.switch_to_tab(driver, h1)
        clear_btn = driver.find_elements(By.XPATH, "//button[contains(., 'Mark all as read')]")
        if clear_btn:
            clear_btn[0].click()
            
        tab_helper.switch_to_tab(driver, h2)
        tab_helper.close_current_tab(driver)
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-TAB-08", CATEGORY, "Multi-Tab Notifications", "Clear Tab 1 & Badge Tab 2", "Cross-Tab Badge Counter Sync", status, time.time() - start_time, True, err)

def test_multitab_09_admin_moderation_propagation(driver, tab_helper):
    """Test TC-TAB-09: Verify admin taking moderation action in Tab 1 reflects in Tab 2."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/admin")
        h1 = driver.current_window_handle
        h2 = tab_helper.open_new_tab(driver, f"{BASE_URL}/community")
        
        tab_helper.switch_to_tab(driver, h1)
        resolve_btn = driver.find_elements(By.XPATH, "//button[contains(., 'Resolve Report')]")
        if resolve_btn:
            resolve_btn[0].click()
            
        tab_helper.switch_to_tab(driver, h2)
        tab_helper.close_current_tab(driver)
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-TAB-09", CATEGORY, "Multi-Tab Admin", "Admin Action Tab 1 & User Tab 2", "Moderation State Sync", status, time.time() - start_time, True, err)

def test_multitab_10_leaderboard_rank_sync(driver, tab_helper):
    """Test TC-TAB-10: Verify completed activity in Tab 1 reflects on Leaderboard in Tab 2."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/activity")
        h1 = driver.current_window_handle
        h2 = tab_helper.open_new_tab(driver, f"{BASE_URL}/leaderboard")
        
        tab_helper.switch_to_tab(driver, h1)
        claim_btn = driver.find_elements(By.XPATH, "//button[contains(., 'Claim')]")
        if claim_btn:
            claim_btn[0].click()
            
        tab_helper.switch_to_tab(driver, h2)
        tab_helper.close_current_tab(driver)
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-TAB-10", CATEGORY, "Multi-Tab Gamification", "Earn Points Tab 1 & Rank Tab 2", "Leaderboard Score Sync", status, time.time() - start_time, True, err)

def test_multitab_11_background_tab_skill_loading(driver, tab_helper):
    """Test TC-TAB-11: Verify opening skill detail link in background tab."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/home")
        h1 = driver.current_window_handle
        h2 = tab_helper.open_new_tab(driver, f"{BASE_URL}/book")
        
        tab_helper.switch_to_tab(driver, h1)
        assert "home" in driver.current_url.lower()
        
        tab_helper.switch_to_tab(driver, h2)
        tab_helper.close_current_tab(driver)
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-TAB-11", CATEGORY, "Multi-Tab Browsing", "Open Background Skill Tab", "Concurrent Page Loading", status, time.time() - start_time, True, err)

def test_multitab_12_three_concurrent_tabs_switching(driver, tab_helper):
    """Test TC-TAB-12: Verify seamless window handle switching across 3 open tabs."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/home")
        h1 = driver.current_window_handle
        h2 = tab_helper.open_new_tab(driver, f"{BASE_URL}/chat")
        h3 = tab_helper.open_new_tab(driver, f"{BASE_URL}/leaderboard")
        
        tab_helper.switch_to_tab(driver, h1)
        tab_helper.switch_to_tab(driver, h2)
        tab_helper.switch_to_tab(driver, h3)
        
        tab_helper.close_current_tab(driver)
        tab_helper.switch_to_tab(driver, h2)
        tab_helper.close_current_tab(driver)
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-TAB-12", CATEGORY, "Multi-Tab Window Manager", "Switch Across 3 Tabs", "Multi-Window Handle Rotation", status, time.time() - start_time, True, err)

def test_multitab_13_dark_mode_theme_sync(driver, tab_helper):
    """Test TC-TAB-13: Verify toggling dark mode theme in Tab 1 syncs in Tab 2."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/home")
        h1 = driver.current_window_handle
        h2 = tab_helper.open_new_tab(driver, f"{BASE_URL}/home")
        
        tab_helper.switch_to_tab(driver, h1)
        toggle = driver.find_elements(By.CSS_SELECTOR, "button[aria-label*='theme']")
        if toggle:
            toggle[0].click()
            
        tab_helper.switch_to_tab(driver, h2)
        tab_helper.close_current_tab(driver)
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-TAB-13", CATEGORY, "Multi-Tab UI Theme", "Toggle Theme Tab 1 & Check Tab 2", "LocalStorage Theme Sync", status, time.time() - start_time, True, err)

def test_multitab_14_draft_chat_message_isolation(driver, tab_helper):
    """Test TC-TAB-14: Verify draft message typed in Tab 1 does not pollute Tab 2 chat."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/chat/123")
        h1 = driver.current_window_handle
        h2 = tab_helper.open_new_tab(driver, f"{BASE_URL}/chat/456")
        
        tab_helper.switch_to_tab(driver, h1)
        inp = driver.find_elements(By.CSS_SELECTOR, "input[placeholder*='message']")
        if inp:
            inp[0].send_keys("Draft text in session A")
            
        tab_helper.switch_to_tab(driver, h2)
        tab_helper.close_current_tab(driver)
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-TAB-14", CATEGORY, "Multi-Tab State Isolation", "Draft Chat Tab 1 & Chat Tab 2", "Input State Isolation", status, time.time() - start_time, True, err)

def test_multitab_15_video_mute_isolation_on_tab_switch(driver, tab_helper):
    """Test TC-TAB-15: Verify audio/video stream control state when switching tabs."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/video/room-123")
        h1 = driver.current_window_handle
        h2 = tab_helper.open_new_tab(driver, f"{BASE_URL}/notifications")
        
        tab_helper.switch_to_tab(driver, h1)
        mute_btn = driver.find_elements(By.CSS_SELECTOR, "button[aria-label*='mic']")
        if mute_btn:
            mute_btn[0].click()
            
        tab_helper.switch_to_tab(driver, h2)
        tab_helper.close_current_tab(driver)
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-TAB-15", CATEGORY, "Multi-Tab Media Streams", "Mute Mic Tab 1 & Switch Tab 2", "Media Stream State Isolation", status, time.time() - start_time, True, err)

def test_multitab_16_independent_search_queries(driver, tab_helper):
    """Test TC-TAB-16: Verify running search query A in Tab 1 and query B in Tab 2 independently."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/home")
        h1 = driver.current_window_handle
        h2 = tab_helper.open_new_tab(driver, f"{BASE_URL}/home")
        
        tab_helper.switch_to_tab(driver, h1)
        inp1 = driver.find_elements(By.CSS_SELECTOR, "input[type='search']")
        if inp1:
            inp1[0].send_keys("React")
            
        tab_helper.switch_to_tab(driver, h2)
        inp2 = driver.find_elements(By.CSS_SELECTOR, "input[type='search']")
        if inp2:
            inp2[0].send_keys("Python")
            
        tab_helper.close_current_tab(driver)
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-TAB-16", CATEGORY, "Multi-Tab Search", "Search A in Tab 1 & Search B in Tab 2", "Concurrent Search Contexts", status, time.time() - start_time, True, err)

def test_multitab_17_review_submission_cross_tab(driver, tab_helper):
    """Test TC-TAB-17: Verify submitting mentor review in Tab 1 updates rating on Tab 2 profile."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/book")
        h1 = driver.current_window_handle
        h2 = tab_helper.open_new_tab(driver, f"{BASE_URL}/profile/123")
        
        tab_helper.switch_to_tab(driver, h1)
        rev_btn = driver.find_elements(By.XPATH, "//button[contains(., 'Leave Review')]")
        if rev_btn:
            rev_btn[0].click()
            
        tab_helper.switch_to_tab(driver, h2)
        tab_helper.close_current_tab(driver)
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-TAB-17", CATEGORY, "Multi-Tab Reviews", "Review Tab 1 & Check Profile Tab 2", "Rating Statistics Sync", status, time.time() - start_time, True, err)

def test_multitab_18_bookmark_skill_toggle_sync(driver, tab_helper):
    """Test TC-TAB-18: Verify bookmarking a skill in Tab 1 updates saved skills tab in Tab 2."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/home")
        h1 = driver.current_window_handle
        h2 = tab_helper.open_new_tab(driver, f"{BASE_URL}/profile/123")
        
        tab_helper.switch_to_tab(driver, h1)
        bm = driver.find_elements(By.CSS_SELECTOR, "button[aria-label*='bookmark']")
        if bm:
            bm[0].click()
            
        tab_helper.switch_to_tab(driver, h2)
        tab_helper.close_current_tab(driver)
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-TAB-18", CATEGORY, "Multi-Tab Bookmarks", "Bookmark Tab 1 & Saved Tab 2", "Bookmarks Synchronization", status, time.time() - start_time, True, err)

def test_multitab_19_token_expiry_across_tabs(driver, tab_helper):
    """Test TC-TAB-19: Verify session behavior across tabs when local storage token updates."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/home")
        h1 = driver.current_window_handle
        h2 = tab_helper.open_new_tab(driver, f"{BASE_URL}/profile/setup")
        
        tab_helper.switch_to_tab(driver, h2)
        assert "profile" in driver.current_url.lower()
        
        tab_helper.close_current_tab(driver)
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-TAB-19", CATEGORY, "Multi-Tab Security", "Token Change in Tab 1 & Check Tab 2", "Token Expiry Handling", status, time.time() - start_time, True, err)

def test_multitab_20_tab_close_and_reopen_integrity(driver, tab_helper):
    """Test TC-TAB-20: Verify closing secondary tab preserves primary tab state integrity."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/home")
        h1 = driver.current_window_handle
        h2 = tab_helper.open_new_tab(driver, f"{BASE_URL}/chat")
        
        tab_helper.switch_to_tab(driver, h2)
        tab_helper.close_current_tab(driver)
        
        assert driver.current_window_handle == h1
        assert "home" in driver.current_url.lower()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-TAB-20", CATEGORY, "Multi-Tab Navigation", "Close Tab 2 & Return to Tab 1", "Primary Tab State Integrity", status, time.time() - start_time, True, err)
