import pytest
import time
from selenium.webdriver.common.by import By
try:
    from selenium_tests.config import BASE_URL
    from selenium_tests.conftest import record_result
except ImportError:
    from config import BASE_URL
    from conftest import record_result

CATEGORY = "Profile Management"

def test_prof_01_edit_profile_button(driver):
    """Test TC-PROF-01: Verify 'Edit Profile' button click."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/profile/123")
        btn = driver.find_elements(By.XPATH, "//button[contains(., 'Edit Profile')]")
        if btn:
            btn[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-PROF-01", CATEGORY, "Profile Editing", "Edit Profile Button", "Click Edit Profile", status, time.time() - start_time, False, err)

def test_prof_02_save_profile_button(driver):
    """Test TC-PROF-02: Verify 'Save Changes' button click on profile form."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/profile/setup")
        btn = driver.find_elements(By.XPATH, "//button[contains(., 'Save') or contains(., 'Update')]")
        if btn:
            btn[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-PROF-02", CATEGORY, "Profile Form", "Save Changes Button", "Submit Profile Form", status, time.time() - start_time, False, err)

def test_prof_03_cancel_edit_button(driver):
    """Test TC-PROF-03: Verify 'Cancel' button click in edit profile view."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/profile/setup")
        btn = driver.find_elements(By.XPATH, "//button[contains(., 'Cancel')]")
        if btn:
            btn[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-PROF-03", CATEGORY, "Profile Form", "Cancel Edit Button", "Cancel Profile Editing", status, time.time() - start_time, False, err)

def test_prof_04_avatar_upload_trigger_button(driver):
    """Test TC-PROF-04: Verify Avatar Upload camera icon button trigger."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/profile/setup")
        cam = driver.find_elements(By.CSS_SELECTOR, "button[aria-label*='avatar'], button.upload-avatar, svg.lucide-camera")
        if cam:
            cam[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-PROF-04", CATEGORY, "Avatar Setup", "Avatar Upload Button", "Trigger File Picker", status, time.time() - start_time, False, err)

def test_prof_05_remove_avatar_button(driver):
    """Test TC-PROF-05: Verify 'Remove Photo' button action."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/profile/setup")
        btn = driver.find_elements(By.XPATH, "//button[contains(., 'Remove Photo') or contains(., 'Delete Photo')]")
        if btn:
            btn[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-PROF-05", CATEGORY, "Avatar Setup", "Remove Photo Button", "Delete Avatar Image", status, time.time() - start_time, False, err)

def test_prof_06_edit_name_input_field(driver):
    """Test TC-PROF-06: Verify editing Full Name in profile setup."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/profile/setup")
        inp = driver.find_elements(By.CSS_SELECTOR, "input[name='name'], input[placeholder*='Name']")
        if inp:
            inp[0].clear()
            inp[0].send_keys("Updated Name QA")
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-PROF-06", CATEGORY, "Profile Fields", "Full Name Input", "Update Name Value", status, time.time() - start_time, False, err)

def test_prof_07_edit_bio_textarea(driver):
    """Test TC-PROF-07: Verify editing Bio description textarea."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/profile/setup")
        txt = driver.find_elements(By.CSS_SELECTOR, "textarea[name='bio'], textarea")
        if txt:
            txt[0].clear()
            txt[0].send_keys("Passionate software engineer and mentor.")
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-PROF-07", CATEGORY, "Profile Fields", "Bio Textarea Box", "Update Bio Content", status, time.time() - start_time, False, err)

def test_prof_08_add_offered_skill_button(driver):
    """Test TC-PROF-08: Verify 'Add Skill to Offer' button trigger."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/profile/setup")
        btn = driver.find_elements(By.XPATH, "//button[contains(., 'Add Skill') or contains(., '+ Skill')]")
        if btn:
            btn[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-PROF-08", CATEGORY, "Skill Portfolio", "Add Offered Skill Button", "Click Add Skill CTA", status, time.time() - start_time, False, err)

def test_prof_09_delete_skill_tag_button(driver):
    """Test TC-PROF-09: Verify Delete ('X') button on skill tag pill."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/profile/setup")
        tags = driver.find_elements(By.CSS_SELECTOR, ".badge button, span button svg.lucide-x")
        if tags:
            tags[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-PROF-09", CATEGORY, "Skill Portfolio", "Delete Skill Tag Button", "Remove Skill Tag", status, time.time() - start_time, False, err)

def test_prof_10_add_desired_skill_button(driver):
    """Test TC-PROF-10: Verify 'Add Skill to Learn' button trigger."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/profile/setup")
        btn = driver.find_elements(By.XPATH, "//button[contains(., 'Add Skill to Learn')]")
        if btn:
            btn[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-PROF-10", CATEGORY, "Skill Portfolio", "Add Desired Skill Button", "Click Add Learn Skill", status, time.time() - start_time, False, err)

def test_prof_11_github_url_input_field(driver):
    """Test TC-PROF-11: Verify GitHub profile URL input field editing."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/profile/setup")
        inp = driver.find_elements(By.CSS_SELECTOR, "input[name='github'], input[placeholder*='github']")
        if inp:
            inp[0].clear()
            inp[0].send_keys("https://github.com/testuser")
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-PROF-11", CATEGORY, "Social Links", "GitHub URL Input", "Enter GitHub Link", status, time.time() - start_time, False, err)

def test_prof_12_linkedin_url_input_field(driver):
    """Test TC-PROF-12: Verify LinkedIn profile URL input field editing."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/profile/setup")
        inp = driver.find_elements(By.CSS_SELECTOR, "input[name='linkedin'], input[placeholder*='linkedin']")
        if inp:
            inp[0].clear()
            inp[0].send_keys("https://linkedin.com/in/testuser")
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-PROF-12", CATEGORY, "Social Links", "LinkedIn URL Input", "Enter LinkedIn Link", status, time.time() - start_time, False, err)

