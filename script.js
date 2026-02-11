/* ==========================================
   ULTIMATE 3D LOVE UNIVERSE FOR SAKSHI - JAVASCRIPT
   Enhanced with counters, map, letters, and more!
   ========================================== */

// Global variables
let mouseX = 0, mouseY = 0;
let heroScene, heroCamera, heroRenderer, heroHeart, heroGlow, heroStars;
let storyScene, storyCamera, storyRenderer, storyOrbs = [];
let galleryScene, galleryCamera, galleryRenderer;
let portalScene, portalCamera, portalRenderer, portalRing, portalGlow;
let proposalScene, proposalCamera, proposalRenderer, proposalPetals;
let mapScene, mapCamera, mapRenderer;

// Wait for everything to load
window.addEventListener('load', () => {
    console.log('Starting initialization for Sakshi...');
    setTimeout(init, 100);
});

function init() {
    try {
        console.log('Initializing...');
        
        // Register GSAP plugins
        if (typeof gsap !== 'undefined') {
            gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
            console.log('GSAP loaded successfully');
        }
        
        // Initialize NEW features
        initDaysCounter();
        initLoveLetters();
        
        // Initialize existing features
        setupCustomCursor();
        setupParticles();
        setupHiddenStars();
        setupTeddyBear();
        setupEnvelope();
        setupMusicToggle();
        setupScrollProgress();
        setupClickRipples();
        
        // Initialize 3D scenes
        if (typeof THREE !== 'undefined') {
            console.log('Three.js loaded successfully');
            initHeroScene();
            initMapScene();
            initStoryScene();
            initGalleryScene();
            initPortalScene();
            initProposalScene();
        } else {
            console.error('Three.js not loaded');
        }
        
        // Setup interactions
        setupHeroInteractions();
        setupStoryInteractions();
        setupGalleryInteractions();
        setupPortalInteractions();
        setupProposalInteractions();
        
        // Hide preloader
        setTimeout(() => {
            const preloader = document.getElementById('preloader');
            if (preloader) {
                preloader.classList.add('hidden');
            }
        }, 2000);
        
        // Start animation loop
        animate();
        
        console.log('Initialization complete! Universe created for Sakshi 💖');
    } catch (error) {
        console.error('Initialization error:', error);
    }
}

/* ==========================================
   NEW: DAYS COUNTER
   ========================================== */
function initDaysCounter() {
    const proposalDate = new Date('2024-03-15');
    const counterElement = document.getElementById('days-counter');
    
    function updateCounter() {
        const today = new Date();
        const diffTime = Math.abs(today - proposalDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (counterElement) {
            counterElement.textContent = diffDays.toLocaleString();
        }
    }
    
    updateCounter();
    setInterval(updateCounter, 60000); // Update every minute
}

/* ==========================================
   NEW: LOVE LETTERS
   ========================================== */
function initLoveLetters() {
    const letters = document.querySelectorAll('.love-letter');
    
    letters.forEach(letter => {
        const envelope = letter.querySelector('.letter-envelope');
        const content = letter.querySelector('.letter-content');
        
        envelope.addEventListener('click', () => {
            letter.classList.toggle('opened');
            playSound('click');
            
            if (letter.classList.contains('opened')) {
                gsap.to(content, {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    ease: 'power2.out'
                });
            } else {
                gsap.to(content, {
                    opacity: 0,
                    y: 20,
                    duration: 0.5
                });
            }
        });
    });
}

/* ==========================================
   NEW: MAP SCENE - THREE.JS
   ========================================== */
function initMapScene() {
    try {
        const canvas = document.getElementById('map-canvas');
        if (!canvas) return;
        
        mapScene = new THREE.Scene();
        mapCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        mapRenderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
        mapRenderer.setSize(window.innerWidth, window.innerHeight);
        mapRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        
        mapCamera.position.z = 5;
        
        // Create particles for map background
        const particleGeometry = new THREE.BufferGeometry();
        const particleMaterial = new THREE.PointsMaterial({
            color: 0xFFB6C1,
            size: 0.02,
            transparent: true,
            opacity: 0.4
        });
        
        const particleVertices = [];
        for (let i = 0; i < 300; i++) {
            particleVertices.push(
                (Math.random() - 0.5) * 20,
                (Math.random() - 0.5) * 20,
                (Math.random() - 0.5) * 10
            );
        }
        
        particleGeometry.setAttribute('position', new THREE.Float32BufferAttribute(particleVertices, 3));
        const particles = new THREE.Points(particleGeometry, particleMaterial);
        mapScene.add(particles);
        
        mapScene.userData = { particles };
        
        console.log('Map scene initialized');
    } catch (error) {
        console.error('Map scene error:', error);
    }
}

function animateMapScene() {
    if (!mapScene || !mapCamera || !mapRenderer) return;
    
    try {
        if (mapScene.userData && mapScene.userData.particles) {
            mapScene.userData.particles.rotation.y += 0.0005;
        }
        mapRenderer.render(mapScene, mapCamera);
    } catch (error) {
        console.error('Map animation error:', error);
    }
}

/* ==========================================
   CUSTOM CURSOR
   ========================================== */
function setupCustomCursor() {
    const cursor = document.querySelector('.custom-cursor');
    const cursorHeart = document.querySelector('.cursor-heart');
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        gsap.to(cursor, {
            x: e.clientX,
            y: e.clientY,
            duration: 0.1
        });
        
        gsap.to(cursorHeart, {
            x: e.clientX + 10,
            y: e.clientY - 10,
            duration: 0.2
        });
    });
    
    // Cursor interactions
    document.querySelectorAll('button, .story-orb-trigger, .gallery-item, .hidden-star, .love-letter').forEach(el => {
        el.addEventListener('mouseenter', () => {
            gsap.to(cursor, { scale: 1.5, duration: 0.3 });
        });
        el.addEventListener('mouseleave', () => {
            gsap.to(cursor, { scale: 1, duration: 0.3 });
        });
    });
}

