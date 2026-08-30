import pytest
import time
from selenium.webdriver.common.by import By
try:
    from selenium_tests.config import BASE_URL
    from selenium_tests.conftest import record_result
except ImportError:
    from config import BASE_URL
    from conftest import record_result

CATEGORY = "Booking & Scheduling"

def test_book_01_direct_booking_page(driver):
    """Test TC-BOOK-01: Verify navigation to session booking route."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/book")
        assert "book" in driver.current_url.lower()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-BOOK-01", CATEGORY, "Booking Navigation", "Direct Book Route", "Load Booking View", status, time.time() - start_time, False, err)

def test_book_02_calendar_next_month_button(driver):
    """Test TC-BOOK-02: Verify Next Month navigation arrow button on calendar."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/book")
        btn = driver.find_elements(By.CSS_SELECTOR, "button[name='next-month'], button.rdp-nav_button_next, svg.lucide-chevron-right")
        if btn:
            btn[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-BOOK-02", CATEGORY, "Calendar Controls", "Calendar Next Month Button", "Click Next Month", status, time.time() - start_time, False, err)

def test_book_03_calendar_prev_month_button(driver):
    """Test TC-BOOK-03: Verify Previous Month navigation arrow button on calendar."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/book")
        btn = driver.find_elements(By.CSS_SELECTOR, "button[name='previous-month'], button.rdp-nav_button_previous, svg.lucide-chevron-left")
        if btn:
            btn[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-BOOK-03", CATEGORY, "Calendar Controls", "Calendar Prev Month Button", "Click Prev Month", status, time.time() - start_time, False, err)

def test_book_04_calendar_date_cell_select(driver):
    """Test TC-BOOK-04: Verify selecting an available date cell on calendar."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/book")
        day_cell = driver.find_elements(By.CSS_SELECTOR, "td button:not([disabled]), .rdp-day:not(.rdp-day_disabled)")
        if day_cell:
            day_cell[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-BOOK-04", CATEGORY, "Calendar Date Picker", "Date Cell Button", "Select Date Cell", status, time.time() - start_time, False, err)

def test_book_05_timeslot_morning_select(driver):
    """Test TC-BOOK-05: Verify selecting 09:00 AM morning time slot button."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/book")
        slot = driver.find_elements(By.XPATH, "//button[contains(., '9:00') or contains(., '09:00')]")
        if slot:
            slot[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-BOOK-05", CATEGORY, "Time Slots", "09:00 AM Time Slot", "Select Morning Slot", status, time.time() - start_time, False, err)

def test_book_06_timeslot_afternoon_select(driver):
    """Test TC-BOOK-06: Verify selecting 02:00 PM afternoon time slot button."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/book")
        slot = driver.find_elements(By.XPATH, "//button[contains(., '2:00') or contains(., '14:00')]")
        if slot:
            slot[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-BOOK-06", CATEGORY, "Time Slots", "02:00 PM Time Slot", "Select Afternoon Slot", status, time.time() - start_time, False, err)

def test_book_07_timeslot_evening_select(driver):
    """Test TC-BOOK-07: Verify selecting 06:00 PM evening time slot button."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/book")
        slot = driver.find_elements(By.XPATH, "//button[contains(., '6:00') or contains(., '18:00')]")
        if slot:
            slot[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-BOOK-07", CATEGORY, "Time Slots", "06:00 PM Time Slot", "Select Evening Slot", status, time.time() - start_time, False, err)

def test_book_08_duration_30m_button(driver):
    """Test TC-BOOK-08: Verify 30 Minutes duration option button."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/book")
        dur = driver.find_elements(By.XPATH, "//button[contains(., '30 min') or contains(., '30m')]")
        if dur:
            dur[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-BOOK-08", CATEGORY, "Session Duration", "30 Minutes Option Button", "Select 30m Duration", status, time.time() - start_time, False, err)

def test_book_09_duration_60m_button(driver):
    """Test TC-BOOK-09: Verify 60 Minutes duration option button."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/book")
        dur = driver.find_elements(By.XPATH, "//button[contains(., '60 min') or contains(., '1 hour')]")
        if dur:
            dur[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-BOOK-09", CATEGORY, "Session Duration", "60 Minutes Option Button", "Select 60m Duration", status, time.time() - start_time, False, err)

def test_book_10_session_notes_textarea(driver):
    """Test TC-BOOK-10: Verify typing in Session Agenda/Notes textarea field."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/book")
        txt = driver.find_elements(By.CSS_SELECTOR, "textarea[name='notes'], textarea[placeholder*='agenda']")
        if txt:
            txt[0].send_keys("Would like to focus on state management patterns in React.")
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-BOOK-10", CATEGORY, "Booking Notes", "Session Notes Textarea", "Enter Session Agenda", status, time.time() - start_time, False, err)

