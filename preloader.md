<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mont - Preloader Orbital</title>
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600&family=Playfair+Display:ital,wght@0,700;1,700&display=swap" rel="stylesheet">
    <style>
        :root {
            --bg: #000000;
            --gold: #C8A96E;
            --white: #FFFFFF;
        }
        
        body, html {
            margin: 0; padding: 0;
            width: 100vw; height: 100vh;
            background-color: var(--bg);
            display: flex;
            justify-content: center;
            align-items: center;
            overflow: hidden;
            font-family: 'Playfair Display', serif;
        }

        .preloader-container {
            position: relative;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            width: 100%;
            height: 100%;
        }

        /* Partículas Orbitais */
        .particles {
            position: absolute;
            top: 50%; left: 50%;
            width: 0; height: 0;
            z-index: 1;
        }

        .particle {
            position: absolute;
            width: 3px; height: 3px;
            background-color: var(--gold);
            border-radius: 50%;
            box-shadow: 0 0 8px var(--gold);
            animation: orbitConverge 2.5s infinite ease-in-out;
        }

        @keyframes orbitConverge {
            0% {
                transform: rotate(var(--start-angle)) translateX(var(--distance)) scale(0);
                opacity: 0;
            }
            15% {
                opacity: 1;
                transform: rotate(calc(var(--start-angle) + 45deg)) translateX(var(--distance)) scale(1.5);
            }
            35% {
                transform: rotate(calc(var(--start-angle) + 180deg)) translateX(0) scale(0);
                opacity: 1;
            }
            100% {
                transform: rotate(calc(var(--start-angle) + 180deg)) translateX(0) scale(0);
                opacity: 0;
            }
        }

        /* Logo Reveal */
        .logo-wrapper {
            z-index: 2;
            display: flex;
            flex-direction: column;
            align-items: center;
            animation: logoReveal 2.5s infinite;
            opacity: 0;
        }

        .icon-svg {
            width: 80px; height: 60px;
            margin-bottom: 15px;
        }

        .brand-name {
            font-size: 3.5rem;
            color: var(--gold);
            letter-spacing: 0.15em;
            margin: 0;
            line-height: 1;
        }

        .brand-sub {
            font-family: 'Montserrat', sans-serif;
            color: var(--white);
            font-size: 0.75rem;
            letter-spacing: 0.4em;
            margin-top: 5px;
            text-transform: uppercase;
        }

        @keyframes logoReveal {
            0%, 30% { opacity: 0; transform: scale(0.9); filter: blur(5px); }
            40% { opacity: 1; transform: scale(1); filter: blur(0px); }
            80% { opacity: 1; transform: scale(1); filter: blur(0px); }
            95%, 100% { opacity: 0; transform: scale(1.05); filter: blur(3px); }
        }

        /* Botão Pular */
        .skip-btn {
            position: absolute;
            bottom: 40px; right: 40px;
            color: var(--white);
            font-family: 'Montserrat', sans-serif;
            font-size: 0.8rem;
            letter-spacing: 2px;
            text-decoration: none;
            text-transform: uppercase;
            border: 1px solid rgba(255,255,255,0.3);
            padding: 10px 20px;
            border-radius: 30px;
            animation: showSkip 2.5s infinite;
            transition: background 0.3s, color 0.3s;
            cursor: pointer;
            z-index: 10;
        }

        .skip-btn:hover {
            background: var(--gold);
            color: var(--bg);
            border-color: var(--gold);
        }

        @keyframes showSkip {
            0%, 39% { opacity: 0; transform: translateY(10px); pointer-events: none; }
            40%, 80% { opacity: 1; transform: translateY(0); pointer-events: auto; }
            90%, 100% { opacity: 0; transform: translateY(-10px); pointer-events: none; }
        }

        @media (max-width: 768px) {
            .brand-name { font-size: 2.5rem; }
            .icon-svg { width: 60px; height: 45px; }
            .skip-btn { bottom: 20px; right: 20px; font-size: 0.7rem; }
        }
    </style>
</head>
<body>

    <div class="preloader-container">
        <div class="particles" id="particles"></div>
        
        <div class="logo-wrapper">
            <svg class="icon-svg" viewBox="0 0 100 80" xmlns="http://www.w3.org/2000/svg">
                <!-- Lua de queijo -->
                <circle cx="50" cy="35" r="22" fill="#C8A96E" />
                <circle cx="43" cy="22" r="2.5" fill="#000" opacity="0.4" />
                <circle cx="60" cy="28" r="3.5" fill="#000" opacity="0.4" />
                <circle cx="53" cy="45" r="2" fill="#000" opacity="0.4" />
                <!-- Montanhas -->
                <path d="M5,80 L35,25 L50,50 L65,25 L95,80 Z" fill="#000000" stroke="#FFFFFF" stroke-width="3" stroke-linejoin="round"/>
                <path d="M20,80 L35,50 L50,70 L65,50 L80,80" fill="none" stroke="#C8A96E" stroke-width="2" stroke-linejoin="round"/>
            </svg>
            <h1 class="brand-name">MONT</h1>
            <div class="brand-sub">Distribuidora</div>
        </div>

        <a href="#" class="skip-btn">pular &rarr;</a>
    </div>

    <script>
        // Script simples apenas para gerar as partículas dinamicamente e manter o HTML limpo
        const container = document.getElementById('particles');
        for(let i=0; i<45; i++) {
            let p = document.createElement('div');
            p.className = 'particle';
            p.style.setProperty('--start-angle', (Math.random() * 360) + 'deg');
            p.style.setProperty('--distance', (80 + Math.random() * 150) + 'px');
            // Pequeno delay aleatório entre 0 e 0.2s para naturalidade
            p.style.animationDelay = (Math.random() * 0.2) + 's';
            container.appendChild(p);
        }
    </script>
</body>
</html>