/* ==========================================
   FLOATING PARTICLES
   ========================================== */
function setupParticles() {
    const container = document.getElementById('particle-container');
    
    document.addEventListener('mousemove', (e) => {
        if (Math.random() > 0.95) {
            createParticle(e.clientX, e.clientY);
        }
    });
    
    function createParticle(x, y) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.textContent = '💖';
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        container.appendChild(particle);
        
        setTimeout(() => particle.remove(), 3000);
    }
}

/* ==========================================
   CLICK RIPPLES
   ========================================== */
function setupClickRipples() {
    const container = document.getElementById('ripple-container');
    
    document.addEventListener('click', (e) => {
        createRipple(e.clientX, e.clientY);
    });
    
    function createRipple(x, y) {
        const ripple = document.createElement('div');
        ripple.className = 'heart-ripple';
        ripple.style.left = (x - 10) + 'px';
        ripple.style.top = (y - 10) + 'px';
        container.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 1000);
    }
}

/* ==========================================
   HIDDEN STARS
   ========================================== */
function setupHiddenStars() {
    const stars = document.querySelectorAll('.hidden-star');
    
    stars.forEach(star => {
        star.addEventListener('click', () => {
            const message = star.getAttribute('data-message');
            showStarMessage(message);
            playSound('click');
        });
    });
}

function showStarMessage(message) {
    const messageEl = document.createElement('div');
    messageEl.className = 'star-message';
    messageEl.textContent = message;
    document.body.appendChild(messageEl);
    
    setTimeout(() => messageEl.classList.add('show'), 10);
    
    setTimeout(() => {
        messageEl.classList.remove('show');
        setTimeout(() => messageEl.remove(), 600);
    }, 3000);
}

/* ==========================================
   TEDDY BEAR
   ========================================== */
function setupTeddyBear() {
    const teddy = document.querySelector('.teddy-bear');
    
    teddy.addEventListener('click', () => {
        showStarMessage("I built this entire universe because Sakshi built mine. From 15th March 2024 onwards, everything changed with Kashu. 🧸💖");
        playSound('click');
    });
}

/* ==========================================
   ENVELOPE
   ========================================== */
function setupEnvelope() {
    const envelope = document.querySelector('.envelope');
    
    envelope.addEventListener('click', () => {
        showStarMessage("From 15th March 2024 till forever... Through Anand and Vellore, through calls and texts, through everything... I choose Sakshi. Every single day. 💌💍");
        playSound('click');
    });
}

