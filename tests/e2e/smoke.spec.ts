import { expect, test } from "@playwright/test";

test.use({ channel: "chrome" });

test("hero shape chip advances the particle core", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  await page.goto("/");
  const chip = page.getByRole("button", { name: /Shape: Web/ });
  await expect(chip).toBeVisible();
  await page.waitForTimeout(1200);
  await chip.click();
  await expect(page.getByRole("button", { name: /Shape: Code/ })).toBeVisible();
  await page.locator(".stage canvas").click({ position: { x: 300, y: 300 } });
  await expect(page.getByRole("button", { name: /Shape: Mobile/ })).toBeVisible();
  expect(errors.filter((e) => !/willaye\.jpg|404/.test(e))).toEqual([]);
});

test("contact form validates and builds the WhatsApp link", async ({ page }) => {
  await page.goto("/#contact");
  const send = page.getByTestId("send");
  await send.click();
  await expect(page.getByRole("status")).toHaveText("Add your name and a short message first");
  await expect(page.locator("#c-name")).toBeFocused();

  await page.fill("#c-name", "Sara");
  await page.fill("#c-email", "sara@example.com");
  await page.getByRole("checkbox", { name: "Mobile app" }).check();
  await page.getByRole("radio", { name: "$2k-$5k" }).check();
  await page.fill("#c-msg", "Fleet tracking app");
  const href = await send.getAttribute("href");
  expect(href).toContain("https://wa.me/");
  expect(decodeURIComponent(href!.split("text=")[1])).toBe(
    "Hi Willaye Haider! I am Sara (sara@example.com). I need Mobile app. My budget is $2k-$5k. Fleet tracking app",
  );
});

test("accent preset persists across reloads", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Teal accent" }).click();
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-accent", "teal");
  await expect(page.getByRole("button", { name: "Teal accent" })).toHaveAttribute("aria-pressed", "true");
});
