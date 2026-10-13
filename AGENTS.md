# UI-UX-Stefano

Kit local e reutilizável para sites. Stack acordado: React, TypeScript, Vite,
Tailwind CSS 4 e Motion (`motion/react`). Node 22.12+.

## Ao criar ou alterar interfaces

1. Leia `.agents/skills/ui-ux-pro-max/SKILL.md` e a identidade atual em
   `design-system/ui-ux-stefano/IDENTIDADE.md`.
2. Para uma página nova, consulte a skill com `npm.cmd run design --
   "consulta curta" --design-system -p "Nome"`. Em Linux/macOS use `npm`.
   O wrapper resolve o Python e o caminho da skill. Não dependa de
   `CLAUDE_PLUGIN_ROOT`, que só existe em instalações como plugin.
3. Para questões específicas use `--domain ux`, `--domain color` ou `--stack react`.
4. Reutilize os componentes em `src/components/ui/`. Novos componentes externos
   precisam de origem e licença em `THIRD_PARTY_NOTICES.md`.
5. Use tokens de `src/styles.css`, elementos semânticos, foco visível, alvos
   de toque de 44px e `useReducedMotion`. Efeitos contínuos devem parar quando
   o visitante pausar o movimento.
6. Verifique com `npm.cmd run build`. Para mudanças nas interações centrais,
   execute `npm.cmd run test:ui` (Chromium do Playwright precisa estar disponível).

## Organização

- `src/App.tsx`: demonstração, pronta para substituir pelo próximo projeto.
- `src/components/ui/`: peças reutilizáveis e adaptações creditadas.
- `vendor/`: originais de referência; não são compilados.
- `.agents/skills/`: skill upstream completa, fixada por commit.
- `.claude/skills/`: adaptador para descoberta da mesma skill pelo Claude Code.
- `scripts/design-system.mjs`: busca local, sem serviço externo.
- `docs/`: instruções de uso e proveniência.

O escopo padrão é desenvolvimento local. O remoto Git já está configurado;
publique/push apenas quando solicitado. Não crie contas, tokens ou conexões MCP
para o 21st.dev sem necessidade indicada pelo usuário.
