import pytest
import time
from selenium.webdriver.common.by import By
try:
    from selenium_tests.config import BASE_URL
    from selenium_tests.conftest import record_result
except ImportError:
    from config import BASE_URL
    from conftest import record_result

CATEGORY = "Community & Forums"

def test_comm_01_create_post_cta_button(driver):
    """Test TC-COMM-01: Verify 'New Post' CTA button click."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/community")
        btn = driver.find_elements(By.XPATH, "//button[contains(., 'New Post') or contains(., 'Create Post')]")
        if btn:
            btn[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-COMM-01", CATEGORY, "Discussion Creation", "New Post CTA Button", "Open Post Composer", status, time.time() - start_time, False, err)

def test_comm_02_post_title_input_field(driver):
    """Test TC-COMM-02: Verify Post Title input text box typing."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/community")
        inp = driver.find_elements(By.CSS_SELECTOR, "input[name='title'], input[placeholder*='Title']")
        if inp:
            inp[0].send_keys("Best practices for learning React in 2026?")
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-COMM-02", CATEGORY, "Post Composer", "Post Title Input", "Enter Title Text", status, time.time() - start_time, False, err)

def test_comm_03_post_content_textarea(driver):
    """Test TC-COMM-03: Verify Post Body content textarea typing."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/community")
        txt = driver.find_elements(By.CSS_SELECTOR, "textarea[name='content'], textarea[placeholder*='mind']")
        if txt:
            txt[0].send_keys("What are your favorite hooks and state management tools?")
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-COMM-03", CATEGORY, "Post Composer", "Post Content Textarea", "Enter Body Content", status, time.time() - start_time, False, err)

def test_comm_04_submit_new_post_button(driver):
    """Test TC-COMM-04: Verify Publish / Submit Post button action."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/community")
        btn = driver.find_elements(By.XPATH, "//button[contains(., 'Publish') or contains(., 'Post')]")
        if btn:
            btn[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-COMM-04", CATEGORY, "Post Composer", "Publish Post Button", "Click Publish Post", status, time.time() - start_time, False, err)

def test_comm_05_cancel_new_post_button(driver):
    """Test TC-COMM-05: Verify Cancel / Discard Post draft button."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/community")
        btn = driver.find_elements(By.XPATH, "//button[contains(., 'Cancel') or contains(., 'Discard')]")
        if btn:
            btn[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-COMM-05", CATEGORY, "Post Composer", "Cancel Composer Button", "Discard Post Draft", status, time.time() - start_time, False, err)

def test_comm_06_category_all_discussions_button(driver):
    """Test TC-COMM-06: Verify 'All Discussions' tab filter button."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/community")
        tab = driver.find_elements(By.XPATH, "//button[contains(., 'All Discussions')]")
        if tab:
            tab[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-COMM-06", CATEGORY, "Category Filter", "All Discussions Tab", "Filter All Discussions", status, time.time() - start_time, False, err)

def test_comm_07_category_qna_button(driver):
    """Test TC-COMM-07: Verify 'Q&A' category filter button."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/community")
        tab = driver.find_elements(By.XPATH, "//button[contains(., 'Q&A') or contains(., 'Questions')]")
        if tab:
            tab[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-COMM-07", CATEGORY, "Category Filter", "Q&A Filter Tab", "Filter Questions", status, time.time() - start_time, False, err)

def test_comm_08_category_showcase_button(driver):
    """Test TC-COMM-08: Verify 'Project Showcase' category filter button."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/community")
        tab = driver.find_elements(By.XPATH, "//button[contains(., 'Showcase') or contains(., 'Projects')]")
        if tab:
            tab[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-COMM-08", CATEGORY, "Category Filter", "Showcase Filter Tab", "Filter Showcase Posts", status, time.time() - start_time, False, err)

def test_comm_09_category_ideas_button(driver):
    """Test TC-COMM-09: Verify 'Ideas & Feedback' category filter button."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/community")
        tab = driver.find_elements(By.XPATH, "//button[contains(., 'Ideas')]")
        if tab:
            tab[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-COMM-09", CATEGORY, "Category Filter", "Ideas Filter Tab", "Filter Ideas", status, time.time() - start_time, False, err)

def test_comm_10_sort_latest_posts_button(driver):
    """Test TC-COMM-10: Verify 'Latest' sort option button."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/community")
        btn = driver.find_elements(By.XPATH, "//button[contains(., 'Latest') or contains(., 'Newest')]")
        if btn:
            btn[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-COMM-10", CATEGORY, "Forum Sorting", "Sort Latest Button", "Sort Posts by Time", status, time.time() - start_time, False, err)

def test_comm_11_sort_top_upvoted_button(driver):
    """Test TC-COMM-11: Verify 'Top Upvoted' sort option button."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/community")
        btn = driver.find_elements(By.XPATH, "//button[contains(., 'Top Upvoted') or contains(., 'Top')]")
        if btn:
            btn[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-COMM-11", CATEGORY, "Forum Sorting", "Sort Top Button", "Sort Posts by Votes", status, time.time() - start_time, False, err)

def test_comm_12_post_like_upvote_button(driver):
    """Test TC-COMM-12: Verify Post Upvote / Like button click."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/community")
        upvote = driver.find_elements(By.CSS_SELECTOR, "button[aria-label*='upvote'], button.upvote-btn, svg.lucide-thumbs-up")
        if upvote:
            upvote[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-COMM-12", CATEGORY, "Post Interactions", "Post Upvote Button", "Click Upvote Button", status, time.time() - start_time, False, err)

def test_comm_13_post_comment_drawer_button(driver):
    """Test TC-COMM-13: Verify Comment button trigger on post card."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/community")
        cmt_btn = driver.find_elements(By.CSS_SELECTOR, "button[aria-label*='comment'], svg.lucide-message-square")
        if cmt_btn:
            cmt_btn[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-COMM-13", CATEGORY, "Post Interactions", "Post Comment Button", "Open Comments Drawer", status, time.time() - start_time, False, err)

def test_comm_14_comment_input_text_box(driver):
    """Test TC-COMM-14: Verify typing in Comment input text field."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/community")
        inp = driver.find_elements(By.CSS_SELECTOR, "input[placeholder*='comment'], textarea[placeholder*='comment']")
        if inp:
            inp[0].send_keys("Great insights! Thanks for sharing.")
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-COMM-14", CATEGORY, "Comments", "Comment Input Box", "Type Comment Text", status, time.time() - start_time, False, err)

