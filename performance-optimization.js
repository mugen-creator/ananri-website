// パフォーマンス最適化スクリプト

// デバウンス関数
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// スロットル関数
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Intersection Observer でのレイジーローディング
const lazyLoadElements = () => {
    const options = {
        root: null,
        rootMargin: '50px',
        threshold: 0.01
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                
                // アニメーション開始
                if (element.dataset.animation) {
                    element.classList.add('animate-in');
                }
                
                // 画像の遅延読み込み
                if (element.dataset.src) {
                    element.src = element.dataset.src;
                    element.removeAttribute('data-src');
                }
                
                observer.unobserve(element);
            }
        });
    }, options);

    // 監視対象要素を登録
    document.querySelectorAll('[data-lazy]').forEach(element => {
        observer.observe(element);
    });
};

// requestAnimationFrame を使った滑らかなスクロール処理
let ticking = false;
function updateScrollEffects() {
    if (!ticking) {
        requestAnimationFrame(() => {
            const scrollY = window.scrollY;
            
            // パララックス効果の更新
            document.querySelectorAll('[data-parallax]').forEach(element => {
                const speed = element.dataset.parallax || 0.5;
                const yPos = -(scrollY * speed);
                element.style.transform = `translate3d(0, ${yPos}px, 0)`;
            });
            
            ticking = false;
        });
        ticking = true;
    }
}

// スクロールイベントの最適化
const optimizedScroll = throttle(updateScrollEffects, 16); // 60fps

// GPU アクセラレーションの強制
const enableGPUAcceleration = () => {
    const elements = document.querySelectorAll('.product-card, .news-card, .section-title');
    elements.forEach(el => {
        el.style.willChange = 'transform, opacity';
        el.style.transform = 'translateZ(0)';
    });
};

// メモリリークの防止
const cleanupAnimations = () => {
    // 不要なアニメーションのクリーンアップ
    if (typeof gsap !== 'undefined') {
        // スクロールトリガーのリフレッシュ
        if (typeof ScrollTrigger !== 'undefined') {
            ScrollTrigger.refresh();
        }

        // 非表示要素のアニメーション停止
        document.querySelectorAll('[style*="visibility: hidden"]').forEach(el => {
            gsap.killTweensOf(el);
        });
    }
};

// CSS アニメーションの最適化
const optimizeCSSAnimations = () => {
    // アニメーション中の要素にwill-changeを適用
    document.addEventListener('animationstart', (e) => {
        e.target.style.willChange = 'transform, opacity';
    });
    
    document.addEventListener('animationend', (e) => {
        // アニメーション終了後にwill-changeを削除
        setTimeout(() => {
            e.target.style.willChange = 'auto';
        }, 100);
    });
};

// 初期化
document.addEventListener('DOMContentLoaded', () => {
    // レイジーローディング開始
    lazyLoadElements();
    
    // GPU アクセラレーション有効化
    enableGPUAcceleration();
    
    // CSS アニメーション最適化
    optimizeCSSAnimations();
    
    // スクロールイベント登録
    window.addEventListener('scroll', optimizedScroll, { passive: true });
    
    // 定期的なメモリクリーンアップ
    setInterval(cleanupAnimations, 30000); // 30秒ごと
});

// パフォーマンスモニタリング
const monitorPerformance = () => {
    if (window.performance && window.performance.memory) {
        const memInfo = window.performance.memory;
        const usedMemory = (memInfo.usedJSHeapSize / 1048576).toFixed(2);
        const totalMemory = (memInfo.totalJSHeapSize / 1048576).toFixed(2);
        
        if (usedMemory / totalMemory > 0.9) {
            // メモリ使用率が90%を超えたら警告
            console.warn('High memory usage detected. Cleaning up...');
            cleanupAnimations();
        }
    }
};

// 5秒ごとにパフォーマンスチェック
setInterval(monitorPerformance, 5000);

// エクスポート
window.performanceOptimization = {
    debounce,
    throttle,
    cleanupAnimations,
    monitorPerformance
};