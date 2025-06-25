/**
 * ZoomManager - Classe para gerenciar funcionalidade de zoom em dispositivos móveis
 * Implementa pinch-to-zoom, double-tap e pan para navegação em imagens
 */
class ZoomManager {
    constructor(container, options = {}) {
        this.container = container;
        this.zoomContainer = container.querySelector('.zoom-container');
        this.image = container.querySelector('.page-image');
        this.controls = container.querySelector('.zoom-controls');
        this.indicator = container.querySelector('.zoom-indicator');
        
        this.options = {
            minZoom: 1,
            maxZoom: 4,
            zoomStep: 0.2,
            doubleTapZoom: 1.5,
            animationDuration: 300,
            showControls: true,
            showIndicator: true,
            onZoomStart: null,
            onZoomEnd: null,
            onZoomChange: null,
            ...options
        };
        
        this.state = {
            scale: 1,
            translateX: 0,
            translateY: 0,
            isZooming: false,
            isPanning: false,
            lastTouchDistance: 0,
            lastTouchCenter: { x: 0, y: 0 },
            lastTapTime: 0,
            lastPanPoint: { x: 0, y: 0 }
        };
        
        // Throttling para performance
        this.throttledUpdate = this.throttle(this.updateTransform.bind(this), 16); // 60fps
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.updateControls();
        this.updateIndicator();
        
        // Callback de inicialização
        if (this.options.onZoomStart) {
            this.options.onZoomStart.call(this);
        }
    }
    
