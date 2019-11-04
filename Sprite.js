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
        gravity: new Vector(0,1,200),
        jumpSpeed: 100,

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
}
Sprite.prototype.mover = function(dt){
    this.updateForce();
    this.updateVelocity(dt);
    //this.updateSpace(dt);
    this.aplicaRestricoes(dt, this.scene.map);





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


