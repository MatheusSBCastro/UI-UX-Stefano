import { test, expect } from '@playwright/test';

test('página responsiva, sem erros de execução ou recursos', async ({ page }, testInfo) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
  page.on('response', (response) => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Interfaces');
  for (const selector of ['#laboratorio .section-heading', '.playground-shell', '#componentes .section-heading', ...Array.from({ length: 3 }, (_, i) => `.component-grid > div:nth-child(${i + 1})`), '.start-panel']) {
    await page.locator(selector).scrollIntoViewIfNeeded();
    await expect(page.locator(selector).locator('..')).toHaveCSS('opacity', '1');
  }
  await page.getByRole('heading', { name: 'Agora, crie algo seu.' }).scrollIntoViewIfNeeded();
  await expect(page.getByRole('button', { name: 'Copiar meu ponto de partida' })).toBeVisible();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
  expect(overflow).toBe(false);
  expect(errors).toEqual([]);
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await page.screenshot({ path: `test-results/${testInfo.project.name}-studio.png`, fullPage: true });
});

test('laboratório aceita clique, ajuste de duração e expansão', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('tab', { name: 'Interação' }).click();
  const panel = page.getByRole('tabpanel');
  await panel.getByRole('button', { name: 'Um pouco de magnetismo' }).click();
  await expect(panel.getByRole('button')).toContainText('1 clique');
  await page.getByRole('tab', { name: 'Layout' }).click();
  await panel.getByRole('button', { name: 'Cor', exact: true }).click();
  const card = panel.getByRole('button', { name: 'Cor Expandir' });
  await card.click();
  await expect(panel.getByText('O conteúdo muda.')).toBeVisible();
  await expect(panel.getByRole('button', { name: 'Cor O conteúdo muda. A experiência continua. Recolher' })).toHaveAttribute('aria-expanded', 'true');
  const range = page.getByRole('slider', { name: 'Duração' });
  await range.focus();
  await range.press('ArrowRight');
  await expect(page.locator('output')).toHaveText('0.7s');
  await page.getByRole('button', { name: 'Repetir animação' }).click();
  await expect(panel.getByText('O conteúdo muda.')).toBeVisible();
});

test('teclado alterna tabs e cores alteram a identidade', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('tab', { name: 'Entrada' }).focus();
  await page.keyboard.press('ArrowRight');
  await expect(page.getByRole('tab', { name: 'Interação' })).toBeFocused();
  await expect(page.getByRole('tab', { name: 'Interação' })).toHaveAttribute('aria-selected', 'true');
  await page.getByRole('button', { name: 'Lavanda', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Lavanda', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('.app')).toHaveCSS('--accent', '#c9b5ff');
});

test('prompt copiado tem alternativa selecionável quando clipboard falha', async ({ page }) => {
  await page.addInitScript(() => Object.defineProperty(navigator, 'clipboard', { value: { writeText: async () => { throw new Error('clipboard unavailable'); } } }));
  await page.goto('/');
  await page.getByRole('button', { name: 'Copiar meu ponto de partida' }).click();
  await expect(page.locator('#comecar').getByRole('status')).toHaveText('Selecione e copie o texto abaixo.');
  await expect(page.getByRole('textbox', { name: 'Prompt para criar um site' })).toHaveValue(/UI UX Pro Max/);
});

test('cópia bem-sucedida fornece o briefing completo', async ({ page }) => {
  await page.addInitScript(() => Object.defineProperty(navigator, 'clipboard', { value: { writeText: async (text: string) => { sessionStorage.setItem('copied-prompt-test', text); } } }));
  await page.goto('/');
  await page.getByRole('button', { name: 'Copiar meu ponto de partida' }).click();
  await expect(page.getByRole('button', { name: 'Prompt copiado' })).toBeVisible();
  expect(await page.evaluate(() => sessionStorage.getItem('copied-prompt-test'))).toContain('UI UX Pro Max');
});

test('movimento reduzido e pausa retiram partículas', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.getByRole('button', { name: 'Movimento reduzido do sistema' })).toBeDisabled();
  await expect(page.locator('.attract-particle')).toHaveCount(0);
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await expect(page.getByRole('button', { name: 'Pausar movimento' })).toBeEnabled();
  await page.getByRole('button', { name: 'Pausar movimento' }).click();
  await expect(page.getByRole('button', { name: 'Ativar movimento' })).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('.attract-particle')).toHaveCount(0);
});
