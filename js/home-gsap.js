document.addEventListener("DOMContentLoaded", () => {
    gsap.registerPlugin(ScrollTrigger);

    // --- 1. HERO & TEXT SCRAMBLE (Existing) ---
    const consoleLines = document.querySelectorAll(".console-text");
    const tl = gsap.timeline();

    tl.from(".hero-glitch", { duration: 1, opacity: 0, y: 20, ease: "power2.out" });

    consoleLines.forEach((line) => {
        tl.to(line, {
            opacity: 1, duration: 0.5,
            text: line.innerText, 
            onStart: () => { /* Scramble logic here if needed */ }
        }, "-=0.2");
    });
    tl.to(".hero-cta-group", { opacity: 1, y: 0, duration: 0.5 });

    // --- 2. CUSTOM CURSOR (Existing) ---
    const cursor = document.getElementById('cursor-highlight');
    if (window.matchMedia("(pointer: fine)").matches) {
        document.addEventListener('mousemove', (e) => {
            gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0.1, ease: "power2.out" });
        });
    }

    // --- 3. HACKATHON TILT (Existing) ---
    const tiltCard = document.querySelector('.hack-main-card');
    if (tiltCard) {
        tiltCard.addEventListener('mousemove', (e) => {
            const rect = tiltCard.getBoundingClientRect();
            const x = e.clientX - rect.left; 
            const y = e.clientY - rect.top;  
            const xPct = x / rect.width;
            const yPct = y / rect.height;
            gsap.to(tiltCard, {
                rotationY: (xPct - 0.5) * 10,
                rotationX: (0.5 - yPct) * 10,
                transformPerspective: 1000,
                duration: 0.5, ease: "power2.out"
            });
        });
        tiltCard.addEventListener('mouseleave', () => {
            gsap.to(tiltCard, { rotationY: 0, rotationX: 0, duration: 0.5, ease: "power2.out" });
        });
    }

    // --- 4. NEW: SEMINAR CARDS REVEAL ---
    gsap.from(".reveal-card", {
        scrollTrigger: {
            trigger: ".cyber-seminars",
            start: "top 80%",
        },
        y: 50,
        opacity: 0,
        stagger: 0.2,
        duration: 0.8,
        ease: "back.out(1.7)"
    });

    // --- 5. NEW: SKILL TREE NODES POP-IN ---
    gsap.from(".reveal-node", {
        scrollTrigger: {
            trigger: ".skill-tree-section",
            start: "top 80%",
        },
        scale: 0,
        opacity: 0,
        stagger: 0.1,
        duration: 0.5,
        ease: "elastic.out(1, 0.5)"
    });

    // --- 6. NEW: LEADERBOARD SLIDE-IN ---
    gsap.from(".lb-row", {
        scrollTrigger: {
            trigger: ".leaderboard-preview",
            start: "top 85%",
        },
        x: -50,
        opacity: 0,
        stagger: 0.1,
        duration: 0.6,
        ease: "power2.out"
    });

    // --- 7. TERMINAL LOGS (Existing) ---
    gsap.from(".log-entry", {
        scrollTrigger: { trigger: ".terminal-window", start: "top 80%" },
        opacity: 0, x: -20, stagger: 0.2, duration: 0.5
    });
});