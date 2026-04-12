export class AudioOptionsRenderer {
  constructor(container, AudioComponent) {
    this.container = container;
    this.AudioComponent = AudioComponent;
    this.checkedFlag = true;   // akan direset setelah render pertama
  }

  renderAll(audioData) {
    // Kosongkan container jika perlu (opsional, karena kita akan menambahkan satu per satu)
    // Namun aslinya tidak menghapus, hanya menambah. Kita akan tetap menambah.
    audioData.forEach(item => {
      this.container.appendChild(
        new this.AudioComponent(this.container, item, this.checkedFlag)
      );
      this.checkedFlag = false;
    });
  }

  addOne(audioItem) {
    this.container.appendChild(
      new this.AudioComponent(this.container, audioItem, this.checkedFlag)
    );
    this.checkedFlag = false;
  }

  resetCheckedFlag() {
    this.checkedFlag = true;
  }
}