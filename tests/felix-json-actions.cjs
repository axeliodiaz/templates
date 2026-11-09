const { chromium } = require("playwright"),
  { spawn } = require("child_process"),
  assert = require("assert/strict");
(async () => {
  const server = spawn(
      "node",
      [
        "node_modules/vitepress/bin/vitepress.js",
        "preview",
        "--host",
        "127.0.0.1",
        "--port",
        "5196",
      ],
      { stdio: "ignore" },
    ),
    browser = await chromium.launch({
      executablePath: "/usr/bin/google-chrome",
      args: ["--no-sandbox"],
    });
  try {
    for (let i = 0; i < 60; i++) {
      try {
        if ((await fetch("http://127.0.0.1:5196/")).ok) break;
      } catch {}
      await new Promise((r) => setTimeout(r, 200));
    }
    for (const theme of ["light", "dark"]) {
      const p = await browser.newPage({
        viewport: { width: 390, height: 1000 },
        reducedMotion: "reduce",
      });
      await p.addInitScript(
        (t) => localStorage.setItem("felix-theme", t),
        theme,
      );
      p.setDefaultTimeout(5000);
      p.on("pageerror", (e) => console.log("PAGEERROR", e.message));
      await p.goto("http://127.0.0.1:5196/felix/components/charts");
      await p.addStyleTag({
        content: ".VPLocalNav{visibility:hidden!important}",
      });
      let c = p.locator(".fj-chart").nth(56);
      await c
        .getByRole("button", { name: "Complete Check locally", exact: true })
        .click();
      await c
        .getByRole("button", { name: "Complete Build locally", exact: true })
        .waitFor();
      await c.getByRole("tab", { name: "Example", exact: true }).click();
      await c.getByText("Edit local source data JSON", { exact: true }).click();
      const sources = JSON.parse(
        await c
          .getByLabel("Source registry with headers and rows")
          .inputValue(),
      );
      assert.equal(Object.values(sources)[0].rows[1][3], "Done");
      await c.getByRole("tab", { name: "Preview", exact: true }).click();
      await c.screenshot({
        path: `/downloads/felix-json-proof/dependency-actions-${theme}.png`,
        animations: "disabled",
      });
      await c
        .getByRole("button", { name: "Reset local graph", exact: true })
        .click();
      await c
        .getByRole("button", { name: "Complete Check locally", exact: true })
        .waitFor();
      c = p.locator(".fj-chart").nth(55);
      await c.getByRole("button", { name: "Water", exact: true }).click();
      assert.equal(
        await c
          .getByRole("button", { name: "Water", exact: true })
          .getAttribute("aria-pressed"),
        "true",
      );
      await c.getByRole("tab", { name: "Spec", exact: true }).click();
      assert.match(await c.locator(".fj-spec").innerText(), /Water/);
      await c.getByRole("tab", { name: "Preview", exact: true }).click();
      await c.screenshot({
        path: `/downloads/felix-json-proof/series-actions-${theme}.png`,
        animations: "disabled",
      });
      await p.close();
      console.log(
        "PASS graph complete/unlock/reset,source-editor parity,series selection/spec parity",
        theme,
      );
    }
  } finally {
    await browser.close();
    server.kill();
    await new Promise((r) => server.once("exit", r));
  }
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