    bindEvents() {
        // Touch events para suporte móvel
        this.zoomContainer.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: false });
        this.zoomContainer.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: false });
        this.zoomContainer.addEventListener('touchend', this.handleTouchEnd.bind(this), { passive: false });
        this.zoomContainer.addEventListener('touchcancel', this.handleTouchCancel.bind(this), { passive: false });
        
        // Controles de zoom
        if (this.controls) {
            const zoomInBtn = this.container.querySelector('.zoom-in');
            const zoomOutBtn = this.container.querySelector('.zoom-out');
            const zoomResetBtn = this.container.querySelector('.zoom-reset');
            
            if (zoomInBtn) zoomInBtn.addEventListener('click', () => this.zoomIn());
            if (zoomOutBtn) zoomOutBtn.addEventListener('click', () => this.zoomOut());
            if (zoomResetBtn) zoomResetBtn.addEventListener('click', () => this.reset());
        }
        
        // Prevenção de comportamentos padrão do navegador
        this.zoomContainer.addEventListener('gesturestart', e => e.preventDefault());
        this.zoomContainer.addEventListener('gesturechange', e => e.preventDefault());
        this.zoomContainer.addEventListener('gestureend', e => e.preventDefault());
        
        // Prevenção de context menu no mobile
        this.zoomContainer.addEventListener('contextmenu', e => e.preventDefault());
    }
    
    handleTouchStart(event) {
        event.preventDefault();
        
        const touches = Array.from(event.touches);
        
        if (touches.length === 1) {
            // Single touch - possível pan ou double tap
            const touch = touches[0];
            const now = Date.now();
            
            if (now - this.state.lastTapTime < 300 && this.state.scale <= 1) {
                // Double tap detectado - zoom in
                this.handleDoubleTap(touch);
            } else if (now - this.state.lastTapTime < 300 && this.state.scale > 1) {
                // Double tap com zoom ativo - reset
                this.reset();
            } else if (this.state.scale > 1) {
                // Início de pan (só se tiver zoom)
                this.startPan(touch);
            }
            
            this.state.lastTapTime = now;
        } else if (touches.length === 2) {
            // Desabilitado: Multi-touch - início do zoom (pinch-to-zoom)
            // this.startZoom(touches);
        }
    }
    
    handleTouchMove(event) {
        event.preventDefault();
        
        const touches = Array.from(event.touches);
        
        if (touches.length === 1 && this.state.isPanning) {
            // Pan em progresso
            this.updatePan(touches[0]);
        } else if (touches.length === 2 && this.state.isZooming) {
            // Desabilitado: Zoom em progresso
            // this.updateZoom(touches);
        }
    }
    
    handleTouchEnd(event) {
        event.preventDefault();
        
        if (event.touches.length === 0) {
            // Todos os toques terminaram
            this.endInteraction();
        } else if (event.touches.length === 1 && this.state.isZooming) {
            // Desabilitado: Transição de zoom para pan
            // this.state.isZooming = false;
            // if (this.state.scale > 1) {
            //     this.startPan(event.touches[0]);
            // }
        }
    }
    
    handleTouchCancel(event) {
        event.preventDefault();
        this.endInteraction();
    }
    
    handleDoubleTap(touch) {
        const rect = this.zoomContainer.getBoundingClientRect();
        const centerX = touch.clientX - rect.left;
        const centerY = touch.clientY - rect.top;
        
        this.setZoom(this.options.doubleTapZoom, centerX, centerY, true);
        this.showControls();
    }
    
    startZoom(touches) {
        this.state.isZooming = true;
        this.state.isPanning = false;
        this.state.lastTouchDistance = this.getTouchDistance(touches[0], touches[1]);
        this.state.lastTouchCenter = this.getTouchCenter(touches[0], touches[1]);
        
        this.zoomContainer.classList.add('zooming');
        this.showControls();
    }
    
    updateZoom(touches) {
        const currentDistance = this.getTouchDistance(touches[0], touches[1]);
        const currentCenter = this.getTouchCenter(touches[0], touches[1]);
        
        if (this.state.lastTouchDistance > 0) {
            const scaleChange = currentDistance / this.state.lastTouchDistance;
            const newScale = Math.max(this.options.minZoom, 
                             Math.min(this.options.maxZoom, this.state.scale * scaleChange));
            
            // Calcular offset para manter o centro do gesto fixo
            const rect = this.zoomContainer.getBoundingClientRect();
            const centerX = currentCenter.x - rect.left;
            const centerY = currentCenter.y - rect.top;
            
            this.setZoom(newScale, centerX, centerY, false);
        }
        
        this.state.lastTouchDistance = currentDistance;
        this.state.lastTouchCenter = currentCenter;
    }
    
    startPan(touch) {
        if (this.state.scale <= 1) return;
        
        this.state.isPanning = true;
        this.state.isZooming = false;
        this.state.lastPanPoint = {
            x: touch.clientX,
            y: touch.clientY
        };
    }
    
    updatePan(touch) {
        if (!this.state.isPanning || this.state.scale <= 1) return;
        
        const deltaX = touch.clientX - this.state.lastPanPoint.x;
        const deltaY = touch.clientY - this.state.lastPanPoint.y;
        
        this.state.translateX += deltaX;
        this.state.translateY += deltaY;
        
        this.constrainTransform();
        this.throttledUpdate();
        
        this.state.lastPanPoint = {
            x: touch.clientX,
            y: touch.clientY
        };
    }
    
    endInteraction() {
        this.state.isZooming = false;
        this.state.isPanning = false;
        this.zoomContainer.classList.remove('zooming');
        
        // Auto-hide controles após inatividade
        this.hideControlsAfterDelay();
        
        // Callback de fim de zoom
        if (this.options.onZoomEnd) {
            this.options.onZoomEnd.call(this);
        }
    }
    
    getTouchDistance(touch1, touch2) {
        return Math.sqrt(
            Math.pow(touch2.clientX - touch1.clientX, 2) +
            Math.pow(touch2.clientY - touch1.clientY, 2)
        );
    }
    
    getTouchCenter(touch1, touch2) {
        return {
            x: (touch1.clientX + touch2.clientX) / 2,
            y: (touch1.clientY + touch2.clientY) / 2
        };
    }
    
    setZoom(scale, centerX, centerY, animate = false) {
        const oldScale = this.state.scale;
        this.state.scale = Math.max(this.options.minZoom, 
                           Math.min(this.options.maxZoom, scale));
        
        if (centerX !== undefined && centerY !== undefined) {
            // Ajustar translação para manter ponto focal
            const scaleChange = this.state.scale / oldScale;
            const rect = this.container.getBoundingClientRect();
            
            const offsetX = (centerX - rect.width / 2) * (scaleChange - 1);
            const offsetY = (centerY - rect.height / 2) * (scaleChange - 1);
            
            this.state.translateX = (this.state.translateX - offsetX);
            this.state.translateY = (this.state.translateY - offsetY);
        }
        
        this.constrainTransform();
        
        if (animate) {
            this.zoomContainer.classList.remove('zooming');
        } else {
            this.zoomContainer.classList.add('zooming');
        }
        
        this.updateTransform();
        this.updateControls();
        this.updateIndicator();
        
        // Callback de mudança de zoom
        if (this.options.onZoomChange) {
            this.options.onZoomChange.call(this, this.state.scale);
        }
        
        // Remover classe de animação após delay
        if (animate) {
            setTimeout(() => {
                this.zoomContainer.classList.add('zooming');
            }, this.options.animationDuration);
        }
    }
    
    constrainTransform() {
        if (this.state.scale <= 1) {
            this.state.translateX = 0;
            this.state.translateY = 0;
            return;
        }
        
        const containerRect = this.container.getBoundingClientRect();
        
        // Usar dimensões originais da imagem, não as escaladas
        const originalImageWidth = containerRect.width;
        const originalImageHeight = containerRect.height;
        
        // Calcular quanto a imagem "cresceu" com o zoom
        const scaledWidth = originalImageWidth * this.state.scale;
        const scaledHeight = originalImageHeight * this.state.scale;
        
        // Calcular o máximo que podemos mover sem mostrar espaços brancos
        const maxTranslateX = Math.max(0, (scaledWidth - originalImageWidth) / (2 * this.state.scale));
        const maxTranslateY = Math.max(0, (scaledHeight - originalImageHeight) / (2 * this.state.scale));
        
        // Aplicar limites
        this.state.translateX = Math.max(-maxTranslateX, 
                                Math.min(maxTranslateX, this.state.translateX));
        this.state.translateY = Math.max(-maxTranslateY, 
                                Math.min(maxTranslateY, this.state.translateY));
    }
    
    updateTransform() {
        const transform = `scale(${this.state.scale}) translate(${this.state.translateX}px, ${this.state.translateY}px)`;
        this.zoomContainer.style.transform = transform;
    }
    
    updateControls() {
        if (!this.controls || !this.options.showControls) return;
        
        const zoomInBtn = this.container.querySelector('.zoom-in');
        const zoomOutBtn = this.container.querySelector('.zoom-out');
        const zoomResetBtn = this.container.querySelector('.zoom-reset');
        
        if (zoomInBtn) {
            zoomInBtn.disabled = this.state.scale >= this.options.maxZoom;
        }
        
        if (zoomOutBtn) {
            zoomOutBtn.disabled = this.state.scale <= this.options.minZoom;
        }
        
        if (zoomResetBtn) {
            zoomResetBtn.disabled = this.state.scale <= this.options.minZoom;
        }
    }
    
    updateIndicator() {
        if (!this.indicator || !this.options.showIndicator) return;
        
        const percentage = Math.round(this.state.scale * 100);
        this.indicator.textContent = `${percentage}%`;
        
        if (this.state.scale > 1) {
            this.indicator.classList.add('visible');
            
            // Auto-hide após delay
            clearTimeout(this.indicatorTimeout);
            this.indicatorTimeout = setTimeout(() => {
                this.indicator.classList.remove('visible');
            }, 2000);
        } else {
            this.indicator.classList.remove('visible');
        }
    }
    
    showControls() {
        if (!this.controls || !this.options.showControls) return;
        
        this.controls.classList.add('visible');
        this.hideControlsAfterDelay();
    }
    
    hideControlsAfterDelay() {
        if (!this.controls) return;
        
        clearTimeout(this.controlsTimeout);
        this.controlsTimeout = setTimeout(() => {
            if (this.state.scale <= 1) {
                this.controls.classList.remove('visible');
            }
        }, 3000);
    }
    
    zoomIn() {
        const newScale = Math.min(this.options.maxZoom, this.state.scale + this.options.zoomStep);
        this.setZoom(newScale, undefined, undefined, true);
        this.showControls();
    }
    
    zoomOut() {
        const newScale = Math.max(this.options.minZoom, this.state.scale - this.options.zoomStep);
        this.setZoom(newScale, undefined, undefined, true);
        
        if (newScale <= this.options.minZoom) {
            this.reset();
        } else {
            this.showControls();
        }
    }
    
    reset() {
        this.state.scale = 1;
        this.state.translateX = 0;
        this.state.translateY = 0;
        
        this.zoomContainer.classList.remove('zooming');
        this.updateTransform();
        this.updateControls();
        this.updateIndicator();
        
        if (this.controls) {
            this.controls.classList.remove('visible');
        }
        
        // Callback de mudança de zoom
        if (this.options.onZoomChange) {
            this.options.onZoomChange.call(this, this.state.scale);
        }
    }
    
    // Utility function para throttling
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }
    
    // Método para limpeza (importante para evitar memory leaks)
    destroy() {
        // Remover event listeners
        this.zoomContainer.removeEventListener('touchstart', this.handleTouchStart);
        this.zoomContainer.removeEventListener('touchmove', this.handleTouchMove);
        this.zoomContainer.removeEventListener('touchend', this.handleTouchEnd);
        this.zoomContainer.removeEventListener('touchcancel', this.handleTouchCancel);
        
        // Limpar timeouts
        clearTimeout(this.indicatorTimeout);
        clearTimeout(this.controlsTimeout);
        
        // Limpar referências
        this.container = null;
        this.zoomContainer = null;
        this.image = null;
        this.controls = null;
        this.indicator = null;
    }
    
    // Getters para estado atual
    get isZoomed() {
        return this.state.scale > 1;
    }
    
    get currentScale() {
        return this.state.scale;
    }
    
    get isActive() {
        return this.state.isZooming || this.state.isPanning || this.isZoomed;
    }
}

