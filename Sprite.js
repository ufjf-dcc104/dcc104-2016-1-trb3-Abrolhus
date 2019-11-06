function Sprite(params){
    var normal = {
        color: "red",
        w: 20,
        h: 20,

        x: 200,
        y: 150,
        v: new Vector(1,0,0),
        a: new Vector(1,0,0),
        dir: new Vector(1,0,0), //direcao q o char esta olhando para
        stdWalkAcceleration: 1000,
        dirX: 0,
        dirY: 0,

        state: null,

        spriteSheet: null,
        animations: null,

        onGround: true,
        inputForce: new Vector(), // o mesmo q new Vector(0,0,0)
        externalForces: [],
        friction: new Vector(),
        airFriction: new Vector(),

        gravity: new Vector(0,1,20),
        jumpSpeed: 0,

        stdFrictionMod: 500,
        is_sliding: false,

        can_walk: true,
        can_jump: true,

        scene: null,

        mc: null,
        mc: null,


    }
    Object.assign(this, normal, params);
}
Sprite.prototype.draw = function(ctx){
    ctx.fillStyle= this.color;
    ctx.strokeStyle="black";
    ctx.fillRect(this.x - this.w/2, this.y - this.h/2, this.w, this.h);
    ctx.fillStyle= "blue";
    ctx.fillRect(this.x, this.y, 2, 2);
}
Sprite.prototype.mover = function(dt){
    this.updateForce();
    this.updateVelocity(dt);
    //this.updateSpace(dt);
    //this.aplicaRestricoes(dt, this.scene.map);
    this.preventMapColisions(this.scene.map);




}
Sprite.prototype.update = function(dt, teclas){
    this.getInput(teclas);
    this.setAInput();
    this.addExternalForce(this.gravity);
    this.mover(dt);
    if(this.dirY == -1 && this.can_jump){
        console.log(this.dirY)
        this.jump();
    }
    this.rForce = new Vector();
    this.clearExternalForces();
}

