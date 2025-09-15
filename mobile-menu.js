// モバイルメニュー制御

document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const body = document.body;
    let isMenuOpen = false;
    
    // ハンバーガーメニューのクリック
    hamburger.addEventListener('click', () => {
        isMenuOpen = !isMenuOpen;
        
        if (isMenuOpen) {
            hamburger.classList.add('active');
            navMenu.classList.add('active');
            body.style.overflow = 'hidden'; // スクロール無効化
            
            // ホラーエフェクト
            navMenu.style.animation = 'menu-glitch 0.3s';
            setTimeout(() => {
                navMenu.style.animation = '';
            }, 300);
        } else {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            body.style.overflow = ''; // スクロール有効化
        }
    });
    
    // メニューリンクのクリックで閉じる
    const menuLinks = navMenu.querySelectorAll('a');
    menuLinks.forEach(link => {
        link.addEventListener('click', () => {
            isMenuOpen = false;
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            body.style.overflow = '';
        });
    });
    
    // 画面外クリックで閉じる
    document.addEventListener('click', (e) => {
        if (isMenuOpen && !navMenu.contains(e.target) && !hamburger.contains(e.target)) {
            isMenuOpen = false;
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            body.style.overflow = '';
        }
    });
    
    // スワイプで閉じる（タッチデバイス用）
    let touchStartX = 0;
    
    navMenu.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
    });
    
    navMenu.addEventListener('touchmove', (e) => {
        if (!isMenuOpen) return;
        
        const touchEndX = e.touches[0].clientX;
        const diffX = touchEndX - touchStartX;
        
        // 右スワイプで閉じる
        if (diffX > 100) {
            isMenuOpen = false;
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            body.style.overflow = '';
        }
    });
    
    // リサイズ時の処理
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            if (window.innerWidth > 767 && isMenuOpen) {
                isMenuOpen = false;
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                body.style.overflow = '';
            }
        }, 250);
    });
});

// メニューグリッチアニメーション
const style = document.createElement('style');
style.textContent = `
    @keyframes menu-glitch {
        0% {
            transform: translateX(0);
            filter: none;
        }
        20% {
            transform: translateX(-5px);
            filter: hue-rotate(90deg);
        }
        40% {
            transform: translateX(5px);
            filter: hue-rotate(180deg);
        }
        60% {
            transform: translateX(-3px);
            filter: hue-rotate(270deg);
        }
        80% {
            transform: translateX(3px);
            filter: hue-rotate(360deg);
        }
        100% {
            transform: translateX(0);
            filter: none;
        }
    }
`;
document.head.appendChild(style);

// モバイルデバイス検出と最適化
function optimizeForMobile() {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    
    if (isMobile) {
        // ビューポート高さ対応
        const setVH = () => {
            const vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
        };
        
        setVH();
        window.addEventListener('resize', setVH);
        
        // タッチイベント最適化
        document.addEventListener('touchstart', () => {}, {passive: true});
        
        // 横向き警告
        window.addEventListener('orientationchange', () => {
            if (window.orientation === 90 || window.orientation === -90) {
                // 横向きの場合の処理
                document.body.classList.add('landscape-mode');
            } else {
                document.body.classList.remove('landscape-mode');
            }
        });
    }
}

optimizeForMobile();