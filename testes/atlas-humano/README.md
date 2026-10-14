# Atlas Humano

Experimento interativo do UI-UX-Stefano, com React, TypeScript, Motion e Three.js.
O modelo é original, criado em código, e usa a identidade visual do kit.

## Executar

Na pasta principal `UI-UX-Stefano`:

```powershell
npm.cmd run dev:atlas
```

Abra **http://127.0.0.1:5176/**. Para encerrar no terminal, pressione Ctrl+C.

## Explorar

- Oito camadas: pele, tecido subcutâneo, fáscias, músculos, órgãos, vasos,
  nervos e esqueleto.
- Combinação de camadas, ajuste de opacidade e contorno do corpo.
- 17 estruturas selecionáveis no corpo ou pela lista, com busca sem acentos
  e filtro por sistema.
- Resumo do sistema, localização e função da estrutura selecionada.
- Retirada de um órgão para inspeção em 3D e devolução à posição original.
- Rotação, zoom, centralização e vistas anterior, posterior e lateral.
- Botões alternativos aos gestos, navegação por teclado, fechamento de
  janelas com Esc e respeito à preferência de movimento reduzido.

O modelo representa anatomia reprodutora feminina e simplifica formas,
proporções e ramificações. Veja as [referências e créditos](CREDITOS.md).

## Compilar e abrir sem servidor

```powershell
npm.cmd run build:atlas
```

Abra `testes/atlas-humano/dist/atlas-humano.html` diretamente no navegador.
Esse arquivo contém o JavaScript, os estilos, as fontes e o modelo; a exploração
funciona sem internet. Os links para fontes externas precisam de conexão.
A visualização 3D requer WebGL.

O `index.html` da pasta de código é a entrada do Vite. Para distribuição offline,
use o arquivo `atlas-humano.html` gerado no build.

Para conferir a versão de produção por HTTP:

```powershell
npm.cmd run preview:atlas
```

Abra **http://127.0.0.1:4176/**.

## Validar

Após compilar, com Chromium do Playwright instalado:

```powershell
npm.cmd run test:atlas
```

A suíte executa oito testes em desktop e celular. Cobre camadas e combinação,
opacidade, orientação, todos os 17 órgãos, inspeção e devolução, busca e filtros,
foco das janelas, movimento reduzido e abertura do HTML offline sem requisições
HTTP. Capturas de tela são gravadas em `evidencias/`.
