var Node = function(j, d) {
    var e = [this.createTriangle];
    this.tPosition = j;
    this.position = j;
    this.path = e[Math.floor(Math.random() * e.length)]();
    this.path.position = j;
    var i = Math.random() * 1;
    var a = Math.random() * i;
    var h = Math.random() * h;
    var f = new Color(i, h, a);
    f.hue += hue;
    this.path.fillColor = f
};
Node.prototype.setupAnimation = function() {
    this.path.opacity = 0;
    this.copy = this.path.clone();
    this.scaling = 0.1;
    this.copy.scaling = this.scaling;

    this.copy.opacity = 1;
};

Node.prototype.createTriangle = function() {
    var a = new Path();
    a.addSegments([new Point(0, -36.622), new Point(41.929, 36), new Point(-
        41.9297, 36)]);
    a.closed = true;
    
    return a
};

Node.prototype.update = function() {
    this.scaling = this.scaling + (1 - this.scaling) * 0.02;
    this.copy.scaling = this.scaling;

};

Node.prototype.teardown = function() {
    if (this.path) {
        this.path.remove()
    }

    if(this.copy) {
        this.copy.remove();
    }
};
var nodes = [];
var c = 1.2;
var a0;
var r0;
var maxNodeNum = 4000;
var initialSize;
var baseR;
var cnt = 0;
var maxCnt = 180;
var hue = Math.random() * 360;
var sat;
var satMode;
var baseScale;

function setup() {
    initialSize = 0;
    reset()
}

function prepare() {
    baseScale = 0.5 + Math.random() * 1.5;
    var e = 0;
    for (var b = 1; b < 100000; b++) {
        e += Math.pow(b, -c)
    }
    var a = view.size.width;
    var d = view.size.height;
    a0 = a * d / e * baseScale;
    r0 = Math.sqrt(a0 / Math.PI);
    hue = Math.random() * 360;
    if (Math.random() < 0.5) {
        satMode = true;
        sat = Math.random()
    }
}


function reset() {
    removeAllNodes();
    prepare();
}

function removeAllNodes() {
    for (var a = 0; a < nodes.length; a++) {
        nodes[a].teardown()
    }
    nodes = []
}

function onFrame(e) {
    for (var d = 0; d < nodes.length; d++) {
        nodes[d].update()
    }
    var b = 0;
    var f = new Date().getTime();
    if (nodes.length < maxNodeNum) {
        while (true) {
            if (createNode()) {
                b++;
                if (b > 10) {
                    break
                }
            }
            var a = new Date().getTime();
            if (a - f > 20) {
                break
            }
        }
    }
}

function createNode() {
    var h = new Point(Math.random() * view.size.width, Math.random() * view
        .size.height);
    var a = new Node(h, 100);
    nodes.push(a);
    var k = a0 * Math.pow((nodes.length), -c);
    var b = a.path.area;
    var f = Math.sqrt(k / b);
    a.path.scaling = f;
    a.path.rotation = Math.random() * 360;
    for (var g = 0; g < nodes.length - 1; g++) {
        var m = nodes[g];
        var j = a.path.position - m.path.position;
        var e = j.length;
        var d = a.path.getIntersections(m.path);

        //a.position = a.path.getNearestPoint(m.path);

        if (m.path.contains(a.path.position)) {
            a.path.remove();
            nodes.pop();
            return false
        }


        if (d.length > 0) {
            a.path.remove();
            nodes.pop();
            return false
        }
    }
    a.path.scaling *= 0.75;
    a.setupAnimation();
    return true
}

function onMouseDown() {
    reset()
}

function onResize(a) {
    reset()
}
setup();