# Spider-Verse — experimento Homem-Aranha

Site de fã feito para testar o kit UI-UX-Stefano. Aplicação separada em
`testes/homem-aranha/`, usando as dependências já instaladas no repositório.

## Abrir agora

Com o servidor ativo: **http://127.0.0.1:5175/**.

Na pasta principal `UI-UX-Stefano`:

```powershell
npm.cmd run dev:spider
```

O `index.html` é uma entrada React e precisa do servidor Vite. Abrir diretamente
por `file://` mostra uma orientação e o link local. Para desligar um servidor
iniciado no seu terminal, pressione Ctrl+C.

## Explorar

- Abertura com arte cinematográfica, profundidade ao mover o mouse e parallax.
- Entrada com cortinas e teias desenhadas, rever entrada e disparo de teia.
- Filmes oficiais animam a abertura e uma sequência de salto com câmera,
  teias e títulos ligados à posição da rolagem.
- Cartões de personagem inclinam em 3D conforme a posição do mouse.
- Manifesto editorial com revelação ao rolar a página.
- Peter Parker, Miles Morales e Traje Simbionte selecionáveis, com transições
  de texto, cores e links para as respectivas fontes.
- Mapa ilustrativo com seleção de Manhattan, Brooklyn e Queens.
- Treino de teias: iniciar, acertar cinco alvos, ver a pontuação e reiniciar.
  Também funciona com teclado: Tab e Enter.
- Sentido aranha destaca os alvos. Movimento completo é o padrão deste
  experimento a pedido do usuário, inclusive quando o sistema prefere reduzir
  movimento. Há controle visível no cabeçalho e pausa no rodapé; estes controles
  interrompem vídeos, ticker, efeitos contínuos e a sequência de rolagem.
  Nenhuma preferência do sistema é alterada.
- Navegação adaptada ao celular, sem dependências de APIs remotas.

## Compilar e verificar

```powershell
npm.cmd run build:spider
npm.cmd run test:spider
npm.cmd run preview:spider
```

Produção em `testes/homem-aranha/dist/`; preview em http://127.0.0.1:4175/.
Chromium do Playwright precisa estar disponível para os testes.

## O que veio do kit

React, TypeScript, Vite, Tailwind 4 e Motion. `AttractButton` e `BackgroundPaths`
são reutilizados diretamente de `src/components/ui/`, com a autoria da
Kokonut UI preservada. A skill UI UX Pro Max foi consultada para design e
redução de movimento; a identidade deste experimento está em `design-system/`.
As ilustrações são artes oficiais de divulgação: [créditos](CREDITOS.md).

Revisão visual e testes documentados em [VALIDACAO.md](VALIDACAO.md).
