# 💌 Love Letter — Interactive Website Template

Um site de carta de amor interativo e cinematográfico, feito com **HTML, CSS
e JavaScript puros** (sem frameworks, sem build step). Um céu estrelado
animado no Canvas, com as estrelas se organizando para formar o nome de
alguém especial, envelope com carta, galeria de fotos, player de música e
um contador de tempo desde uma data marcante.

> 🔗 https://jonaskenpachi3-design.github.io/love-letter-template/
## ✨ Funcionalidades

- **Céu estrelado animado** em Canvas 2D, com nebulosas, parallax pelo
  mouse e ~2000 partículas (ajustado automaticamente para menos partículas
  em celulares/aparelhos mais fracos).
- **Constelação de texto** — as estrelas se reorganizam para desenhar um
  nome, com tamanho de fonte que se adapta automaticamente ao comprimento
  do texto.
- **Sequência cinematográfica de abertura**: introdução → céu → zoom →
  *warp speed* → formação da constelação.
- **Câmera vinculada ao scroll**, dando um leve zoom conforme a página é
  percorrida.
- **Envelope com abertura em 3D** (perspectiva real via CSS) revelando uma
  carta.
- **Galeria de fotos** com lightbox, efeito de inclinação 3D no hover e
  entrada escalonada (stagger) ao rolar a página — gerada automaticamente
  a partir de uma lista de configuração.
- **Contador de tempo** ("há quanto tempo") com efeito de dígitos tipo
  odômetro a cada troca de valor.
- **Player de música** (vinil giratório, barra de progresso, controle de
  volume) — funciona mesmo sem um arquivo de áudio (o botão apenas fica
  desabilitado com um aviso).
- **Chuva de estrelas cadentes** ao chegar na seção final.
- Efeitos de clique (ripple), cursor magnético, burst de corações ao dar
  duplo clique, e suporte a `prefers-reduced-motion`.

## 🛠️ Tecnologias

- HTML5 semântico
- CSS3 (Grid, Flexbox, custom properties, `clip-path`, animações)
- JavaScript (ES6+), sem dependências — Canvas API, Web Animations API,
  Intersection Observer API

## 🚀 Como rodar localmente

Por ser um site 100% estático, não precisa de build nem instalação de
pacotes. Basta abrir `index.html` num servidor local, por exemplo:

```bash
# Python
python3 -m http.server 8080

# ou Node
npx serve .
```

Depois acesse `http://localhost:8080`.

## 🎨 Como personalizar

Toda a customização básica fica em **`js/config.js`** — não é necessário
editar HTML, CSS ou o restante do JavaScript:

```js
const SITE_CONFIG = {
    name: "Alguém Especial",             // nome exibido e formado pelas estrelas
    sinceDate: "2024-01-01T00:00:00",     // data usada no contador
    photos: [                             // fotos da galeria (adicione quantas quiser)
        {
            src: "assets/images/photo1.jpg",
            alt: "...",
            title: "...",
            caption: "..."
        }
    ],
    musicFile: "assets/music/musica.mp3"  // música de fundo (opcional)
};
```

- **Fotos**: salve os arquivos em `assets/images/` e liste-os em
  `SITE_CONFIG.photos`. Os cards da galeria são gerados automaticamente.
- **Música**: coloque um arquivo `.mp3` em `assets/music/` e aponte o
  caminho em `musicFile`. Sem arquivo, o player fica visualmente
  desabilitado em vez de quebrar.
- **Texto da carta**: edite diretamente o parágrafo dentro de
  `<div class="paper">` no `index.html`.
- **Cores**: ajuste as variáveis no topo do `style.css` (`--pink`,
  `--purple`, `--bg` etc.).

## 📦 Estrutura

```
├── index.html
├── style.css
├── js/
│   ├── config.js     ← edite aqui para personalizar
│   └── main.js        ← lógica/engine do site
└── assets/
    ├── images/         ← fotos da galeria
    └── music/          ← música de fundo (opcional)
```

## ☁️ Deploy no GitHub Pages

1. Suba o repositório no GitHub.
2. Vá em **Settings → Pages**.
3. Em **Source**, selecione a branch principal (`main`) e a pasta raiz
   (`/`).
4. Salve — o site fica disponível em
   `https://seu-usuario.github.io/nome-do-repo/`.

## ⚠️ Sobre fotos reais

As imagens incluídas neste repositório são apenas **placeholders
decorativos gerados para demonstração** — nenhuma foto real é distribuída
aqui. Se for usar este template para presentear alguém, troque as fotos
localmente antes de subir para um repositório público, ou mantenha esse
repositório específico como privado.

## 📄 Licença

Distribuído sob a licença MIT — veja [LICENSE](LICENSE) para mais
detalhes. Sinta-se à vontade para usar, adaptar e compartilhar.
