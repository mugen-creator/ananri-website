// GSAP登録
if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

// ローディングアニメーション
window.addEventListener('load', () => {
    if (typeof gsap === 'undefined') {
        // GSAPが読み込まれていない場合のフォールバック
        document.getElementById('loading').style.display = 'none';
        return;
    }
    
    // プログレスパーセンテージ更新
    let progress = { value: 0 };
    gsap.to(progress, {
        value: 100,
        duration: 2.5,
        ease: 'power2.inOut',
        onUpdate: () => {
            const progressText = document.querySelector('.progress-text');
            if (progressText) {
                progressText.textContent = Math.round(progress.value) + '%';
            }
        }
    });
    
    const tl = gsap.timeline();
    
    // 漢字アニメーション
    tl.from('.loading-kanji', {
        scale: 0,
        rotation: 180,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'back.out(1.7)',
        force3D: true
    })
    // メインタイトル
    .from('.loading-title', {
        scale: 0.5,
        opacity: 0,
        duration: 1,
        ease: 'power4.out'
    }, '-=0.5')
    // サブタイトル
    .from('.subtitle-text', {
        y: 20,
        opacity: 0,
        duration: 0.5
    }, '-=0.3')
    // 墨が広がるエフェクト
    .to('.ink-drop, .ink-drop-2, .ink-drop-3', {
        scale: 50,
        opacity: 0,
        duration: 1.5,
        stagger: 0.1,
        ease: 'power2.inOut'
    }, '+=0.5')
    .to('.loading-kanji', {
        y: -200,
        opacity: 0,
        rotation: 360,
        duration: 1,
        stagger: 0.05,
        ease: 'power2.in'
    }, '-=1')
    .to('.loading-title, .loading-subtitle', {
        scale: 1.5,
        opacity: 0,
        duration: 0.8,
        ease: 'power2.in'
    }, '-=0.5')
    .to('.loading-bg-pattern', {
        scale: 5,
        opacity: 0,
        duration: 1,
        ease: 'power2.inOut'
    }, '-=0.5')
    .to('#loading', {
        opacity: 0,
        duration: 0.5,
        onComplete: () => {
            document.getElementById('loading').style.display = 'none';
            initAnimations();
        }
    });
    
    // プログレスバーアニメーション
    gsap.to('.progress-bar', {
        width: '100%',
        duration: 2.5,
        ease: 'power2.inOut'
    });
    
    // パーティクル生成
    createLoadingParticles();
});