/* ==========================================
   MUSIC TOGGLE
   ========================================== */
function setupMusicToggle() {
    const toggle = document.getElementById('music-toggle');
    const music = document.getElementById('background-music');
    let isPlaying = false;
    
    toggle.addEventListener('click', () => {
        if (isPlaying) {
            music.pause();
            toggle.classList.remove('playing');
        } else {
            music.play().catch(() => {
                console.log('Audio play prevented by browser');
            });
            toggle.classList.add('playing');
        }
        isPlaying = !isPlaying;
    });
}

/* ==========================================
   SCROLL PROGRESS
   ========================================== */
function setupScrollProgress() {
    const progress = document.querySelector('.scroll-progress');
    
    window.addEventListener('scroll', () => {
        const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        progress.style.width = scrollPercent + '%';
    });
}

/* ==========================================
   HERO SCENE - THREE.JS
   ========================================== */
function initHeroScene() {
    try {
        const canvas = document.getElementById('hero-canvas');
        if (!canvas) {
            console.error('Hero canvas not found');
            return;
        }
        
        // Scene setup
        heroScene = new THREE.Scene();
        heroCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        heroRenderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
        heroRenderer.setSize(window.innerWidth, window.innerHeight);
        heroRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        
        heroCamera.position.z = 5;
        
        // Create starfield
        const starGeometry = new THREE.BufferGeometry();
        const starMaterial = new THREE.PointsMaterial({
            color: 0xFFB6C1,
            size: 0.05,
            transparent: true,
            opacity: 0.8
        });
        
        const starVertices = [];
        for (let i = 0; i < 1000; i++) {
            const x = (Math.random() - 0.5) * 50;
            const y = (Math.random() - 0.5) * 50;
            const z = (Math.random() - 0.5) * 50;
            starVertices.push(x, y, z);
        }
        
        starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
        heroStars = new THREE.Points(starGeometry, starMaterial);
        heroScene.add(heroStars);
        
        // Create 3D heart
        const heartShape = createHeartShape();
        const heartGeometry = new THREE.ShapeGeometry(heartShape);
        const heartMaterial = new THREE.MeshBasicMaterial({
            color: 0xFFB6C1,
            transparent: true,
            opacity: 0.9
        });
        
        heroHeart = new THREE.Mesh(heartGeometry, heartMaterial);
        heroHeart.scale.set(0.3, 0.3, 0.3);
        heroScene.add(heroHeart);
        
        // Add glow
        const glowGeometry = new THREE.ShapeGeometry(heartShape);
        const glowMaterial = new THREE.MeshBasicMaterial({
            color: 0xF4C430,
            transparent: true,
            opacity: 0.3
        });
        heroGlow = new THREE.Mesh(glowGeometry, glowMaterial);
        heroGlow.scale.set(0.35, 0.35, 0.35);
        heroScene.add(heroGlow);
        
        console.log('Hero scene initialized');
    } catch (error) {
        console.error('Hero scene error:', error);
    }
}

function createHeartShape() {
    const shape = new THREE.Shape();
    const x = 0, y = 0;
    shape.moveTo(x + 0.5, y + 0.5);
    shape.bezierCurveTo(x + 0.5, y + 0.5, x + 0.4, y, x, y);
    shape.bezierCurveTo(x - 0.6, y, x - 0.6, y + 0.7, x - 0.6, y + 0.7);
    shape.bezierCurveTo(x - 0.6, y + 1.1, x - 0.3, y + 1.54, x + 0.5, y + 1.9);
    shape.bezierCurveTo(x + 1.2, y + 1.54, x + 1.6, y + 1.1, x + 1.6, y + 0.7);
    shape.bezierCurveTo(x + 1.6, y + 0.7, x + 1.6, y, x + 1.0, y);
    shape.bezierCurveTo(x + 0.7, y, x + 0.5, y + 0.5, x + 0.5, y + 0.5);
    return shape;
}