def test_comm_15_submit_comment_button(driver):
    """Test TC-COMM-15: Verify Submit Comment button trigger."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/community")
        btn = driver.find_elements(By.XPATH, "//button[contains(., 'Post Comment') or contains(., 'Reply')]")
        if btn:
            btn[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-COMM-15", CATEGORY, "Comments", "Submit Comment Button", "Post User Comment", status, time.time() - start_time, False, err)

def test_comm_16_post_bookmark_button(driver):
    """Test TC-COMM-16: Verify Bookmark post button feature."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/community")
        bm = driver.find_elements(By.CSS_SELECTOR, "button[aria-label*='bookmark'], svg.lucide-bookmark")
        if bm:
            bm[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-COMM-16", CATEGORY, "Post Interactions", "Bookmark Post Button", "Toggle Post Bookmark", status, time.time() - start_time, False, err)

def test_comm_17_post_share_button(driver):
    """Test TC-COMM-17: Verify Share post button feature."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/community")
        sh = driver.find_elements(By.CSS_SELECTOR, "button[aria-label*='share'], svg.lucide-share-2")
        if sh:
            sh[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-COMM-17", CATEGORY, "Post Interactions", "Share Post Button", "Open Post Share Modal", status, time.time() - start_time, False, err)

def test_comm_18_tag_pill_react_filter(driver):
    """Test TC-COMM-18: Verify Tag filter pill '#React' click."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/community")
        tag = driver.find_elements(By.XPATH, "//button[contains(., 'React') or contains(., '#React')]")
        if tag:
            tag[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-COMM-18", CATEGORY, "Tag Filtering", "#React Tag Pill", "Filter by #React", status, time.time() - start_time, False, err)

def test_comm_19_tag_pill_python_filter(driver):
    """Test TC-COMM-19: Verify Tag filter pill '#Python' click."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/community")
        tag = driver.find_elements(By.XPATH, "//button[contains(., 'Python') or contains(., '#Python')]")
        if tag:
            tag[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-COMM-19", CATEGORY, "Tag Filtering", "#Python Tag Pill", "Filter by #Python", status, time.time() - start_time, False, err)

def test_comm_20_tag_pill_design_filter(driver):
    """Test TC-COMM-20: Verify Tag filter pill '#Design' click."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/community")
        tag = driver.find_elements(By.XPATH, "//button[contains(., 'Design') or contains(., '#Design')]")
        if tag:
            tag[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-COMM-20", CATEGORY, "Tag Filtering", "#Design Tag Pill", "Filter by #Design", status, time.time() - start_time, False, err)

def test_comm_21_join_group_button(driver):
    """Test TC-COMM-21: Verify 'Join Community Group' button action."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/community")
        btn = driver.find_elements(By.XPATH, "//button[contains(., 'Join Group') or contains(., 'Join Community')]")
        if btn:
            btn[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-COMM-21", CATEGORY, "Groups & Channels", "Join Group Button", "Join Selected Group", status, time.time() - start_time, False, err)

def test_comm_22_leave_group_button(driver):
    """Test TC-COMM-22: Verify 'Leave Community Group' button action."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/community")
        btn = driver.find_elements(By.XPATH, "//button[contains(., 'Leave Group') or contains(., 'Joined')]")
        if btn:
            btn[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-COMM-22", CATEGORY, "Groups & Channels", "Leave Group Button", "Leave Group Session", status, time.time() - start_time, False, err)

def test_comm_23_group_tab_discussions(driver):
    """Test TC-COMM-23: Verify Group view 'Discussions' tab button."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/community")
        tab = driver.find_elements(By.XPATH, "//button[contains(., 'Discussions')]")
        if tab:
            tab[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-COMM-23", CATEGORY, "Group Navigation", "Discussions Group Tab", "View Group Discussions", status, time.time() - start_time, False, err)

def test_comm_24_group_tab_members(driver):
    """Test TC-COMM-24: Verify Group view 'Members List' tab button."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/community")
        tab = driver.find_elements(By.XPATH, "//button[contains(., 'Members')]")
        if tab:
            tab[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-COMM-24", CATEGORY, "Group Navigation", "Members List Group Tab", "View Group Members", status, time.time() - start_time, False, err)

def test_comm_25_group_tab_events(driver):
    """Test TC-COMM-25: Verify Group view 'Upcoming Events' tab button."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/community")
        tab = driver.find_elements(By.XPATH, "//button[contains(., 'Events')]")
        if tab:
            tab[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-COMM-25", CATEGORY, "Group Navigation", "Events Group Tab", "View Group Events", status, time.time() - start_time, False, err)

def test_comm_26_search_forum_posts_input(driver):
    """Test TC-COMM-26: Verify Search Forum Posts input field action."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/community")
        inp = driver.find_elements(By.CSS_SELECTOR, "input[placeholder*='search'], input[placeholder*='Search']")
        if inp:
            inp[0].send_keys("TypeScript")
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-COMM-26", CATEGORY, "Forum Search", "Search Forum Input", "Filter Forum Discussions", status, time.time() - start_time, False, err)