// ローディングパーティクル
function createLoadingParticles() {
    const container = document.querySelector('.loading-particles');
    if (!container) return;
    
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: absolute;
            width: 3px;
            height: 3px;
            background: ${['#6A0DAD', '#FF69B4', '#CC5500'][Math.floor(Math.random() * 3)]};
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: particle-float ${5 + Math.random() * 10}s linear infinite;
            animation-delay: ${Math.random() * 5}s;
        `;
        container.appendChild(particle);
    }
}

// メインアニメーション初期化
function initAnimations() {
    // ヒーロータイトルアニメーション
    gsap.from('.title-main', {
        y: 100,
        opacity: 0,
        duration: 1.5,
        ease: 'power4.out',
        force3D: true,
        will-change: 'transform'
    });
    
    gsap.from('.title-sub', {
        y: 50,
        opacity: 0,
        duration: 1.5,
        delay: 0.3,
        ease: 'power4.out',
        force3D: true
    });
    
    gsap.from('.cta-btn', {
        scale: 0,
        opacity: 0,
        duration: 1,
        delay: 0.6,
        ease: 'back.out(1.7)',
        force3D: true
    });
    
    // パララックススクロール
    initParallax();
    
    // スクロールトリガーアニメーション
    initScrollAnimations();
    
    // マウスフォロワー
    initCursorEffects();
    
    // インタラクティブカード
    initInteractiveCards();
}

// パララックススクロール
function initParallax() {
    document.querySelectorAll('.parallax-layer').forEach(layer => {
        const speed = layer.dataset.speed || 0.5;
        
        gsap.to(layer, {
            y: () => window.innerHeight * speed,
            ease: 'none',
            scrollTrigger: {
                trigger: layer.closest('section'),
                start: 'top bottom',
                end: 'bottom top',
                scrub: true
            }
        });
    });
    
    // 浮遊する漢字
    document.querySelectorAll('.floating-kanji').forEach((kanji, index) => {
        gsap.to(kanji, {
            y: 'random(-100, 100)',
            x: 'random(-50, 50)',
            rotation: 'random(-30, 30)',
            duration: 'random(10, 20)',
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            delay: index * 0.5
        });
    });
}

// スクロールトリガーアニメーション
function initScrollAnimations() {
    // セクションフェードイン
    gsap.utils.toArray('section').forEach(section => {
        gsap.from(section, {
            opacity: 0,
            y: 100,
            duration: 1.5,
            scrollTrigger: {
                trigger: section,
                start: 'top 80%',
                end: 'top 50%',
                scrub: 1
            }
        });
    });
    
    // タイトルアニメーション
    gsap.utils.toArray('.section-title').forEach(title => {
        const letters = title.textContent.split('').map(letter => 
            `<span class="letter">${letter}</span>`
        ).join('');
        title.innerHTML = letters;
        
        gsap.from(title.querySelectorAll('.letter'), {
            opacity: 0,
            y: 50,
            rotationX: -90,
            stagger: 0.05,
            duration: 1,
            ease: 'back.out(1.7)',
            scrollTrigger: {
                trigger: title,
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            }
        });
    });
    
    // カードアニメーション
    gsap.utils.toArray('.world-item, .product-category, .underground-item').forEach(card => {
        gsap.from(card, {
            scale: 0.8,
            opacity: 0,
            duration: 1,
            scrollTrigger: {
                trigger: card,
                start: 'top 85%',
                toggleActions: 'play none none reverse'
            }
        });
    });
}

// カーソルエフェクト
function initCursorEffects() {
    const cursor = document.querySelector('.cursor-follower');
    const brush = document.querySelector('.cursor-brush');
    let mouseX = 0, mouseY = 0;
    let brushX = 0, brushY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // カーソル追従
        gsap.to(cursor, {
            x: mouseX - 15,
            y: mouseY - 15,
            duration: 0.3,
            ease: 'power2.out'
        });
        
        // ブラシエフェクト
        gsap.to(brush, {
            x: mouseX - 25,
            y: mouseY - 25,
            duration: 0.8,
            ease: 'power2.out'
        });
    });
    
    // ホバーエフェクト
    document.querySelectorAll('a, button, .world-item, .product-category').forEach(el => {
        el.addEventListener('mouseenter', () => {
            gsap.to(cursor, {
                scale: 2,
                backgroundColor: 'rgba(255, 105, 180, 0.5)',
                duration: 0.3
            });
        });
        
        el.addEventListener('mouseleave', () => {
            gsap.to(cursor, {
                scale: 1,
                backgroundColor: 'rgba(106, 13, 173, 0.5)',
                duration: 0.3
            });
        });
    });
}

// インタラクティブカード
function initInteractiveCards() {
    // 3Dチルトエフェクト
    document.querySelectorAll('.tilt-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            gsap.to(card, {
                rotationX: rotateX,
                rotationY: rotateY,
                transformPerspective: 1000,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
        
        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                rotationX: 0,
                rotationY: 0,
                duration: 0.5,
                ease: 'power2.out'
            });
        });
    });
    
    // マグネティックボタン
    document.querySelectorAll('.magnetic').forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            gsap.to(btn, {
                x: x * 0.3,
                y: y * 0.3,
                duration: 0.3,
                ease: 'power2.out'
            });
            
            gsap.to(btn.querySelector('.btn-text'), {
                x: x * 0.15,
                y: y * 0.15,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
        
        btn.addEventListener('mouseleave', () => {
            gsap.to(btn, {
                x: 0,
                y: 0,
                duration: 0.5,
                ease: 'elastic.out(1, 0.3)'
            });
            
            gsap.to(btn.querySelector('.btn-text'), {
                x: 0,
                y: 0,
                duration: 0.5,
                ease: 'elastic.out(1, 0.3)'
            });
        });
    });
}

// ENTERボタンエフェクト
document.querySelector('.cta-btn').addEventListener('click', function(e) {
    // パーティクル爆発エフェクト
    createExplosionEffect(this);
    
    // フェードエフェクト
    gsap.to('body', {
        filter: 'brightness(2)',
        duration: 0.2,
        yoyo: true,
        repeat: 1
    });
});

// 爆発エフェクト
function createExplosionEffect(element) {
    const rect = element.getBoundingClientRect();
    const particles = 30;
    
    for (let i = 0; i < particles; i++) {
        const particle = document.createElement('div');
        particle.className = 'explosion-particle';
        particle.style.left = rect.left + rect.width / 2 + 'px';
        particle.style.top = rect.top + rect.height / 2 + 'px';
        document.body.appendChild(particle);
        
        const angle = (Math.PI * 2 * i) / particles;
        const velocity = 200 + Math.random() * 200;
        
        gsap.to(particle, {
            x: Math.cos(angle) * velocity,
            y: Math.sin(angle) * velocity,
            opacity: 0,
            scale: 0,
            duration: 1,
            ease: 'power2.out',
            onComplete: () => particle.remove()
        });
    }
}

// スムーススクロール改良版
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            // ScrollToPluginがない場合のフォールバック
            if (gsap.plugins && gsap.plugins.scrollTo) {
                gsap.to(window, {
                    scrollTo: {
                        y: target,
                        offsetY: 80
                    },
                    duration: 1.5,
                    ease: 'power3.inOut'
                });
            } else {
                // 通常のスクロール
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - 80;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        }
    });
});

// フォーム送信アニメーション
const contactForm = document.querySelector('.contact-form form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // 送信ボタンアニメーション
        const submitBtn = this.querySelector('.submit-btn');
        
        gsap.to(submitBtn, {
            scale: 0.95,
            duration: 0.1,
            yoyo: true,
            repeat: 1,
            onComplete: () => {
                // 成功メッセージ
                const message = document.createElement('div');
                message.className = 'success-message';
                message.textContent = '闇への伝言を受け取りました...';
                message.style.cssText = `
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    background: linear-gradient(135deg, #6A0DAD, #FF69B4);
                    color: white;
                    padding: 2rem 3rem;
                    border-radius: 10px;
                    font-size: 1.2rem;
                    z-index: 10000;
                    box-shadow: 0 10px 40px rgba(106, 13, 173, 0.5);
                `;
                document.body.appendChild(message);
                
                gsap.from(message, {
                    scale: 0,
                    rotation: 180,
                    duration: 0.5,
                    ease: 'back.out(1.7)'
                });
                
                gsap.to(message, {
                    opacity: 0,
                    y: -50,
                    duration: 0.5,
                    delay: 2,
                    onComplete: () => message.remove()
                });
                
                this.reset();
            }
        });
    });
}

// 時間による背景変化（改良版）
function updateTimeBasedTheme() {
    const hour = new Date().getHours();
    
    if (hour >= 0 && hour < 6) {
        // 深夜モード
        document.body.classList.add('midnight-mode');
        gsap.to(':root', {
            '--color-purple': '#9D50BB',
            '--color-pink': '#FF1744',
            duration: 2
        });
    } else if (hour >= 18 && hour < 24) {
        // 夕暮れモード
        document.body.classList.add('twilight-mode');
        gsap.to(':root', {
            '--color-red': '#FF5722',
            '--color-purple': '#7C4DFF',
            duration: 2
        });
    }
}

updateTimeBasedTheme();

// シークレットコード（改良版）
let secretCode = [];
const correctCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight'];

document.addEventListener('keydown', function(e) {
    secretCode.push(e.key);
    secretCode = secretCode.slice(-8);
    
    if (JSON.stringify(secretCode) === JSON.stringify(correctCode)) {
        // 秘密のポータル開放
        const portal = document.createElement('div');
        portal.className = 'secret-portal';
        portal.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 0;
            height: 0;
            border-radius: 50%;
            background: radial-gradient(circle, #FF69B4, #6A0DAD, #000);
            z-index: 9999;
        `;
        document.body.appendChild(portal);
        
        gsap.to(portal, {
            width: '200vw',
            height: '200vh',
            duration: 2,
            ease: 'power4.inOut',
            onComplete: () => {
                document.querySelectorAll('.underground-item.locked').forEach(item => {
                    item.classList.remove('locked');
                    const icon = item.querySelector('.lock-icon');
                    if (icon) {
                        gsap.to(icon, {
                            rotation: 360,
                            scale: 0,
                            duration: 1,
                            onComplete: () => icon.remove()
                        });
                    }
                });
                
                gsap.to(portal, {
                    opacity: 0,
                    duration: 1,
                    onComplete: () => portal.remove()
                });
            }
        });
    }
});

console.log('%c暗暗裏へようこそ', 'font-size: 30px; color: #FF69B4; text-shadow: 2px 2px 4px #6A0DAD;');
console.log('%c真実は闇の中にある...', 'font-size: 16px; color: #6A0DAD;');