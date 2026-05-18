from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()
    
    # Capture console logs
    page.on("console", lambda msg: print(f"Console {msg.type}: {msg.text}"))
    page.on("pageerror", lambda err: print(f"Page Error: {err}"))
    
    try:
        response = page.goto('http://localhost:3000', wait_until='networkidle')
        print(f"Status: {response.status}")
        
        # also print text content of body in case it's a Next.js error overlay
        print(page.locator("body").text_content()[:1000])
    except Exception as e:
        print(f"Failed to load: {e}")
        
    browser.close()
