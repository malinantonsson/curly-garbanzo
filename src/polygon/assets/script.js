var springManager;
var countBeacon;
var dotSymbol;
var dotRedSymbol;
var dotsGroup;
var linesGroup;
var dots = [];
var lines = [];
var wh;
var hh;
var isKillAll;
var killdeCount = 0;
var draggingNode;
var draggingSpring;
var nearestNode;

var colours = ['#72c2ad', '#87c7a3', '#a0cd8f', '#b6d37b', '#c5d76a', '#c5d76a', '#efefee', '#d9d9d6', '#27347b', '#2260ab', '#298dcc', '#52aedd', '#7ccdf3', '#7ccdf3', '#e8d3e7', '#e8d3e7', '#ffffff'];

function randomIntFromInterval(min,max) {
    return Math.floor(Math.random()*(max-min+1)+min);
}

var hex;


function setup() {
    springManager = new GLDSpringManager();
    countBeacon = new GLDCountBeacon(5, beacon);
    var a = new Path.RegularPolygon(0,0, 3, 1);
    //var a = new Path.Circle(new Point(0, 0), 1);
    a.fillColor = "black";
    dotSymbol = new Symbol(a);
    
    a = new Path.RegularPolygon(0,0, 3, 1);
    //a = new Path.Circle(new Point(0, 0), 1);
    a.fillColor = colours[randomIntFromInterval(0, (colours.length - 1))];
    dotRedSymbol = new Symbol(a);
    linesGroup = new Group();
    dotsGroup = new Group();
    reset()
}

function reset() {
    removeAll();
    countBeacon.reset();
    killedCount = 0;
    wh = view.size.width * 0.5;
    hh = view.size.height * 0.5;
    isKillAll = false;
    springManager.minX = 0;
    springManager.minY = 0;
    springManager.maxX = view.size.width;
    springManager.maxY = view.size.height;
    springManager.gravity = 0;
    dots = [];
    lines = []
}

function removeAll() {
    for (var c = 0; c < lines.length; c++) {
        var a = lines[c];
        springManager.removeSpring(a.spring);
        if (a.path) {
            a.path.remove()
        }
    }
    lines = [];
    for (var c = 0; c < dots.length; c++) {
        var b = dots[c];
        springManager.removeNode(b.node);
        if (b.path) {
            b.path.remove()
        }
    }
    dots = []
}

function onMouseDown(a) {
    if (draggingNode) {
        onMouseUp(a)
    }
    nearestNode = springManager.nearestNode(a.point.x, a.point.y);
    draggingNode = new GLDSpringNode(a.point.x, a.point.y);
    draggingNode.isFixed = true;
    springManager.addNode(draggingNode);
    console.log(nearestNode, draggingNode);
    draggingSpring = new GLDSpring(draggingNode, nearestNode, 0);
    springManager.addSpring(draggingSpring)
}

function onMouseUp(a) {
    if (draggingNode) {
        springManager.removeSpring(draggingSpring);
        springManager.removeNode(draggingNode);
        draggingNode = undefined;
        nearestNode = undefined;
        draggingSpring = undefined
    }
}

function onMouseDrag(a) {
    if (draggingNode) {
        draggingNode.x = a.point.x;
        draggingNode.y = a.point.y
    }
}

function onFrame(b) {
    var d = new Date().getTime();
    countBeacon.update();
    compulsion();
    springManager.update();
    for (var a = 0; a < dots.length; a++) {
        dots[a].update()
    }
    for (var a = 0; a < lines.length; a++) {
        lines[a].update()
    }
    var c = new Date().getTime();
    if (c - d > 100 && isKillAll == false) {
        killAll()
    }
    if (killedCount == dots.length && dots.length > 1) {
        setup();
        //reset()
    }
}

function compulsion() {
    for (var e = 0; e < dots.length; e++) {
        for (var d = e + 1; d < dots.length; d++) {
            var a = dots[e].node;
            var k = dots[d].node;
            var l = k.x - a.x;
            var h = k.y - a.y;
            var g = l * l + h * h;
            if (g > 1 && g < 40000) {
                var f = Math.atan2(h, l);
                var c = Math.cos(f) * 20 / g;
                var b = Math.sin(f) * 20 / g;
                a.fx -= c;
                a.fy -= b;
                k.fx += c;
                k.fy += b
            }
        }
    }
}

function onResize(a) {
    reset()
}

function beacon() {
    if (isKillAll) {
        return
    }
    var f;
    var h;
    if (dots.length == 0) {
        h = new Point(view.size.width * 0.53, view.size.height * 0.5); //this defines start position
        f = new Dot(h);
        f.maxConnection = 5;
        springManager.addNode(f.node);
        dots.push(f)
    } else {
        var d = getNodeForConnection();
        if (d) {
            h = new Point(d.node.x, d.node.y);
            var a = Math.random() * 360 * Math.PI / 180;
            h += new Point(Math.cos(a) * d.radius, Math.sin(a) * d.radius);
            f = new Dot(h);
            f.generation = d.generation + 1;
            springManager.addNode(f.node);
            dots.push(f);
            var c = new Line(d, f);
            var g = new GLDSpring(d.node, f.node, 50);
            springManager.addSpring(g);
            c.spring = g;
            lines.push(c);
            d.connectionCount++;
            d.redCount = 1;
            d.scaleV += 4;
            f.connectionCount++;
            var e = wh - f.node.x;
            var b = hh - f.node.y;
            var a = Math.atan2(b, e)
        }
    }
}

