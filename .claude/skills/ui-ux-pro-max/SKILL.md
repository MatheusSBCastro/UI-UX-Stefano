---
name: ui-ux-pro-max
description: Use ao criar, revisar ou melhorar interfaces neste repositório, incluindo layouts, cores, fontes, animação, responsividade e acessibilidade.
---

# UI UX Pro Max — integração local

Leia a skill upstream completa em `.agents/skills/ui-ux-pro-max/SKILL.md`.
Ela é a fonte de regras e contém os dados, scripts e referências oficiais.
Este arquivo é apenas o adaptador de descoberta do Claude Code.

Execute as buscas pelo wrapper do projeto:

```powershell
npm.cmd run design -- "creative studio portfolio" --design-system -p "Meu site"
npm.cmd run design -- "keyboard focus modal" --domain ux
npm.cmd run design -- "animation accessibility" --stack react
```

O wrapper resolve o runtime Python e os imports locais. Não use
`${CLAUDE_PLUGIN_ROOT}` nesta instalação por arquivos. Não sobrescreva uma
identidade existente; consulte `design-system/ui-ux-stefano/IDENTIDADE.md`.
