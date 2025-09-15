// Three.js 3D背景アニメーション
let scene, camera, renderer;
let particles, smokeMaterial;
let mouseX = 0, mouseY = 0;
let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;

// Three.js初期化
function initThree() {
    // シーン作成
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000000, 0.0008);

    // カメラ設定
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.z = 1000;

    // レンダラー設定
    renderer = new THREE.WebGLRenderer({
        canvas: document.getElementById('three-canvas'),
        antialias: true,
        alpha: true
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);

    // パーティクルシステム作成
    createParticles();
    
    // 煙エフェクト
    createSmokeEffect();
    
    // 浮遊する和柄
    createFloatingPatterns();

    // イベントリスナー
    document.addEventListener('mousemove', onDocumentMouseMove, false);
    window.addEventListener('resize', onWindowResize, false);
}

// パーティクルシステム
function createParticles() {
    const geometry = new THREE.BufferGeometry();
    const vertices = [];
    const colors = [];
    
    // パーティクルの色（紫、ピンク、緑のグラデーション）
    const particleColors = [
        new THREE.Color(0x6A0DAD),
        new THREE.Color(0xFF69B4),
        new THREE.Color(0x32CD32),
        new THREE.Color(0xCC5500)
    ];

    for (let i = 0; i < 2000; i++) {
        const x = Math.random() * 2000 - 1000;
        const y = Math.random() * 2000 - 1000;
        const z = Math.random() * 2000 - 1000;
        
        vertices.push(x, y, z);
        
        // ランダムな色を選択
        const color = particleColors[Math.floor(Math.random() * particleColors.length)];
        colors.push(color.r, color.g, color.b);
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

    // カスタムシェーダーマテリアル
    const material = new THREE.ShaderMaterial({
        uniforms: {
            time: { value: 0 },
            size: { value: 10.0 }
        },
        vertexShader: `
            uniform float time;
            uniform float size;
            attribute vec3 color;
            varying vec3 vColor;
            
            void main() {
                vColor = color;
                vec3 pos = position;
                
                // 時間による動き
                pos.x += sin(time * 0.001 + position.y * 0.01) * 20.0;
                pos.y += cos(time * 0.001 + position.x * 0.01) * 20.0;
                
                vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
                gl_PointSize = size * (300.0 / -mvPosition.z);
                gl_Position = projectionMatrix * mvPosition;
            }
        `,
        fragmentShader: `
            varying vec3 vColor;
            
            void main() {
                float dist = distance(gl_PointCoord, vec2(0.5));
                if (dist > 0.5) discard;
                
                float opacity = 1.0 - (dist * 2.0);
                gl_FragColor = vec4(vColor, opacity * 0.8);
            }
        `,
        blending: THREE.AdditiveBlending,
        depthTest: false,
        transparent: true,
        vertexColors: true
    });

    particles = new THREE.Points(geometry, material);
    scene.add(particles);
}

// 煙エフェクト
function createSmokeEffect() {
    const smokeTexture = new THREE.TextureLoader().load('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==');
    
    smokeMaterial = new THREE.MeshLambertMaterial({
        color: 0x6A0DAD,
        opacity: 0.1,
        transparent: true
    });

    const smokeGeometry = new THREE.PlaneGeometry(300, 300);
    
    for (let i = 0; i < 20; i++) {
        const smoke = new THREE.Mesh(smokeGeometry, smokeMaterial.clone());
        smoke.position.set(
            Math.random() * 1000 - 500,
            Math.random() * 1000 - 500,
            Math.random() * 1000 - 100
        );
        smoke.rotation.z = Math.random() * Math.PI * 2;
        smoke.material.opacity = 0.05;
        scene.add(smoke);
    }
}

// 浮遊する和柄
function createFloatingPatterns() {
    const patternGeometry = new THREE.TorusGeometry(50, 20, 8, 20);
    
    for (let i = 0; i < 5; i++) {
        const material = new THREE.MeshPhongMaterial({
            color: new THREE.Color().setHSL(Math.random(), 0.7, 0.5),
            emissive: new THREE.Color(0x6A0DAD),
            emissiveIntensity: 0.2,
            shininess: 100,
            specular: new THREE.Color(0xFF69B4),
            transparent: true,
            opacity: 0.3,
            side: THREE.DoubleSide
        });
        
        const mesh = new THREE.Mesh(patternGeometry, material);
        mesh.position.set(
            Math.random() * 800 - 400,
            Math.random() * 800 - 400,
            Math.random() * 800 - 400
        );
        mesh.rotation.set(
            Math.random() * Math.PI,
            Math.random() * Math.PI,
            Math.random() * Math.PI
        );
        
        // アニメーション用のプロパティ
        mesh.userData = {
            rotationSpeed: {
                x: Math.random() * 0.01 - 0.005,
                y: Math.random() * 0.01 - 0.005,
                z: Math.random() * 0.01 - 0.005
            }
        };
        
        scene.add(mesh);
    }

    // ライト追加
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);
    
    const pointLight = new THREE.PointLight(0xFF69B4, 1, 1000);
    pointLight.position.set(100, 100, 100);
    scene.add(pointLight);
}

// マウス動作
function onDocumentMouseMove(event) {
    mouseX = (event.clientX - windowHalfX) * 0.5;
    mouseY = (event.clientY - windowHalfY) * 0.5;
}

// ウィンドウリサイズ
function onWindowResize() {
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;
    
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// アニメーションループ
function animate() {
    requestAnimationFrame(animate);
    
    const time = Date.now() * 0.001;
    
    // カメラの動き
    camera.position.x += (mouseX - camera.position.x) * 0.05;
    camera.position.y += (-mouseY - camera.position.y) * 0.05;
    camera.lookAt(scene.position);
    
    // パーティクルアニメーション
    if (particles) {
        particles.rotation.y = time * 0.1;
        particles.material.uniforms.time.value = Date.now();
    }
    
    // 浮遊オブジェクトの回転
    scene.traverse((child) => {
        if (child instanceof THREE.Mesh && child.userData.rotationSpeed) {
            child.rotation.x += child.userData.rotationSpeed.x;
            child.rotation.y += child.userData.rotationSpeed.y;
            child.rotation.z += child.userData.rotationSpeed.z;
        }
    });
    
    renderer.render(scene, camera);
}

// 初期化実行
if (typeof THREE !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        initThree();
        animate();
    });
}

// グリッチエフェクト
class GlitchEffect {
    constructor(element) {
        this.element = element;
        this.originalText = element.textContent;
        this.init();
    }
    
    init() {
        this.element.addEventListener('mouseenter', () => this.startGlitch());
        this.element.addEventListener('mouseleave', () => this.stopGlitch());
    }
    
    startGlitch() {
        this.interval = setInterval(() => {
            const glitchText = this.originalText
                .split('')
                .map(char => Math.random() > 0.7 ? this.getRandomChar() : char)
                .join('');
            this.element.textContent = glitchText;
        }, 50);
    }
    
    stopGlitch() {
        clearInterval(this.interval);
        this.element.textContent = this.originalText;
    }
    
    getRandomChar() {
        const chars = '暗裏闇真実世界';
        return chars[Math.floor(Math.random() * chars.length)];
    }
}

// グリッチエフェクト適用
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.glitch').forEach(element => {
        new GlitchEffect(element);
    });
});