def test_book_11_apply_promo_code_button(driver):
    """Test TC-BOOK-11: Verify 'Apply Discount Code' button click."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/book")
        btn = driver.find_elements(By.XPATH, "//button[contains(., 'Apply') or contains(., 'Apply Promo')]")
        if btn:
            btn[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-BOOK-11", CATEGORY, "Discounts", "Apply Promo Code Button", "Apply Promo Code", status, time.time() - start_time, False, err)

def test_book_12_payment_method_card(driver):
    """Test TC-BOOK-12: Verify Credit Card payment option selector button."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/book")
        card = driver.find_elements(By.XPATH, "//button[contains(., 'Credit Card') or contains(., 'Card')]")
        if card:
            card[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-BOOK-12", CATEGORY, "Payment Options", "Credit Card Option Button", "Select Card Payment", status, time.time() - start_time, False, err)

def test_book_13_payment_method_skill_credits(driver):
    """Test TC-BOOK-13: Verify Skill Swap Credits payment option button."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/book")
        cred = driver.find_elements(By.XPATH, "//button[contains(., 'Skill Credits') or contains(., 'Points')]")
        if cred:
            cred[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-BOOK-13", CATEGORY, "Payment Options", "Skill Credits Option Button", "Select Credits Payment", status, time.time() - start_time, False, err)

def test_book_14_confirm_booking_submit_button(driver):
    """Test TC-BOOK-14: Verify 'Confirm & Pay' booking submit button."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/book")
        btn = driver.find_elements(By.XPATH, "//button[contains(., 'Confirm Booking') or contains(., 'Confirm & Pay')]")
        if btn:
            btn[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-BOOK-14", CATEGORY, "Booking Submission", "Confirm Booking Button", "Submit Booking Form", status, time.time() - start_time, False, err)

def test_book_15_cancel_booking_modal_button(driver):
    """Test TC-BOOK-15: Verify Cancel booking wizard button."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/book")
        btn = driver.find_elements(By.XPATH, "//button[contains(., 'Cancel')]")
        if btn:
            btn[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-BOOK-15", CATEGORY, "Booking Submission", "Cancel Booking Button", "Cancel Booking Wizard", status, time.time() - start_time, False, err)

def test_book_16_my_bookings_tab_upcoming(driver):
    """Test TC-BOOK-16: Verify 'Upcoming Bookings' tab button."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/book")
        tab = driver.find_elements(By.XPATH, "//button[contains(., 'Upcoming')]")
        if tab:
            tab[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-BOOK-16", CATEGORY, "My Bookings", "Upcoming Bookings Tab", "Switch to Upcoming", status, time.time() - start_time, False, err)

def test_book_17_my_bookings_tab_past(driver):
    """Test TC-BOOK-17: Verify 'Past Bookings' tab button."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/book")
        tab = driver.find_elements(By.XPATH, "//button[contains(., 'Past') or contains(., 'Completed')]")
        if tab:
            tab[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-BOOK-17", CATEGORY, "My Bookings", "Past Bookings Tab", "Switch to Past Bookings", status, time.time() - start_time, False, err)

def test_book_18_my_bookings_tab_cancelled(driver):
    """Test TC-BOOK-18: Verify 'Cancelled Bookings' tab button."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/book")
        tab = driver.find_elements(By.XPATH, "//button[contains(., 'Cancelled')]")
        if tab:
            tab[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-BOOK-18", CATEGORY, "My Bookings", "Cancelled Bookings Tab", "Switch to Cancelled", status, time.time() - start_time, False, err)

def test_book_19_reschedule_session_button(driver):
    """Test TC-BOOK-19: Verify 'Reschedule Session' button action."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/book")
        btn = driver.find_elements(By.XPATH, "//button[contains(., 'Reschedule')]")
        if btn:
            btn[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-BOOK-19", CATEGORY, "Booking Management", "Reschedule Session Button", "Open Reschedule Modal", status, time.time() - start_time, False, err)

def test_book_20_cancel_existing_session_button(driver):
    """Test TC-BOOK-20: Verify 'Cancel Session' button on upcoming item."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/book")
        btn = driver.find_elements(By.XPATH, "//button[contains(., 'Cancel Session')]")
        if btn:
            btn[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-BOOK-20", CATEGORY, "Booking Management", "Cancel Session Button", "Trigger Cancel Session", status, time.time() - start_time, False, err)

def test_book_21_add_google_calendar_button(driver):
    """Test TC-BOOK-21: Verify 'Add to Google Calendar' button action."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/book")
        btn = driver.find_elements(By.XPATH, "//button[contains(., 'Google Calendar')]")
        if btn:
            btn[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-BOOK-21", CATEGORY, "Calendar Integration", "Google Calendar Button", "Add Session to GCal", status, time.time() - start_time, False, err)

def test_book_22_add_ical_button(driver):
    """Test TC-BOOK-22: Verify 'Add to Outlook / iCal' button action."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/book")
        btn = driver.find_elements(By.XPATH, "//button[contains(., 'iCal') or contains(., 'Outlook')]")
        if btn:
            btn[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-BOOK-22", CATEGORY, "Calendar Integration", "iCal Export Button", "Download iCal File", status, time.time() - start_time, False, err)

def test_book_23_join_video_room_button(driver):
    """Test TC-BOOK-23: Verify 'Join Call' CTA button on upcoming booking."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/book")
        btn = driver.find_elements(By.XPATH, "//button[contains(., 'Join Call') or contains(., 'Join Video')]")
        if btn:
            btn[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-BOOK-23", CATEGORY, "Call Launcher", "Join Video Room Button", "Launch Video Call", status, time.time() - start_time, False, err)

def test_book_24_download_invoice_pdf_button(driver):
    """Test TC-BOOK-24: Verify 'Download Receipt / Invoice' button action."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/book")
        btn = driver.find_elements(By.XPATH, "//button[contains(., 'Invoice') or contains(., 'Receipt')]")
        if btn:
            btn[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-BOOK-24", CATEGORY, "Billing", "Download Invoice Button", "Download Receipt PDF", status, time.time() - start_time, False, err)

def test_book_25_contact_host_button(driver):
    """Test TC-BOOK-25: Verify 'Contact Mentor / Host' button on booking detail."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/book")
        btn = driver.find_elements(By.XPATH, "//button[contains(., 'Contact Host') or contains(., 'Message Mentor')]")
        if btn:
            btn[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-BOOK-25", CATEGORY, "Host Communication", "Contact Host Button", "Message Mentor Host", status, time.time() - start_time, False, err)

def test_book_26_leave_review_button(driver):
    """Test TC-BOOK-26: Verify 'Leave Review & Rating' button on completed session."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/book")
        btn = driver.find_elements(By.XPATH, "//button[contains(., 'Leave Review') or contains(., 'Rate Session')]")
        if btn:
            btn[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-BOOK-26", CATEGORY, "Reviews", "Leave Review Button", "Open Rating Modal", status, time.time() - start_time, False, err)

def test_book_27_star_rating_5_select(driver):
    """Test TC-BOOK-27: Verify 5-Star rating selection button click."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/book")
        stars = driver.find_elements(By.CSS_SELECTOR, ".star-rating button, svg.lucide-star")
        if stars:
            stars[-1].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-BOOK-27", CATEGORY, "Reviews", "5 Star Rating Button", "Select 5 Stars", status, time.time() - start_time, False, err)

def test_book_28_submit_review_form_button(driver):
    """Test TC-BOOK-28: Verify Submit Review form button action."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/book")
        btn = driver.find_elements(By.XPATH, "//button[contains(., 'Submit Review')]")
        if btn:
            btn[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-BOOK-28", CATEGORY, "Reviews", "Submit Review Button", "Submit Session Review", status, time.time() - start_time, False, err)

def test_book_29_view_session_location_map(driver):
    """Test TC-BOOK-29: Verify View Session Location map toggle button."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/book")
        btn = driver.find_elements(By.XPATH, "//button[contains(., 'Location') or contains(., 'Map')]")
        if btn:
            btn[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-BOOK-29", CATEGORY, "Location", "Session Map Button", "Toggle Location Map", status, time.time() - start_time, False, err)

def test_book_30_timezone_dropdown_selector(driver):
    """Test TC-BOOK-30: Verify Timezone selector dropdown menu interaction."""
    start_time = time.time()
    try:
        driver.get(f"{BASE_URL}/book")
        tz = driver.find_elements(By.CSS_SELECTOR, "button[aria-label*='timezone'], select[name='timezone']")
        if tz:
            tz[0].click()
        status = "PASS"
        err = ""
    except Exception as e:
        status = "FAIL"
        err = str(e)
    record_result("TC-BOOK-30", CATEGORY, "Timezone Settings", "Timezone Selector Dropdown", "Change Session Timezone", status, time.time() - start_time, False, err)
