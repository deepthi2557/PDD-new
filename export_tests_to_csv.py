import os
import csv
import openpyxl

def export_test_actions_to_csv():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    sel_path = os.path.join(base_dir, 'selenium_tests', 'selenium_test_analysis_report.xlsx')
    app_path = os.path.join(base_dir, 'appium_test_suite', 'appium_test_analysis_report.xlsx')

    sel_csv_file = os.path.join(base_dir, 'selenium_tested_actions.csv')
    app_csv_file = os.path.join(base_dir, 'appium_tested_actions.csv')
    combined_csv_file = os.path.join(base_dir, 'selenium_and_appium_tested_actions.csv')

    sel_data = []
    if os.path.exists(sel_path):
        wb_sel = openpyxl.load_workbook(sel_path, data_only=True)
        ws_sel = wb_sel['Detailed Test Results']
        headers = [cell.value for cell in ws_sel[1]]
        for row in ws_sel.iter_rows(min_row=2, values_only=True):
            if row[0]:
                sel_data.append(row)
        
        # Write Selenium CSV
        with open(sel_csv_file, mode='w', newline='', encoding='utf-8-sig') as f:
            writer = csv.writer(f)
            writer.writerow(headers)
            for row in sel_data:
                writer.writerow(row)
        print(f"[OK] Exported {len(sel_data)} Selenium actions to: {sel_csv_file}")

    app_data = []
    if os.path.exists(app_path):
        wb_app = openpyxl.load_workbook(app_path, data_only=True)
        ws_app = wb_app['Detailed Test Results']
        headers = [cell.value for cell in ws_app[1]]
        for row in ws_app.iter_rows(min_row=2, values_only=True):
            if row[0]:
                app_data.append(row)

        # Write Appium CSV
        with open(app_csv_file, mode='w', newline='', encoding='utf-8-sig') as f:
            writer = csv.writer(f)
            writer.writerow(headers)
            for row in app_data:
                writer.writerow(row)
        print(f"[OK] Exported {len(app_data)} Appium actions to: {app_csv_file}")

    # Write Combined CSV
    combined_headers = ['Test Suite', 'Test Case ID', 'Category', 'Feature Name', 'Button / Target Element', 'Action Tested', 'Status', 'Duration (s)', 'Multi-Tab Verified', 'Error Details']
    with open(combined_csv_file, mode='w', newline='', encoding='utf-8-sig') as f:
        writer = csv.writer(f)
        writer.writerow(combined_headers)
        
        for r in sel_data:
            writer.writerow(['Selenium Web', r[0], r[1], r[2], r[3], r[4], r[5], r[6], r[7], r[8] if len(r) > 8 else ""])
        
        for r in app_data:
            writer.writerow(['Appium Mobile', r[0], r[1], r[2], r[3], r[4], r[5], r[6], r[7], r[8] if len(r) > 8 else ""])

    print(f"[OK] Exported {len(sel_data) + len(app_data)} Combined actions to: {combined_csv_file}")

if __name__ == '__main__':
    export_test_actions_to_csv()

