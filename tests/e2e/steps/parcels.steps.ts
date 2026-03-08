import { Given, Then, When } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { UiWorld } from '../support/world.ts';

Given('la base de demonstration est reinitialisee', async function (this: UiWorld) {
  let response: Response;
  try {
    response = await fetch(`${this.apiUrl}/test/reset`, {
      method: 'POST'
    });
  } catch (error) {
    throw new Error(
      `Reset API unreachable at ${this.apiUrl}/test/reset. Start backend+db first. (${String(error)})`
    );
  }

  if (response.status !== 204) {
    throw new Error(`Reset API failed with status ${response.status}`);
  }
});

When("j'ouvre l'application", async function (this: UiWorld) {
  await this.page.goto(this.frontUrl);
});

When(
  'je cree une parcelle {string} de {float} ha a {string}',
  async function (this: UiWorld, name: string, area: number, location: string) {
    const openCreate = this.page.getByRole('button', { name: /Nouvelle parcelle|Ajouter une parcelle/i });
    if (await openCreate.isVisible()) {
      await openCreate.click();
    }
    await this.page.getByTestId('parcel-name-input').fill(name);
    await this.page.getByTestId('parcel-area-input').fill(String(area));
    await this.page.getByTestId('parcel-location-input').fill(location);
    await this.page.getByTestId('parcel-submit-btn').click();
  }
);

Then('la parcelle {string} apparait dans la liste', async function (this: UiWorld, name: string) {
  await expect(this.page.getByText(name)).toBeVisible();
});

When('je vais sur la parcelle {string}', async function (this: UiWorld, name: string) {
  await this.page.getByRole('link', { name }).click();
});

When(
  'j\'ajoute une plantation {string} du {string} sur {float} ha',
  async function (this: UiWorld, crop: string, date: string, area: number) {
    await this.page.getByRole('button', { name: /\+ Plantation/i }).click();
    await this.page.getByTestId('planting-crop-input').fill(crop);
    await this.page.getByTestId('planting-date-input').fill(date);
    await this.page.getByTestId('planting-area-input').fill(String(area));
    await this.page.getByTestId('planting-submit-btn').click();
  }
);

When(
  'j\'ajoute un traitement {string} du {string} dose {string}',
  async function (
    this: UiWorld,
    treatmentType: string,
    date: string,
    dose: string
  ) {
    await this.page.getByRole('button', { name: /\+ Traitement/i }).click();
    await this.page.getByTestId('treatment-type-input').fill(treatmentType);
    await this.page.getByTestId('treatment-date-input').fill(date);
    await this.page.getByTestId('treatment-dose-input').fill(dose);
    await this.page.getByTestId('treatment-notes-input').fill('E2E notes');
    await this.page.getByTestId('treatment-submit-btn').click();
  }
);

Then('la plantation {string} est visible', async function (this: UiWorld, crop: string) {
  await expect(this.page.getByText(crop)).toBeVisible();
});

Then('le traitement {string} est visible', async function (this: UiWorld, type: string) {
  await expect(this.page.getByText(type)).toBeVisible();
});
