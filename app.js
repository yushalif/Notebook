document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 📝 1. DATA TO EDIT (PLAYLIST & PAGES)
    // ==========================================
    
    // Add your songs here. The script reads the actual file metadata to find the duration.
    const playlist = [ 
    { src: 'inthepool.mp3', title: 'In The Pool', artist: 'kensuke ushio' },
    { src: 'older.mp3', title: 'Older', artist: 'Sasha Sloan' },
    { src: 'hello.mp3', title: 'Hello', artist: 'Conor Maynard' },
    { src: 'gluesong.mp3', title: 'Glue Song', artist: 'beabadoobee' },
    { src: 'itwasyou.mp3', title: 'It Was You (Acoustic)', artist: '12 Stones' },
    { src: 'iwontgiveup.mp3', title: 'I Wont Give Up', artist: 'Alex G' },
    { src: 'sofargone.mp3', title: 'So Far Gone', artist: 'Thousand Foot Krutch' },
    { src: 'toosadtocry.mp3', title: 'Too Sad to Cry', artist: 'Sasha Sloan' },
    { src: 'dancingwithyourghost.mp3', title: 'Dancing With Your Ghost', artist: 'Sasha Sloan' },
    { src: 'getyouthemoon.mp3', title: 'Get You The Moon', artist: 'Kina' },
    { src: 'dieforyou.mp3', title: 'Die For You', artist: 'Joji' },
    { src: 'blue.mp3', title: 'Blue', artist: 'YUNG KAI' }
    ];

    // Add your pages here. Choose a theme and set hasPlayer: true to inject the music player.
    const notebookPages = [
        {
            title: "August 21st",
            text: "Happy birthday baby. As you reach this, you are probably very mad and upset by how I made you go through your whole day before your birthday. I'm really sorry for how it went for you and I know you had a lot to say to me the other night and even today. But as you can see I really needed to focus on this because I wanted to give you something that I put genuine effort like you always do with with your gifts. I know my first letter that I gave to you was utterly trash. And I wanted to make up for it by giving this. As you read this I probably haven't even had dinner. I skipped lunch today to go to tuition early and come back home early to work on this. Even as you read this, this webpage is not even complete. I wanted to do way more but I just didnt get enough time to do that.It's really incomplete I am just frustrated that I couldn't finish it before it striked 12 AM. There is no amount of words left in me that will ever be able to describe how much you mean to me. I don't know if you will understand that. I know there is so many ups and downs with us that gets you questioning things that have already been addressed. I wish I could give you the time you deserve from me. I really wish I could do that. But I don't know when that time will come. And when will I ever be able to truly make you believe that I do love you a lot. you are 22 now. I don't know why but i feel like I knew you for a long time even though its been less than 1.5 years. Oh wish I could have been there when you needed me. I wish I knew when you needed me. I wish I was there when you didn't even know me. I'm sorry for how the world is. But in the end all of it is temporary, and best we can do is make the best of the short amount of time we have together doing mundane stuff. This will not be that long but I hope this finishes writing before the song ends. And as a finishing note I want you tell you again, Baby, my beloved, my sweet little sandler, I love you a lot, and I will never leave, I got your back, I hope you got mine too. For tonight and for this moment, this is your sweet little bumble bee. Yusha",
            theme: "theme-fall",
            hasPlayer: true, // No player on page 1
            hasTyped: true 
        },
        {
            title: "August 22nd",
            text: "I just went to your birthday and came back. I dont know when is the next time you are gonna open this. Maybe you didn't really like it. I even told you that I changed the password. I hated how everyone turned your birthday about themeselves, that was just so damn horrible. It was unfair. I was wondering where the foam inside the ring box went. Did you lose it? I wasn't done giving you all the gifts, I just didnt get the chance to give you the main thing. But I left it in the ring box. I hope your like it. It's not expensive but I did walk 20,000 steps to go find a one that I wanted to give to you. Everything else looked ugly to me. I wish I could give it to you personally, and put it on your finger. But maybe next time. Until come home, this is your notebook where I write my things for you to descover on random days. I love you so much. Cupcake birthdays are better because only 2 people can wholeheartedly enjoy it. and I'm all for it. Anyways, I hope you like your gift :)",
            theme: "theme-fall",
            hasPlayer: true,  // The music player will appear at the bottom of this page
            hasTyped: false
        },
        {
            title: "August 23rd",
            text: "",
            theme: "theme-fall",
            hasPlayer: true,
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
        if (pass === 'sandler' || pass === 'Sandler') {
            
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
