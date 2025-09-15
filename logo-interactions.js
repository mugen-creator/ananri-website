// ロゴインタラクション

document.addEventListener('DOMContentLoaded', () => {
    // ロゴのホラーエフェクト
    const logos = document.querySelectorAll('.loading-logo, .hero-logo, .logo-image');
    
    // ランダムにロゴがグリッチする
    setInterval(() => {
        const randomLogo = logos[Math.floor(Math.random() * logos.length)];
        if (randomLogo && Math.random() > 0.9) {
            randomLogo.classList.add('glitch-logo');
            setTimeout(() => {
                randomLogo.classList.remove('glitch-logo');
            }, 300);
        }
    }, 3000);
    
    // スクロールでヘッダーロゴが変化
    window.addEventListener('scroll', () => {
        const header = document.querySelector('.main-header');
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    // ドライバロゴのイースターエッグ
    const driverLogo = document.querySelector('.driver-logo');
    let clickCount = 0;
    
    if (driverLogo) {
        // ドライバロゴをクリック可能にする特殊コマンド
        document.addEventListener('keydown', (e) => {
            if (e.key === 'd' && e.ctrlKey && e.shiftKey) {
                driverLogo.style.pointerEvents = 'auto';
                driverLogo.style.opacity = '0.5';
                driverLogo.style.cursor = 'pointer';
                
                setTimeout(() => {
                    driverLogo.style.pointerEvents = 'none';
                    driverLogo.style.opacity = '0.1';
                }, 5000);
            }
        });
        
        driverLogo.addEventListener('click', () => {
            clickCount++;
            
            if (clickCount === 3) {
                // 画面全体が狂う
                document.body.style.animation = 'reality-break 2s';
                
                // 全てのロゴが回転
                logos.forEach(logo => {
                    logo.style.animation = 'insane-rotation 1s';
                });
                
                // 警告メッセージ
                const warning = document.createElement('div');
                warning.style.cssText = `
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    font-size: 5rem;
                    color: #FF0000;
                    z-index: 10000;
                    text-shadow: 0 0 50px #FF0000;
                    font-weight: 900;
                    animation: flash 0.1s infinite;
                `;
                warning.textContent = '解放';
                document.body.appendChild(warning);
                
                setTimeout(() => {
                    warning.remove();
                    document.body.style.animation = '';
                    logos.forEach(logo => {
                        logo.style.animation = '';
                    });
                    clickCount = 0;
                }, 2000);
            }
        });
    }
    
    // ローディングロゴの特殊演出
    const loadingLogos = document.querySelectorAll('.loading-logo');
    loadingLogos.forEach((logo, index) => {
        logo.addEventListener('animationiteration', () => {
            if (Math.random() > 0.95) {
                // たまに全てのロゴが同期する
                loadingLogos.forEach(l => {
                    l.style.animationDelay = '0s';
                });
                
                setTimeout(() => {
                    loadingLogos.forEach((l, i) => {
                        l.style.animationDelay = `${i * 0.5}s`;
                    });
                }, 1000);
            }
        });
    });
    
    // ヒーローロゴのマウス追従
    const heroLogo = document.querySelector('.hero-logo');
    if (heroLogo) {
        document.addEventListener('mousemove', (e) => {
            const rect = heroLogo.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            const angleX = (e.clientY - centerY) / 50;
            const angleY = (e.clientX - centerX) / 50;
            
            heroLogo.style.transform = `
                translate(-50%, -50%) 
                perspective(1000px) 
                rotateX(${-angleX}deg) 
                rotateY(${angleY}deg)
            `;
        });
    }
});

// 現実崩壊アニメーション
const style = document.createElement('style');
style.textContent = `
    @keyframes reality-break {
        0% { 
            filter: none;
            transform: none;
        }
        10% { 
            filter: invert(1) hue-rotate(90deg);
            transform: skew(5deg);
        }
        20% { 
            filter: invert(0) hue-rotate(180deg);
            transform: skew(-5deg) scale(1.1);
        }
        30% { 
            filter: invert(1) hue-rotate(270deg);
            transform: skew(10deg) scale(0.9);
        }
        40% { 
            filter: invert(0) saturate(0);
            transform: skew(-10deg);
        }
        50% { 
            filter: invert(1) contrast(2);
            transform: rotate(5deg) scale(1.2);
        }
        60% { 
            filter: invert(0) brightness(2);
            transform: rotate(-5deg) scale(0.8);
        }
        70% { 
            filter: invert(1) sepia(1);
            transform: skew(15deg);
        }
        80% { 
            filter: invert(0) blur(5px);
            transform: skew(-15deg) scale(1.1);
        }
        90% { 
            filter: invert(1) hue-rotate(360deg);
            transform: rotate(10deg);
        }
        100% { 
            filter: none;
            transform: none;
        }
    }
    
    @keyframes flash {
        0%, 100% { opacity: 1; }
        50% { opacity: 0; }
    }
`;
document.head.appendChild(style);