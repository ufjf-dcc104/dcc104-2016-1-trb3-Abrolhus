function Map(modelo) {
    exemplo = {
        cells: [],
        LINES: 32,
        COLUMNS: 32,
        SIZE: 32
    }
    Object.assign(this, exemplo, modelo);
    for (var c = 0; c < this.COLUMNS; c++) {
        this.cells[c] = [];
        for (var l = 0; l < this.LINES; l++) {
            exemplo.cells[c][l] = { tipo: 0, color: "none"};
        }
    }
    if (modelo.m) {
        for (var c = 0; c < this.COLUMNS; c++) {
            for (var l = 0; l < this.LINES; l++) {
                this.cells[c][l] = { tipo: modelo.m[l][c], color: "none" };
            }
        }
    }
}

Map.prototype.draw = function (ctx) {
    var cor = "black";
    for (var c = 0; c < this.COLUMNS; c++) {
        for (var l = 0; l < this.LINES; l++) {
            switch (this.cells[c][l].tipo) {
                case 0:
                    cor = "tan";
                    break;
                case 1:
                    cor = "darkgrey";
                    break;
                default:
                    cor = "black";
            }
            ctx.fillStyle = cor;
            if(this.cells[c][l].color != "none"){
                ctx.fillStyle = this.cells[c][l].color;
            }
            ctx.fillRect(c * this.SIZE, l * this.SIZE, this.SIZE, this.SIZE);
            ctx.strokeStyle = "black";
            ctx.strokeRect(c * this.SIZE, l * this.SIZE, this.SIZE, this.SIZE);
        }
    }
}
Map.prototype.drawCell = function(ctx, col, lin, color){
    ctx.fillStyle = color
    ctx.fillRect(this.getCellX, this.getCellY, this.SIZE, this.SIZE);
}
Map.prototype.getCellX = function(col){
    return col*this.SIZE;
}
Map.prototype.getCellY = function(lin){
    return lin*this.SIZE;
}
Map.prototype.getSideOfCell = function(col, lin, dirX, dirY){
    if(Math.abs(dirX) == 1 && dirY == 0){
        if(dirX == 1){
            return this.getCellX(col) + this.SIZE; //RIGHT SIDE
        }
        else return this.getCellX(col); //LEFT SIDE
    }
    else if(Math.abs(dirY) == 1 && dirX == 0){
        if(dirY == 1){
            return this.getCellY(lin) + this.SIZE; //BOT SIDE
        }
        else return this.getCellY(lin); //TOP SIDE

    }
    else return -1;
}