function animateHeroScene() {
    if (!heroHeart || !heroGlow || !heroCamera || !heroRenderer) return;
    
    try {
        heroHeart.rotation.z += 0.005;
        heroGlow.rotation.z -= 0.003;
        
        // Gentle floating
        heroHeart.position.y = Math.sin(Date.now() * 0.001) * 0.2;
        heroGlow.position.y = Math.sin(Date.now() * 0.001) * 0.2;
        
        // Mouse parallax
        const targetRotationX = (mouseY / window.innerHeight - 0.5) * 0.3;
        const targetRotationY = (mouseX / window.innerWidth - 0.5) * 0.3;
        heroCamera.rotation.x += (targetRotationX - heroCamera.rotation.x) * 0.05;
        heroCamera.rotation.y += (targetRotationY - heroCamera.rotation.y) * 0.05;
        
        heroRenderer.render(heroScene, heroCamera);
    } catch (error) {
        console.error('Hero animation error:', error);
    }
}

/* ==========================================
   STORY SCENE - THREE.JS
   ========================================== */
function initStoryScene() {
    try {
        const canvas = document.getElementById('story-canvas');
        if (!canvas) return;
        
        storyScene = new THREE.Scene();
        storyCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        storyRenderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
        storyRenderer.setSize(window.innerWidth, window.innerHeight);
        storyRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        
        storyCamera.position.z = 8;
        
        // Create floating orbs in 3D space
        for (let i = 0; i < 5; i++) {
            const geometry = new THREE.SphereGeometry(0.5, 32, 32);
            const material = new THREE.MeshBasicMaterial({
                color: 0xFFB6C1,
                transparent: true,
                opacity: 0.3,
                wireframe: true
            });
            const orb = new THREE.Mesh(geometry, material);
            orb.position.set(
                (Math.random() - 0.5) * 10,
                (Math.random() - 0.5) * 10,
                (Math.random() - 0.5) * 10
            );
            storyScene.add(orb);
            storyOrbs.push(orb);
        }
        
        console.log('Story scene initialized');
    } catch (error) {
        console.error('Story scene error:', error);
    }
}

function animateStoryScene() {
    if (!storyScene || !storyCamera || !storyRenderer) return;
    
    try {
        storyOrbs.forEach((orb, i) => {
            orb.rotation.x += 0.01;
            orb.rotation.y += 0.01;
            orb.position.y += Math.sin(Date.now() * 0.001 + i) * 0.002;
        });
        
        storyRenderer.render(storyScene, storyCamera);
    } catch (error) {
        console.error('Story animation error:', error);
    }
}

/* ==========================================
   GALLERY SCENE
   ========================================== */
function initGalleryScene() {
    try {
        const canvas = document.getElementById('gallery-canvas');
        if (!canvas) return;
        
        galleryScene = new THREE.Scene();
        galleryCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        galleryRenderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
        galleryRenderer.setSize(window.innerWidth, window.innerHeight);
        galleryRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        
        galleryCamera.position.z = 5;
        
        // Add ambient particles
        const particleGeometry = new THREE.BufferGeometry();
        const particleMaterial = new THREE.PointsMaterial({
            color: 0xFFB6C1,
            size: 0.03,
            transparent: true,
            opacity: 0.6
        });
        
        const particleVertices = [];
        for (let i = 0; i < 500; i++) {
            particleVertices.push(
                (Math.random() - 0.5) * 20,
                (Math.random() - 0.5) * 20,
                (Math.random() - 0.5) * 20
            );
        }
        
        particleGeometry.setAttribute('position', new THREE.Float32BufferAttribute(particleVertices, 3));
        const particles = new THREE.Points(particleGeometry, particleMaterial);
        galleryScene.add(particles);
        
        // Store particles for animation
        galleryScene.userData = { particles };
        
        // Create gallery placeholder items
        createGalleryItems();
        
        console.log('Gallery scene initialized');
    } catch (error) {
        console.error('Gallery scene error:', error);
    }
}

function animateGalleryScene() {
    if (!galleryScene || !galleryCamera || !galleryRenderer) return;
    
    try {
        if (galleryScene.userData && galleryScene.userData.particles) {
            galleryScene.userData.particles.rotation.y += 0.001;
        }
        galleryRenderer.render(galleryScene, galleryCamera);
    } catch (error) {
        console.error('Gallery animation error:', error);
    }
}

