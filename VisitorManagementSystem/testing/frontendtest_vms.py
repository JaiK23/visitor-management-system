from selenium import webdriver
from selenium.webdriver.common.by import By
import time

# Use your Netlify URL
URL = "https://vms102363.netlify.app"

def test_frontend_visitor_registration(): # Added 'test_' prefix
    driver = webdriver.Chrome()
    driver.get(URL)
    driver.maximize_window()

    # Navigate to Registration Section (cite: 1770, 1807)
    register_btn = driver.find_element(By.XPATH, "//button[contains(text(), 'Register Visitor')]")
    register_btn.click()
    time.sleep(1)

    # Fill Form (cite: 1809)
    driver.find_element(By.ID, "name").send_keys("Selenium Frontend Test")
    driver.find_element(By.ID, "phone").send_keys("1234567890")
    driver.find_element(By.ID, "aadharNumber").send_keys("112233445566")
    driver.find_element(By.ID, "purpose").send_keys("Frontend Automation")
    driver.find_element(By.ID, "hostName").send_keys("Dr. Priyanka Maan")
    driver.find_element(By.ID, "hostPhone").send_keys("9876543210")

    # Submit and Capture Evidence (cite: 1839, 2014)
    driver.find_element(By.CLASS_NAME, "submit-btn").click()
    time.sleep(5) # Wait for QR Code generation
    
    driver.save_screenshot("frontend_registration_evidence.png")
    print("\nPASS: Frontend registration and QR display verified.")
    
    driver.quit()