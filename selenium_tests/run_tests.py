import os
import sys
import time
import pytest
from selenium_tests.conftest import TEST_RESULTS
from selenium_tests.generate_report import generate_excel_analysis_report
from selenium_tests.config import EXCEL_REPORT_PATH, BASE_URL

def run_all_selenium_tests():
    """
    Main entry point for executing the entire 340-test-case Selenium E2E suite
    and outputting the Excel analysis report.
    """
    print("=" * 80)
    print(" SELENIUM END-TO-END AUTOMATED TEST SUITE RUNNER")
    print(f" Target Base URL: {BASE_URL}")
    print("=" * 80)
    
    suite_dir = os.path.join(os.path.dirname(__file__), "test_suites")
    
    start_time = time.time()
    
    # Run pytest programmatically on the test_suites directory
    exit_code = pytest.main([
        suite_dir,
        "-v",
        "--tb=short"
    ])
    
    total_time = round(time.time() - start_time, 2)
    
    print("\n" + "=" * 80)
    print(" TEST EXECUTION COMPLETE - GENERATING EXCEL REPORT")
    print("=" * 80)
    
    report_file = generate_excel_analysis_report(TEST_RESULTS, output_path=EXCEL_REPORT_PATH)
    
    total_count = len(TEST_RESULTS)
    pass_count = sum(1 for r in TEST_RESULTS if r["Status"] == "PASS")
    fail_count = sum(1 for r in TEST_RESULTS if r["Status"] == "FAIL")
    pass_rate = round((pass_count / total_count * 100), 1) if total_count > 0 else 0.0
    multi_tab_count = sum(1 for r in TEST_RESULTS if r.get("Is_Multi_Tab") == "YES")
    
    print("\n" + "#" * 80)
    print(f" FINAL TEST EXECUTION SUMMARY:")
    print(f"  - Total Test Cases Executed : {total_count}")
    print(f"  - Total Passed              : {pass_count}")
    print(f"  - Total Failed              : {fail_count}")
    print(f"  - Success Pass Rate         : {pass_rate}%")
    print(f"  - Multi-Tab Verified        : {multi_tab_count}")
    print(f"  - Total Duration            : {total_time} seconds")
    print(f"  - Excel Analysis Report     : {report_file}")
    print("#" * 80 + "\n")
    
    return exit_code

if __name__ == "__main__":
    sys.exit(run_all_selenium_tests())
