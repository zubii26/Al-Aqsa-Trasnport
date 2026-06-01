const puppeteer = require('puppeteer');

(async () => {
    try {
        console.log("Launching browser...");
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        
        page.on('console', msg => {
            console.log(`[BROWSER CONSOLE] ${msg.type().toUpperCase()}: ${msg.text()}`);
        });

        page.on('pageerror', error => {
            console.log(`[PAGE ERROR]: ${error.message}`);
        });

        page.on('requestfailed', request => {
            console.log(`[REQUEST FAILED]: ${request.url()} - ${request.failure()?.errorText}`);
        });

        console.log("Navigating to http://localhost:3000...");
        const response = await page.goto('http://localhost:3000', { waitUntil: 'networkidle0', timeout: 30000 });
        
        console.log(`Response Status: ${response.status()}`);
        
        // Let it run for a bit to catch delayed hydration errors
        await new Promise(r => setTimeout(r, 5000));
        
        // Take a screenshot to see what it actually looks like
        await page.screenshot({ path: 'debug-screenshot.png' });
        console.log("Saved debug-screenshot.png");
        
        await browser.close();
    } catch (e) {
        console.error("Script Error:", e);
    }
})();