function createGalleryItems() {
    const grid = document.querySelector('.gallery-grid');
    if (!grid) return;
    
    const memories = [
        { caption: "The day Sakshi said yes – 15th March 2024 💖" },
        { caption: "Late night calls with Kashu that turned into early mornings 📞" },
        { caption: "Video calls where we just smiled at each other, Sakshi 💕" },
        { caption: "Anand ↔ Vellore but heart to heart always 🌍" },
        { caption: "Every 'I miss you, Kashu' that made us stronger 🤍" },
        { caption: "Almost 2 years with Sakshi... still feels like day one ✨" },
        { caption: "Hours of chatting with Kashu that felt like minutes ⏰💬" },
        { caption: "The support from Sakshi that got us through everything 💪💕" }
    ];
    
    memories.forEach((memory, i) => {
        const item = document.createElement('div');
        item.className = 'gallery-item';
        item.innerHTML = `<img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Crect fill='%23FADADD' width='400' height='400'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='20' fill='%23666'%3EMemory ${i + 1}%0A%0AWith Sakshi%3C/text%3E%3C/svg%3E" alt="${memory.caption}">`;
        item.dataset.caption = memory.caption;
        item.addEventListener('click', () => openGalleryModal(item));
        grid.appendChild(item);
    });
}

/* ==========================================
   PORTAL SCENE
   ========================================== */
function initPortalScene() {
    try {
        const canvas = document.getElementById('portal-canvas');
        if (!canvas) return;
        
        portalScene = new THREE.Scene();
        portalCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        portalRenderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
        portalRenderer.setSize(window.innerWidth, window.innerHeight);
        portalRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        
        portalCamera.position.z = 5;
        
        // Create portal ring
        const ringGeometry = new THREE.TorusGeometry(2, 0.1, 16, 100);
        const ringMaterial = new THREE.MeshBasicMaterial({
            color: 0xF4C430,
            transparent: true,
            opacity: 0.8
        });
        portalRing = new THREE.Mesh(ringGeometry, ringMaterial);
        portalScene.add(portalRing);
        
        // Create inner glow
        const glowGeometry = new THREE.CircleGeometry(1.8, 64);
        const glowMaterial = new THREE.MeshBasicMaterial({
            color: 0xFFB6C1,
            transparent: true,
            opacity: 0.3
        });
        portalGlow = new THREE.Mesh(glowGeometry, glowMaterial);
        portalScene.add(portalGlow);
        
        console.log('Portal scene initialized');
    } catch (error) {
        console.error('Portal scene error:', error);
    }
}

function animatePortalScene() {
    if (!portalScene || !portalCamera || !portalRenderer || !portalRing || !portalGlow) return;
    
    try {
        portalRing.rotation.z += 0.01;
        portalGlow.rotation.z -= 0.005;
        
        // Pulsing effect
        const pulse = Math.sin(Date.now() * 0.003) * 0.2 + 1;
        portalRing.scale.set(pulse, pulse, pulse);
        
        portalRenderer.render(portalScene, portalCamera);
    } catch (error) {
        console.error('Portal animation error:', error);
    }
}

/* ==========================================
   PROPOSAL SCENE
   ========================================== */
function initProposalScene() {
    try {
        const canvas = document.getElementById('proposal-canvas');
        if (!canvas) return;
        
        proposalScene = new THREE.Scene();
        const proposalCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const proposalRenderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
        proposalRenderer.setSize(window.innerWidth, window.innerHeight);
        proposalRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        
        proposalCamera.position.z = 5;
        
        // Create falling particles (petals)
        const petalGeometry = new THREE.BufferGeometry();
        const petalMaterial = new THREE.PointsMaterial({
            color: 0xF4C430,
            size: 0.1,
            transparent: true,
            opacity: 0.8
        });
        
        const petalVertices = [];
        const petalVelocities = [];
        for (let i = 0; i < 200; i++) {
            petalVertices.push(
                (Math.random() - 0.5) * 20,
                Math.random() * 20 + 5,
                (Math.random() - 0.5) * 10
            );
            petalVelocities.push(Math.random() * 0.02 + 0.01);
        }
        
        petalGeometry.setAttribute('position', new THREE.Float32BufferAttribute(petalVertices, 3));
        proposalPetals = new THREE.Points(petalGeometry, petalMaterial);
        proposalScene.add(proposalPetals);
        
        // Create large background heart
        const bgHeartShape = createHeartShape();
        const bgHeartGeometry = new THREE.ShapeGeometry(bgHeartShape);
        const bgHeartMaterial = new THREE.MeshBasicMaterial({
            color: 0xFFB6C1,
            transparent: true,
            opacity: 0.1
        });
        const bgHeart = new THREE.Mesh(bgHeartGeometry, bgHeartMaterial);
        bgHeart.scale.set(3, 3, 3);
        bgHeart.position.z = -5;
        proposalScene.add(bgHeart);
        
        // Store data for animation
        proposalScene.userData = {
            camera: proposalCamera,
            renderer: proposalRenderer,
            petals: proposalPetals,
            velocities: petalVelocities,
            bgHeart: bgHeart
        };
        
        console.log('Proposal scene initialized');
    } catch (error) {
        console.error('Proposal scene error:', error);
    }
}

