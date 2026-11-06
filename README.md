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

Todas as imagens estão em `assets/img/`, inclusive o favicon (`favicon.png`).

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
  css/  tokens.css + monolume.css (sistema de design)  + um arquivo por página (home, sobre, case-checkout, case-nivo)
  js/   site.js (topo, menu, e-mail, banda do rodapé, foco dos cards no toque: um card por vez)  case.js (abas, antes e depois, visualizador de imagens)
  img/  imagens
.nojekyll
```

## Atualizar o site

Os links para CSS e JS levam um número de versão (`assets/css/monolume.css?v=20261106`). A cada atualização, troque esse número em todas as páginas pela data do dia: assim o navegador de quem já visitou o site busca os arquivos novos na hora, em vez de mostrar a versão guardada.

O visual vem do sistema de design Monolume (`assets/css/tokens.css` e `assets/css/monolume.css`). As fontes (Geist e IBM Plex Mono) são carregadas do Google Fonts.
