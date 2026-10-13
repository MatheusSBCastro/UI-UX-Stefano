# Validação local

Data: 12/10/2026, America/Sao_Paulo. Windows x64, Node 24.21.0.

- Build de produção e checagem TypeScript concluídos.
- 12 cenários Playwright em Chromium: desktop 1440px e celular emulado 375px.
- Cobertura: navegação por teclado nas tabs, cliques, mudança de layout,
  controle de duração, troca de paleta, prompt copiável com sucesso/falha,
  pausa de animação e preferência de movimento reduzido alterada ao vivo.
- Sem erros de JavaScript, console ou respostas HTTP 4xx/5xx na carga da demo.
- Capturas completas desktop e mobile revisadas visualmente, sem sobreposição
  ou rolagem horizontal; arquivos locais em `test-results/` (ignorados pelo Git).
- Busca UI UX Pro Max executada com Python portátil oficial e categoria
  Design System/Component Library conferida antes de salvar `MASTER.md`.
- `npm install` reportou zero vulnerabilidades conhecidas no conjunto instalado.

O celular foi emulado, não foi usado aparelho físico. Os cenários de clipboard
instrumentam sucesso/falha da API, sem acessar o clipboard pessoal do usuário.
Não houve auditoria completa WCAG nem benchmark de FPS/GPU. O site é local;
Claude Code permanece um agente externo com instalação e conta próprias.
