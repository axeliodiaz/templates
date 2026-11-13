// Assay: verify real rendered data, responsive geometry, interaction and isolation.
const assert = require("node:assert/strict"),
  fs = require("node:fs"),
  path = require("node:path"),
  { spawn } = require("node:child_process"),
  { chromium } = require("playwright");
const root = path.resolve(__dirname, ".."),
  out = path.join(root, ".artifacts/assay");
fs.mkdirSync(out, { recursive: true });
const pkg = require("../package.json");
assert.equal(pkg.dependencies.bootstrap, "6.0.0-alpha.1");
const css = fs.readFileSync(
  path.join(root, ".vitepress/theme/assay-bs6.bootstrap.css"),
  "utf8",
);
assert.ok(css.includes("@scope (.assay-bs6)"));
for (const x of [".relay-bs6", ".bst-root", ".b2-bs6"])
  assert.ok(!css.includes("@scope (" + x + ")"));
async function ready(url) {
  for (let i = 0; i < 100; i++) {
    try {
      if ((await fetch(url)).ok) return;
    } catch {}
    await new Promise((r) => setTimeout(r, 100));
  }
  throw Error("Preview unavailable");
}
function textReport() {
  const bad = [];
  function rgba(s) {
    const v = s.match(/[\d.]+/g)?.map(Number);
    return v?.length >= 3 ? [...v.slice(0, 3), v[3] ?? 1] : null;
  }
  function over(f, b) {
    const a = f[3] + b[3] * (1 - f[3]);
    return [0, 1, 2]
      .map((i) => (f[i] * f[3] + b[i] * b[3] * (1 - f[3])) / a)
      .concat(a);
  }
  function lum(c) {
    return c
      .slice(0, 3)
      .map((x) => x / 255)
      .map((x) => (x <= 0.04045 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4))
      .reduce((s, x, i) => s + x * [0.2126, 0.7152, 0.0722][i], 0);
  }
  function bg(e) {
    const stack = [];
    for (let p = e; p; p = p.parentElement) {
      const c = rgba(getComputedStyle(p).backgroundColor);
      if (c) stack.push(c);
      if (c?.[3] === 1) break;
    }
    return stack.reverse().reduce((b, c) => over(c, b), [255, 255, 255, 1]);
  }
  const walk = document.createTreeWalker(
    document.querySelector(".assay"),
    NodeFilter.SHOW_TEXT,
  );
  let n;
  while ((n = walk.nextNode())) {
    const e = n.parentElement,
      text = n.textContent.trim();
    if (
      !text ||
      e.closest("script,style,.as-sr,[aria-hidden=true]") ||
      !e.getClientRects().length
    )
      continue;
    let hidden = false;
    for (let p = e; p; p = p.parentElement) {
      const s = getComputedStyle(p);
      if (
        s.display === "none" ||
        s.visibility === "hidden" ||
        Number(s.opacity) === 0
      )
        hidden = true;
    }
    if (hidden) continue;
    const s = getComputedStyle(e),
      back = bg(e),
      ink =
        rgba(e.closest("svg") ? s.fill : s.webkitTextFillColor) ||
        rgba(s.color);
    if (!ink) continue;
    const fg = over(ink, back),
      a = lum(fg),
      b = lum(back),
      ratio = (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
    let px = parseFloat(s.fontSize);
    if (e instanceof SVGGraphicsElement) {
      const m = e.getScreenCTM();
      px *= Math.hypot(m.a, m.b);
    }
    if (px < 10.99 || ratio < 4.49)
      bad.push({
        text: text.slice(0, 50),
        px,
        ratio,
        cls: e.className.baseVal ?? e.className,
      });
  }
  return bad;
}
(async () => {
  const server = spawn(
    path.join(root, "node_modules/.bin/vitepress"),
    ["preview", root, "--port", "4368", "--host", "127.0.0.1"],
    { stdio: "ignore" },
  );
  let browser;
  try {
    await ready("http://127.0.0.1:4368/assay/dashboard");
    browser = await chromium.launch({
      executablePath: process.env.CHROME_PATH || "/usr/bin/google-chrome",
      args: ["--no-sandbox"],
    });
    const page = await browser.newPage({ reducedMotion: "reduce" }),
      errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    const base = "http://127.0.0.1:4368";
    for (const route of [
      "/assay",
      "/assay/foundations",
      "/assay/agent-orchestration",
    ]) {
      const res = await page.goto(base + route, { waitUntil: "networkidle" });
      assert.equal(res.status(), 200, route);
      assert.ok(!(await page.title().then((x) => x.includes("404"))));
      assert.equal(
        await page.locator("html").getAttribute("data-tpl"),
        "assay",
      );
    }
    for (const width of [390, 820, 1440]) {
      await page.setViewportSize({ width, height: 1000 });
      await page.goto(base + "/assay/dashboard", { waitUntil: "networkidle" });
      await page.locator(".assay").waitFor();
      assert.equal(await page.locator("main").count(), 1);
      assert.equal(
        await page.locator(".assay").getAttribute("data-bs-theme"),
        "light",
      );
      assert.ok((await page.locator(".assay").innerText()).includes("87.4%"));
      assert.ok(
        (await page.locator(".assay").innerText()).includes("run #482"),
      );
      assert.equal(await page.locator(".as-heatmap tbody tr").count(), 6);
      assert.equal(await page.locator(".as-heatmap td").count(), 30);
      assert.equal(await page.locator(".as-chart svg polyline").count(), 3);
      assert.equal(
        await page.locator(".as-step-current").getAttribute("aria-current"),
        "step",
      );
      assert.equal(await page.locator(".as-kpi").count(), 4);
      assert.equal(
        await page
          .locator(".as-kpis")
          .evaluate(
            (e) => getComputedStyle(e).gridTemplateColumns.split(" ").length,
          ),
        width < 768 ? 1 : width < 1200 ? 2 : 4,
      );
      assert.ok(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth + 1,
        ),
      );
      assert.equal(
        await page.locator(".as-case-cards").isVisible(),
        width < 768,
      );
      assert.equal(
        await page.locator(".as-case-table").isVisible(),
        width >= 768,
      );
      assert.deepEqual(await page.evaluate(textReport), [], width + " text");
      assert.equal(
        await page
          .locator(".assay")
          .evaluate(
            (e) =>
              e
                .getAnimations({ subtree: true })
                .filter((a) => a.playState === "running").length,
          ),
        0,
      );
      await page.keyboard.press("Tab");
      assert.equal(
        await page.evaluate(() => document.activeElement.className),
        "as-skip",
      );
      await page.keyboard.press("Enter");
      assert.equal(
        await page.evaluate(() => document.activeElement.id),
        "assay-main",
      );
      if (width < 1200) {
        await page
          .getByRole("button", { name: "Open navigation", exact: true })
          .click();
        assert.equal(
          await page.locator(".as-nav-dialog").evaluate((e) => e.open),
          true,
        );
        await page.keyboard.press("Tab");
        assert.ok(
          await page.evaluate(
            () => !!document.activeElement.closest("dialog[open]"),
          ),
        );
        await page.keyboard.press("Escape");
        assert.equal(
          await page.locator(".as-nav-dialog").evaluate((e) => e.open),
          false,
        );
        assert.equal(
          await page.evaluate(() => document.activeElement.className),
          "as-menu",
        );
      }
      for (const name of [
        "Suites",
        "Models",
        "MCP Tools",
        "Traces",
        "Datasets",
        "Runs",
      ]) {
        if (width < 1200)
          await page
            .getByRole("button", { name: "Open navigation", exact: true })
            .click();
        await page
          .locator(width < 1200 ? ".as-nav-dialog" : ".as-rail")
          .getByRole("button", { name, exact: true })
          .click();
        if (name !== "Runs")
          assert.ok(
            (await page.locator(".as-empty").innerText()).includes("selected."),
          );
      }
      await page.getByRole("button", { name: "Compare", exact: false }).click();
      assert.equal(
        await page.locator(".as-dialog").evaluate((e) => e.open),
        true,
      );
      assert.ok(
        (await page.locator(".as-dialog").innerText()).includes(
          "later version",
        ),
      );
      await page.keyboard.press("Escape");
      await page
        .getByRole("button", {
          name: "Select commit f9a3b2c (current)",
          exact: true,
        })
        .click();
      assert.ok(
        (await page.locator(".as-dialog").innerText()).includes("87.4%"),
      );
      await page.getByRole("button", { name: "Close", exact: true }).click();
      await page
        .locator(width < 768 ? ".as-case-cards" : ".as-case-table")
        .getByRole("button", { name: "#482-311", exact: true })
        .click();
      assert.ok(
        (await page.locator(".as-dialog").innerText()).includes(
          "Policy snippet truncated",
        ),
      );
      await page.keyboard.press("Escape");
      await page
        .getByRole("button", { name: "View all failing cases", exact: false })
        .click();
      assert.ok(
        (await page.locator(".as-dialog").innerText()).includes("5 of 6"),
      );
      await page.keyboard.press("Escape");
      const controls = page.locator(
        '.assay button:visible,.assay a:visible,.assay [tabindex="0"]:visible',
      );
      for (const el of await controls.all()) {
        const box = await el.boundingBox();
        assert.ok(
          box.width >= 39.9 && box.height >= 39.9,
          "target " + (await el.innerText()),
        );
        await el.focus();
        const f = await el.evaluate((e) => ({
          outline: getComputedStyle(e).outlineWidth,
          visible: e.matches(":focus-visible"),
        }));
        assert.ok(
          parseFloat(f.outline) >= 2,
          "focus " + (await el.innerText()),
        );
      }
      await page.evaluate(() => {
        document.activeElement.blur();
        scrollTo(0, 0);
      });
      await page.screenshot({
        path: path.join(out, `assay-${width}.png`),
        fullPage: true,
      });
      console.log("PASS", width);
    }
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.goto(base + "/assay/dashboard", { waitUntil: "networkidle" });
    const shadow = await page
      .locator(".as-dot")
      .first()
      .evaluate((e) => getComputedStyle(e).boxShadow);
    await page.waitForFunction(
      (before) =>
        getComputedStyle(document.querySelector(".as-dot")).boxShadow !==
        before,
      shadow,
    );
    assert.notEqual(
      await page
        .locator(".as-dot")
        .first()
        .evaluate((e) => getComputedStyle(e).boxShadow),
      shadow,
    );
    await page.emulateMedia({ reducedMotion: "reduce" });
    assert.equal(
      await page
        .locator(".assay")
        .evaluate(
          (e) =>
            e
              .getAnimations({ subtree: true })
              .filter((a) => a.playState === "running").length,
        ),
      0,
    );
    for (const route of ["/relay", "/bastion"]) {
      await page.goto(base + route, { waitUntil: "networkidle" });
      assert.equal(await page.locator(".assay-bs6").count(), 0);
      assert.equal(
        await page
          .locator("body")
          .evaluate((e) => getComputedStyle(e).getPropertyValue("--as-bg")),
        "",
      );
    }
    assert.deepEqual(errors, []);
    console.log(
      "PASS routes, sample data, 3 widths, AA rendered text, native dialogs, keyboard/focus/touch, motion/reduced change and CSS isolation",
    );
  } finally {
    if (browser) await browser.close();
    server.kill();
  }
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
