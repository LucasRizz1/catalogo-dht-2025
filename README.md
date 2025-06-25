# 📱 Catálogo Digital Mobile

Um catálogo digital moderno e responsivo, otimizado para dispositivos móveis, baseado no projeto HTML5FoldableFlipBookExample.

## ✨ Características Principais

- 📱 **Mobile-First**: Otimizado para smartphones e tablets
- 🎨 **Design Moderno**: Interface com gradientes e efeitos glassmorphism
- 🔍 **Zoom Avançado**: Zoom de 2.5x com navegação por arrasto
- 👆 **Gestos Intuitivos**: Duplo toque e pinça para zoom
- ⚡ **Performance**: Carregamento rápido e animações suaves
- 🎯 **Navegação Fácil**: Botões laterais e indicador de página

## 🚀 Início Rápido

### 1. Preparar suas imagens
- Formate suas páginas como imagens JPG
- Nomeie sequencialmente: `1.jpg`, `2.jpg`, `3.jpg`, etc.
- Coloque na pasta `pages/`

### 2. Configurar o catálogo
- Abra `index.html`
- Atualize a variável `maxpage` com o número de páginas
- Personalize o título em `bookname`

### 3. Testar localmente
- Use um servidor local (Live Server, Python, etc.)
- Acesse através de `http://localhost:porta/`

## 📁 Estrutura do Projeto

```
catalogo-digital/
├── index.html          # Arquivo principal
├── pages/              # Suas imagens do catálogo
│   ├── 1.jpg
│   ├── 2.jpg
│   └── ...
├── css/                # Estilos
├── js/                 # Scripts
├── lib/                # Bibliotecas TurnJS
└── extras/             # jQuery e dependências
```

## 🎮 Como Usar

### Navegação
- **Próxima/Anterior**: Toque nas setas laterais
- **Virar página**: Deslize o dedo na tela

### Zoom
- **Zoom rápido**: Duplo toque na página
- **Zoom com botões**: Use os ícones de lupa
- **Zoom personalizado**: Gesto de pinça (dois dedos)
- **Navegar com zoom**: Arraste quando ampliado

## 🛠️ Personalização

### Alterar Cores
```css
/* No CSS, modifique o gradiente de fundo */
background: linear-gradient(135deg, #sua-cor-1 0%, #sua-cor-2 100%);
```

### Configurar Páginas
```javascript
// No JavaScript, atualize estas variáveis
var catalogConfig = {
    maxpage: 10,        // Número de páginas
    bookname: "Meu Catálogo"
};
```

## 📱 Compatibilidade

- ✅ iOS Safari
- ✅ Android Chrome
- ✅ Firefox Mobile
- ✅ Desktop (Chrome, Firefox, Safari, Edge)

## 🔧 Tecnologias

- HTML5 + CSS3
- JavaScript (ES5)
- jQuery 1.7
- TurnJS
- FontAwesome

## 📖 Documentação Completa

Consulte `DOCUMENTACAO.md` para instruções detalhadas, solução de problemas e guia de personalização avançada.

## 🤝 Contribuição

Este projeto é baseado no [HTML5FoldableFlipBookExample](https://github.com/habibieamrullah/HTML5FoldableFlipBookExample) com melhorias significativas para uso mobile e comercial.

## 📄 Licença

MIT License - Veja o arquivo original do projeto base para detalhes.

---

**Transforme suas apresentações em catálogos digitais profissionais! 🚀**

