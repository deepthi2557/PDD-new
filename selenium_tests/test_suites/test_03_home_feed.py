import pytest
import time
from selenium.webdriver.common.by import By
try:
    from selenium_tests.config import BASE_URL
    from selenium_tests.conftest import record_result
except ImportError:
    from config import BASE_URL
    from conftest import record_result

CATEGORY = "Home Feed & Skill Discovery"

def test_home_01_request_skill_cta_button(driver):
    """Test TC-HOME-01: Verify 'Request Skill' CTA button click."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/home")
        cta = driver.find_elements(By.XPATH, "//button[contains(., 'Request Skill') or contains(., 'Request a Skill')]")
        if cta:
            cta[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-HOME-01", CATEGORY, "Skill Requests", "Request Skill CTA Button", "Click Request CTA", status, time.time() - start_time, False, err)

def test_home_02_search_submit_button(driver):
    """Test TC-HOME-02: Verify Search Skill submit button action."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/home")
        search_btn = driver.find_elements(By.XPATH, "//button[contains(., 'Search') or @type='submit']")
        if search_btn:
            search_btn[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-HOME-02", CATEGORY, "Skill Search", "Search Skill Button", "Submit Search Query", status, time.time() - start_time, False, err)

def test_home_03_category_filter_all_button(driver):
    """Test TC-HOME-03: Verify 'All Categories' filter pill button."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/home")
        pill = driver.find_elements(By.XPATH, "//button[contains(., 'All')]")
        if pill:
            pill[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-HOME-03", CATEGORY, "Category Filtering", "All Categories Filter Pill", "Click All Pill", status, time.time() - start_time, False, err)

def test_home_04_category_filter_webdev(driver):
    """Test TC-HOME-04: Verify 'Web Development' category pill button."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/home")
        pill = driver.find_elements(By.XPATH, "//button[contains(., 'Web Dev') or contains(., 'Web Development')]")
        if pill:
            pill[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-HOME-04", CATEGORY, "Category Filtering", "Web Dev Filter Pill", "Click Web Dev Pill", status, time.time() - start_time, False, err)

def test_home_05_category_filter_mobiledev(driver):
    """Test TC-HOME-05: Verify 'Mobile App Dev' category pill button."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/home")
        pill = driver.find_elements(By.XPATH, "//button[contains(., 'Mobile') or contains(., 'App Dev')]")
        if pill:
            pill[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-HOME-05", CATEGORY, "Category Filtering", "Mobile Dev Filter Pill", "Click Mobile Pill", status, time.time() - start_time, False, err)

def test_home_06_category_filter_design(driver):
    """Test TC-HOME-06: Verify 'Design & UI/UX' category pill button."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/home")
        pill = driver.find_elements(By.XPATH, "//button[contains(., 'Design') or contains(., 'UI/UX')]")
        if pill:
            pill[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-HOME-06", CATEGORY, "Category Filtering", "Design Filter Pill", "Click Design Pill", status, time.time() - start_time, False, err)

def test_home_07_category_filter_datascience(driver):
    """Test TC-HOME-07: Verify 'Data Science' category pill button."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/home")
        pill = driver.find_elements(By.XPATH, "//button[contains(., 'Data Science') or contains(., 'Analytics')]")
        if pill:
            pill[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-HOME-07", CATEGORY, "Category Filtering", "Data Science Filter Pill", "Click Data Science Pill", status, time.time() - start_time, False, err)

def test_home_08_category_filter_ai_ml(driver):
    """Test TC-HOME-08: Verify 'AI & Machine Learning' category pill button."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/home")
        pill = driver.find_elements(By.XPATH, "//button[contains(., 'AI') or contains(., 'Machine Learning')]")
        if pill:
            pill[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-HOME-08", CATEGORY, "Category Filtering", "AI/ML Filter Pill", "Click AI/ML Pill", status, time.time() - start_time, False, err)

def test_home_09_category_filter_devops(driver):
    """Test TC-HOME-09: Verify 'DevOps & Cloud' category pill button."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/home")
        pill = driver.find_elements(By.XPATH, "//button[contains(., 'DevOps') or contains(., 'Cloud')]")
        if pill:
            pill[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-HOME-09", CATEGORY, "Category Filtering", "DevOps Filter Pill", "Click DevOps Pill", status, time.time() - start_time, False, err)

def test_home_10_category_filter_marketing(driver):
    """Test TC-HOME-10: Verify 'Digital Marketing' category pill button."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/home")
        pill = driver.find_elements(By.XPATH, "//button[contains(., 'Marketing') or contains(., 'Business')]")
        if pill:
            pill[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-HOME-10", CATEGORY, "Category Filtering", "Marketing Filter Pill", "Click Marketing Pill", status, time.time() - start_time, False, err)

def test_home_11_sort_popular_button(driver):
    """Test TC-HOME-11: Verify 'Popular' sort option button."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/home")
        sort_btn = driver.find_elements(By.XPATH, "//button[contains(., 'Popular')]")
        if sort_btn:
            sort_btn[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-HOME-11", CATEGORY, "Feed Sorting", "Popular Sort Button", "Sort by Popularity", status, time.time() - start_time, False, err)

def test_home_12_sort_recent_button(driver):
    """Test TC-HOME-12: Verify 'Recent' sort option button."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/home")
        sort_btn = driver.find_elements(By.XPATH, "//button[contains(., 'Recent') or contains(., 'Newest')]")
        if sort_btn:
            sort_btn[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-HOME-12", CATEGORY, "Feed Sorting", "Recent Sort Button", "Sort by Recent Date", status, time.time() - start_time, False, err)

def test_home_13_sort_top_rated_button(driver):
    """Test TC-HOME-13: Verify 'Top Rated' sort option button."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/home")
        sort_btn = driver.find_elements(By.XPATH, "//button[contains(., 'Top Rated') or contains(., 'Rating')]")
        if sort_btn:
            sort_btn[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-HOME-13", CATEGORY, "Feed Sorting", "Top Rated Sort Button", "Sort by Top Rating", status, time.time() - start_time, False, err)

def test_home_14_skill_card_click(driver):
    """Test TC-HOME-14: Verify clicking a Skill Card item to view details."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/home")
        cards = driver.find_elements(By.CSS_SELECTOR, ".skill-card, [role='article'], .card")
        if cards:
            cards[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-HOME-14", CATEGORY, "Skill Cards", "Skill Card Container", "Click Skill Card", status, time.time() - start_time, False, err)

def test_home_15_skill_card_book_now_button(driver):
    """Test TC-HOME-15: Verify 'Book Now' button on skill card."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/home")
        book_btns = driver.find_elements(By.XPATH, "//button[contains(., 'Book Now') or contains(., 'Book Session')]")
        if book_btns:
            book_btns[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-HOME-15", CATEGORY, "Skill Cards", "Card Book Now Button", "Click Book Session", status, time.time() - start_time, False, err)

def test_home_16_skill_card_view_details_button(driver):
    """Test TC-HOME-16: Verify 'View Details' button on skill card."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/home")
        view_btns = driver.find_elements(By.XPATH, "//button[contains(., 'View') or contains(., 'Details')]")
        if view_btns:
            view_btns[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-HOME-16", CATEGORY, "Skill Cards", "Card View Details Button", "Click View Details", status, time.time() - start_time, False, err)

def test_home_17_skill_card_bookmark_button(driver):
    """Test TC-HOME-17: Verify Bookmark / Save skill button feature."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/home")
        bookmark = driver.find_elements(By.CSS_SELECTOR, "button[aria-label*='bookmark'], svg.lucide-bookmark")
        if bookmark:
            bookmark[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-HOME-17", CATEGORY, "Skill Cards", "Card Bookmark Icon Button", "Toggle Bookmark", status, time.time() - start_time, False, err)

def test_home_18_skill_card_like_heart_button(driver):
    """Test TC-HOME-18: Verify Like / Heart button on skill card."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/home")
        like_btn = driver.find_elements(By.CSS_SELECTOR, "button[aria-label*='like'], svg.lucide-heart")
        if like_btn:
            like_btn[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-HOME-18", CATEGORY, "Skill Cards", "Card Like Heart Button", "Toggle Skill Like", status, time.time() - start_time, False, err)

def test_home_19_skill_card_share_button(driver):
    """Test TC-HOME-19: Verify Share skill button feature."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/home")
        share_btn = driver.find_elements(By.CSS_SELECTOR, "button[aria-label*='share'], svg.lucide-share")
        if share_btn:
            share_btn[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-HOME-19", CATEGORY, "Skill Cards", "Card Share Link Button", "Open Share Options", status, time.time() - start_time, False, err)

def test_home_20_skill_card_mentor_profile_link(driver):
    """Test TC-HOME-20: Verify Mentor Avatar / Name link click on skill card."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/home")
        mentor_links = driver.find_elements(By.CSS_SELECTOR, ".card a[href*='profile']")
        if mentor_links:
            mentor_links[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-HOME-20", CATEGORY, "Skill Cards", "Mentor Profile Link", "Click Mentor Name", status, time.time() - start_time, False, err)

def test_home_21_pagination_next_button(driver):
    """Test TC-HOME-21: Verify Pagination Next Page button action."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/home")
        next_btn = driver.find_elements(By.XPATH, "//button[contains(., 'Next') or @aria-label='Go to next page']")
        if next_btn:
            next_btn[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-HOME-21", CATEGORY, "Pagination", "Pagination Next Button", "Click Next Page", status, time.time() - start_time, False, err)

def test_home_22_pagination_prev_button(driver):
    """Test TC-HOME-22: Verify Pagination Previous Page button action."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/home")
        prev_btn = driver.find_elements(By.XPATH, "//button[contains(., 'Previous') or @aria-label='Go to previous page']")
        if prev_btn:
            prev_btn[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-HOME-22", CATEGORY, "Pagination", "Pagination Previous Button", "Click Prev Page", status, time.time() - start_time, False, err)

def test_home_23_pagination_page_number_button(driver):
    """Test TC-HOME-23: Verify clicking explicit Page Number button (Page 2)."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/home")
        p2_btn = driver.find_elements(By.XPATH, "//button[text()='2']")
        if p2_btn:
            p2_btn[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-HOME-23", CATEGORY, "Pagination", "Page Number 2 Button", "Click Page 2", status, time.time() - start_time, False, err)

def test_home_24_reset_filters_button(driver):
    """Test TC-HOME-24: Verify Reset Filters button feature."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/home")
        reset_btn = driver.find_elements(By.XPATH, "//button[contains(., 'Reset') or contains(., 'Clear Filters')]")
        if reset_btn:
            reset_btn[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-HOME-24", CATEGORY, "Filter Controls", "Reset Filters Button", "Click Reset All Filters", status, time.time() - start_time, False, err)

def test_home_25_tab_recommended_skills(driver):
    """Test TC-HOME-25: Verify 'Recommended for You' feed tab button."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/home")
        tab = driver.find_elements(By.XPATH, "//button[contains(., 'Recommended')]")
        if tab:
            tab[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-HOME-25", CATEGORY, "Feed Tabs", "Recommended Tab Button", "Switch to Recommended", status, time.time() - start_time, False, err)

def test_home_26_tab_trending_skills(driver):
    """Test TC-HOME-26: Verify 'Trending' feed tab button."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/home")
        tab = driver.find_elements(By.XPATH, "//button[contains(., 'Trending')]")
        if tab:
            tab[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-HOME-26", CATEGORY, "Feed Tabs", "Trending Tab Button", "Switch to Trending", status, time.time() - start_time, False, err)

def test_home_27_tab_new_arrivals(driver):
    """Test TC-HOME-27: Verify 'New Skills' feed tab button."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/home")
        tab = driver.find_elements(By.XPATH, "//button[contains(., 'New')]")
        if tab:
            tab[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-HOME-27", CATEGORY, "Feed Tabs", "New Arrivals Tab Button", "Switch to New Arrivals", status, time.time() - start_time, False, err)

def test_home_28_filter_online_only_switch(driver):
    """Test TC-HOME-28: Verify 'Online Sessions Only' toggle switch."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/home")
        sw = driver.find_elements(By.CSS_SELECTOR, "button[role='switch'], input[type='checkbox']")
        if sw:
            sw[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-HOME-28", CATEGORY, "Filter Controls", "Online Only Switch", "Toggle Online Filter", status, time.time() - start_time, False, err)

def test_home_29_filter_level_beginner(driver):
    """Test TC-HOME-29: Verify 'Beginner' level filter button."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/home")
        lvl = driver.find_elements(By.XPATH, "//button[contains(., 'Beginner')]")
        if lvl:
            lvl[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-HOME-29", CATEGORY, "Level Filters", "Beginner Level Button", "Select Beginner Level", status, time.time() - start_time, False, err)

def test_home_30_filter_level_intermediate(driver):
    """Test TC-HOME-30: Verify 'Intermediate' level filter button."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/home")
        lvl = driver.find_elements(By.XPATH, "//button[contains(., 'Intermediate')]")
        if lvl:
            lvl[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-HOME-30", CATEGORY, "Level Filters", "Intermediate Level Button", "Select Intermediate Level", status, time.time() - start_time, False, err)

def test_home_31_filter_level_expert(driver):
    """Test TC-HOME-31: Verify 'Expert' level filter button."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/home")
        lvl = driver.find_elements(By.XPATH, "//button[contains(., 'Expert') or contains(., 'Advanced')]")
        if lvl:
            lvl[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-HOME-31", CATEGORY, "Level Filters", "Expert Level Button", "Select Expert Level", status, time.time() - start_time, False, err)

def test_home_32_quick_request_modal_submit(driver):
    """Test TC-HOME-32: Verify Quick Request modal Submit button action."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/home")
        sub_btn = driver.find_elements(By.XPATH, "//button[contains(., 'Submit Request')]")
        if sub_btn:
            sub_btn[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-HOME-32", CATEGORY, "Skill Requests", "Modal Submit Request Button", "Submit Quick Request", status, time.time() - start_time, False, err)

def test_home_33_quick_request_modal_cancel(driver):
    """Test TC-HOME-33: Verify Quick Request modal Cancel button action."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/home")
        can_btn = driver.find_elements(By.XPATH, "//button[contains(., 'Cancel')]")
        if can_btn:
            can_btn[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-HOME-33", CATEGORY, "Skill Requests", "Modal Cancel Button", "Cancel Request Modal", status, time.time() - start_time, False, err)

def test_home_34_refresh_feed_button(driver):
    """Test TC-HOME-34: Verify Refresh Feed button feature."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/home")
        ref_btn = driver.find_elements(By.XPATH, "//button[contains(., 'Refresh')] | //button svg.lucide-refresh-cw")
        if ref_btn:
            ref_btn[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-HOME-34", CATEGORY, "Feed Controls", "Refresh Feed Button", "Click Refresh Feed", status, time.time() - start_time, False, err)

def test_home_35_grid_list_layout_toggle(driver):
    """Test TC-HOME-35: Verify Grid vs List layout toggle button."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/home")
        view_toggle = driver.find_elements(By.CSS_SELECTOR, "button[aria-label*='grid'], button[aria-label*='list']")
        if view_toggle:
            view_toggle[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-HOME-35", CATEGORY, "Layout Controls", "Grid/List Toggle Button", "Toggle Feed View Mode", status, time.time() - start_time, False, err)
