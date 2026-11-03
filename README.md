# Portfólio, Guilherme Menezes

Site estático em HTML, CSS e JavaScript puros, sem build e sem dependências. Quatro páginas:

| Página | Arquivo |
|---|---|
| Home | `index.html` |
| Sobre | `sobre.html` |
| Case 01, Checkout de Renda Variável | `case-checkout.html` |
| Case 02, Rebalanceamento de carteira (nivo) | `case-nivo.html` |

Todos os caminhos são relativos, então funciona na raiz do domínio e em subpasta (como `guimnz.github.io/portifolio/`).

## Imagens

Todas as imagens estão em `assets/img/`. Se alguma faltar, a página mostra uma caixa tracejada com o nome do arquivo, e o console do navegador (F12) lista `Imagem pendente: assets/img/<nome>`.

## Ver no seu computador

Dê dois cliques em `index.html`. Se preferir um servidor local: `python -m http.server 8000` na pasta e abra `http://localhost:8000`.

## Publicar no GitHub Pages

1. Coloque **o conteúdo desta pasta** na raiz do repositório (`index.html` ao lado de `assets/`).
   - **Pelo site do GitHub:** no repositório, **Add file > Upload files**, arraste os arquivos e pastas, e confirme com **Commit changes**.
   - **Pelo terminal:**
     ```
     git clone https://github.com/GuiMnz/portifolio.git
     cd portifolio
     # copie para cá o conteúdo da pasta do site
     git add .
     git commit -m "Portfólio: home, sobre e dois cases"
     git push
     ```
2. No repositório, abra **Settings > Pages**.
3. Em **Build and deployment**, escolha **Deploy from a branch**, branch `main` e pasta `/ (root)`. Salve.
4. Em alguns minutos o site aparece em `https://guimnz.github.io/portifolio/`.

Se o repositório já tiver outros arquivos, confira antes se não há um `index.html` seu que seria substituído.

## Estrutura

```
index.html  sobre.html  case-checkout.html  case-nivo.html
assets/
  css/  monolume.css (sistema de design)  + um arquivo por página
  js/   site.js (menu, e-mail)  home.js  case.js (abas, antes e depois, visualizador de imagens)
  img/  imagens
.nojekyll
```

O visual vem do sistema de design Monolume (`assets/css/monolume.css`). As fontes (Geist e IBM Plex Mono) são carregadas do Google Fonts.
