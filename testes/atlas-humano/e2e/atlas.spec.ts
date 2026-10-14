import { test,expect } from '@playwright/test';
import { fileURLToPath,pathToFileURL } from 'node:url';
import { ORGANS } from '../src/data';

test('complete body, all layers, combinations, opacity and orientation',async({page},info)=>{
  const errors:string[]=[];page.on('pageerror',error=>errors.push(error.message));
  await page.goto('/');const body=page.getByTestId('body-viewport');await expect(body).toHaveAttribute('data-ready','true');
  await expect(page.getByRole('heading',{level:1})).toHaveText('Descubra o que move você.');
  await expect(page.getByRole('button',{name:/^Explorar /})).toHaveCount(17);
  for(const [name,id] of [['Pele','skin'],['Tecido subcutâneo','fat'],['Fáscias','fascia'],['Músculos','muscles'],['Órgãos','organs'],['Vasos sanguíneos','vessels'],['Sistema nervoso','nerves'],['Esqueleto','bones']]){
    await page.getByRole('button',{name:`Camada ${name}`,exact:true}).click();await expect(body).toHaveAttribute('data-layers',id);
  }
  await page.getByLabel('Combinar camadas').check();await page.getByRole('button',{name:'Camada Músculos',exact:true}).click();await expect(body).toHaveAttribute('data-layers','bones,muscles');
  await page.getByLabel('Opacidade das camadas').fill('55');await expect(page.locator('output')).toHaveText('55%');
  await page.getByRole('button',{name:'Posterior',exact:true}).click();await expect(page.getByRole('button',{name:'Posterior',exact:true})).toHaveAttribute('aria-pressed','true');
  await page.getByRole('button',{name:'Restaurar exploração',exact:true}).click();await expect(body).toHaveAttribute('data-layers','organs');
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
  await page.screenshot({path:`testes/atlas-humano/evidencias/${info.project.name}-atlas.png`,fullPage:true});
  expect(errors).toEqual([]);
});

test('every organ opens its system, extracts, rotates, zooms and returns',async({page},info)=>{
  await page.goto('/');await expect(page.getByTestId('body-viewport')).toHaveAttribute('data-ready','true');
  for(const organ of ORGANS){
    await page.getByRole('button',{name:`Explorar ${organ.name}`,exact:true}).click();
    const dialog=page.getByRole('dialog');await expect(dialog.locator('.three-lines p')).toHaveCount(3);
    await dialog.getByRole('button',{name:`Retirar ${organ.name} e explorar em 3D`,exact:true}).click();
    const isolated=page.getByTestId('organ-viewport');await expect(isolated).toHaveAttribute('data-ready','true');
    await expect(page.getByTestId('body-viewport')).toHaveAttribute('data-extracted',organ.id);
    const initial=await isolated.getAttribute('data-camera');
    await dialog.getByRole('button',{name:'Girar órgão para a direita',exact:true}).click();await expect(isolated).not.toHaveAttribute('data-camera',initial||'');
    const rotated=await isolated.getAttribute('data-camera');await dialog.getByRole('button',{name:'Ampliar órgão',exact:true}).click();await expect(isolated).not.toHaveAttribute('data-camera',rotated||'');
    if(organ.id==='heart')await page.screenshot({path:`testes/atlas-humano/evidencias/${info.project.name}-coracao.png`,fullPage:true});
    await dialog.getByRole('button',{name:'Recolocar no corpo',exact:true}).click();await expect(dialog).toHaveCount(0);await expect(page.getByTestId('body-viewport')).toHaveAttribute('data-extracted','');
  }
});

test('search, empty results, system filtering and accessible dialog focus',async({page})=>{
  await page.goto('/');await page.getByLabel('Buscar órgão').fill('pancreas');await expect(page.getByRole('button',{name:'Explorar Pâncreas',exact:true})).toBeVisible();await expect(page.getByRole('button',{name:/^Explorar /})).toHaveCount(1);
  await page.getByLabel('Buscar órgão').fill('xyz');await expect(page.getByText('Nenhum órgão encontrado.')).toBeVisible();await page.getByRole('button',{name:'Limpar filtros',exact:true}).click();
  await page.getByLabel('Filtrar por sistema').selectOption('digestive');await expect(page.getByRole('button',{name:'Explorar Estômago',exact:true})).toBeVisible();await expect(page.getByRole('button',{name:'Explorar Coração',exact:true})).toHaveCount(0);
  await page.getByRole('button',{name:'Explorar Estômago',exact:true}).click();await page.keyboard.press('Tab');
  expect(await page.evaluate(()=>!!document.activeElement?.closest('dialog'))).toBeTruthy();await page.keyboard.press('Escape');await expect(page.getByRole('dialog')).toHaveCount(0);await expect(page.getByRole('button',{name:'Explorar Estômago',exact:true})).toBeFocused();
});

test('reduced motion and self-contained offline HTML',async({page})=>{
  await page.emulateMedia({reducedMotion:'reduce'});
  const file=fileURLToPath(new URL('../dist/atlas-humano.html',import.meta.url));
  const requests:string[]=[];page.on('request',request=>{if(/^https?:/.test(request.url()))requests.push(request.url());});
  await page.goto(pathToFileURL(file).href);await expect(page.getByTestId('body-viewport')).toHaveAttribute('data-ready','true');
  await expect(page.getByRole('button',{name:'Iniciar rotação automática',exact:true})).toBeDisabled();
  await page.getByRole('button',{name:'Explorar Coração',exact:true}).click();await expect(page.getByRole('dialog')).toBeVisible();expect(requests).toEqual([]);
});
