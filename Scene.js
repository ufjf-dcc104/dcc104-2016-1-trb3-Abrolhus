function Scene(params) {
    var exemplo ={
        sprites: [],
        toRemove: [],
        ctx: null,
        w: 300,
        h: 300,
        assets: null,
        map: null
    }
    Object.assign(this, exemplo, params);
}

Scene.prototype = new Scene();
Scene.prototype.constructor = Scene;

Scene.prototype.add = function(sprite){
    this.sprites.push(sprite);
    sprite.scene = this;
};

Scene.prototype.draw = function(){
    for(var i = 0; i<this.sprites.length; i++){
        this.sprites[i].draw(this.ctx);
    }  
};

Scene.prototype.update = function(dt, teclas){
    for(var i = 0; i<this.sprites.length; i++){
        this.sprites[i].update(dt, teclas);
    }  
};

Scene.prototype.comportar = function(){
    for(var i = 0; i<this.sprites.length; i++){
        if(this.sprites[i].comportar){
            this.sprites[i].comportar();
        }
    }  
};


Scene.prototype.limpar = function(){
    this.ctx.clearRect(0,0, this.w, this.h);
}

Scene.prototype.checaColisao = function(){
    for(var i = 0; i<this.sprites.length; i++){
        if(this.sprites[i].morto){
            this.toRemove.push(this.sprites[i]);
        }
        for(var j = i+1; j<this.sprites.length; j++){
            if(this.sprites[i].colidiuCom(this.sprites[j])){
                if(this.sprites[i].props.tipo === "pc"
                && this.sprites[j].props.tipo ==="npc"){
                    this.toRemove.push(this.sprites[j]);
                    this.add(new Explosion({x: this.sprites[j].x, y:this.sprites[j].y}));
                    this.assets.play("explosion");
                }
                else 
                if(this.sprites[i].props.tipo === "npc"
                && this.sprites[j].props.tipo ==="tiro"){
                    this.toRemove.push(this.sprites[i]);
                    this.toRemove.push(this.sprites[j]);
                    this.add(new Explosion({x: this.sprites[i].x, y:this.sprites[i].y}));
                    this.assets.play("explosion");
                }
            }
        }
    }  
};

Scene.prototype.removeSprites = function () {
    for (var i = 0; i < this.toRemove.length; i++) {
        var idx = this.sprites.indexOf(this.toRemove[i]);
        if(idx>=0){
            this.sprites.splice(idx,1);
        }
    }
    this.toRemove = [];
};

Scene.prototype.drawMapa = function () {
    this.map.draw(this.ctx);
}

Scene.prototype.passo = function(dt, teclas){
    this.limpar();
    this.drawMapa();
    //this.comportar();
    this.update(dt, teclas);
    this.draw();
    //this.checaColisao();
    this.removeSprites();
}