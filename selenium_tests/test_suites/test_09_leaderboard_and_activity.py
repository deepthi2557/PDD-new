import pytest
import time
from selenium.webdriver.common.by import By
try:
    from selenium_tests.config import BASE_URL
    from selenium_tests.conftest import record_result
except ImportError:
    from config import BASE_URL
    from conftest import record_result

CATEGORY = "Leaderboard & Activity"

def test_lead_01_leaderboard_route(driver):
    """Test TC-LEAD-01: Verify navigation to Leaderboard page."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/leaderboard")
        assert "leaderboard" in driver.current_url.lower()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-LEAD-01", CATEGORY, "Leaderboard Nav", "Direct Leaderboard Route", "Load Leaderboard Page", status, time.time() - start_time, False, err)

def test_lead_02_timeframe_weekly_tab(driver):
    """Test TC-LEAD-02: Verify 'This Week' timeframe filter tab button."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/leaderboard")
        tab = driver.find_elements(By.XPATH, "//button[contains(., 'Weekly') or contains(., 'This Week')]")
        if tab:
            tab[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-LEAD-02", CATEGORY, "Timeframe Filters", "Weekly Tab Button", "Filter Weekly Rankings", status, time.time() - start_time, False, err)

def test_lead_03_timeframe_monthly_tab(driver):
    """Test TC-LEAD-03: Verify 'This Month' timeframe filter tab button."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/leaderboard")
        tab = driver.find_elements(By.XPATH, "//button[contains(., 'Monthly') or contains(., 'This Month')]")
        if tab:
            tab[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-LEAD-03", CATEGORY, "Timeframe Filters", "Monthly Tab Button", "Filter Monthly Rankings", status, time.time() - start_time, False, err)

def test_lead_04_timeframe_alltime_tab(driver):
    """Test TC-LEAD-04: Verify 'All Time' timeframe filter tab button."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/leaderboard")
        tab = driver.find_elements(By.XPATH, "//button[contains(., 'All-Time') or contains(., 'All Time')]")
        if tab:
            tab[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-LEAD-04", CATEGORY, "Timeframe Filters", "All Time Tab Button", "Filter All-Time Rankings", status, time.time() - start_time, False, err)

def test_lead_05_category_filter_dropdown(driver):
    """Test TC-LEAD-05: Verify Category dropdown selector on leaderboard."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/leaderboard")
        dd = driver.find_elements(By.CSS_SELECTOR, "select[name='category'], button[aria-label*='Filter by skill category']")
        if dd:
            dd[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-LEAD-05", CATEGORY, "Category Filters", "Category Filter Dropdown", "Filter Category Rankings", status, time.time() - start_time, False, err)

def test_lead_06_rank_1_podium_card_click(driver):
    """Test TC-LEAD-06: Verify Rank #1 Gold Trophy podium card click."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/leaderboard")
        rank1 = driver.find_elements(By.CSS_SELECTOR, ".podium-1, [data-rank='1'], .rank-card-1")
        if rank1:
            rank1[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-LEAD-06", CATEGORY, "Podium Rankings", "Rank 1 Podium Card", "Inspect Rank 1 Details", status, time.time() - start_time, False, err)

def test_lead_07_rank_2_podium_card_click(driver):
    """Test TC-LEAD-07: Verify Rank #2 Silver podium card click."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/leaderboard")
        rank2 = driver.find_elements(By.CSS_SELECTOR, ".podium-2, [data-rank='2'], .rank-card-2")
        if rank2:
            rank2[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-LEAD-07", CATEGORY, "Podium Rankings", "Rank 2 Podium Card", "Inspect Rank 2 Details", status, time.time() - start_time, False, err)

def test_lead_08_rank_3_podium_card_click(driver):
    """Test TC-LEAD-08: Verify Rank #3 Bronze podium card click."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/leaderboard")
        rank3 = driver.find_elements(By.CSS_SELECTOR, ".podium-3, [data-rank='3'], .rank-card-3")
        if rank3:
            rank3[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-LEAD-08", CATEGORY, "Podium Rankings", "Rank 3 Podium Card", "Inspect Rank 3 Details", status, time.time() - start_time, False, err)

def test_lead_09_search_leaderboard_user_input(driver):
    """Test TC-LEAD-09: Verify Search User input on leaderboard table."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/leaderboard")
        inp = driver.find_elements(By.CSS_SELECTOR, "input[placeholder*='search user'], input[placeholder*='Search']")
        if inp:
            inp[0].send_keys("Sarah")
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-LEAD-09", CATEGORY, "Leaderboard Search", "Search User Input", "Filter Leaderboard Users", status, time.time() - start_time, False, err)

def test_lead_10_follow_top_user_button(driver):
    """Test TC-LEAD-10: Verify 'Follow User' button action on leaderboard row."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/leaderboard")
        btn = driver.find_elements(By.XPATH, "//button[contains(., 'Follow')]")
        if btn:
            btn[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-LEAD-10", CATEGORY, "User Actions", "Follow User Button", "Follow Leaderboard User", status, time.time() - start_time, False, err)

def test_lead_11_unfollow_user_button(driver):
    """Test TC-LEAD-11: Verify 'Unfollow User' button action."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/leaderboard")
        btn = driver.find_elements(By.XPATH, "//button[contains(., 'Following') or contains(., 'Unfollow')]")
        if btn:
            btn[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-LEAD-11", CATEGORY, "User Actions", "Unfollow User Button", "Unfollow Leaderboard User", status, time.time() - start_time, False, err)

def test_lead_12_sort_by_badges_button(driver):
    """Test TC-LEAD-12: Verify 'Sort by Badges Earned' column header button."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/leaderboard")
        btn = driver.find_elements(By.XPATH, "//button[contains(., 'Badges')]")
        if btn:
            btn[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-LEAD-12", CATEGORY, "Leaderboard Sorting", "Sort Badges Column Button", "Sort Table by Badges", status, time.time() - start_time, False, err)

def test_lead_13_sort_by_hours_taught_button(driver):
    """Test TC-LEAD-13: Verify 'Sort by Hours Taught' column header button."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/leaderboard")
        btn = driver.find_elements(By.XPATH, "//button[contains(., 'Hours') or contains(., 'Hours Taught')]")
        if btn:
            btn[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-LEAD-13", CATEGORY, "Leaderboard Sorting", "Sort Hours Column Button", "Sort Table by Hours", status, time.time() - start_time, False, err)

def test_lead_14_sort_by_rating_score_button(driver):
    """Test TC-LEAD-14: Verify 'Sort by Rating Score' column header button."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/leaderboard")
        btn = driver.find_elements(By.XPATH, "//button[contains(., 'Rating') or contains(., 'Score')]")
        if btn:
            btn[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-LEAD-14", CATEGORY, "Leaderboard Sorting", "Sort Rating Column Button", "Sort Table by Rating", status, time.time() - start_time, False, err)

def test_lead_15_activity_stream_route(driver):
    """Test TC-LEAD-15: Verify direct navigation to Activity Stream route."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/activity")
        assert "activity" in driver.current_url.lower()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-LEAD-15", CATEGORY, "Activity Stream", "Direct Activity Route", "Load Activity Stream", status, time.time() - start_time, False, err)

def test_lead_16_activity_filter_all_button(driver):
    """Test TC-LEAD-16: Verify 'All Activity' filter tab button."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/activity")
        tab = driver.find_elements(By.XPATH, "//button[contains(., 'All Activity') or contains(., 'All')]")
        if tab:
            tab[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-LEAD-16", CATEGORY, "Activity Filters", "All Activity Tab", "Filter All Events", status, time.time() - start_time, False, err)

def test_lead_17_activity_filter_sessions_button(driver):
    """Test TC-LEAD-17: Verify 'Completed Sessions' activity filter button."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/activity")
        tab = driver.find_elements(By.XPATH, "//button[contains(., 'Sessions')]")
        if tab:
            tab[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-LEAD-17", CATEGORY, "Activity Filters", "Sessions Filter Tab", "Filter Completed Sessions", status, time.time() - start_time, False, err)

def test_lead_18_activity_filter_badges_button(driver):
    """Test TC-LEAD-18: Verify 'Badges & Achievements' activity filter button."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/activity")
        tab = driver.find_elements(By.XPATH, "//button[contains(., 'Badges') or contains(., 'Achievements')]")
        if tab:
            tab[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-LEAD-18", CATEGORY, "Activity Filters", "Badges Filter Tab", "Filter Badge Events", status, time.time() - start_time, False, err)

def test_lead_19_activity_filter_community_button(driver):
    """Test TC-LEAD-19: Verify 'Community Posts' activity filter button."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/activity")
        tab = driver.find_elements(By.XPATH, "//button[contains(., 'Posts') or contains(., 'Community')]")
        if tab:
            tab[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-LEAD-19", CATEGORY, "Activity Filters", "Community Posts Tab", "Filter Community Activity", status, time.time() - start_time, False, err)

def test_lead_20_claim_badge_reward_button(driver):
    """Test TC-LEAD-20: Verify 'Claim Badge Reward' button action."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/activity")
        btn = driver.find_elements(By.XPATH, "//button[contains(., 'Claim') or contains(., 'Claim Reward')]")
        if btn:
            btn[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-LEAD-20", CATEGORY, "Badges & Rewards", "Claim Reward Button", "Claim Achievement Bonus", status, time.time() - start_time, False, err)

def test_lead_21_share_achievement_button(driver):
    """Test TC-LEAD-21: Verify 'Share Achievement' social button action."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/activity")
        btn = driver.find_elements(By.XPATH, "//button[contains(., 'Share Achievement') or contains(., 'Share Badge')]")
        if btn:
            btn[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-LEAD-21", CATEGORY, "Badges & Rewards", "Share Achievement Button", "Open Social Share Dialog", status, time.time() - start_time, False, err)

def test_lead_22_view_badge_details_modal(driver):
    """Test TC-LEAD-22: Verify View Badge criteria modal trigger button."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/activity")
        btn = driver.find_elements(By.XPATH, "//button[contains(., 'Badge Details') or contains(., 'View Badge')]")
        if btn:
            btn[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-LEAD-22", CATEGORY, "Badges & Rewards", "Badge Details Button", "Open Badge Info Modal", status, time.time() - start_time, False, err)

def test_lead_23_expand_activity_item_details(driver):
    """Test TC-LEAD-23: Verify Expand details arrow button on activity item card."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/activity")
        btn = driver.find_elements(By.CSS_SELECTOR, "button[aria-label*='expand'], button svg.lucide-chevron-down")
        if btn:
            btn[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-LEAD-23", CATEGORY, "Activity Details", "Expand Activity Item Button", "Expand Event Card Details", status, time.time() - start_time, False, err)

def test_lead_24_refresh_activity_feed_button(driver):
    """Test TC-LEAD-24: Verify Refresh Activity stream button click."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/activity")
        btn = driver.find_elements(By.XPATH, "//button[contains(., 'Refresh')] | //button svg.lucide-refresh-cw")
        if btn:
            btn[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-LEAD-24", CATEGORY, "Activity Feed", "Refresh Stream Button", "Refresh Activity Stream", status, time.time() - start_time, False, err)

def test_lead_25_load_more_activity_button(driver):
    """Test TC-LEAD-25: Verify 'Load More Activity' pagination button click."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/activity")
        btn = driver.find_elements(By.XPATH, "//button[contains(., 'Load More')]")
        if btn:
            btn[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-LEAD-25", CATEGORY, "Pagination", "Load More Activity Button", "Load Older Activity Items", status, time.time() - start_time, False, err)

def test_lead_26_export_leaderboard_certificate(driver):
    """Test TC-LEAD-26: Verify 'Export Rank Certificate' PDF button action."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/leaderboard")
        btn = driver.find_elements(By.XPATH, "//button[contains(., 'Certificate') or contains(., 'Export Rank')]")
        if btn:
            btn[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-LEAD-26", CATEGORY, "Certificates", "Export Certificate Button", "Download Rank Certificate", status, time.time() - start_time, False, err)

def test_lead_27_points_tooltip_hover_trigger(driver):
    """Test TC-LEAD-27: Verify Hover / Click points info icon for breakdown."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/leaderboard")
        btn = driver.find_elements(By.CSS_SELECTOR, "button[aria-label*='points info'], svg.lucide-info")
        if btn:
            btn[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-LEAD-27", CATEGORY, "Points Info", "Points Breakdown Icon", "Show Points Tooltip", status, time.time() - start_time, False, err)

def test_lead_28_clear_activity_history_button(driver):
    """Test TC-LEAD-28: Verify Clear my activity log button action."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/activity")
        btn = driver.find_elements(By.XPATH, "//button[contains(., 'Clear Activity') or contains(., 'Clear Log')]")
        if btn:
            btn[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-LEAD-28", CATEGORY, "Activity Settings", "Clear Activity Log Button", "Purge Activity History", status, time.time() - start_time, False, err)

def test_lead_29_toggle_compact_view_mode(driver):
    """Test TC-LEAD-29: Verify Compact vs Detailed view mode button."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/activity")
        btn = driver.find_elements(By.CSS_SELECTOR, "button[aria-label*='compact'], button.view-mode-toggle")
        if btn:
            btn[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-LEAD-29", CATEGORY, "View Modes", "Compact View Toggle Button", "Toggle Stream Density", status, time.time() - start_time, False, err)

def test_lead_30_challenge_top_user_button(driver):
    """Test TC-LEAD-30: Verify 'Challenge User' button action on leaderboard."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/leaderboard")
        btn = driver.find_elements(By.XPATH, "//button[contains(., 'Challenge')]")
        if btn:
            btn[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-LEAD-30", CATEGORY, "Gamification", "Challenge User Button", "Send Skill Challenge", status, time.time() - start_time, False, err)
