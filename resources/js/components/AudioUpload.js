import { Notify } from "../helpers/helper-notif";
import { SubmitButton } from "./SubmitButton";

export class AudioUpload {
  constructor(parentComponent, wsManager, onUploadComplete = null) {
    this.component = parentComponent;
    this.wsManager = wsManager;
    this.onUploadComplete = onUploadComplete;
    this.uploadLabel = null;
    this.uploadOriginalContent = null;
    this.uploadForm = null;
    this.fileNameSpan = null;
    this.cancelUploadBtn = null;
    this.uploadButtonElement = null;  // simpan elemen asli
    this.uploadBtn = null;            // instance SubmitButton
    this.currentFile = null;
    this.CHUNK_SIZE = 64 * 1024; // 64 KB
    this.targetSampleRate = 16000; // 16 kHz
    this.targetChannels = 1;       // mono

    // Create modal overlay
    this.modal = document.createElement('div');
    this.modal.className = 'upload-modal-overlay';
    this.modal.style.display = 'none';
    this.modal.innerHTML = `
      <div class="upload-modal-content">
        <div class="spinner"></div>
        <p>Mengunggah audio...</p>
      </div>
    `;
    document.body.appendChild(this.modal);

    this.#initUI();
  }

  #initUI() {
    this.uploadLabel = this.component.querySelector('label[for="custom-audio-input"]');
    if (!this.uploadLabel) return;

    const originalContent = this.uploadLabel.querySelector('.audio-option-content');
    if (!originalContent) return;

    // Buat form upload (awalnya tersembunyi)
    const uploadForm = document.createElement('div');
    uploadForm.className = 'custom-audio-upload-form';
    uploadForm.style.display = 'none';
    uploadForm.innerHTML = `
      <div class="selected-file-info">
        <i class="fas fa-file-audio"></i>
        <span class="file-name"></span>
        <button type="button" class="btn-cancel-file"><i class="fas fa-times"></i></button>
      </div>
      <button type="button" id="btn-upload-audio" disabled>
        <i class="fas fa-upload"></i> Kirim
      </button>
    `;
    originalContent.insertAdjacentElement('afterend', uploadForm);