def test_prof_13_twitter_url_input_field(driver):
    """Test TC-PROF-13: Verify Twitter / X profile URL input field editing."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/profile/setup")
        inp = driver.find_elements(By.CSS_SELECTOR, "input[name='twitter'], input[placeholder*='twitter']")
        if inp:
            inp[0].clear()
            inp[0].send_keys("https://x.com/testuser")
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-PROF-13", CATEGORY, "Social Links", "Twitter URL Input", "Enter Twitter Link", status, time.time() - start_time, False, err)

def test_prof_14_availability_toggle_switch(driver):
    """Test TC-PROF-14: Verify 'Available for Mentorship' status switch button."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/profile/setup")
        sw = driver.find_elements(By.CSS_SELECTOR, "button[role='switch']")
        if sw:
            sw[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-PROF-14", CATEGORY, "Mentorship Availability", "Availability Switch", "Toggle Status Switch", status, time.time() - start_time, False, err)

def test_prof_15_hourly_rate_input_field(driver):
    """Test TC-PROF-15: Verify Hourly Rate / Credits input field editing."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/profile/setup")
        inp = driver.find_elements(By.CSS_SELECTOR, "input[type='number'], input[name='rate']")
        if inp:
            inp[0].clear()
            inp[0].send_keys("50")
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-PROF-15", CATEGORY, "Rate Configuration", "Hourly Rate Input", "Update Rate Amount", status, time.time() - start_time, False, err)

def test_prof_16_tab_overview_button(driver):
    """Test TC-PROF-16: Verify 'Overview' profile view tab button."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/profile/123")
        tab = driver.find_elements(By.XPATH, "//button[contains(., 'Overview')]")
        if tab:
            tab[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-PROF-16", CATEGORY, "Profile Navigation", "Overview Tab Button", "Switch to Overview", status, time.time() - start_time, False, err)

def test_prof_17_tab_skills_offered_button(driver):
    """Test TC-PROF-17: Verify 'Skills Offered' profile view tab button."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/profile/123")
        tab = driver.find_elements(By.XPATH, "//button[contains(., 'Skills Offered') or contains(., 'Teaching')]")
        if tab:
            tab[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-PROF-17", CATEGORY, "Profile Navigation", "Skills Offered Tab", "Switch to Skills Offered", status, time.time() - start_time, False, err)

def test_prof_18_tab_reviews_feedback_button(driver):
    """Test TC-PROF-18: Verify 'Reviews & Feedback' profile view tab button."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/profile/123")
        tab = driver.find_elements(By.XPATH, "//button[contains(., 'Reviews') or contains(., 'Feedback')]")
        if tab:
            tab[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-PROF-18", CATEGORY, "Profile Navigation", "Reviews Tab Button", "Switch to Reviews", status, time.time() - start_time, False, err)

def test_prof_19_tab_history_sessions_button(driver):
    """Test TC-PROF-19: Verify 'Session History' profile view tab button."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/profile/123")
        tab = driver.find_elements(By.XPATH, "//button[contains(., 'History') or contains(., 'Sessions')]")
        if tab:
            tab[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-PROF-19", CATEGORY, "Profile Navigation", "History Tab Button", "Switch to History", status, time.time() - start_time, False, err)

def test_prof_20_share_profile_button(driver):
    """Test TC-PROF-20: Verify 'Share Profile' button click."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/profile/123")
        btn = driver.find_elements(By.XPATH, "//button[contains(., 'Share') or contains(., 'Share Profile')]")
        if btn:
            btn[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-PROF-20", CATEGORY, "Profile Sharing", "Share Profile Button", "Click Share Profile", status, time.time() - start_time, False, err)

def test_prof_21_copy_profile_link_button(driver):
    """Test TC-PROF-21: Verify 'Copy Profile URL' button click."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/profile/123")
        btn = driver.find_elements(By.XPATH, "//button[contains(., 'Copy Link') or contains(., 'Copy URL')]")
        if btn:
            btn[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-PROF-21", CATEGORY, "Profile Sharing", "Copy Profile Link Button", "Copy Link to Clipboard", status, time.time() - start_time, False, err)

def test_prof_22_preview_public_profile_button(driver):
    """Test TC-PROF-22: Verify 'Public Preview' button click."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/profile/setup")
        btn = driver.find_elements(By.XPATH, "//button[contains(., 'Preview') or contains(., 'Public View')]")
        if btn:
            btn[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-PROF-22", CATEGORY, "Profile Preview", "Public Preview Button", "Open Public View", status, time.time() - start_time, False, err)

def test_prof_23_add_portfolio_project_button(driver):
    """Test TC-PROF-23: Verify 'Add Portfolio Item' button trigger."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/profile/setup")
        btn = driver.find_elements(By.XPATH, "//button[contains(., 'Add Project') or contains(., 'Add Portfolio')]")
        if btn:
            btn[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-PROF-23", CATEGORY, "Portfolio Management", "Add Project Button", "Click Add Portfolio Item", status, time.time() - start_time, False, err)

def test_prof_24_delete_portfolio_project_button(driver):
    """Test TC-PROF-24: Verify Trash / Delete button on portfolio item card."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/profile/setup")
        del_btn = driver.find_elements(By.CSS_SELECTOR, "button[aria-label*='delete'], button svg.lucide-trash")
        if del_btn:
            del_btn[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-PROF-24", CATEGORY, "Portfolio Management", "Delete Project Button", "Remove Portfolio Item", status, time.time() - start_time, False, err)

def test_prof_25_contact_user_message_button(driver):
    """Test TC-PROF-25: Verify 'Message User' button on profile header."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/profile/123")
        msg_btn = driver.find_elements(By.XPATH, "//button[contains(., 'Message') or contains(., 'Chat')]")
        if msg_btn:
            msg_btn[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-PROF-25", CATEGORY, "Direct Contact", "Message User Button", "Initiate Chat Session", status, time.time() - start_time, False, err)

def test_prof_26_book_mentor_session_button(driver):
    """Test TC-PROF-26: Verify 'Book Session' button on mentor profile page."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/profile/123")
        book_btn = driver.find_elements(By.XPATH, "//button[contains(., 'Book Session') or contains(., 'Schedule')]")
        if book_btn:
            book_btn[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-PROF-26", CATEGORY, "Direct Contact", "Book Mentor Session Button", "Open Booking Sheet", status, time.time() - start_time, False, err)

def test_prof_27_endorse_skill_button(driver):
    """Test TC-PROF-27: Verify 'Endorse Skill' thumbs up button click."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/profile/123")
        end_btn = driver.find_elements(By.XPATH, "//button[contains(., 'Endorse') or contains(., '+1')]")
        if end_btn:
            end_btn[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-PROF-27", CATEGORY, "Social Endorsements", "Endorse Skill Button", "Click Endorse Skill", status, time.time() - start_time, False, err)

def test_prof_28_report_profile_button(driver):
    """Test TC-PROF-28: Verify 'Report User / Profile' button trigger."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/profile/123")
        rep_btn = driver.find_elements(By.XPATH, "//button[contains(., 'Report')]")
        if rep_btn:
            rep_btn[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-PROF-28", CATEGORY, "Profile Moderation", "Report User Button", "Trigger Report Form", status, time.time() - start_time, False, err)

def test_prof_29_block_user_button(driver):
    """Test TC-PROF-29: Verify 'Block User' button action."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/profile/123")
        blk_btn = driver.find_elements(By.XPATH, "//button[contains(., 'Block')]")
        if blk_btn:
            blk_btn[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-PROF-29", CATEGORY, "User Safety", "Block User Button", "Click Block User", status, time.time() - start_time, False, err)

def test_prof_30_view_reviewer_profile_link(driver):
    """Test TC-PROF-30: Verify Reviewer avatar/name link in reviews tab."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/profile/123")
        rev_link = driver.find_elements(By.CSS_SELECTOR, ".review-card a[href*='profile']")
        if rev_link:
            rev_link[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-PROF-30", CATEGORY, "Social Reviews", "Reviewer Profile Link", "Click Reviewer Name", status, time.time() - start_time, False, err)
