class PageTable{
    constructor(size){
        this.pageTable = [];
        for(let i = 0; i < size; i++){
            this.pageTable[i] = [ 0, "invalid"];
        }
    };
    getTable(){
        return this.pageTable;
    }
    setFrame(page, frame){
        this.pageTable[page] = [frame, "valid"];
    };
    removeFrame(page){
        this.pageTable[page] = [0, "invalid"];
    }
    checkIfPageInMemory(page){
        return this.pageTable[page][1] === "valid";
    }
    getPageFrame(page){
        return this.pageTable[page][0];
    }
}

module.exports = PageTable;