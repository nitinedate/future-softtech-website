let speechSynthesis = window.speechSynthesis;
let currentUtterance = null;
let isReading = false;
let selectedVoice = null;
let hasGreeted = false;
let currentLanguage = 'english';
let userRequestedStop = false;
let hasUserInteracted = false;
let sectionContent = translations.english.sectionContent;

// This map will hold the relationship between text and DOM elements for scrolling
let speechMap = []; 

/**
 * Finds the best available voice for the selected language.
 */
function findBestVoiceForCurrentLanguage(voices) {
    if (currentLanguage === 'hindi') {
        // Broader search for Hindi voices across different browsers/platforms
        const hindiVoices = voices.filter(v => 
            v.lang.startsWith('hi') || 
            v.name.toLowerCase().includes('hindi') || 
            v.name.toLowerCase().includes('हिन्दी')
        );
        if (hindiVoices.length > 0) {
            // Prefer voices with 'hi-IN' for Indian accent
            return hindiVoices.find(v => v.lang.includes('hi-IN')) || hindiVoices[0];
        }
    }
    
    // Fallback for English
    const preferredVoices = ['Microsoft Ravi - English (India)', 'Google US English', 'Alex'];
    for (let name of preferredVoices) {
        const voice = voices.find(v => v.name === name);
        if (voice) return voice;
    }
    const englishVoices = voices.filter(v => v.lang.startsWith('en'));
    return englishVoices.length > 0 ? englishVoices[0] : voices[0];
}

/**
 * Adjusts the speech rate for English and Hindi.
 */
function getVoiceSettings() {
    if (!selectedVoice) {
        selectedVoice = findBestVoiceForCurrentLanguage(speechSynthesis.getVoices());
    }
    return {
        voice: selectedVoice,
        rate: currentLanguage === 'hindi' ? 1.0 : 0.8,
        pitch: 1.0,
        volume: 1.0
    };
}

function initializeVoices() {
    selectedVoice = findBestVoiceForCurrentLanguage(speechSynthesis.getVoices());
}

function stopReading() {
    userRequestedStop = true;
    if (currentUtterance) {
        speechSynthesis.cancel();
    }
    isReading = false;
    updateButtonStates(false);
}

/**
 * Reads the content of a given slide section and handles live scrolling.
 */
function readTextWithMap(textToRead, localSpeechMap) {
    currentUtterance = new SpeechSynthesisUtterance(textToRead);
    currentUtterance.lang = currentLanguage === 'hindi' ? 'hi-IN' : 'en-US';
    
    const { voice, rate, pitch, volume } = getVoiceSettings();
    if (voice) {
        currentUtterance.voice = voice;
    } else {
        console.warn(`No suitable voice found for ${currentLanguage}. Using browser default.`);
    }
    
    currentUtterance.rate = rate;
    currentUtterance.pitch = pitch;
    currentUtterance.volume = volume;

    currentUtterance.onstart = () => { isReading = true; updateButtonStates(true); };
    
    currentUtterance.onend = () => {
        isReading = false;
        if (userRequestedStop) {
            updateButtonStates(false);
            return;
        }

        if (currentSlide < totalSlides - 1) {
            setTimeout(() => {
                nextSlide();
                setTimeout(() => { startReading(true); }, 700);
            }, 1200);
        } else {
            updateButtonStates(false);
        }
    };
    
    currentUtterance.onerror = (e) => { 
        console.error('Speech synthesis error:', e.error); 
        isReading = false; 
        updateButtonStates(false); 
    };

    let lastSpokenElement = null;
    currentUtterance.onboundary = (event) => {
        if (event.name !== 'word') return;

        let charIndex = event.charIndex;
        let cumulativeLength = 0;
        let currentElement = null;

        // The boundary event should only map to the visible text, not the appended explanation
        for (const item of localSpeechMap) {
            cumulativeLength += item.text.length + 2; // Account for ". " joiner
            if (charIndex < cumulativeLength) {
                currentElement = item.element;
                break;
            }
        }

        if (currentElement && currentElement !== lastSpokenElement) {
            lastSpokenElement = currentElement;
            const slideContainer = document.querySelector('.slide.active');
            const containerRect = slideContainer.getBoundingClientRect();
            const elementRect = currentElement.getBoundingClientRect();

            const scrollTriggerZone = containerRect.bottom - (containerRect.height * 0.3);

            if (elementRect.top > scrollTriggerZone) {
                const scrollAmount = slideContainer.scrollTop + elementRect.height * 2;
                slideContainer.scrollTo({
                    top: scrollAmount,
                    behavior: 'smooth'
                });
            }
        }
    };

    speechSynthesis.speak(currentUtterance);
}