function animateProposalScene() {
    if (!proposalScene || !proposalScene.userData) return;
    
    try {
        const { camera, renderer, petals, velocities, bgHeart } = proposalScene.userData;
        
        if (petals && velocities) {
            // Animate falling petals
            const positions = petals.geometry.attributes.position.array;
            for (let i = 0; i < positions.length; i += 3) {
                positions[i + 1] -= velocities[i / 3];
                if (positions[i + 1] < -10) {
                    positions[i + 1] = 10;
                }
            }
            petals.geometry.attributes.position.needsUpdate = true;
        }
        
        // Rotate background heart
        if (bgHeart) {
            bgHeart.rotation.z += 0.002;
        }
        
        if (renderer && camera) {
            renderer.render(proposalScene, camera);
        }
    } catch (error) {
        console.error('Proposal animation error:', error);
    }
}

/* ==========================================
   HERO INTERACTIONS
   ========================================== */
function setupHeroInteractions() {
    const heroText1 = document.getElementById('hero-text-1');
    const heroText2 = document.getElementById('hero-text-2');
    const heroText3 = document.getElementById('hero-text-3');
    const heroButtons = document.getElementById('hero-buttons');
    const yesBtn = document.getElementById('yes-btn');
    const noBtn = document.getElementById('no-btn');
    
    if (!heroText1 || !heroText2 || !heroText3 || !heroButtons || !yesBtn || !noBtn) {
        console.error('Hero elements not found');
        return;
    }
    
    // Cinematic text reveal
    if (typeof gsap !== 'undefined') {
        const timeline = gsap.timeline({ delay: 2.5 });
        
        timeline
            .to(heroText1, { opacity: 1, y: 0, duration: 1.5, ease: 'power2.out' })
            .to(heroText1, { opacity: 0, y: -30, duration: 1, delay: 2 })
            .to(heroText2, { opacity: 1, y: 0, duration: 1.5, ease: 'power2.out' })
            .to(heroText2, { opacity: 0, y: -30, duration: 1, delay: 2 })
            .to(heroText3, { opacity: 1, y: 0, duration: 1.5, ease: 'power2.out' })
            .to(heroButtons, { opacity: 1, y: 0, duration: 1, delay: 1 });
    }
    
    // No button playful dodge
    let noDodgeCount = 0;
    noBtn.addEventListener('click', (e) => {
        e.preventDefault();
        noDodgeCount++;
        const randomX = (Math.random() - 0.5) * 200;
        const randomY = (Math.random() - 0.5) * 200;
        
        if (typeof gsap !== 'undefined') {
            gsap.to(noBtn, {
                x: randomX,
                y: randomY,
                duration: 0.3,
                ease: 'power2.out'
            });
        }
        
        if (noDodgeCount >= 3) {
            noBtn.textContent = "Sakshi knows the answer is yes! 😊";
        }
    });
    
    // Yes button - heart explosion
    yesBtn.addEventListener('click', (e) => {
        e.preventDefault();
        playSound('click');
        
        // Create heart explosion
        for (let i = 0; i < 30; i++) {
            setTimeout(() => {
                createFloatingHeart();
            }, i * 50);
        }
        
        // Scroll to next section
        setTimeout(() => {
            const loveStory = document.getElementById('love-story');
            if (loveStory) {
                loveStory.scrollIntoView({ behavior: 'smooth' });
            }
        }, 1000);
    });
}

