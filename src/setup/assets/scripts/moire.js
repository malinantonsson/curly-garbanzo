var MoireLayer = function() {
    this.rotationVelocity = 0;
    this.setup()
};
MoireLayer.prototype.setup = function() {
    this.group = new Group();
    this.speedRad = 0;
    this.speedRadDelta = Math.random() * 0.00000001 + 0.0000001;
    this.speedAmp = Math.random() * 2;
    this.scaleRad = 0;
    this.scaleRadDelta = Math.random() * 0.0001 + 0.0001;
    this.scaleAmp = Math.random() * 2;
    var a = Math.random() * 100 + 4;
    for (var b = 0; b < 200; b++) {
        var c = new Path.Line(new Point(0, b * a), new Point(4000, b * a));
        c.strokeColor = new Color(0.8, 0.8, 0.8);
        this.group.addChild(c)
    }
};
MoireLayer.prototype.update = function() {
    this.speedRad += this.speedRadDelta;
    if (this.speedRad > Math.PI * 2) {
        this.speedRad = 0
    }
    this.scaleRad += this.scaleRadDelta;
    if (this.scaleRad > Math.PI * 2) {
        this.scaleRad = 0
    }
    this.group.rotation += this.rotationVelocity + Math.sin(this.speedRad) *
        this.speedAmp;
    this.group.scaling = Math.sin(this.scaleRad) * 0.25 + 1
};
var layers = [];

function setup() {
    for (var b = 0; b < 5; b++) {
        var a = new MoireLayer();
        a.rotationVelocity = (Math.random() - 0.5) * 0.1;
        layers.push(a)
    }
}

function onMouseDown(a) {}

function onMouseUp(a) {}

function onFrame(b) {
    for (var a = 0; a < layers.length; a++) {
        layers[a].update()
    }
}

function addSabo() {}

function onResize(a) {}
setup();

//var Moire = {}

/*window.moire = layers;
console.log(window.digitalArt);
console.log(window);*/