import unittest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

class PortfolioTest(unittest.TestCase):
    def setUp(self):
        # Using Chrome, but you can change this to Firefox or Edge if needed
        options = webdriver.ChromeOptions()
        # options.add_argument('--headless') # Uncomment to run in headless mode
        self.driver = webdriver.Chrome(options=options)
        self.driver.get("https://naga9911.github.io/protifilo/")
        self.driver.maximize_window()
        self.wait = WebDriverWait(self.driver, 10)

    def test_page_title(self):
        """Test if the page title is correct"""
        expected_title = "Nagababu Irrinki | Test Engineer & DevOps Learner Portfolio"
        self.assertIn("Nagababu", self.driver.title)

    def test_navigation_links(self):
        """Test if main navigation links are present and working"""
        # Define the links to test
        nav_items = [
            ("Home", "home"),
            ("Experience", "experience"),
            ("Skills", "skills"),
            ("DevOps Journey", "devops")
        ]

        for text, section_id in nav_items:
            # Find the navigation link (using XPath to find link with specific text)
            link = self.wait.until(EC.element_to_be_clickable((By.XPATH, f"//a[contains(text(), '{text}')]")))
            
            # Click the link
            link.click()
            time.sleep(1) # Wait for smooth scroll
            
            # Check if URL hash updated correctly
            self.assertIn(f"#{section_id}", self.driver.current_url)

    def test_home_section(self):
        """Test if home section content is visible"""
        home_section = self.wait.until(EC.visibility_of_element_located((By.ID, "home")))
        
        # Check for main heading
        heading = self.driver.find_element(By.XPATH, "//h1[contains(., 'Test Engineer')]")
        self.assertTrue(heading.is_displayed())
        
        # Check 'View My Work' button
        view_work_btn = self.driver.find_element(By.XPATH, "//a[contains(text(), 'View My Work')]")
        self.assertEqual(view_work_btn.get_attribute("href"), "https://naga9911.github.io/protifilo/#experience")

    def test_experience_section(self):
        """Test if experience section is present"""
        # Navigate to experience
        self.driver.get("https://naga9911.github.io/protifilo/#experience")
        time.sleep(1)
        
        # Check for the section heading
        heading = self.driver.find_element(By.XPATH, "//h2[contains(text(), 'Professional Experience')]")
        self.assertTrue(heading.is_displayed())
        
        # Check for job title
        job_title = self.driver.find_element(By.XPATH, "//h3[contains(text(), 'Test Engineer | Changepond Technologies')]")
        self.assertTrue(job_title.is_displayed())

    def test_skills_section(self):
        """Test if skills section contains expected technical skills"""
        self.driver.get("https://naga9911.github.io/protifilo/#skills")
        time.sleep(1)
        
        # Check main skills headings
        expected_skills = ["Manual & Automation Testing", "Defect Management", "Agile Methodologies"]
        for skill in expected_skills:
            element = self.driver.find_element(By.XPATH, f"//h3[contains(text(), '{skill}')]")
            self.assertTrue(element.is_displayed())

    def test_footer_links(self):
        """Test if footer social links are correct"""
        # Scroll to bottom
        self.driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
        time.sleep(1)
        
        # Check LinkedIn link
        linkedin = self.driver.find_element(By.XPATH, "//a[contains(@href, 'linkedin.com')]")
        self.assertEqual(linkedin.get_attribute("href"), "https://www.linkedin.com/in/nagababu-irrinki-13801a3b0/")
        
        # Check GitHub link
        github = self.driver.find_element(By.XPATH, "//a[contains(@href, 'github.com/naga9911')]")
        self.assertEqual(github.get_attribute("href"), "https://github.com/naga9911")
        
        # Check Email link
        email = self.driver.find_element(By.XPATH, "//a[contains(@href, 'mailto:')]")
        self.assertEqual(email.get_attribute("href"), "mailto:nagababui.urs@gmail.com")

    def tearDown(self):
        self.driver.quit()

if __name__ == "__main__":
    unittest.main()
