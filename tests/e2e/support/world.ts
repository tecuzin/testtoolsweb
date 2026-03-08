import {
  Before,
  After,
  BeforeAll,
  AfterAll,
  World,
  setWorldConstructor,
  setDefaultTimeout
} from '@cucumber/cucumber';
import type { IWorldOptions } from '@cucumber/cucumber';
import { chromium } from '@playwright/test';
import type { Browser, BrowserContext, Page } from '@playwright/test';

setDefaultTimeout(60_000);

let browser: Browser;

export class UiWorld extends World {
  context!: BrowserContext;
  page!: Page;
  readonly frontUrl = process.env.FRONT_URL ?? 'http://localhost:4200';
  readonly apiUrl = process.env.API_URL ?? 'http://localhost:3000/api';

  constructor(options: IWorldOptions) {
    super(options);
  }
}

setWorldConstructor(UiWorld);

BeforeAll(async () => {
  browser = await chromium.launch({ headless: true });
});

AfterAll(async () => {
  await browser.close();
});

Before(async function (this: UiWorld) {
  this.context = await browser.newContext();
  this.page = await this.context.newPage();
});

After(async function (this: UiWorld) {
  await this.context.close();
});
