import wsManager from "../core/ws-instance";
import { Audio } from "./Audio";
import { AudioStorage } from "../utils/AudioStorage";
import { AudioOptionsRenderer } from "./AudioOptionRenderer";
import { AudioUpload } from "./AudioUpload";

export class AudioSelection {
  #selectedAudio;

  constructor(parent, elementId) {
    this.component = parent.querySelector(`#${elementId}`);
    this.audioOptionsContainer = this.component.querySelector('.audio-options');

    // Create placeholder element
    this.placeholder = document.createElement('div');
    this.placeholder.className = 'audio-empty-placeholder';
    this.placeholder.innerHTML = '<i class="fas fa-info-circle"></i> Belum ada data';
    this.audioOptionsContainer.appendChild(this.placeholder);

    // Inisialisasi komponen pendukung
    this.audioStorage = AudioStorage;
    this.audioRenderer = new AudioOptionsRenderer(this.audioOptionsContainer, Audio);
    this.audioUpload = new AudioUpload(this.component, wsManager, () => {
      // Callback setelah upload selesai (tidak ada aksi khusus)
    });
    this.audioUpload.setupEventListeners();

    // State
    this.audioData = [];
    this.selectedAudio = null;

    this.#forceMobileScrollCSS();
    this.#init();

    setTimeout(() => this.#setupTouchScroll(), 100);
  }

  #init() {
    this.#initElements();
    this.#setupEventListener();

    wsManager.on('get-metadata-audio', (result) => {
      result.data.audios.forEach(d => this.#updateUI(d));
    });
  }

  #initElements() {
    const stored = this.audioStorage.load();
    if (stored && stored.length > 0) {
      this.audioData = stored;
      this.audioRenderer.renderAll(this.audioData);
      this.#togglePlaceholder(false);
    } else {
      this.#togglePlaceholder(true);
    }
  }

  #setupEventListener() {
    this.component.addEventListener('change', (e) => this.#handleChange(e));
  }

  #handleChange(e) {
    const radio = e.target;
    if (radio.type !== 'radio' || radio.name !== 'audio') return;
    if (radio.value) {
      this.selectedAudio = radio.value;
      console.log('Audio terpilih:', this.selectedAudio);
    }
  }

  #updateUI(data) {
    const isExist = this.audioData.some(meta => meta.id === data.id);
    if (isExist) return;

    this.audioData = this.audioStorage.update(data);
    this.audioRenderer.addOne(data);
    this.#togglePlaceholder(false);
  }

  // Helper to show/hide placeholder
  #togglePlaceholder(show) {
    if (this.placeholder) {
      this.placeholder.style.display = show ? 'flex' : 'none';
    }
  }

  // --- Touch scroll helpers (tetap sama) ---
  #forceMobileScrollCSS() {
    if (!this.#isTouchDevice()) return;
    this.component.style.cssText += `
      overflow-y: scroll !important;
      -webkit-overflow-scrolling: touch !important;
      touch-action: pan-y !important;
      overscroll-behavior: contain !important;
    `;
  }

  #isTouchDevice() {
    return ('ontouchstart' in window) ||
           (navigator.maxTouchPoints > 0) ||
           (navigator.msMaxTouchPoints > 0);
  }

  #setupTouchScroll() {
    if (!this.#isTouchDevice()) return;

    let startY = 0;
    let scrollTop = 0;
    let isScrolling = false;

    this.component.addEventListener('touchstart', (e) => {
      const touch = e.touches[0];
      startY = touch.clientY;
      scrollTop = this.component.scrollTop;
      isScrolling = true;

      const target = e.target.closest('.audio-option');
      if (target) {
        target.style.transition = 'background-color 0.2s';
        target.style.backgroundColor = 'rgba(58, 134, 255, 0.1)';
      }
    }, { passive: true });

    this.component.addEventListener('touchmove', (e) => {
      if (!isScrolling) return;

      const touch = e.touches[0];
      const deltaY = startY - touch.clientY;

      if (Math.abs(deltaY) > 3) {
        this.component.scrollTop = scrollTop + deltaY * 1.5;
        startY = touch.clientY;
        scrollTop = this.component.scrollTop;
        e.stopPropagation();

        if (this.#canScroll()) {
          e.preventDefault();
        }
      }
    }, { passive: false });

    this.component.addEventListener('touchend', (e) => {
      isScrolling = false;
      const target = e.target.closest('.audio-option');
      if (target) {
        setTimeout(() => {
          target.style.backgroundColor = '';
        }, 200);
      }
    }, { passive: true });

    this.component.addEventListener('touchcancel', () => {
      isScrolling = false;
    }, { passive: true });
  }

  #canScroll() {
    return this.component.scrollHeight > this.component.clientHeight + 5;
  }

  // --- Public methods ---
  getAudio() {
    return this.selectedAudio;
  }

  reset() {
    // Cari radio dengan value 'bell1' (hanya jika ada)
    const defaultRadio = this.component.querySelector('input[value="bell1"]');
    if (defaultRadio) {
      defaultRadio.checked = true;
      this.selectedAudio = defaultRadio.value;
    } else {
      // Jika tidak ada, pilih yang pertama (jika ada)
      const firstRadio = this.component.querySelector('input[name="audio"]');
      if (firstRadio) {
        firstRadio.checked = true;
        this.selectedAudio = firstRadio.value;
      } else {
        this.selectedAudio = null;
      }
    }
  }
}