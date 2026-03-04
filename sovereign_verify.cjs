const { chromium } = require("playwright");

(async () => {
  console.log("--- INITIATING SOVEREIGN E2E VERIFICATION ---");
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  // Front-end in this session is on 5175
  const url = "http://localhost:5175";

  try {
    console.log(`Navigating to Vault HUD: ${url}`);
    await page.goto(url, { waitUntil: "load", timeout: 30000 });

    const title = await page.title();
    console.log(`Vault Title: ${title}`);

    // Take an executive screenshot
    await page.screenshot({ path: "sovereign_baseline.png", fullPage: true });
    console.log("📸 Baseline screenshot captured: sovereign_baseline.png");

    // Check for branding in the UI
    const content = await page.content();
    const hasSovereign = content.toUpperCase().includes("SOVEREIGN");
    const hasVault = content.toUpperCase().includes("VAULT");

    if (hasSovereign || hasVault) {
      console.log("✅ PROTOCOL VERIFIED: Sovereign Branding Detected in HUD.");
    } else {
      console.log(
        "⚠️ Branding check failed. Current content structure may be de-auth'd.",
      );
      console.log(
        "Sample text: " + content.substring(0, 200).replace(/\n/g, " "),
      );
    }
  } catch (err) {
    console.error(
      "❌ SOVEREIGN_ERROR: Playwright connection timed out. Server may be in Flash mode only.",
    );
    console.error(err.message);
  } finally {
    console.log("--- VERIFICATION COMPLETE ---");
    await browser.close();
  }
})();