function getNodeForConnection() {
    for (var b = 0; b < 100; b++) {
        var a = dots[Math.floor(Math.random() * dots.length)];
        if (a.connectionCount < a.maxConnection) {
            return a
        }
    }
    return
}

function killAll() {
    isKillAll = true;
    for (var b = 0; b < dots.length; b++) {
        var c = dots[b];
        c.killDelay = 2 + Math.floor(Math.random() * 20);
        c.killFlag = true
    }
    for (var b = 0; b < lines.length; b++) {
        var a = lines[b];
        a.killFlag = true
    }
}

function removeDot(c) {
    reset();
    console.log("kill");
    return;
    var f = objectIndexForArray(c, dots);
    var b = [];
    for (var e = 0; e < lines.length; e++) {
        var a = lines[e];
        if (a.spring.node0 == c.node || a.spring.node1 == c.node) {
            b.push(a)
        }
    }
    for (var e = 0; e < b.length; e++) {
        var a = b[e];
        var d = objectIndexForArray(a, lines);
        springManager.removeSpring(a.spring);
        a.teardown();
        lines.splice(d, 1)
    }
    c.teardown();
    springManager.removeNode(c.node);
    dots.splice(f, 1)
}

function removeSubDot(d) {
    var c = [];
    for (var e = 0; e < lines.length; e++) {
        var b = lines[e];
        if (b.spring.node0 == d.node || b.spring.node1 == d.node) {
            c.push(b)
        }
    }
    for (var e = 0; e < c.length; e++) {
        var b = c[e];
        var a;
        var f;
        if (b.node0 == d) {
            a = b.node0;
            f = b.node1
        } else {
            a = b.node1;
            f = b.node0
        } if (f && f.generation > a.generation) {
            removeDot(f)
        }
    }
}

function objectIndexForArray(c, a) {
    for (var b = 0; b < a.length; b++) {
        if (a[b] == c) {
            return b
        }
    }
    return -1
}

var Camera = function() {
    this.fixedPositionNode;
    this.positionNode;
    this.tscaling = 1;
    this.scaling = 1;
    this.scalingV = 0;
    this.scalingF = 0
};

Camera.prototype.update = function() {
    this.scalingF = (this.tscaling - this.scaling) * 0.01;
    this.scalingV += this.scalingF;
    this.scalingV *= 0.9;
    this.scaling += this.scalingV;
    if (this.scaling < 0.1) {
        this.scaling = 0.1
    }
};

var Dot = function(a) {
    this.node = new GLDSpringNode(a.x, a.y, false);
    this.node.deccel = 0.95;
    this.maxConnection = Math.floor(Math.pow(Math.random() * 3, 2) + 1) + 1;
    this.connectionCount = 0;
    this.radius = this.maxConnection * 10;
    this.tscaling = 1;
    this.scaling = 1;
    this.scalingV = 8;
    this.scalingF = 0;
    this.redCount = 1;
    this.generation;
    this.killDelay = 1;
    this.killFlag = false;
    this.killCompleteFlag = false
};

Dot.prototype.update = function() {
    if (this.path) {
        this.path.remove()
    }
    if (this.killFlag && this.killDelay == 0) {
        this.tscaling = 100;
        this.scalingV = Math.random() * 100;
        this.killDelay = -1
    } else {
        if (this.killFlag && this.killDelay < 0) {
            this.tscaling = 0.1;
            if (this.killCompleteFlag == false && this.scaling < 0.1) {
                this.killCompleteFlag = true;
                killedCount++
            }
        } else {
            this.tscaling = this.connectionCount;
            if (this.killFlag == true) {
                this.killDelay--
            }
        }
    }
    this.scalingF = (this.tscaling - this.scaling) * 0.05;
    this.scalingV += this.scalingF;
    this.scalingV *= 0.8;
    this.scaling += this.scalingV;
    this.redCount *= 0.75;
    this.path = (this.redCount > 0.1) ? dotRedSymbol.place() : dotSymbol.place();
    this.path.position = new Point(this.node.x, this.node.y);
    this.path.scaling = this.scaling;
    dotsGroup.addChild(this.path)
};
Dot.prototype.teardown = function() {
    this.path.remove();
};
var Line = function(b, a) {
    this.dot0 = b;
    this.dot1 = a;
    this.spring;
    this.path = new Path.Line(new Point(0, 0), new Point(0, 0));
    this.path.closed = false;
    this.killFlag = false;
    this.update()
};
Line.prototype.update = function() {
    if (this.path) {
        this.path.remove()
    }
    if (this.dot0.path && this.dot1.path) {
        this.path = new Path.Line(this.dot0.path.position, this.dot1.path.position);
        this.path.strokeColor = new Color(0.85, 0.85, 0.85);
        this.path.closed = false;
        linesGroup.addChild(this.path);
        if (this.killFlag) {
            this.path.visible = false
        }
    }
};
Line.prototype.teardown = function() {
    console.log("teardown");
    this.path.remove()
};
setup();