Sprite.prototype.updateSpace = function(dt){
    this.x += this.v.projection("x")*dt;
    this.y += this.v.projection("y")*dt;
}
Sprite.prototype.updateVelocity = function(dt){
    
    this.v.add(this.rForce.rFloatProd(dt)); // v = v + "a"*dt;


    if(this.onGround){
        this.friction.x = -Math.sign(this.v.x); //atrito sempre na direção contraria da velocidade em x;
        this.friction.y = 0; // atrito só tem componente em x;
        this.friction.mod = (this.stdFrictionMod*dt < Math.abs(this.v.projection("x"))) ? this.stdFrictionMod : this.v.projection("x");
        //solucao sem encalpsulamento devido
        this.v.add(this.friction.rFloatProd(dt));
    }
}
Sprite.prototype.updateForce = function(){
    this.rForce = new Vector(); //de acordo com a pseudo Física dessa "engine", força é nada mais que uma aceleracao;
    for (let i = 0; i < this.externalForces.length; i++) {
        this.rForce.add(this.externalForces[i]);
    }
    this.rForce.add(this.inputForce); //talvez.......
    this.inputForce = new Vector();
}
Sprite.prototype.addExternalForce = function(force){
    this.externalForces.push(force);
}
Sprite.prototype.clearExternalForces = function(){
    this.externalForces = [];
}
Sprite.prototype.getInput = function(teclas){
    var dirX = 0;
    var dirY = 0;
    if(teclas.left && teclas.last == "left"){
        dirX = -1;
    } 
    else if(teclas.right && teclas.last == "right"){ 
        dirX = 1; 
    }
    else{

    }
    if(teclas.up && teclas.lastY == "up"){
        dirY = -1;
    } else if(teclas.down && teclas.lastY == "down"){ 
        dirY = 1; 
    }
    else{

    }
    this.dirX = dirX;
    this.dirY = dirY;
    // console.log(this.dirX)
    // this.walkDir = this.walkDir.vetorUnitario(dirX, dirY);
    // if(dirX == 0 && dirY == 0){
    //     this.walkDir.mod = 0;
    //     this.andar.isTryingTo = false;
    // }
    // else{
    //     this.walkDir.mod = 1;
    //     this.andar.isTryingTo = true;
    // }
}
Sprite.prototype.setAInput = function(){
    if(this.dirX != 0 && this.can_walk){
        this.inputForce = new Vector(this.dirX, 0, this.stdWalkAcceleration);

    }
    // console.log(this.inputForce)
}
Sprite.prototype.jump = function(){
    //this.v.add(new Vector(0,1,-this.jumpSpeed));
    this.v = this.v.normal(this.v.x*this.v.mod, -this.jumpSpeed); //cria um novo vetor velocidade que mantem "x" mas seta o "y" para "-jumpSpeed";
    console.log("a");
    console.log(this.v.x*this.v.mod);
    console.log(this.v);
}
Sprite.prototype.aplicaRestricoes = function (dt, map) {
    var vx = this.v.projection("x");
    var vy = this.v.projection("y");

    this.mc = Math.floor(this.x / this.scene.map.SIZE);
    this.ml = Math.floor(this.y / this.scene.map.SIZE);


    var dnx;
    var dx;
    dx = vx * dt;
    dnx = dx;
    dy = vy * dt;
    dny = dy;
    if (dx > 0 && map.cells[this.mc + 1][this.ml].tipo != 0) {
        dnx = map.SIZE * (this.mc + 1) - (this.x + this.w / 2);
        dx = Math.min(dnx, dx);
    }
    if (dx < 0 && map.cells[this.mc - 1][this.ml].tipo != 0) {
        dnx = map.SIZE * (this.mc - 1 + 1) - (this.x - this.w / 2);
        dx = Math.max(dnx, dx);
    }
    if (dy > 0 && map.cells[this.mc][this.ml + 1].tipo != 0) {
        dny = map.SIZE * (this.ml + 1) - (this.y + this.h / 2);
        dy = Math.min(dny, dy);
    }
    if (dy < 0 && map.cells[this.mc][this.ml - 1].tipo != 0) {
        dny = map.SIZE * (this.ml - 1 + 1) - (this.y - this.h / 2);
        dy = Math.max(dny, dy);
    }
    //this.vy = dy / dt;
    this.x = this.x + dx;
    this.y = this.y + dy;

    var MAXX = map.SIZE * map.COLUMNS - this.w / 2;
    var MAXY = map.SIZE * map.LINES - this.h / 2;

    if (this.x > MAXX) this.x = MAXX;
    if (this.y > MAXY) {
        this.y = MAXY;
        this.vy = 0;
    }
    if (this.x - this.w / 2 < 0) this.x = 0 + this.w / 2;
    if (this.y - this.h / 2 < 0) this.y = 0 + this.h / 2;

}
Sprite.prototype.preventMapColisions = function(map){
    /*  essa solucao parte do pressuposto que o objeto nao esta colidindo com nada no momento,
        é uma medida preventiva.
    */

    var vx = this.v.projection("x");
    var vy = this.v.projection("y");

    this.mc = Math.floor(this.x / this.scene.map.SIZE);
    this.ml = Math.floor(this.y / this.scene.map.SIZE);

    var dx = vx * dt;
    var dy = vy * dt;
    //console.log(dx);
    var fdx = 0;
    var fdy = 0;

    var dirX = Math.sign(vx);
    var dirY = Math.sign(vy);
    var mainCorner = {x: this.x + dirX*this.w/2,      y: this.y + dirY*this.h/2,      col: Math.floor((this.x + (dirX)*this.w/2) / map.SIZE),      lin: Math.floor((this.y + dirY*this.h/2) / this.scene.map.SIZE)}
    var xCorner =    {x: this.x + dirX*this.w/2,      y: this.y + (-1)*dirY*this.h/2, col: Math.floor((this.x + dirX*this.w/2) / map.SIZE),      lin: Math.floor((this.y + (-1)*dirY*this.h/2) / this.scene.map.SIZE)}
    var yCorner =    {x: this.x + (-1)*dirX*this.w/2, y: this.y + dirY*this.h/2,      col: Math.floor((this.x + (-1)*dirX*this.w/2) / map.SIZE), lin: Math.floor((this.y + dirY*this.h/2) / this.scene.map.SIZE)}
    
    mainCorner.xCell = {col:(mainCorner.col + dirX), lin: mainCorner.lin};
    mainCorner.yCell = {col:(mainCorner.col), lin: mainCorner.lin + dirY};
    mainCorner.xCell.x = mainCorner.xCell.col*map.SIZE;
    mainCorner.xCell.y = mainCorner.xCell.lin*map.SIZE;
    mainCorner.yCell.x = mainCorner.yCell.col*map.SIZE;
    mainCorner.yCell.y = mainCorner.yCell.lin*map.SIZE;

    xCorner.xCell = {col:(xCorner.col + dirX), lin: xCorner.lin};
    yCorner.yCell = {col:(yCorner.col), lin: yCorner.lin + dirY};
    xCorner.xCell.x = xCorner.xCell.col*map.SIZE;
    xCorner.xCell.y = xCorner.xCell.lin*map.SIZE;
    yCorner.yCell.x = yCorner.yCell.col*map.SIZE;
    yCorner.yCell.y = yCorner.yCell.lin*map.SIZE;

    var xBarriers = [dx];
    var yBarriers = [dy];

    if(map.cells[mainCorner.col][mainCorner.lin].tipo == 1 || map.cells[xCorner.col][xCorner.lin].tipo == 1){
        this.x += 0; 
    }
    else{
        if(dx != 0){
            if(map.cells[mainCorner.xCell.col][mainCorner.xCell.lin].tipo == 1){xBarriers.push(Math.abs(mainCorner.xCell.x))}
            if(map.cells[xCorner.xCell.col][xCorner.xCell.lin].tipo == 1){xBarriers.push(Math.abs(xCorner.xCell.x))}
            if(xBarriers.length != 1){
                this.x += dirX*Math.min(...xBarriers)
            }
        }
        else{
            return;
        }
    }
    if(map.cells[mainCorner.col][mainCorner.lin].tipo == 1 || map.cells[yCorner.col][yCorner.lin].tipo == 1){
        this.y += 0;
    }
    else{
        if(dy != 0){
            if(map.cells[mainCorner.yCell.col][mainCorner.yCell.lin].tipo == 1){yBarriers.push(Math.abs(mainCorner.yCell.y))}
            if(map.cells[yCorner.yCell.col][yCorner.yCell.lin].tipo == 1){yBarriers.push(Math.abs(yCorner.yCell.y))}
            if(yBarriers.length != 1){
                this.y += dirY*Math.min(...xBarriers)
            }
        }
        else{
            ;
        }
    }

    

    
    // if(dy != 0){
    //     if(map.cells[mainCorner.yCell.col][mainCorner.yCell.lin].tipo == 1){yBarriers.push(Math.abs(mainCorner.yCell.y))}
    //     if(map.cells[yCorner.yCell.col][yCorner.yCell.lin].tipo == 1){yBarriers.push(Math.abs(yCorner.yCell.y))}
    // }




    // mainCorner.xBarrier = (mainCorner.col + dirX)*map.SIZE;
    // mainCorner.yBarrier = (mainCorner.lin + dirY)*map.SIZE;
    // xCorner.xBarrier =  (xCorner.col + dirX)*map.SIZE;
    // yCorner.yBarrier =  (yCorner.lin + dirY)*map.SIZE;
    // //console.log(mainCorner);

    // // var nearXside = (this.mc + dirX)*map.SIZE; //se o dx for 0, fudeu, FU-----DEU
    // // var nearYside = map.cells[this.mc][this.ml + dirY];


    // fdx = dirX*Math.min(Math.abs(dx), Math.abs(mainCorner.x - mainCorner.xBarrier), Math.abs(xCorner.x - xCorner.xBarrier));
    // console.log("distY: " + Math.abs(mainCorner.y - mainCorner.yBarrier));
    // console.log("dy: " + Math.abs(dy))
    // console.log(Math.abs(dy)> Math.abs(mainCorner.y - mainCorner.yBarrier))

    // fdy = dirY*Math.min(Math.abs(dy), Math.abs(mainCorner.y - mainCorner.yBarrier), Math.abs(yCorner.y - yCorner.yBarrier));
    //     if(Math.abs(fdy) == Math.abs(mainCorner.y - mainCorner.yBarrier)){
    //         ctx.fillStyle = "blue";
    //         ctx.fillText("FOI PORRA", mainCorner.x, mainCorner.y);
    //     }

    
    
    // this.x += fdx;
    // this.y += fdy;
    // console.log(this.y);

    

}
