// 互換性とエラーハンドリング

// ライブラリの存在チェック
const checkDependencies = () => {
    const dependencies = {
        THREE: typeof THREE !== 'undefined',
        gsap: typeof gsap !== 'undefined',
        ScrollTrigger: typeof ScrollTrigger !== 'undefined'
    };
    
    console.log('依存関係チェック:', dependencies);
    return dependencies;
};

// エラーハンドリング
window.addEventListener('error', (e) => {
    console.error('エラー検出:', e.error);
    
    // Three.js関連のエラー
    if (e.message.includes('THREE')) {
        console.warn('Three.jsのエラーを検出。3D機能を無効化します。');
        const canvas = document.getElementById('three-canvas');
        if (canvas) canvas.style.display = 'none';
    }
    
    // GSAP関連のエラー
    if (e.message.includes('gsap') || e.message.includes('GSAP')) {
        console.warn('GSAPのエラーを検出。代替アニメーションに切り替えます。');
    }
});

// パフォーマンス監視
const performanceMonitor = {
    fps: 0,
    lastTime: performance.now(),
    frames: 0,
    
    update() {
        this.frames++;
        const currentTime = performance.now();
        
        if (currentTime >= this.lastTime + 1000) {
            this.fps = Math.round((this.frames * 1000) / (currentTime - this.lastTime));
            this.frames = 0;
            this.lastTime = currentTime;
            
            // FPSが低い場合、重いエフェクトを無効化
            if (this.fps < 30 && this.fps > 0) {
                console.warn(`低FPS検出: ${this.fps}fps - エフェクトを軽減します`);
                this.reduceLaggyEffects();
            }
        }
        
        requestAnimationFrame(() => this.update());
    },
    
    reduceLaggyEffects() {
        // Three.jsのパーティクル数を減らす
        if (window.particleCount) {
            window.particleCount = Math.max(100, window.particleCount / 2);
        }
        
        // CSSアニメーションを簡略化
        document.documentElement.style.setProperty('--animation-duration', '0.3s');
    },
    
    start() {
        this.update();
    }
};

// モバイルデバイス検出
const isMobile = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

// モバイルの場合、重いエフェクトを自動的に無効化
if (isMobile()) {
    console.log('モバイルデバイスを検出。パフォーマンス最適化を適用。');
    
    // Three.jsのキャンバスを非表示
    document.addEventListener('DOMContentLoaded', () => {
        const canvas = document.getElementById('three-canvas');
        if (canvas) {
            canvas.style.display = 'none';
        }
        
        // パーティクルエフェクトを無効化
        if (window.createParticle) {
            window.createParticle = () => {};
        }
    });
}

// CSSとJSの競合を修正
document.addEventListener('DOMContentLoaded', () => {
    // 重複するアニメーションクラスを整理
    const animatedElements = document.querySelectorAll('[class*="animate"], [class*="fade"], [class*="slide"]');
    
    animatedElements.forEach(element => {
        // GSAPでアニメーションされる要素からCSSアニメーションを削除
        if (element.hasAttribute('data-gsap-animated')) {
            element.style.animation = 'none';
        }
    });
    
    // スクロールスムージングの競合を解決
    if (typeof gsap !== 'undefined' && gsap.plugins && gsap.plugins.scrollTo) {
        // GSAPのScrollToPluginが存在する場合、CSSのscroll-behaviorを無効化
        document.documentElement.style.scrollBehavior = 'auto';
    }
});

// 初期化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        checkDependencies();
        if (!isMobile()) {
            performanceMonitor.start();
        }
    });
} else {
    checkDependencies();
    if (!isMobile()) {
        performanceMonitor.start();
    }
}

console.log('互換性修正スクリプトを読み込みました');