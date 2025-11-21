import os
import json
import time
import traceback
import random
import string
from typing import Tuple
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions

SERVICE_HOST = os.getenv('SERVICE_HOST', 'http://nginx')

def run_chrome():
    chrome_options = Options()
    chrome_options.binary_location = "/usr/bin/chromium"
    chrome_options.add_argument("--headless")
    chrome_options.add_argument("--disable-dev-shm-usage")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-setuid-sandbox")
    chrome_options.add_argument("--disable-gpu")
    chrome_options.add_argument("--no-gpu")
    chrome_options.add_argument("--disable-default-apps")
    chrome_options.add_argument("--disable-translate")
    chrome_options.add_argument("--disable-device-discovery-notifications")
    chrome_options.add_argument("--disable-software-rasterizer")
    chrome_options.add_argument("--disable-xss-auditor")
    chrome_options.set_capability("unhandledPromptBehavior", "accept") 
    chrome_options.add_argument("--user-data-dir=/home/bot/data/")
    chrome_options.set_capability("acceptInsecureCerts", True)

    return webdriver.Chrome(options=chrome_options)

def load_credentials() -> dict:
    try:
        with open('credentials.json', 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        return {}

def save_credentials(credentials: dict) -> None:
    with open('credentials.json', 'w') as f:
        return json.dump(credentials, f)

def randstr(length: int) -> str:
    return ''.join(random.choices(string.ascii_letters + string.digits, k=length))

def register(driver) -> Tuple[str, str]:
    username = f"admin_{randstr(8)}"
    password = randstr(16)
    save_credentials({'username': username, 'password': password})

    try:
        driver.get(SERVICE_HOST)
        time.sleep(2)

        register_tab = WebDriverWait(driver, 10).until(
            expected_conditions.element_to_be_clickable((By.XPATH, "//button[contains(text(), 'Daftar')]"))
        )
        register_tab.click()
        time.sleep(1)

        username_field = WebDriverWait(driver, 10).until(
            expected_conditions.presence_of_element_located((By.ID, "username"))
        )
        password_field = driver.find_element(By.ID, "password")

        username_field.clear()
        username_field.send_keys(username)
        password_field.clear()
        password_field.send_keys(password)

        register_btn = driver.find_element(By.XPATH, "//button[contains(text(), 'Buat Akun')]")
        register_btn.click()

        WebDriverWait(driver, 10).until(
            lambda x: "dashboard" in x.current_url.lower()
        )
        time.sleep(2)

        create_post_btn = WebDriverWait(driver, 10).until(
            expected_conditions.element_to_be_clickable((By.XPATH, "//button[.//span[text()='Post Baru']]"))
        )
        create_post_btn.click()
        time.sleep(1)

        with open('flag.txt', 'r') as f:
            flag = f.read().strip()

        post_textarea = WebDriverWait(driver, 10).until(
            expected_conditions.presence_of_element_located((By.TAG_NAME, "textarea"))
        )
        post_textarea.clear()
        post_textarea.send_keys(f"{flag}")
        
        private_checkbox = driver.find_element(By.XPATH, "//input[@type='checkbox']")
        if not private_checkbox.is_selected():
            private_checkbox.click()

        publish_btn = driver.find_element(By.XPATH, "//button[.//span[text()='Kirim']]")
        publish_btn.click()
        time.sleep(2)

        return username, password

    except Exception as e:
        raise Exception(f"Registration failed: {str(e)}")

def login(driver, credentials: dict):
    try:
        driver.get(SERVICE_HOST)
        time.sleep(1)
        
        if "dashboard" in driver.current_url.lower():
            return True

        username_field = WebDriverWait(driver, 10).until(
            expected_conditions.presence_of_element_located((By.ID, "username"))
        )
        password_field = driver.find_element(By.ID, "password")

        username_field.clear()
        username_field.send_keys(credentials['username'])
        password_field.clear()
        password_field.send_keys(credentials['password'])

        login_btn = driver.find_element(By.XPATH, "//button[contains(text(), 'Login')]")
        login_btn.click()

        WebDriverWait(driver, 10).until(
            lambda x: "dashboard" in x.current_url.lower()
        )

        return True

    except Exception as e:
        print(f"Login failed: {str(e)}")
        return False

def browse_post(driver, url: str) -> None:
    try:
        driver.get(url)
        time.sleep(3)

        driver.execute_script("window.scrollTo(0, document.body.scrollHeight/2);")
        time.sleep(1)
        driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
        time.sleep(2)
        driver.execute_script("window.scrollTo(0, 0);")
        time.sleep(2)

    except Exception as e:
        print(f"Error browsing post: {str(e)}")

def init() -> None:
    import chromedriver_autoinstaller as ca
    ca.install()

    driver = run_chrome()
    try:
        username, password = register(driver)
        save_credentials({'username': username, 'password': password})
        print(f"Bot initialized with admin user: {username}")
    except Exception as e:
        print(f"Initialization failed: {str(e)}")
    finally:
        driver.quit()

def visit(url: str) -> Tuple[bool, str]:
    valid_prefixes = [
        f"{SERVICE_HOST}/posts/"  
        # f"{SERVICE_HOST}/#/posts/",  # Hash routing
    ]
    
    if not any(url.startswith(prefix) for prefix in valid_prefixes):
        return False, "Invalid URL - only local posts allowed"

    driver = None
    try:
        driver = run_chrome()
        credentials = load_credentials()

        if not credentials:
            print("No credentials found, initializing...")
            driver.quit()
            init()
            driver = run_chrome()
            credentials = load_credentials()

        if not login(driver, credentials):
            print("Login failed, re-registering...")
            username, password = register(driver)
            save_credentials({'username': username, 'password': password})

        browse_post(driver, url)
        
        return True, "Admin has reviewed the post successfully!"

    except Exception as e:
        error_msg = f"Bot failed: {str(e)}\n{traceback.format_exc()}"
        print(error_msg)
        return False, "Admin review failed"
    finally:
        if driver:
            driver.quit()

if __name__ == "__main__":
    init()