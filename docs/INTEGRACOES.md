# Como ampliar o kit

## 21st.dev

O catálogo é uma fonte de componentes da comunidade, com licença por autor.
Comece em https://21st.dev/community/components. Nesta base há duas adaptações
da Kokonut UI (MIT); consulte `vendor/kokonut-ui/` e a proveniência fixada.

Para adicionar uma peça:

1. Abra o componente desejado e confira a origem e a licença.
2. Copie seu TSX para `src/components/ui/`, ou use a URL de registry que a
   própria página fornecer com `npx.cmd shadcn@latest add "URL_DO_REGISTRY"`.
3. Instale as dependências exigidas, confira os arquivos alterados e adapte os
   tokens à identidade do projeto. `@/` já aponta para `src/`, e `cn` existe.
4. Padronize animações em `motion/react`, mantenha semântica e movimento reduzido.
5. Registre autoria/licença em `THIRD_PARTY_NOTICES.md` e execute o build.

Não invente URLs de registry; nem todos os componentes usam a mesma rota.
Não adicione chave secreta ao frontend. MCP do 21st.dev é uma integração opcional
do agente e não é necessário para usar os componentes locais.

## Motion

Use o pacote `motion` via `motion/react`. `MotionConfig reducedMotion="user"`
está na raiz; animações SVG ou contínuas também precisam de `useReducedMotion`
e de respeitar o controle de pausa. Exemplos locais: `Reveal`, `BackgroundPaths`
e as demonstrações de entrada/layout em `App.tsx`.

Documentação: https://motion.dev/docs/react

## Claude Code

Instale pelo procedimento oficial em https://code.claude.com/docs/en/setup,
autentique sua conta e execute `claude` dentro desta pasta. O repositório contém
as instruções e o adaptador de skill; não contém o binário, sua conta ou tokens.

## Skill UI UX Pro Max

Upstream fixado em `docs/PROVENIENCIA.json`. O instalador oficial de skills do
Codex copiou a pasta `.claude/skills/ui-ux-pro-max` do upstream para
`.agents/skills/ui-ux-pro-max`; o conteúdo original foi preservado.
O adaptador em `.claude/skills/` lê a mesma cópia para evitar bases divergentes.

Para atualizar, baixe uma nova revisão em pasta temporária, compare os arquivos,
atualize o registro de proveniência e rode uma busca e o build. Preserve a
identidade escolhida pelo usuário; o sistema gerado é uma recomendação.