function createFloatingHeart() {
    const heart = document.createElement('div');
    heart.className = 'particle';
    heart.textContent = '💖';
    heart.style.left = (window.innerWidth / 2 + (Math.random() - 0.5) * 200) + 'px';
    heart.style.top = (window.innerHeight / 2 + (Math.random() - 0.5) * 200) + 'px';
    heart.style.fontSize = (Math.random() * 20 + 20) + 'px';
    heart.style.opacity = '0';
    
    const container = document.getElementById('particle-container');
    if (container) {
        container.appendChild(heart);
        
        // Trigger animation
        setTimeout(() => {
            heart.style.opacity = '1';
        }, 10);
        
        setTimeout(() => heart.remove(), 3000);
    }
}

/* ==========================================
   STORY INTERACTIONS
   ========================================== */
function setupStoryInteractions() {
    const triggers = document.querySelectorAll('.story-orb-trigger');
    
    triggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const storyId = trigger.getAttribute('data-story');
            const panel = document.getElementById(`story-${storyId}`);
            panel.classList.add('active');
            playSound('click');
        });
    });
    
    const closeBtns = document.querySelectorAll('.close-panel');
    closeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            btn.parentElement.classList.remove('active');
        });
    });
}

/* ==========================================
   GALLERY INTERACTIONS
   ========================================== */
function setupGalleryInteractions() {
    const modal = document.getElementById('gallery-modal');
    const closeBtn = modal.querySelector('.close-modal');
    
    closeBtn.addEventListener('click', () => {
        modal.classList.remove('active');
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });
}

function openGalleryModal(item) {
    const modal = document.getElementById('gallery-modal');
    const img = modal.querySelector('#modal-image');
    const caption = modal.querySelector('.modal-caption');
    
    img.src = item.querySelector('img').src;
    caption.textContent = item.dataset.caption;
    
    modal.classList.add('active');
    playSound('click');
}

/* ==========================================
   PORTAL INTERACTIONS
   ========================================== */
function setupPortalInteractions() {
    const input = document.getElementById('portal-password');
    const submit = document.getElementById('portal-submit');
    const hint = document.getElementById('portal-hint');
    const proposalSection = document.getElementById('proposal');
    
    if (!input || !submit || !hint || !proposalSection) {
        console.error('Portal elements not found');
        return;
    }
    
    const correctPassword = 'forever'; // The password is "forever"
    
    submit.addEventListener('click', () => {
        checkPassword();
    });
    
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            checkPassword();
        }
    });
    
    function checkPassword() {
        const password = input.value.toLowerCase().trim();
        
        if (password === correctPassword) {
            hint.textContent = '✨ Portal unlocking for Sakshi... ✨';
            hint.style.color = '#F4C430';
            playSound('click');
            
            // Animate portal opening
            const container = document.getElementById('portal-input-container');
            if (container) {
                if (typeof gsap !== 'undefined') {
                    gsap.to(container, {
                        opacity: 0,
                        y: -50,
                        duration: 1
                    });
                }
            }
            
            setTimeout(() => {
                proposalSection.classList.remove('hidden');
                proposalSection.scrollIntoView({ behavior: 'smooth' });
            }, 1500);
        } else {
            hint.textContent = 'Hmm, Kashu... try the word that describes what we\'ll be... ✨';
            hint.style.color = '#FADADD';
            
            // Shake animation
            if (typeof gsap !== 'undefined') {
                gsap.to(input, {
                    x: [-10, 10, -10, 10, 0],
                    duration: 0.4
                });
            }
        }
    }
}

/* ==========================================
   PROPOSAL INTERACTIONS
   ========================================== */
