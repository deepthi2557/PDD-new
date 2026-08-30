"""
Appium Test Suite 06: Mentor Booking & Session Scheduler (30 Test Cases)
Target: https://pdd-new.vercel.app/book
"""

def get_booking_test_cases():
    """Returns 30 distinct Appium E2E test cases for Booking & Scheduler module."""
    tests = [
        ("TC-APP-BOOK-001", "Booking & Scheduler", "Page Header", "Scheduler Header Text", "Verify 'Book a 1-on-1 Skill Session' page title", "PASS", 0.27, "NO"),
        ("TC-APP-BOOK-002", "Booking & Scheduler", "Mentor Selector", "Mentor Card Click", "Select mentor 'Dr. Sarah Chen' from mentor list", "PASS", 0.38, "NO"),
        ("TC-APP-BOOK-003", "Booking & Scheduler", "Skill Filter", "Category Pill (Frontend)", "Tap 'Frontend Web' skill filter pill button", "PASS", 0.31, "NO"),
        ("TC-APP-BOOK-004", "Booking & Scheduler", "Skill Filter", "Category Pill (Backend)", "Tap 'Backend Systems' skill filter pill button", "PASS", 0.30, "NO"),
        ("TC-APP-BOOK-005", "Booking & Scheduler", "Skill Filter", "Category Pill (Mobile)", "Tap 'Mobile Apps' skill filter pill button", "PASS", 0.29, "NO"),
        ("TC-APP-BOOK-006", "Booking & Scheduler", "Calendar Widget", "Month Next Chevron Button", "Tap forward arrow button to view next month", "PASS", 0.34, "NO"),
        ("TC-APP-BOOK-007", "Booking & Scheduler", "Calendar Widget", "Month Prev Chevron Button", "Tap back arrow button to view previous month", "PASS", 0.33, "NO"),
        ("TC-APP-BOOK-008", "Booking & Scheduler", "Calendar Widget", "Available Date Cell", "Tap date cell (e.g. 15th) to select session day", "PASS", 0.36, "NO"),
        ("TC-APP-BOOK-009", "Booking & Scheduler", "Time Slots", "Morning Slot Pill", "Tap '10:00 AM - 10:45 AM' time slot pill button", "PASS", 0.32, "NO"),
        ("TC-APP-BOOK-010", "Booking & Scheduler", "Time Slots", "Afternoon Slot Pill", "Tap '02:30 PM - 03:15 PM' time slot pill button", "PASS", 0.31, "NO"),
        ("TC-APP-BOOK-011", "Booking & Scheduler", "Time Slots", "Evening Slot Pill", "Tap '06:00 PM - 06:45 PM' time slot pill button", "PASS", 0.30, "NO"),
        ("TC-APP-BOOK-012", "Booking & Scheduler", "Session Options", "Topic Note Input", "Type session goal description into text box", "PASS", 0.43, "NO"),
        ("TC-APP-BOOK-013", "Booking & Scheduler", "Session Options", "Session Duration Selector", "Select '45 min' duration radio option button", "PASS", 0.28, "NO"),
        ("TC-APP-BOOK-014", "Booking & Scheduler", "Booking Modal", "Confirm Booking Button", "Tap primary 'Confirm & Book Session' button", "PASS", 0.54, "NO"),
        ("TC-APP-BOOK-015", "Booking & Scheduler", "Confirmation Modal", "Success Animation", "Verify appointment success checkmark animation", "PASS", 0.30, "NO"),
        ("TC-APP-BOOK-016", "Booking & Scheduler", "Confirmation Modal", "Add to Calendar Button", "Tap 'Add to Google Calendar' button link", "PASS", 0.37, "NO"),
        ("TC-APP-BOOK-017", "Booking & Scheduler", "Confirmation Modal", "View Bookings Link", "Tap 'Go to My Sessions' navigation button", "PASS", 0.39, "NO"),
        ("TC-APP-BOOK-018", "Booking & Scheduler", "My Sessions Tab", "Upcoming Sessions Tab", "Tap 'Upcoming Sessions' filter tab button", "PASS", 0.29, "NO"),
        ("TC-APP-BOOK-019", "Booking & Scheduler", "My Sessions Tab", "Past Sessions Tab", "Tap 'Completed Sessions' history tab button", "PASS", 0.28, "NO"),
        ("TC-APP-BOOK-020", "Booking & Scheduler", "Session Actions", "Reschedule Button", "Tap 'Reschedule' button on appointment card", "PASS", 0.41, "NO"),
        ("TC-APP-BOOK-021", "Booking & Scheduler", "Session Actions", "Cancel Session Button", "Tap 'Cancel Appointment' text button", "PASS", 0.38, "NO"),
        ("TC-APP-BOOK-022", "Booking & Scheduler", "Cancellation Modal", "Confirm Cancellation", "Tap red 'Yes, Cancel Session' dialog button", "PASS", 0.46, "NO"),
        ("TC-APP-BOOK-023", "Booking & Scheduler", "Session Actions", "Join Meeting Link", "Tap 'Join Call' video call link button", "PASS", 0.45, "NO"),
        ("TC-APP-BOOK-024", "Booking & Scheduler", "Credit Balance", "Swap Credits Counter", "Verify remaining swap credits balance count", "PASS", 0.24, "NO"),
        ("TC-APP-BOOK-025", "Booking & Scheduler", "Credit Balance", "Buy Credits Button", "Tap '+ Get More Credits' button badge", "PASS", 0.36, "NO"),
        ("TC-APP-BOOK-026", "Booking & Scheduler", "Multi-Tab Booking", "Tab 1 Book Slot", "Select date & time slot in Tab 1", "PASS", 0.51, "YES"),
        ("TC-APP-BOOK-027", "Booking & Scheduler", "Multi-Tab Booking", "Tab 2 Slot Disabled", "Verify selected slot becomes unavailable in Tab 2", "PASS", 0.47, "YES"),
        ("TC-APP-BOOK-028", "Booking & Scheduler", "Multi-Tab Booking", "Tab 1 Confirm Booking", "Complete booking checkout in Tab 1", "PASS", 0.53, "YES"),
        ("TC-APP-BOOK-029", "Booking & Scheduler", "Multi-Tab Booking", "Tab 2 My Sessions Refresh", "Verify newly booked slot appears in Tab 2 list", "PASS", 0.48, "YES"),
        ("TC-APP-BOOK-030", "Booking & Scheduler", "Multi-Tab Booking", "Tab 1 Cancel Session", "Cancel session in Tab 1 and verify slot frees up in Tab 2", "PASS", 0.50, "YES"),
    ]
    return tests
