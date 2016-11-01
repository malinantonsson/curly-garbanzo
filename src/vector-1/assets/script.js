var Node = function(b, a) {
    this.position = b;
    this.setRadius(a)
};
Node.prototype.setRadius = function(d) {
    if (this.path) {
        this.path.remove()
    }
    this.radius = d;
    
    this.path = new Path.RegularPolygon(new Point(this.position), 3, d);

    //this.path = new Path.RegularPolygon(new Point(this.position), 3, d);
    var h = Math.random() * 1;
    var a = Math.random() * h;
    var f = Math.random() * f;
    var e = new Color(h, f, a);
    e.hue += hue;
    if (satMode) {
        e.saturation = sat
    }
    this.path.fillColor = e;
    this.scaling = 0.1;
    this.path.scaling = this.scaling;
};

Node.prototype.update = function() {
    this.scaling = this.scaling + (1 - this.scaling) * 0.1;
    this.path.scaling = this.scaling;
};

Node.prototype.teardown = function() {
    if (this.path) {
        this.path.remove()
    }
};

var nodes = [];
var c = 0.2;
var maxNodeNum = 3000; //3000
var initialSize;
var baseR;
var cnt = 0;
var maxCnt = 180;
var hue = Math.random() * 360;
var sat;
var satMode;

function setup() {
    initialSize = 0;
    reset()
}

function reset() {
    removeAllNodes();
    var a = view.size.width;
    var b = view.size.height;
    var e = Math.sqrt(a * a + b * b);
    baseR = e * 0.15 * (Math.random() * 2.5 + 0.5);
    hue += Math.random() * 100;
    if (hue > 360) {
        hue = hue % 360
    }
    cnt = 0;
    satMode = (Math.random() < 0.5) ? true : false;
    sat = Math.random()
}

function removeAllNodes() {
    for (var a = 0; a < nodes.length; a++) {
        nodes[a].teardown()
    }
    nodes = []
}

function onFrame(d) {
    cnt++;
    if (cnt == maxCnt) {
        reset()
    }
    var e = new Date().getTime();
    for (var b = 0; b < nodes.length; b++) {
        nodes[b].update()
    }
    if (nodes.length < maxNodeNum) {
        while (true) {
            createNode();
            var a = new Date().getTime();
            if (a - e > 10) {
                break
            }
        }
    }
}

function createNode() {
    var j = new Point(Math.random() * view.size.width, Math.random() * view
        .size.height);
    var copy = j;
    console.log('org: ' + j);
    var a = baseR * Math.pow(nodes.length, -c);
    var d;
    var e = Number.POSITIVE_INFINITY;
    for (var g = 0; g < nodes.length; g++) {
        var h = nodes[g];
        var f = j - h.position;
        //console.log(f);
        var b = f.length;
        //console.log(b);
        if (b < h.radius) {
            return Number.POSITIVE_INFINITY
        } else {
            if (b >= h.radius && b - h.radius < e) {
                e = b - h.radius;
                d = h
            }
        }
    }
    if (nodes.length == 0) {
        var h = new Node(j, baseR);
        nodes.push(h)
    } 
    else {
        //console.log(e);
        if (e != Number.POSITIVE_INFINITY && e > Math.sqrt(Math.sqrt(a))) {
            console.log('j: ' + j);
            //console.log('copy: ' + copy);
            //var j = new Point(Math.random() * view.size.width, Math.random() * view.size.height);
            var h = new Node(j, Math.min(e, a));
            //console.log('create all');
            nodes.push(h)
        }
    }
    
   
}

function onMouseDown() {
    reset()
}

function onResize(a) {
    reset()
}
setup();