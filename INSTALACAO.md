# 🔧 Guia de Instalação e Configuração

## Pré-requisitos

- Navegador web moderno
- Servidor web local (Live Server, XAMPP, Python, etc.)
- Editor de código (VS Code, Sublime, etc.)
- Suas imagens do catálogo em formato JPG

## 📥 Instalação

### Opção 1: Download Direto
1. Baixe todos os arquivos do projeto
2. Extraia para uma pasta local
3. Mantenha a estrutura de pastas intacta

### Opção 2: Clone do Repositório
```bash
git clone [url-do-repositorio]
cd catalogo-digital
```

## ⚙️ Configuração Básica

### 1. Preparar Suas Imagens

#### Formato e Qualidade
- **Formato**: JPG (recomendado) ou PNG
- **Resolução**: 800x600px ou 1024x768px
- **Qualidade**: 80-90% para balancear tamanho e qualidade
- **Orientação**: Retrato ou paisagem (mantenha consistência)

#### Nomenclatura
```
pages/
├── 1.jpg    # Primeira página (capa)
├── 2.jpg    # Segunda página
├── 3.jpg    # Terceira página
└── ...      # Continue sequencialmente
```

### 2. Configurar o Catálogo

#### Editar Configurações Principais
Abra `index.html` e localize:

```javascript
var catalogConfig = {
    bookname: "Seu Catálogo",     // Nome do catálogo
    maxpage: 6,                   // ALTERE: número total de páginas
    currentPage: 1,
    // ... outras configurações
};
```

#### Personalizar Título e Descrição
```html
<!-- No <head> -->
<title>Seu Catálogo Digital</title>
<meta name="description" content="Descrição do seu catálogo">

<!-- No header -->
<div class="header">
    <div>📱 Seu Catálogo Digital</div>
</div>
```

### 3. Personalização Visual

#### Alterar Cores do Tema
```css
/* Gradiente de fundo */
body {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

/* Cores dos botões */
.nav-btn, .zoom-btn {
    background: rgba(255, 255, 255, 0.9);
    color: #333;
}
```

#### Personalizar Footer
```html
<div class="footer">
    <div>Suas instruções personalizadas aqui</div>
</div>
```

## 🚀 Configuração do Servidor

### Opção 1: Live Server (VS Code)
1. Instale a extensão "Live Server"
2. Clique com botão direito em `index.html`
3. Selecione "Open with Live Server"

### Opção 2: Python (Simples)
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```
Acesse: `http://localhost:8000`

### Opção 3: Node.js
```bash
npx http-server
```

### Opção 4: XAMPP/WAMP
1. Copie a pasta para `htdocs/`
2. Acesse: `http://localhost/catalogo-digital/`

## 📱 Teste em Dispositivos

### Desktop
- Abra em diferentes navegadores
- Teste redimensionamento da janela
- Verifique responsividade

### Mobile
- Use ferramentas de desenvolvedor (F12)
- Ative modo de dispositivo móvel
- Teste em dispositivos reais

### Ferramentas de Teste
- Chrome DevTools
- Firefox Responsive Design Mode
- BrowserStack (para múltiplos dispositivos)

## 🔧 Configurações Avançadas

### Ajustar Zoom
```javascript
var catalogConfig = {
    maxZoom: 3.0,    // Zoom máximo (padrão: 2.5)
    minZoom: 1.0,    // Zoom mínimo
    // ...
};
```

### Personalizar Dimensões
```javascript
// Na função loadApp()
var flipbookWidth = Math.min(containerWidth, 900);  // Largura máxima
var flipbookHeight = Math.min(containerHeight, 700); // Altura máxima
```

### Adicionar Páginas Dinamicamente
```javascript
// Para catálogos com muitas páginas
function loadPages() {
    for(var i = 2; i <= catalogConfig.maxpage; i++) {
        $("#flipbook").append(
            "<div class='bpage'>" +
                "<div class='bpcontent'>" +
                    "<img src='pages/" + i + ".jpg' alt='Página " + i + "'>" +
                "</div>" +
            "</div>"
        );
    }
    initializeTurnJS();
}
```

## 🐛 Solução de Problemas

### Imagens não carregam
- ✅ Verifique se as imagens estão na pasta `pages/`
- ✅ Confirme a nomenclatura sequencial (1.jpg, 2.jpg, etc.)
- ✅ Verifique permissões de arquivo
- ✅ Teste com servidor local (não abra arquivo diretamente)

### JavaScript não funciona
- ✅ Abra console do navegador (F12)
- ✅ Verifique erros de JavaScript
- ✅ Confirme que todas as bibliotecas carregaram
- ✅ Teste em navegador diferente

### Layout quebrado
- ✅ Verifique meta tag viewport
- ✅ Confirme que CSS está carregando
- ✅ Teste em modo incógnito
- ✅ Limpe cache do navegador

### Performance lenta
- ✅ Otimize tamanho das imagens
- ✅ Use formato JPG com compressão
- ✅ Considere lazy loading para muitas páginas
- ✅ Teste conexão de internet

## 📊 Otimização

### Imagens
```bash
# Redimensionar com ImageMagick
convert input.jpg -resize 800x600 -quality 85 output.jpg

# Otimizar com JPEGoptim
jpegoptim --size=200k *.jpg
```

### Performance
- Comprima imagens antes de usar
- Use CDN para bibliotecas se necessário
- Minimize CSS/JS para produção
- Configure cache do servidor

## 🚀 Deploy

### Hospedagem Estática
- GitHub Pages
- Netlify
- Vercel
- Firebase Hosting

### Hospedagem Tradicional
- Upload via FTP
- Mantenha estrutura de pastas
- Configure permissões adequadas

---

**Seu catálogo digital está pronto para impressionar! 🎉**

