const { chromium } = require("playwright"),
  { spawn } = require("child_process"),
  fs = require("fs"),
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
        "5191",
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
        if ((await fetch("http://127.0.0.1:5191/")).ok) break;
      } catch {}
      await new Promise((r) => setTimeout(r, 200));
    }
    fs.mkdirSync("/downloads/felix-json-catalog", { recursive: true });
    for (const theme of ["light", "dark"]) {
      const p = await browser.newPage({
          viewport: { width: 390, height: 1000 },
          reducedMotion: "reduce",
        }),
        errors = [];
      p.on("pageerror", (e) => errors.push(e.message));
      await p.addInitScript(
        (t) => localStorage.setItem("felix-theme", t),
        theme,
      );
      await p.goto("http://127.0.0.1:5191/felix/components/charts");
      await p.locator(".fj-chart").first().waitFor();
      await p.addStyleTag({
        content: ".VPLocalNav{visibility:hidden!important}",
      });
      const charts = p.locator(".fj-chart");
      assert.equal(await charts.count(), 63);
      for (let i = 0; i < (await charts.count()); i++) {
        const c = charts.nth(i);
        await c.locator("svg").waitFor();
        await c.screenshot({
          path: `/downloads/felix-json-catalog/${String(i).padStart(2, "0")}-${theme}.png`,
          animations: "disabled",
        });
        assert(
          (await c.locator("svg [tabindex]").count()) ||
            (await c.locator("svg text").count()),
        );
        assert.equal(await c.getByRole("alert").count(), 0);
      }
      assert.deepEqual(errors, []);
      console.log("PASS63catalogscreens", theme);
      await p.close();
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
