import { test, expect } from '@playwright/test';

test('carrega as artes, navega por todas as seções e não transborda', async ({ page }, testInfo) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
  page.on('response', (response) => { if (response.status() >= 400) errors.push(`${response.status()}: ${response.url()}`); });
  await page.goto('/');
  await expect(page.locator('.cinematic-intro')).toHaveCount(0);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('SEU AMIGO');
  await expect(page.locator('.hero-image-layer img')).toBeVisible();
  expect(await page.locator('.hero-image-layer img').evaluate((image: HTMLImageElement) => image.naturalWidth)).toBeGreaterThan(1000);
  await page.screenshot({ path: `testes/homem-aranha/test-results/${testInfo.project.name}-hero.png` });
  for (const selector of ['.origin-statement', '.origin-copy', '#universo .section-heading', ...Array.from({ length: 3 }, (_, i) => `.character-grid > div:nth-child(${i + 1})`), '.city-copy', '.map-frame', '#treino .section-heading', '.training-shell', '.final-copy']) {
    await page.locator(selector).scrollIntoViewIfNeeded();
    await expect(page.locator(selector)).toHaveCSS('opacity', '1');
    await expect(page.locator(selector).locator('..')).toHaveCSS('opacity', '1');
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)).toBe(false);
  expect(errors).toEqual([]);
  await page.getByRole('button', { name: 'Reduzir movimento' }).click();
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await page.screenshot({ path: `testes/homem-aranha/test-results/${testInfo.project.name}-full.png`, fullPage: true });
});

test('entrada cinematográfica, filme e disparo de teia são visíveis', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.cinematic-intro')).toHaveCount(0);
  const video = page.locator('.hero-motion-film');
  await expect(video).toBeVisible();
  await expect.poll(() => video.evaluate((element: HTMLVideoElement) => element.currentTime), { timeout: 10000 }).toBeGreaterThan(.15);
  await page.getByRole('button', { name: 'LANÇAR TEIA' }).click();
  await expect(page.locator('.hero-web-burst')).toHaveCount(1);
  await expect(page.locator('.hero-web-line path')).toHaveAttribute('d', /M7 92/);
  await page.getByRole('button', { name: 'Rever entrada cinematográfica' }).click();
  await expect(page.locator('.cinematic-intro')).toBeVisible();
  await expect(page.locator('.cinematic-intro')).toHaveCount(0);
});

test('scroll controla a sequência e o controle de redução interrompe os filmes', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.cinematic-intro')).toHaveCount(0);
  await page.evaluate(() => {
    const element = document.getElementById('salto')!;
    window.scrollTo({ top: element.offsetTop + (element.offsetHeight - window.innerHeight) * .46, behavior: 'instant' });
  });
  await expect(page.getByRole('heading', { name: 'ALCANCE O CÉU.' })).toHaveCSS('opacity', '1');
  const footage = page.locator('.swing-footage video');
  await expect.poll(() => footage.evaluate((element: HTMLVideoElement) => element.currentTime), { timeout: 10000 }).toBeGreaterThan(.1);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.locator('.spider-site')).toHaveAttribute('data-paused', 'false');
  await page.getByRole('button', { name: 'Reduzir movimento' }).click();
  await expect(page.locator('#salto')).toHaveClass(/sequence-reduced/);
  await expect.poll(() => footage.evaluate((element: HTMLVideoElement) => element.paused)).toBe(true);
  await expect(page.getByRole('heading', { name: 'ENCONTRE SEU CAMINHO.' })).toHaveCSS('opacity', '1');
});

test('seleção de personagens atualiza texto, estado e origem', async ({ page }) => {
  await page.goto('/');
  const group = page.getByRole('group', { name: 'Escolher personagem' });
  const miles = group.getByRole('button', { name: /Miles Morales/ });
  await miles.click();
  await expect(miles).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByRole('heading', { name: 'Outra voz. O mesmo chamado.' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Conhecer Miles Morales na Marvel' })).toHaveAttribute('href', /miles-morales/);
  const symbiote = group.getByRole('button', { name: /Traje Simbionte/ });
  await symbiote.focus(); await page.keyboard.press('Enter');
  await expect(symbiote).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByRole('heading', { name: 'Mais poder. Um limite a descobrir.' })).toBeVisible();
});

test('bairros atualizam o mapa e o capítulo', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: /Queens/ }).click();
  await expect(page.getByRole('button', { name: /Queens/ })).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByRole('heading', { name: /Todo herói começa em casa/ })).toBeVisible();
  await expect(page.locator('.map-frame-header')).toContainText('QUEENS');
  await page.getByRole('button', { name: /Brooklyn/ }).click();
  await expect(page.getByRole('heading', { name: /Cada rua tem seu ritmo/ })).toBeVisible();
});

test('cinco acertos por teclado concluem e reiniciam o treino', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'INICIAR TREINO' }).click();
  await expect(page.getByRole('button', { name: 'Acertar alvo 1 de 5' })).toBeFocused();
  for (let hit = 1; hit <= 5; hit++) {
    const target = page.getByRole('button', { name: `Acertar alvo ${hit} de 5` });
    await expect(target).toBeVisible();
    await target.press('Enter');
    await expect(page.getByRole('status')).toContainText(hit.toString().padStart(2, '0'));
  }
  await expect(page.getByText('SENTIDO ARANHA AFINADO.')).toBeVisible();
  const restart = page.getByRole('button', { name: 'TREINAR NOVAMENTE' });
  await expect(restart).toBeFocused();
  await restart.press('Enter');
  await expect(page.getByRole('status')).toContainText('00');
  await expect(page.getByRole('button', { name: 'Acertar alvo 1 de 5' })).toBeVisible();
  await page.getByRole('button', { name: 'Ativar sentido aranha' }).click();
  await expect(page.getByRole('button', { name: 'Sentido aranha ativado' })).toHaveAttribute('aria-pressed', 'true');
});

test('modo cinematográfico funciona mesmo com sistema reduzido e mantém pausa e menu', async ({ page }, testInfo) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.locator('.spider-site')).toHaveAttribute('data-paused', 'false');
  await expect(page.locator('.spider-site')).toHaveAttribute('data-motion-mode', 'full');
  await expect(page.locator('.cinematic-intro')).toHaveCount(0);
  await expect.poll(() => page.locator('.hero-motion-film').evaluate((video: HTMLVideoElement) => video.currentTime), { timeout: 10000 }).toBeGreaterThan(.1);
  await page.getByRole('button', { name: 'Pausar animações' }).click();
  await expect(page.locator('.spider-site')).toHaveAttribute('data-paused', 'true');
  await expect(page.locator('.ticker-track')).toHaveCSS('animation-play-state', 'paused');
  await page.getByRole('button', { name: 'Ativar animações' }).click();
  await expect(page.locator('.spider-site')).toHaveAttribute('data-paused', 'false');
  if (testInfo.project.name === 'mobile') {
    await page.getByRole('button', { name: 'Abrir menu' }).click();
    await expect(page.getByRole('navigation')).toBeVisible();
    await page.getByRole('navigation').getByRole('link', { name: 'Aranhaverso' }).click();
    await expect(page.getByRole('button', { name: 'Abrir menu' })).toHaveAttribute('aria-expanded', 'false');
  }
});
