int gridSize = 120;
int gridMargin = 120;
int xNum;
int yNum;
float xOffset;
float yOffset;
ArrayList rectSets;


void setup(){
  size(window.innerWidth,window.innerHeight, P3D);
  window.onresize = function()
	{
		//size(window.innerWidth,window.innerHeight, P3D);
		reset();
	};
  reset();
}

void reset(){
  stroke(255, 255);
  noFill();
  
  background(0);
  xNum = 3;
  yNum = 3;
  xOffset = (width-(xNum*(gridSize+gridMargin)-gridMargin)) * 0.5;
  yOffset = (height-(yNum*(gridSize+gridMargin)-gridMargin)) * 0.5;
  
  rectSets = new ArrayList();
  for(int i=0; i<xNum; i++){
    for(int j=0; j<yNum; j++){
      RectSet rs = new RectSet();
      rs.xOffset = xOffset + i * (gridMargin+gridSize) + gridSize * 0.5;
      rs.yOffset = yOffset + j * (gridMargin+gridSize) + gridSize * 0.5;
      rs.rotVx = random(-0.005,0.005);
      rs.rotVy = random(-0.005,0.005);
      rs.rotVz = random(-0.005,0.005);
      rs.ts = 1;
      rs.sv = 0;
      rs.reset();
      rs.s = 1;
      rectSets.add(rs);
    }
  }
  
}

void mousePressed(){
  reset();
}

void draw(){
  background(0);
  
  noFill();
  for(int i=0; i<rectSets.size(); i++){
    RectSet rs = (RectSet)rectSets.get(i);
    rs.rotX += rs.rotVx;
    rs.rotY += rs.rotVy;
    rs.rotZ += rs.rotVz;
   
    rs.sv += (rs.ts - rs.s) * 0.1;
    rs.sv *= 0.9;
    rs.s += rs.sv;
    
    pushMatrix();
    translate(rs.xOffset, rs.yOffset);
    scale(rs.s);
    rotateX(rs.rotX);
    rotateY(rs.rotY);
    rotateZ(rs.rotZ);
    for(int j=0; j<rs.rects.size(); j++){
      Rectangle r = (Rectangle)rs.rects.get(j);
      r.rotX += r.rotVx;
      r.rotY += r.rotVy;
      r.rotZ += r.rotVz;
      r.rotX2 += r.rotVx2;
      r.rotY2 += r.rotVy2;
      r.rotZ2 += r.rotVz2;
      
      pushMatrix();
      rotateX(r.rotX2);
      rotateY(r.rotY2);
      rotateZ(r.rotZ2);
      translate(r.x, r.y, r.z);
      rotateX(r.rotX);
      rotateY(r.rotY);
      rotateZ(r.rotZ);


      triangle(-r.w*0.5, -r.h*0.5, -r.h*0.5, -r.w*0.5, r.w, r.h);

      //rect(-r.w*0.5, -r.h*0.5, r.w, r.h);
      popMatrix();
    }
    popMatrix();
  }
}

class RectSet{
  ArrayList rects;
  float xOffset;
  float yOffset;
  float s;
  float ts;
  float sv;
  float rotX, rotVx;
  float rotY, rotVy;
  float rotZ, rotVz;
  int cnt = 100;
  RectSet(){
    rects = new ArrayList();
  }
  
  void reset(){
    cnt = 400 + floor(random(0,100));
    s = 0;
    for(int i=0; i<3; i++){
        Rectangle r;
        if(rects.size()<i+1){
          r = new Rectangle();
          rects.add(r);
        }
        r = (Rectangle)rects.get(i);
        r.x = random(0,gridSize*0.25);
        r.y = random(0,gridSize*0.25);
        r.z = random(0,gridSize*0.25);
        r.w = random(0,gridSize*0.75);
        r.h = random(0,gridSize*0.75);
        r.rotX = random(0,PI*2);
        r.rotY = random(0,PI*2);
        r.rotZ = random(0,PI*2);
        r.rotVx = random(-0.01,0.01);
        r.rotVy = random(-0.01,0.01);
        r.rotVz = random(-0.01,0.01);
        r.rotX2 = random(0,PI*2);
        r.rotY2 = random(0,PI*2);
        r.rotZ2 = random(0,PI*2);
        r.rotVx2 = random(-0.005,0.005);
        r.rotVy2 = random(-0.005,0.005);
        r.rotVz2 = random(-0.005,0.005);
        
        
        float hue = random(0,360);
        float sat = random(0,100);
        float bri = random(0,100);
        r.col = color(hue,sat,bri);
      }
  }
}

class Rectangle{
  color col;
  float w;
  float h;
  float x;
  float y;
  float z;
  float rotX, rotVx;
  float rotY, rotVy;
  float rotZ, rotVz;
  float rotX2, rotVx2;
  float rotY2, rotVy2;
  float rotZ2, rotVz2;
  int cnt = 0; 
}