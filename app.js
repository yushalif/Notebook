document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 📝 1. DATA TO EDIT (PLAYLIST & PAGES)
    // ==========================================
    
    // Add your songs here. The script reads the actual file metadata to find the duration.
    const playlist = [
        { src: 'inthepool.mp3', title: 'In The Pool', artist: 'Unknown Artist' },
        { src: 'blue.mp3', title: 'Blue', artist: 'Unknown Artist' },
        { src: 'song3.mp3', title: 'Autumn Leaves', artist: 'Cozy Band' }
    ];

    // Add your pages here. Choose a theme and set hasPlayer: true to inject the music player.
    const notebookPages = [
        {
            title: "September 14th",
            text: "Hi baby. The cabin smells of pine and old paper today. I watched the rain tracing paths along the windowpane for hours, mesmerized by the rhythm. There is something profoundly healing about the isolation of autumn. The way the leaves surrender to the wind, turning a vibrant, fiery rust before they hit the damp earth. It reminds me that letting go can be beautiful too.",
            theme: "theme-fall",
            hasPlayer: false, // No player on page 1
            hasTyped: false 
        },
        {
            title: "September 15th",
            text: "The rain hasn't stopped. I found an old photograph tucked between the floorboards today. The music playing in the background makes the memories flood back in.",
            theme: "theme-winter-blue",
            hasPlayer: true,  // The music player will appear at the bottom of this page
            hasTyped: false
        },
        {
            title: "September 20th",
            text: "The sky finally cleared. The world feels a little brighter today.",
            theme: "theme-midnight",
            hasPlayer: false,
            hasTyped: false
        }
    ];

    // ==========================================
    // ⚙️ 2. SYSTEM LOGIC (DO NOT EDIT BELOW)
    // ==========================================

    const audioEl = document.getElementById('bg-audio');
    const pagesWrapper = document.getElementById('pages-wrapper');
    const bodyEl = document.body;
    let currentTrackIndex = 0;
    let currentPage = 1;
    const totalPages = notebookPages.length;

    // --- A. DYNAMIC PAGE GENERATOR ---
    function buildNotebook() {
        pagesWrapper.style.width = `${totalPages * 100}vw`;

        notebookPages.forEach((pageData, index) => {
            const section = document.createElement('section');
            section.className = 'page';
            
            let playerHTML = '';
            if (pageData.hasPlayer) {
                // Exact layout referencing image_1c3d68.png (No progress bar)
                playerHTML = `
                    <div class="music-player-container" id="player-container-${index}">
                        <div class="music-player">
                            <div class="song-info">
                                <div class="song-title" id="ui-title">SONG TITLE</div>
                                <div class="song-artist" id="ui-artist">ARTIST NAME</div>
                                <div class="song-duration" id="ui-duration">--:--</div>
                            </div>
                            <div class="player-controls">
                                <i class="fa-solid fa-shuffle" id="btn-shuffle"></i>
                                <i class="fa-solid fa-backward-step" id="btn-prev"></i>
                                <i class="fa-solid fa-circle-play" id="btn-play-pause"></i>
                                <i class="fa-solid fa-forward-step" id="btn-next"></i>
                                <i class="fa-solid fa-rotate-right" id="btn-repeat"></i>
                            </div>
                        </div>
                    </div>
                `;
            }

            const swipeHintHTML = index < (totalPages - 1) 
                ? `<div class="swipe-hint">Swipe right to read more</div>` 
                : `<div class="swipe-hint">End of entries.</div>`;

            section.innerHTML = `
                <div class="content">
                    <h2 class="page-title">${pageData.title}</h2>
                    <p class="notebook-text" id="text-page-${index}"></p>
                    ${playerHTML}
                    ${swipeHintHTML}
                </div>
            `;
            pagesWrapper.appendChild(section);
        });

        // Attach event listeners to the player if it was created
        if(document.getElementById('btn-play-pause')) attachPlayerEvents();
    }
    buildNotebook();

    // --- B. MUSIC PLAYER LOGIC ---
    function loadTrack(index) {
        currentTrackIndex = index;
        audioEl.src = playlist[currentTrackIndex].src;
        updatePlayerUI();
    }

    // Read metadata automatically to get exact duration
    audioEl.addEventListener('loadedmetadata', () => {
        const minutes = Math.floor(audioEl.duration / 60);
        const seconds = Math.floor(audioEl.duration % 60).toString().padStart(2, '0');
        const durationStr = `${minutes}:${seconds}`;
        
        const uiDuration = document.getElementById('ui-duration');
        if(uiDuration) uiDuration.innerText = durationStr;
    });

    function updatePlayerUI() {
        const titleEl = document.getElementById('ui-title');
        const artistEl = document.getElementById('ui-artist');
        
        if (titleEl && artistEl) {
            titleEl.innerText = playlist[currentTrackIndex].title;
            artistEl.innerText = playlist[currentTrackIndex].artist;
        }
        updatePlayPauseButton();
    }

    function updatePlayPauseButton() {
        const playBtn = document.getElementById('btn-play-pause');
        if(!playBtn) return;
        
        if (audioEl.paused) {
            playBtn.classList.remove('fa-circle-pause');
            playBtn.classList.add('fa-circle-play');
        } else {
            playBtn.classList.remove('fa-circle-play');
            playBtn.classList.add('fa-circle-pause');
        }
    }

    function attachPlayerEvents() {
        document.getElementById('btn-play-pause').addEventListener('click', () => {
            if (audioEl.paused) audioEl.play();
            else audioEl.pause();
            updatePlayPauseButton();
        });

        document.getElementById('btn-next').addEventListener('click', () => {
            currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
            loadTrack(currentTrackIndex);
            audioEl.play();
        });

        document.getElementById('btn-prev').addEventListener('click', () => {
            currentTrackIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length;
            loadTrack(currentTrackIndex);
            audioEl.play();
        });

        // Basic toggle visual feedback for shuffle/repeat (Logic can be expanded later)
        document.getElementById('btn-shuffle').addEventListener('click', (e) => {
            e.target.style.color = e.target.style.color === 'var(--accent-primary)' ? 'var(--text-color)' : 'var(--accent-primary)';
        });
        document.getElementById('btn-repeat').addEventListener('click', (e) => {
            e.target.style.color = e.target.style.color === 'var(--accent-primary)' ? 'var(--text-color)' : 'var(--accent-primary)';
            audioEl.loop = !audioEl.loop;
        });
    }

    audioEl.addEventListener('ended', () => {
        if (!audioEl.loop) {
            currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
            loadTrack(currentTrackIndex);
        }
        audioEl.play();
    });

    audioEl.addEventListener('play', updatePlayPauseButton);
    audioEl.addEventListener('pause', updatePlayPauseButton);

    // --- C. TYPEWRITER & TIMING ---
    function typeWriterEffect(element, text, targetDurationMs = null) {
        element.textContent = ""; 
        let charIndex = 0;
        
        // If target duration provided, calculate speed to finish exactly on time
        const speed = targetDurationMs ? (targetDurationMs / text.length) : 40;
        
        function type() {
            if (charIndex < text.length) {
                element.textContent += text.charAt(charIndex);
                charIndex++;
                setTimeout(type, speed);
            }
        }
        type();
    }

    // --- D. LOGIN & INITIALIZATION ---
    document.getElementById('submit-btn').addEventListener('click', handleLogin);
    function handleLogin() {
        const pass = document.getElementById('password-input').value.toLowerCase().trim();
        if (pass === 'autumn' || pass === 'cozy') {
            
            // Start Music
            loadTrack(0); 
            audioEl.play();
            
            // Audio Context for Visualizer
            initWebAudio();

            // Hide Login
            document.getElementById('login-screen').style.opacity = '0';
            setTimeout(() => document.getElementById('login-screen').style.display = 'none', 1000);

            // Sync Page 1 text to finish 15s before first track ends
            audioEl.addEventListener('loadedmetadata', function startPage1() {
                const duration = audioEl.duration;
                const typingTimeInSeconds = Math.max(duration - 15, 10); // Ensure at least 10s of typing if track is short
                
                typeWriterEffect(document.getElementById('text-page-0'), notebookPages[0].text, typingTimeInSeconds * 1000);
                notebookPages[0].hasTyped = true;
                
                audioEl.removeEventListener('loadedmetadata', startPage1);
            }, { once: true });

        } else {
            document.getElementById('error-msg').classList.remove('hidden');
        }
    }

    // --- E. SWIPE & THEME CHANGING LOGIC ---
    let touchStartX = 0;
    let touchEndX = 0;

    document.addEventListener('touchstart', e => touchStartX = e.changedTouches[0].screenX, { passive: true });
    document.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });

    function handleSwipe() {
        const swipeDistance = touchStartX - touchEndX;
        if (swipeDistance > 50 && currentPage < totalPages) {
            currentPage++;
            updatePage();
        } else if (swipeDistance < -50 && currentPage > 1) {
            currentPage--;
            updatePage();
        }
    }

    function updatePage() {
        const pageIndex = currentPage - 1;
        const pageData = notebookPages[pageIndex];

        // 1. Move Page
        pagesWrapper.style.transform = `translateX(${pageIndex * -100}vw)`;

        // 2. Change Theme
        bodyEl.className = pageData.theme;

        // 3. Trigger Typewriter for new page (Standard speed)
        if (!pageData.hasTyped) {
            setTimeout(() => {
                typeWriterEffect(document.getElementById(`text-page-${pageIndex}`), pageData.text, null);
                pageData.hasTyped = true;
            }, 600);
        }
    }

    // --- F. AUDIO VISUALIZER (Retained from previous code) ---
    let audioContext, analyser, source;
    function initWebAudio() {
        if (audioContext) return;
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioContext.createAnalyser();
        analyser.fftSize = 2048;
        source = audioContext.createMediaElementSource(audioEl);
        source.connect(analyser);
        analyser.connect(audioContext.destination);
        drawVisualizer();
    }

    const canvas = document.getElementById('visualizer');
    const ctx = canvas.getContext('2d');
    function resizeCanvas() { canvas.width = window.innerWidth; canvas.height = 300; }
    window.addEventListener('resize', resizeCanvas); resizeCanvas();

    function drawVisualizer() {
        requestAnimationFrame(drawVisualizer);
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        analyser.getByteTimeDomainData(dataArray);

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.lineWidth = 2.5;
        
        // Match the line color to the current theme's text color using computed styles
        const themeColor = getComputedStyle(document.body).getPropertyValue('--text-color').trim();
        ctx.strokeStyle = themeColor; 
        
        ctx.beginPath();
        const sliceWidth = canvas.width * 1.0 / bufferLength;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
            const v = dataArray[i] / 128.0; 
            const y = (v * canvas.height) / 2; 
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
            x += sliceWidth;
        }
        ctx.lineTo(canvas.width, canvas.height / 2);
        ctx.stroke();
    }
});