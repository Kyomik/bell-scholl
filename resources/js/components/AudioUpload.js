import { Notify } from "../helpers/helper-notif";
import { SubmitButton } from "./SubmitButton";

// Perbaiki fungsi toWav agar menghasilkan header WAV yang benar
function toWav(audioBuffer) {
  const numChannels = 1; // paksa mono karena targetChannels=1
  const sampleRate = audioBuffer.sampleRate;
  const bitDepth = 16;
  const format = 1; // PCM

  // Ambil channel 0 (mono)
  const samples = audioBuffer.getChannelData(0);
  const int16Samples = new Int16Array(samples.length);
  for (let i = 0; i < samples.length; i++) {
    let s = samples[i];
    s = Math.max(-1, Math.min(1, s)); // clamp
    int16Samples[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
  }

  const dataSize = int16Samples.length * 2;
  const buffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(buffer);

  // RIFF chunk
  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + dataSize, true); // file size - 8
  writeString(view, 8, 'WAVE');
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true); // chunk size
  view.setUint16(20, format, true);
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * numChannels * (bitDepth / 8), true); // byte rate
  view.setUint16(32, numChannels * (bitDepth / 8), true); // block align
  view.setUint16(34, bitDepth, true);
  writeString(view, 36, 'data');
  view.setUint32(40, dataSize, true);

  // Write sample data
  for (let i = 0; i < int16Samples.length; i++) {
    view.setInt16(44 + i * 2, int16Samples[i], true);
  }

  return buffer;
}

  function writeString(view, offset, str) {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i));
    }
  }

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
      
      // Resample ke target sample rate & mono
      audioBuffer = await this.#resampleAudioBuffer(audioBuffer, this.targetSampleRate, this.targetChannels);
      
      // Pastikan sample rate sudah sesuai target (misal 16000)
      if (audioBuffer.sampleRate !== this.targetSampleRate) {
        console.warn(`Sample rate mismatch: ${audioBuffer.sampleRate} vs ${this.targetSampleRate}`);
        // Jika tidak sesuai, ulang resampling dengan cara lain (opsional)
      }
      
      const wavArrayBuffer = toWav(audioBuffer);
      await audioContext.close();
      
      const baseName = file.name.replace(/\.[^/.]+$/, '');
      const wavFile = new File([wavArrayBuffer], `${baseName}.wav`, { type: 'audio/wav' });
      
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

  // Resample menggunakan OfflineAudioContext
  #resampleAudioBuffer(audioBuffer, targetSampleRate, targetChannels) {
    return new Promise((resolve) => {
      const sourceSampleRate = audioBuffer.sampleRate;
      const sourceChannels = audioBuffer.numberOfChannels;
      const duration = audioBuffer.duration;
      const sampleCount = Math.ceil(duration * targetSampleRate);
      
      const offlineCtx = new OfflineAudioContext(
        targetChannels,
        sampleCount,
        targetSampleRate
      );
      
      const source = offlineCtx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(offlineCtx.destination);
      source.start();
      
      offlineCtx.startRendering().then((renderedBuffer) => {
        resolve(renderedBuffer);
      }).catch((err) => {
        console.error('Resampling failed', err);
        // Fallback: kembalikan buffer asli (walaupun sample rate berbeda)
        resolve(audioBuffer);
      });
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