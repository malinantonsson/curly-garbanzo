var colours = ['#72c2ad', '#87c7a3', '#a0cd8f', '#b6d37b', '#c5d76a', '#c5d76a', '#efefee', '#d9d9d6', '#27347b', '#2260ab', '#298dcc', '#52aedd', '#7ccdf3', '#7ccdf3', '#e8d3e7', '#ffffff'];
var strokeFills = ['#27347b', '#2260ab', '#298dcc'];

function randomIntFromInterval(min,max) {
    return Math.floor(Math.random()*(max-min+1)+min);
}

var hex = randomIntFromInterval(0, (colours.length - 1));
//hex = 15;

if ((hex === 6) || (hex === 14) || (hex === 15)){ //avoid light stroke on light background
    fill = strokeFills[randomIntFromInterval(0, (strokeFills.length - 1))];
} 
else {
    fill = '#ffffff';
}

var MoireLayer = function() {
    this.rotationVelocity = 0;
    this.setup()
};
MoireLayer.prototype.setup = function() {
    this.group = new Group();
    this.speedRad = 0;
    this.speedRadDelta = Math.random() * 0.0000000000001 + 0.0000000000001;
    this.speedAmp = Math.random() * 2;
    this.scaleRad = 0;
    this.scaleRadDelta = Math.random() * 0.0001 + 0.0001;
    this.scaleAmp = Math.random() * 2;
    var a = Math.random() * 100 + 4;
    for (var b = 0; b < 200; b++) {
        var c = new Path.Line(new Point(0, b * a), new Point(4000, b * a));

        c.strokeColor = fill;
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
    //black background
    var rect = new Path.Rectangle({
        point: [0, 0],
        size: [view.size.width, view.size.height],
        strokeColor: '#000',
        selected: true
    });

    rect.sendToBack();
    rect.fillColor = colours[hex];

    for (var b = 0; b < 5; b++) {
        var a = new MoireLayer();
        a.rotationVelocity = (Math.random() - 0.5) * 0.05;
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