function setupProposalInteractions() {
    const proposalText1 = document.getElementById('proposal-text-1');
    const proposalText2 = document.getElementById('proposal-text-2');
    const proposalText3 = document.getElementById('proposal-text-3');
    const proposalActions = document.getElementById('proposal-actions');
    const finalYes = document.getElementById('final-yes');
    const hugBtn = document.getElementById('hug-btn');
    const foreverMessage = document.getElementById('forever-message');
    
    if (!proposalText1 || !finalYes || !hugBtn) {
        console.error('Proposal elements not found');
        return;
    }
    
    // Setup scroll trigger for proposal texts
    if (typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.create({
            trigger: '#proposal',
            start: 'top center',
            onEnter: () => {
                if (typeof gsap !== 'undefined') {
                    const tl = gsap.timeline();
                    if (proposalText1) tl.to(proposalText1, { opacity: 1, y: 0, duration: 1.5, delay: 0.5 });
                    if (proposalText2) tl.to(proposalText2, { opacity: 1, y: 0, duration: 1.5 }, '+=1');
                    if (proposalText3) tl.to(proposalText3, { opacity: 1, y: 0, duration: 1.5 }, '+=1');
                    if (proposalActions) tl.to(proposalActions, { opacity: 1, y: 0, duration: 1 }, '+=0.5');
                }
            }
        });
    }
    
    // Final yes button
    finalYes.addEventListener('click', (e) => {
        e.preventDefault();
        playSound('click');
        
        // Massive heart explosion
        for (let i = 0; i < 100; i++) {
            setTimeout(() => {
                createFloatingHeart();
            }, i * 30);
        }
        
        // Show forever message
        if (foreverMessage) {
            setTimeout(() => {
                foreverMessage.classList.remove('hidden');
                foreverMessage.classList.add('show');
            }, 2000);
        }
        
        // Change background theme
        const proposal = document.getElementById('proposal');
        if (proposal) {
            if (typeof gsap !== 'undefined') {
                gsap.to(proposal, {
                    background: 'linear-gradient(135deg, #FFB6C1 0%, #F4C430 100%)',
                    duration: 3
                });
            }
        }
    });
    
    // Hug button - screen squeeze
    hugBtn.addEventListener('click', (e) => {
        e.preventDefault();
        playSound('click');
        
        if (typeof gsap !== 'undefined') {
            gsap.to('body', {
                scale: 0.95,
                duration: 0.3,
                yoyo: true,
                repeat: 1,
                ease: 'power2.inOut'
            });
        }
        
        showStarMessage("*Sending the biggest, warmest hug to Kashu* 🤗💕 I love you so much, Sakshi!");
    });
}

/* ==========================================
   ANIMATION LOOP
   ========================================== */
function animate() {
    requestAnimationFrame(animate);
    
    // Animate all scenes
    animateHeroScene();
    animateMapScene();
    animateStoryScene();
    animateGalleryScene();
    animatePortalScene();
    animateProposalScene();
}

/* ==========================================
   SOUND EFFECTS
   ========================================== */
function playSound(type) {
    try {
        // Create simple sound effects using Web Audio API
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        if (type === 'click') {
            oscillator.frequency.value = 800;
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
        }
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
    } catch (error) {
        console.log('Sound not available');
    }
}

/* ==========================================
   RESPONSIVE HANDLING
   ========================================== */
window.addEventListener('resize', () => {
    // Resize all renderers
    if (heroCamera && heroRenderer) {
        heroCamera.aspect = window.innerWidth / window.innerHeight;
        heroCamera.updateProjectionMatrix();
        heroRenderer.setSize(window.innerWidth, window.innerHeight);
    }
    
    if (mapCamera && mapRenderer) {
        mapCamera.aspect = window.innerWidth / window.innerHeight;
        mapCamera.updateProjectionMatrix();
        mapRenderer.setSize(window.innerWidth, window.innerHeight);
    }
    
    if (storyCamera && storyRenderer) {
        storyCamera.aspect = window.innerWidth / window.innerHeight;
        storyCamera.updateProjectionMatrix();
        storyRenderer.setSize(window.innerWidth, window.innerHeight);
    }
    
    if (galleryCamera && galleryRenderer) {
        galleryCamera.aspect = window.innerWidth / window.innerHeight;
        galleryCamera.updateProjectionMatrix();
        galleryRenderer.setSize(window.innerWidth, window.innerHeight);
    }
    
    if (portalCamera && portalRenderer) {
        portalCamera.aspect = window.innerWidth / window.innerHeight;
        portalCamera.updateProjectionMatrix();
        portalRenderer.setSize(window.innerWidth, window.innerHeight);
    }
    
    if (proposalScene && proposalScene.userData) {
        const { camera, renderer } = proposalScene.userData;
        if (camera && renderer) {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        }
    }
});

console.log('Script loaded successfully for Sakshi! Universe ready. 💖');
