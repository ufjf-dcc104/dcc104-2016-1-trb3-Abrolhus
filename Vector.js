function Vector(x, y, mod){
    if(mod == undefined && x == undefined && y == undefined){
        this.mod = 0;
        this.x = 0;
        this.y = 0;
    }
    else if(mod == undefined){
            var len = Math.hypot(x,y);
            if(len == 0){
                this.mod = 0;
                this.x = 0;
                this.y = 0;
            }
            else{
                this.mod = len;
                this.x = x/len;
                this.y = y/len;
            }
    }
    else{
        this.mod = mod;
        this.x = x;
        this.y = y;
    }
}
Vector.prototype.floatProd = function(num){
    this.mod *= num;
}
Vector.prototype.rFloatProd = function(num){
    return new Vector(this.x, this.y, this.mod*num);
}
Vector.prototype.add = function(that){
    var x =  this.x*this.mod + that.x*that.mod;
    var y =  this.y*this.mod + that.y*that.mod;
    //than is needed to "unit" this x and y values; (x = cos(a), x = sin(a), len = len);
    var len = Math.hypot(x,y);
    if(len == 0){
        this.mod = 0;
        this.x = 0;
        this.y = 0;
    }
    else{
        this.x   = x/len;
        this.y   = y/len;
        this.mod = len;
    }
}
Vector.prototype.dotProduct = function(that){
    return (this.mod*that.mod)*(this.x*that.x + this.y*that.y);
}
Vector.prototype.rAdd = function(that){
    var x =  this.x*this.mod + that.x*that.mod;
    var y =  this.y*this.mod + that.y*that.mod;
    //than is needed to "unit" this x and y values; (x = cos(a), x = sin(a), len = len);
    var len = Math.hypot(x,y);
    if(len == 0){
        return new Vector(0,0,0);
    }
    return new Vector(x/len, y/len, len);
}
Vector.prototype.isNull = function(){
    return (this.mod == 0 || (this.x == 0 && this.y == 0));
}
Vector.prototype.projection = function(axis){
    if(axis == "x" || axis == 0){
        return this.x*this.mod;
    }
    else if(axis == "y" || axis == 1){
        return this.y*this.mod;
    }
}
Vector.prototype.normal = function(x,y){
    var len = Math.hypot(x,y);
    if(len == 0)
        return new Vector();
    return new Vector(x/len, y/len, len);
}
Vector.prototype.zeroAxis = function(axis){
    var aux;
    if(axis == "x"){
        var x = 0;
        var y = this.projection("y")
        aux = new Vector(x, y);
        
    }
    else if(axis == "y"){
        var y = 0;
        var x = this.projection("x")
        aux = new Vector(x, y);
        console.log("isso:")
        console.log(this);

        console.log(aux);
    }
    if(aux){
        this.x = aux.x;
        this.y = aux.y;
        this.mod = aux.mod
    }

}





