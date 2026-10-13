# Validação do experimento

12/10/2026 — Windows x64, Node 24.21.0, Chromium via Playwright.

- Build TypeScript + Vite do experimento passou.
- Build do kit principal passou após adicionar a fonte e os comandos.
- Quatorze cenários automatizados passaram, sete em desktop 1440px e sete em
  celular emulado 375px.
- Cobertura: carga das artes, navegação, seleção de personagem, atualização
  do mapa, cinco alvos por teclado, pontuação, reinício, destaque de sentido
  aranha, pausa, menu no celular, reprodução efetiva dos vídeos, replay da
  entrada, disparo de teia e sequência de títulos por rolagem.
- Foi identificado o motivo da versão estática na máquina: preferência de
  movimento reduzido do sistema. O modo cinematográfico agora é explícito e
  inicia ativo por pedido do usuário; testes com mídia `reduce` comprovam a
  reprodução e os controles locais de pausa/redução.
- Nenhum erro de JavaScript, console ou resposta HTTP 4xx/5xx na carga.
- Capturas da abertura e da página inteira foram revisadas; sem rolagem
  horizontal ou sobreposição de controles. Local: `test-results/`, ignorado
  pelo Git.
- O `index.html` inclui orientação quando aberto diretamente via `file://`.

O celular foi emulado; não houve teste em aparelho físico, benchmark de GPU/FPS
ou auditoria completa WCAG. O servidor de desenvolvimento está em 5175 e os
servidores temporários de testes foram encerrados pelo Playwright.