/**
 * Builds the text map from the DOM, appends the explanation, and initiates reading.
 */
function startReading(isAuto = false) {
    if (!isAuto) {
        hasUserInteracted = true;
    }

    if (isReading) {
        stopReading();
    } else {
        const activeSlide = document.querySelector('.slide.active');
        if (activeSlide) {
            userRequestedStop = false;
            if (!isAuto) {
                hasGreeted = false;
            }

            // 1. Get visible text from the screen for narration and scroll-mapping
            speechMap = [];
            const textParts = [];
            const readableElements = activeSlide.querySelectorAll('[data-translate]');
            
            readableElements.forEach((el) => {
                const text = el.textContent.trim().replace(/\s+/g, ' ');
                if (text && el.offsetParent !== null) { // Only read visible elements
                    textParts.push(text);
                    speechMap.push({ text: text, element: el });
                }
            });
            let textToSpeak = textParts.join('. ');

            // 2. Get and append the hidden "explanation" text from translations.js
            const sectionName = activeSlide.getAttribute('data-section');
            if (sectionName) {
                const sectionData = translations[currentLanguage].sectionContent[sectionName];
                if (sectionData && sectionData.explanation) {
                    const simpleTermsPhrase = currentLanguage === 'hindi' ? "सरल शब्दों में," : "In simple terms,";
                    textToSpeak += `. ${simpleTermsPhrase} ${sectionData.explanation}`;
                }
            }

            // 3. Add the initial greeting if this is the first time playing
            if (!hasGreeted) {
                textToSpeak = `${translations[currentLanguage].greeting}. ${textToSpeak}`;
                hasGreeted = true;
            }
            
            // 4. Scroll to top and then initiate speech
            let scrollDelay = 0;
            if (activeSlide.scrollHeight > activeSlide.clientHeight && activeSlide.scrollTop > 0) {
                activeSlide.scrollTo({ top: 0, behavior: 'smooth' });
                scrollDelay = 500;
            }
            
            setTimeout(() => readTextWithMap(textToSpeak, speechMap), scrollDelay);
        }
    }
}

function setLanguage(language) {
    if (currentLanguage === language) return;

    const wasReading = isReading;
    if (wasReading) {
        stopReading();
    }

    currentLanguage = language;
    sectionContent = translations[language].sectionContent;
    selectedVoice = null; 
    initializeVoices();
    
    document.body.classList.toggle('lang-hi', language === 'hindi');

    document.getElementById('englishBtn').classList.toggle('active', language === 'english');
    document.getElementById('hindiBtn').classList.toggle('active', language === 'hindi');
    
    updateHTMLContent();
    updateUIText();
    
    if (wasReading) {
        setTimeout(() => startReading(false), 200);
    }
}

function updateHTMLContent() {
    const content = htmlTranslations[currentLanguage];
    document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.getAttribute('data-translate');
        if (content[key]) {
            element.textContent = content[key];
        }
    });
}

function updateUIText() {
    const uiText = translations[currentLanguage].uiText;
    document.querySelector('.audio-title').textContent = uiText.audioPanel;

    // Get the correct message based on device type for the start message
    const startMsgKey = isMobileDevice() ? 'mobile' : 'desktop';
    document.getElementById('startMessage').textContent = translations[currentLanguage].startMessage[startMsgKey];

    updateButtonStates(isReading);
}


function initializeAudioApp() {
    if (speechSynthesis.getVoices().length === 0) {
        speechSynthesis.onvoiceschanged = initializeVoices;
    } else {
        initializeVoices();
    }
    makeAudioPanelDraggable();
    showStartMessage();
    document.addEventListener('click', () => { 
        if (!hasUserInteracted) { 
            hasUserInteracted = true; 
            hideStartMessage(); 
            if (speechSynthesis.paused) {
                speechSynthesis.resume();
            }
        } 
    });
}