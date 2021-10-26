class FrameTable {
  constructor(size) {
    this.frameTable = new Array(size);
    for (let i = 0; i < this.frameTable.length; i++) {
      this.frameTable[i] = "vago";
    }
  }
  setOnUseFrame(index) {
    this.frameTable[index] = "ocupado";
  }
  setFreeFrame(index) {
    this.frameTable[index] = "vago";
    return index;
  }
  getFreeSlot() {
    for (let i = 0; i < this.frameTable.length; i++) {
      if (this.frameTable[i] === "vago") {
        return i;
      }
    }
    return -1;
  }
}

module.exports = FrameTable;
