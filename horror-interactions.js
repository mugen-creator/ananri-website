// シュールホラーインタラクション

// 不気味な音声効果（Web Audio API）
class CreepyAudio {
    constructor() {
        this.audioContext = null;
        this.initAudio();
    }
    
    initAudio() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch(e) {
            console.log('Web Audio APIは利用できません');
        }
    }
    
    playWhisper() {
        if (!this.audioContext) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(100 + Math.random() * 50, this.audioContext.currentTime);
        
        gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.02, this.audioContext.currentTime + 0.1);
        gainNode.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + 1);
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.start();
        oscillator.stop(this.audioContext.currentTime + 1);
    }
}

const creepyAudio = new CreepyAudio();

// 不気味なカーソル追跡
document.addEventListener('DOMContentLoaded', () => {
    const cursor = document.querySelector('.cursor-follower');
    let isBeingWatched = false;
    
    // ランダムにカーソルが呪われる
    setInterval(() => {
        if (Math.random() > 0.95 && cursor) {
            cursor.classList.add('cursed');
            setTimeout(() => {
                cursor.classList.remove('cursed');
            }, 3000);
        }
    }, 5000);
    
    // 画面の端に目が現れる
    function createWatchingEye() {
        const eye = document.createElement('div');
        eye.className = 'watching-eye';
        eye.style.cssText = `
            position: fixed;
            width: 40px;
            height: 20px;
            background: radial-gradient(ellipse at center, #FFF 20%, #8B0000 30%, #000 40%);
            border-radius: 50%;
            z-index: 100;
            opacity: 0;
            transition: opacity 2s;
        `;
        
        const positions = [
            { top: '10%', left: '-20px' },
            { top: '50%', right: '-20px' },
            { bottom: '10%', left: '-20px' },
            { top: '10%', right: '-20px' }
        ];
        
        const pos = positions[Math.floor(Math.random() * positions.length)];
        Object.assign(eye.style, pos);
        
        document.body.appendChild(eye);
        
        setTimeout(() => {
            eye.style.opacity = '1';
            eye.style.transform = 'translateX(30px)';
        }, 100);
        
        setTimeout(() => {
            eye.style.opacity = '0';
            setTimeout(() => eye.remove(), 2000);
        }, 5000);
    }
    
    // ランダムに目が現れる
    setInterval(createWatchingEye, 15000);
    
    // テキストの狂気度を上げる
    document.querySelectorAll('.section-title').forEach(title => {
        title.addEventListener('mouseenter', function() {
            this.style.filter = 'blur(1px)';
            this.style.transform = 'scale(1.05) rotate(-1deg)';
            
            // 囁き声を再生
            creepyAudio.playWhisper();
            
            setTimeout(() => {
                this.style.filter = '';
                this.style.transform = '';
            }, 500);
        });
    });
    
    // スクロールで現実が歪む（制限付き）
    let lastScrollY = 0;
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        const direction = scrollY > lastScrollY ? 1 : -1;
        
        // フィルター効果を制限
        const hueRotate = Math.min(scrollY * 0.01, 30); // 最大30度
        const contrast = 1 + Math.sin(scrollY * 0.001) * 0.1; // コントラスト変化を半分に
        document.body.style.filter = `hue-rotate(${hueRotate}deg) contrast(${contrast})`;
        
        // 深くスクロールするほど狂気度が増す
        if (scrollY > 1000) {
            document.body.classList.add('deep-madness');
        } else {
            document.body.classList.remove('deep-madness');
        }
        
        lastScrollY = scrollY;
    });
    
    // ランダムなグリッチ
    function randomGlitch() {
        const elements = document.querySelectorAll('h1, h2, h3, p');
        const randomElement = elements[Math.floor(Math.random() * elements.length)];
        
        if (randomElement) {
            const originalText = randomElement.textContent;
            const glitchText = originalText.split('').map(char => 
                Math.random() > 0.7 ? String.fromCharCode(Math.floor(Math.random() * 100) + 0x4E00) : char
            ).join('');
            
            randomElement.textContent = glitchText;
            
            setTimeout(() => {
                randomElement.textContent = originalText;
            }, 100);
        }
    }
    
    // ランダムにグリッチを発生させる
    setInterval(randomGlitch, 10000);
    
    // 隠しメッセージ
    const hiddenMessages = [
        '見ているぞ',
        '逃げられない',
        '君の後ろに',
        '振り返るな',
        '意識が溶ける',
        '現実は嘘',
        '助けて',
        'ここから出して'
    ];
    
    // コンソールに不気味なメッセージ
    let messageIndex = 0;
    setInterval(() => {
        console.log(`%c${hiddenMessages[messageIndex % hiddenMessages.length]}`, 
            'color: #8B0000; font-size: 20px; text-shadow: 0 0 10px #8B0000;');
        messageIndex++;
    }, 30000);
    
    // マウスが止まると何かが起こる（クラスで管理）
    let mouseTimer;
    let isMouseMoving = false;
    
    document.addEventListener('mousemove', () => {
        isMouseMoving = true;
        clearTimeout(mouseTimer);
        document.body.classList.remove('mouse-idle');
        
        mouseTimer = setTimeout(() => {
            isMouseMoving = false;
            // 静止したらクラスを追加
            document.body.classList.add('mouse-idle');
            setTimeout(() => {
                document.body.classList.remove('mouse-idle');
            }, 1000);
        }, 3000);
    });
    
    // ページ離脱時の警告（クラスで管理）
    let hasWarned = false;
    document.addEventListener('mouseleave', (e) => {
        if (e.clientY <= 0 && !hasWarned) {
            hasWarned = true;
            document.body.classList.add('escape-warning');
            
            const warning = document.createElement('div');
            warning.className = 'escape-warning-text';
            warning.textContent = '逃げるな';
            document.body.appendChild(warning);
            
            setTimeout(() => {
                document.body.classList.remove('escape-warning');
                warning.remove();
                hasWarned = false;
            }, 500);
        }
    });
});

// 時間経過で狂気度が増す（制御版）
let madnessLevel = 0;
let madnessInterval = setInterval(() => {
    madnessLevel++;
    
    // 狂気度に上限を設定
    if (madnessLevel > 30) {
        madnessLevel = 30;
        clearInterval(madnessInterval); // 30で停止
    }
    
    // エフェクトをクラスで管理（直接styleを変更しない）
    if (madnessLevel === 10) {
        document.body.classList.add('madness-level-1');
    }
    
    if (madnessLevel === 20) {
        document.body.classList.add('madness-level-2');
    }
    
    if (madnessLevel === 30) {
        document.body.classList.add('madness-level-3');
    }
}, 10000);

// リセット機能（Ctrl+Shift+Rで狂気度リセット）
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.shiftKey && e.key === 'R') {
        e.preventDefault();
        madnessLevel = 0;
        document.body.classList.remove('madness-level-1', 'madness-level-2', 'madness-level-3', 'total-madness', 'deep-madness');
        document.body.style.filter = '';
        document.body.style.animation = '';
        console.log('狂気度がリセットされました');
    }
});

console.log('%c暗暗裏へようこそ...もう遅い', 'color: #8B0000; font-size: 30px; text-shadow: 2px 2px 4px #000;');