    this.uploadOriginalContent = originalContent;
    this.uploadForm = uploadForm;
    this.fileNameSpan = uploadForm.querySelector('.file-name');
    this.cancelUploadBtn = uploadForm.querySelector('.btn-cancel-file');
    this.uploadButtonElement = uploadForm.querySelector('#btn-upload-audio');
    this.uploadBtn = new SubmitButton(uploadForm, 'btn-upload-audio');
  }

  setupEventListeners() {
    const customInput = this.component.querySelector('#custom-audio-input');
    if (customInput) {
      customInput.addEventListener('change', (e) => this.#handleFileSelect(e));
    }
    if (this.cancelUploadBtn) {
      this.cancelUploadBtn.addEventListener('click', () => this.#cancelUpload());
    }
    if (this.uploadButtonElement) {
      this.uploadButtonElement.addEventListener('click', () => this.#startUpload());
    }
  }

  #handleFileSelect(e) {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith('audio/')) {
      Notify.error('Harap pilih file audio (MP3, WAV, dll)');
      return;
    }

    this.currentFile = file;
    this.fileNameSpan.textContent = file.name;

    // Tampilkan form upload, sembunyikan konten asli
    this.uploadOriginalContent.style.display = 'none';
    this.uploadForm.style.display = 'flex';
    this.uploadButtonElement.disabled = false;
    // Reset loading state jika sebelumnya loading (misalnya jika gagal)
    if (this.uploadBtn) this.uploadBtn.setLoading(false);

    this.#convertToWav(file);
  }

  async #convertToWav(file) {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      let audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
      
      // Resample ke mono 16kHz
      audioBuffer = await this.#resampleAudioBuffer(audioBuffer, this.targetSampleRate, 1);
      await audioContext.close();

      // Konversi manual ke PCM 16-bit integer — BUKAN pakai audiobuffer-to-wav
      const pcm16 = this.#audioBufferToPCM16(audioBuffer);
      const wavBuffer = this.#encodePCM16toWAV(pcm16, this.targetSampleRate, 1);

      const baseName = file.name.replace(/\.[^/.]+$/, '');
      const wavFile = new File([wavBuffer], `${baseName}.wav`, { type: 'audio/wav' });
      this.currentFile = wavFile;
      this.fileNameSpan.textContent = wavFile.name;
      this.uploadButtonElement.disabled = false;
      if (this.uploadBtn) this.uploadBtn.setLoading(false);
      Notify.success(`Audio siap dikirim (${(wavFile.size / 1024).toFixed(1)} KB)`);
    } catch (err) {
      console.error(err);
      Notify.error('Gagal mengonversi audio. Pastikan file tidak rusak.');
      this.#cancelUpload();
    }
  }

  #audioBufferToPCM16(audioBuffer) {
    const float32 = audioBuffer.getChannelData(0); // mono
    const int16 = new Int16Array(float32.length);
    for (let i = 0; i < float32.length; i++) {
      const s = Math.max(-1, Math.min(1, float32[i]));
      int16[i] = s < 0 ? s * 32768 : s * 32767;
    }
    return int16;
  }

  #encodePCM16toWAV(pcm16, sampleRate, channels) {
    const byteRate    = sampleRate * channels * 2;
    const blockAlign  = channels * 2;
    const dataSize    = pcm16.length * 2;
    const buffer      = new ArrayBuffer(44 + dataSize);
    const view        = new DataView(buffer);

    const write = (offset, str) => {
      for (let i = 0; i < str.length; i++)
        view.setUint8(offset + i, str.charCodeAt(i));
    };

    write(0,  'RIFF');
    view.setUint32(4,  36 + dataSize, true);
    write(8,  'WAVE');
    write(12, 'fmt ');
    view.setUint32(16, 16, true);         // chunk size
    view.setUint16(20, 1,  true);         // PCM = 1
    view.setUint16(22, channels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, byteRate, true);
    view.setUint16(32, blockAlign, true);
    view.setUint16(34, 16, true);         // 16-bit
    write(36, 'data');
    view.setUint32(40, dataSize, true);

    // Tulis sampel
    const dataView = new Int16Array(buffer, 44);
    dataView.set(pcm16);

    return buffer;
  }

  // Resample menggunakan OfflineAudioContext
  #resampleAudioBuffer(audioBuffer, targetSampleRate, targetChannels) {
    return new Promise((resolve, reject) => {
      const duration = audioBuffer.duration;
      const sampleCount = Math.ceil(duration * targetSampleRate);
      const offlineCtx = new OfflineAudioContext(targetChannels, sampleCount, targetSampleRate);
      const source = offlineCtx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(offlineCtx.destination);
      source.start();
      offlineCtx.startRendering().then(resolve).catch(reject);
    });
  }

  #cancelUpload() {
    this.currentFile = null;
    this.uploadOriginalContent.style.display = 'flex';
    this.uploadForm.style.display = 'none';
    if (this.uploadBtn) this.uploadBtn.setLoading(false); // kembalikan tombol ke normal
    this.uploadButtonElement.disabled = true;

    const customInput = this.component.querySelector('#custom-audio-input');
    if (customInput) customInput.value = '';

    this.hideModal(); // hide modal if it was shown
  }

  showModal() {
    this.modal.style.display = 'flex';
  }

  hideModal() {
    this.modal.style.display = 'none';
  }

  async #startUpload() {
    if (!this.currentFile) return;

    // Tampilkan loading pada tombol
    if (this.uploadBtn) this.uploadBtn.setLoading(true);
    this.showModal();

    const file = this.currentFile;

    // Kirim event START
    this.wsManager.send({
      event: 'upload-audio-start',
      data: {
        filename: file.name,
        size: file.size,
        type: file.type,
        totalChunks: Math.ceil(file.size / this.CHUNK_SIZE),
      }
    });
  }

  letsFuckingGo() {
    // Kirim chunk binary
    let offset = 0;
    let chunkIndex = 0;
    const file = this.currentFile;
    
    const sendNextChunk = () => {
      const slice = file.slice(offset, offset + this.CHUNK_SIZE);
      const reader = new FileReader();

      reader.onload = (e) => {
        const buffer = e.target.result;
        if (this.wsManager.ws && this.wsManager.ws.readyState === WebSocket.OPEN) {
          this.wsManager.ws.send(buffer);
        } else {
          throw new Error('Koneksi WebSocket terputus');
        }

        chunkIndex++;
        offset += this.CHUNK_SIZE;

        if (offset < file.size) {
          setTimeout(sendNextChunk, 10);
        } else {
          // Kirim event END
          this.wsManager.send({
            event: 'upload-audio-end',
          });

          this.#cancelUpload(); // akan mengembalikan tombol ke normal dan menutup modal
          Notify.info('File terkirim, menunggu konfirmasi server...');

          if (this.onUploadComplete) this.onUploadComplete();
        }
      };

      reader.onerror = () => {
        Notify.error('Gagal membaca file chunk');
        this.#cancelUpload(); // reset tombol dan tutup modal
      };

      reader.readAsArrayBuffer(slice);
    };

    sendNextChunk();
  }
}