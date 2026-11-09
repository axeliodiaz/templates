const { chromium } = require("playwright"),
  { spawn, execFileSync } = require("child_process"),
  fs = require("fs"),
  assert = require("assert/strict");
const manifest = require("./felix-charts-manifest.json");
const PORT = process.env.PORT || "5190";
(async () => {
  const server = spawn(
      "node",
      [
        "node_modules/vitepress/bin/vitepress.js",
        "preview",
        "--host",
        "127.0.0.1",
        "--port",
        PORT,
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
        if ((await fetch("http://127.0.0.1:" + PORT + "/")).ok) break;
      } catch {}
      await new Promise((r) => setTimeout(r, 200));
    }
    fs.mkdirSync("/downloads/felix-json-proof", { recursive: true });
    let count = 0;
    for (const width of process.env.WIDTH ? [+process.env.WIDTH] : [390, 1440])
      for (const theme of ["light", "dark"]) {
        const p = await browser.newPage({
          viewport: { width, height: 1000 },
          reducedMotion: "reduce",
        });
        let errors = [];
        p.on("pageerror", (e) => errors.push(e.message));
        await p.addInitScript(
          (t) => localStorage.setItem("felix-theme", t),
          theme,
        );
        for (const item of manifest) {
          await p.goto("http://127.0.0.1:" + PORT + item.route);
          await p.locator(".fj-plot").waitFor();
          assert.equal(
            await p.locator(".fj-chart [role=alert]").count(),
            0,
            item.slug,
          );
          assert(
            await p.evaluate(
              () => document.documentElement.scrollWidth <= innerWidth,
            ),
            item.slug + " overflow",
          );
          const chart = p.locator(".fj-chart");
          await chart.getByRole("tab", { name: "Spec", exact: true }).click();
          const spec = JSON.parse(
            await chart.locator(".fj-spec code").last().innerText(),
          );
          assert(spec.component && spec.data.source);
          assert(!("values" in spec.data));
          await chart.getByRole("tab", { name: "Spec", exact: true }).focus();
          await chart
            .getByRole("tab", { name: "Spec", exact: true })
            .press("ArrowRight");
          assert.equal(
            await chart
              .getByRole("tab", { name: "Example", exact: true })
              .getAttribute("aria-selected"),
            "true",
          );
          const input = chart.getByLabel("Chart spec JSON");
          const valid = await input.inputValue();
          await input.fill("{broken");
          await chart
            .getByRole("button", { name: "Render JSON", exact: true })
            .click();
          await chart.getByRole("alert").waitFor();
          assert.match(
            await chart.getByRole("alert").innerText(),
            /last valid preview/,
          );
          await input.fill(valid);
          await chart
            .getByRole("button", { name: "Render JSON", exact: true })
            .click();
          await chart.locator(".fj-plot").waitFor();
          await chart
            .getByRole("button", { name: "Data view", exact: true })
            .click();
          assert(await chart.locator("tbody tr").count());
          await chart.locator("tbody tr").first().focus();
          assert((await chart.getByRole("status").innerText()).includes(":"));
          await chart
            .getByRole("button", { name: "Chart view", exact: true })
            .click();
          await chart.getByLabel("Data state").selectOption("empty");
          assert.match(await chart.getByRole("status").innerText(), /No data/);
          await chart.getByLabel("Data state").selectOption("ready");
          await chart.locator("svg").waitFor();
          const mark = chart.locator("svg [tabindex]").first();
          if (await mark.count()) {
            await mark.focus();
            await mark.press("Enter");
            assert((await chart.getByRole("status").innerText()).length > 0);
          }
          await chart.scrollIntoViewIfNeeded();
          await chart.screenshot({
            animations: "disabled",
            path: `/downloads/felix-json-proof/${item.slug}-${width}-${theme}.png`,
          });
          assert.deepEqual(errors, [], item.slug);
          count++;
          console.log("PASS", item.slug, width, theme);
        }
        await p.goto("http://127.0.0.1:" + PORT + "/felix/components/charts");
        await p.locator(".fj-chart").first().waitFor();
        assert.equal(await p.locator(".fj-chart").count(), 63);
        assert.equal(await p.locator(".fj-chart [role=alert]").count(), 0);
        assert(
          await p.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth,
          ),
          "catalog overflow",
        );
        const anchors = await p.locator("[id^=mono-]").count();
        assert.equal(anchors, 38);
        await p.close();
      }
    console.log(
      "PASS",
      count,
      "route/viewport/theme playground+invalidJSON+data+state cases;catalog63previews38legacyanchors",
    );
    // Preview must actually follow source edits, component changes, filters and options.
    const p = await browser.newPage({
      viewport: { width: 390, height: 1000 },
      reducedMotion: "reduce",
    });
    await p.goto("http://127.0.0.1:" + PORT + "/felix/components/bar-chart");
    const chart = p.locator(".fj-chart");
    await chart.locator(".fj-plot").waitFor();
    const before = await chart
      .locator("svg rect")
      .first()
      .getAttribute("width");
    await chart.getByRole("tab", { name: "Example", exact: true }).click();
    await chart
      .getByText("Edit local source data JSON", { exact: true })
      .click();
    const sourceInput = chart.getByLabel(
        "Source registry with headers and rows",
      ),
      sources = JSON.parse(await sourceInput.inputValue()),
      id = Object.keys(sources)[0];
    sources[id].rows[0][1] = 500;
    await sourceInput.fill(JSON.stringify(sources));
    await chart
      .getByRole("button", { name: "Render JSON", exact: true })
      .click();
    await chart.locator(".fj-plot").waitFor();
    assert.notEqual(
      await chart.locator("svg rect").first().getAttribute("width"),
      before,
    );
    await chart.getByRole("button", { name: "Data view", exact: true }).click();
    assert.match(await chart.locator("tbody tr").first().innerText(), /500/);
    await chart.getByRole("tab", { name: "Example", exact: true }).click();
    await chart
      .getByRole("button", { name: "Reset example", exact: true })
      .click();
    const input = chart.getByLabel("Chart spec JSON"),
      spec = JSON.parse(await input.inputValue());
    spec.component = "column";
    spec.encoding = { x: spec.encoding.category, value: spec.encoding.value };
    spec.options = {};
    await input.fill(JSON.stringify(spec));
    await chart
      .getByRole("button", { name: "Render JSON", exact: true })
      .click();
    await chart.locator(".fj-plot").waitFor();
    assert.match(await chart.locator(".fj-source").innerText(), /column/);
    await p.close();
    console.log(
      "PASS source mutation affects marks and table, JSON component switch and reset",
    );
  } finally {
    await browser.close();
    server.kill();
    await new Promise((r) => server.once("exit", r));
  }
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