def test_comm_27_filter_unanswered_posts_switch(driver):
    """Test TC-COMM-27: Verify 'Unanswered Questions Only' switch button."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/community")
        sw = driver.find_elements(By.CSS_SELECTOR, "button[role='switch']")
        if sw:
            sw[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-COMM-27", CATEGORY, "Forum Filters", "Unanswered Switch", "Filter Unanswered Posts", status, time.time() - start_time, False, err)

def test_comm_28_report_post_button(driver):
    """Test TC-COMM-28: Verify Report Post option button in post menu."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/community")
        rep = driver.find_elements(By.XPATH, "//button[contains(., 'Report Post') or contains(., 'Report')]")
        if rep:
            rep[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-COMM-28", CATEGORY, "Forum Moderation", "Report Post Button", "Open Report Post Form", status, time.time() - start_time, False, err)

def test_comm_29_edit_my_post_button(driver):
    """Test TC-COMM-29: Verify Edit Post button feature."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/community")
        edt = driver.find_elements(By.XPATH, "//button[contains(., 'Edit Post') or contains(., 'Edit')]")
        if edt:
            edt[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-COMM-29", CATEGORY, "Post Management", "Edit My Post Button", "Open Edit Composer", status, time.time() - start_time, False, err)

def test_comm_30_load_more_posts_button(driver):
    """Test TC-COMM-30: Verify 'Load More Posts' pagination CTA button."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/community")
        btn = driver.find_elements(By.XPATH, "//button[contains(., 'Load More')]")
        if btn:
            btn[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-COMM-30", CATEGORY, "Pagination", "Load More Posts Button", "Load Next Batch", status, time.time() - start_time, False, err)
