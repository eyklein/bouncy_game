var ball;
var paddle;
var totalRealHeight = 3; //in meter
var totalRealWidth = 3; //in meter

var density = 0; //air


var accGravity;


var startButton;

var startSym = true;

var myFont;
var deathImg;
var score;

var started=false;

function preload() {
  myFont = loadFont('fonts/GamjaFlower-Regular.ttf');
  deathImg = loadImage('img/death.png');
}


function setup() {
  createCanvas(windowWidth, windowHeight);
  
  startButton=createButton('Start');
  startButton.mousePressed(startSim);

  ball = new Ball(color(0, 142, 200));
  
  paddle = new Paddle(color(200, 50, 50));
  noStroke();
  
  

  score=new Scoreboard();
  accGravity=createVector(0,9.8);
  background(0);
  textFont(myFont);

  
}
function startSim(){
  if(!startSym){
  	startSym=true;
  }else{
    ball.divs.remove();
    ball=new Ball(
      color(5,150,250));
      
    paddle.divs.remove();  
    paddle = new Paddle(color(200, 50, 50));
  }
}


function draw() {
  if (frameRate() && startSym) {
    if(started){
    background(0);
    
    
    // if(keyIsPressed){
    //   if(keyCode === LEFT_ARROW){
    //     paddle.accelerate(-1,0);
    //   }else if(keyCode === RIGHT_ARROW){
    //     paddle.accelerate(1,0);
    //   }
      
    // }

    // ball.applyForces();
    ball.accelerate();
    ball.move();
    ball.bounce();
    ball.display();
    
    
    paddle.applyForces();
    paddle.accelerate();
    paddle.move();
    paddle.bounce();
    paddle.display();
    
    score.updateScore();
    score.display();
    
    
    
    }else{
      push()
      
      
      rectMode(CENTER)
      textAlign(CENTER);
      fill(70)
      rect(width/2,height/2,startButtonWidth,startButtonHeight)
      fill(0)
      textSize(80);
      
      if(score.lives<0){
       image(deathImg,width/2,height/2-100,200,200) 
      }
      text("START",width/2,height/2+40)

      pop()
    }
    
    
    
    
   
  }
}
var startButtonWidth=400;
var startButtonHeight=250;
function mousePressed(){
  if(abs(mouseX-width/2)<startButtonWidth/2 && abs(mouseY-height/2)<startButtonHeight/2){
    score.score=0;
    score.lives=5;
    started=true;
  }
}

function changeDensity(){
  //density=log(ball.densitySlider.value());
  density=pow(10,ball.densitySlider.value());
  // console.log(density + " : " + ball.densitySlider.value());
  if(density<=.011){
    density=0;
  }
  ball.divDensity.html('Density: ' + 
                       density);
}

function Scoreboard(){
  this.graphicScoreBoard=createGraphics(width/2,height/2)
  this.graphicScoreBoard.pixelDensity(1);
  this.score=0;
  this.lives=5;
  
  this.graphicScoreBoard.textFont(myFont);
  this.graphicScoreBoard.textSize(30);
  
  this.lastDeathTime=-10000;
  
  this.updateScore=function(){
    //console.log(1/frameRate/300)
   this.score+=1/frameRate()*3;
  }
  
  this.dei=function(){
     this.lives--;
     this.lastDeathTime=millis();
     
     if(this.lives<0){
       ball = new Ball(color(0, 142, 200));
  
  paddle = new Paddle(color(200, 50, 50));
        
        started=false;
     }
  }
  this.updateDisplay=function(){
    this.graphicScoreBoard.clear();
    this.graphicScoreBoard.fill(255);
    
    this.graphicScoreBoard.text("Score: \t" + floor(this.score),30,50);
    this.graphicScoreBoard.text("Lives: \t" + this.lives,30,100);
    
  }
  this.display=function(){
     this.updateDisplay();
     
     
     if(this.lastDeathTime+5000>millis()){
      this.graphicScoreBoard.push()
      this.graphicScoreBoard.fill(255,map(1500-(millis()-this.lastDeathTime),0,1500,0,255))
     
      this.graphicScoreBoard.text("-1",150,100);
      this.graphicScoreBoard.pop()
      
      
      
     }
     image(this.graphicScoreBoard,0,0);
  }
  
}
function Ball(colorIn) {
  this.elasticity = 1;
  this.color = colorIn;
  this.diam = 0.11;
  this.mass = 0.045;
  this.density=100;
  this.dragConstant = 0.4; //between .5 and .1 for ball
  this.pos = createVector(totalRealWidth * 0.3, totalRealHeight * 0.1);
  this.pos = createVector(totalRealWidth * 0.3, totalRealHeight * 0.1);

  this.vel = createVector(1, 0);
  this.pvel;

  this.acc = createVector(0, 1);
	this.divs=createDiv("");
  this.divElasitisity=createDiv('Elasticity');
  this.divElasitisity.parent(this.divs);
	this.elastisitySlider = createSlider(0, 1, 1, 0.01);
	this.elastisitySlider.parent(this.divs);
  this.divDensity=createDiv('Density '+ 
                       density);
  this.divDensity.parent(this.divs);
  
  this.densitySlider = createSlider(-2, 3, log(density),0.0001);
	this.densitySlider.parent(this.divs);
  this.densitySlider.mouseReleased(changeDensity);
  
  this.move = function() {

    this.pos.y = this.pos.y + ((this.pvel.y + this.vel.y) / 2) / frameRate()
    this.pos.x = this.pos.x + ((this.pvel.x + this.vel.x) / 2) / frameRate()
    
    if(this.pos.y>totalRealHeight - this.diam / 2){
      var pposition=this.pos.y - ((this.pvel.y + this.vel.y) / 2) / frameRate();
      // entripolate
      var percentOver=map(totalRealHeight - this.diam / 2, 
                          pposition,this.pos.y,
                          0,1);
          
          //abs((this.pos.y-totalRealHeight - this.diam / 2)/(pposition-this.pos.y))
      
      //console.log(map(percentOver,0,1,this.pvel.y,this.vel.y) + " ?? " + this.pvel.y + " / " +this.vel.y);
      this.vel.y=map(percentOver,0,1,this.pvel.y,this.vel.y)
      this.pos.y=totalRealHeight - this.diam / 2;
      
      // console.log(pposition + " : : " + (totalRealHeight - this.diam / 2) + " : " + this.pos.y);
      // console.log(percentOver);
    }
  }
  this.accelerate = function() {
    this.acc.y=1+score.score/100;
   
    this.pvel = createVector(this.vel.x, this.vel.y)
    this.vel.y = this.vel.y + this.acc.y / frameRate()
    
    this.vel.x = this.vel.x + this.acc.x / frameRate()

  }

  // this.applyForces = function() {
  //   //f=ma
  //   accGravity.y=9800
  //   this.acc.x = (accGravity.x*this.mass-0.5 * this.density * this.dragConstant *
  //     pow(this.diam / 2, 2) * PI *
  //     this.vel.x * abs(this.vel.x)) / this.mass;

  //   // 	this.acc.y = (accGravity.y*this.mass - 0.5 * this.density * this.dragConstant *
  //   //     pow(this.diam / 2, 2) * PI *
  //   //     this.vel.y * abs(this.vel.y)) / this.mass;
  //     this.acc.y = (accGravity.y);
  //   console.log(this.acc.y)
    

  // }

  this.bounce = function() {
    
    
    if (this.pos.x >= totalRealWidth - this.diam / 2) {
      this.vel.x = -abs(this.vel.x) * this.elastisitySlider.value();
      //this.pos.x=0+totalRealWidth-this.diam/2;
    }
    if (this.pos.x <= 0 + this.diam / 2) {
      this.vel.x = abs(this.vel.x) * this.elastisitySlider.value();
      //this.pos.x=0+this.diam/2;
    }
    
    
    //paddle
    if (this.pos.y >= paddle.pos.y) {
      if(this.pos.x>paddle.pos.x-this.diam/2 && this.pos.x<paddle.pos.x+paddle.width+this.diam/2)
      this.vel.y = -abs(this.vel.y) * this.elastisitySlider.value();
    }
    
    
    if (this.pos.y >= totalRealHeight - this.diam / 2) {

      this.vel.y = -abs(this.vel.y) * this.elastisitySlider.value();
      score.dei();
      //console.log("DEI")

      //this.pos.y=totalRealHeight-this.diam/2;
      //console.log(this.vel.y);
    }
    if (this.pos.y <= 0 + this.diam / 2) {
      this.vel.y = abs(this.vel.y) * this.elastisitySlider.value();
      //this.pos.y=this.diam/2;
    }
  }

  this.display = function() {
    fill(this.color);
    //console.log(map(this.pos.x,0,totalRealHeight,0,width))
    ellipse(
      map(this.pos.x, 0, totalRealWidth, 0, width),
      map(this.pos.y, 0, totalRealHeight, 0, height),
      map(this.diam, 0, totalRealHeight, 0, height),
      map(this.diam, 0, totalRealHeight, 0, height));
  }

}

function Paddle(colorIn) {
  this.accMag=3
  this.elasticity = 1;
  this.color = colorIn;
  this.height = 0.041;
  this.width = .3;
  this.mass = 1;
  this.density=1
  this.dragConstant = 0.4*1; //between .5 and .1 for ball
  
  this.pos = createVector(totalRealWidth * .5, totalRealHeight * 0.95);

  this.vel =createVector(1, 0);
  this.pvel=this.vel;

  this.acc = createVector(0, 0);
	this.divs=createDiv("");
  this.divElasitisity=createDiv('Elasticity');
  this.divElasitisity.parent(this.divs);
	this.elastisitySlider = createSlider(0, 1, 1, 0.01);
	this.elastisitySlider.parent(this.divs);
  this.divDensity=createDiv('Density '+ 
                       density);
  this.divDensity.parent(this.divs);
  
  this.densitySlider = createSlider(-2, 3, log(density),0.0001);
	this.densitySlider.parent(this.divs);
  this.densitySlider.mouseReleased(changeDensity);
  
  
  
  this.move = function() {
    //console.log("pos y? " + this.pos.y + " : " + this.vel.y)
    
    
    this.pos.y = this.pos.y + ((this.pvel.y + this.vel.y) / 2) / frameRate()
    this.pos.x = this.pos.x + ((this.pvel.x + this.vel.x) / 2) / frameRate()
    
    //console.log("pos y???? " + this.pos.y)
    
    if(this.pos.y>totalRealHeight - this.diam / 2){
      var pposition=this.pos.y - ((this.pvel.y + this.vel.y) / 2) / frameRate();
      var percentOver=map(totalRealHeight - this.diam / 2, 
                          pposition,this.pos.y,
                          0,1);

      this.vel.y=map(percentOver,0,1,this.pvel.y,this.vel.y)
      this.pos.y=totalRealHeight - this.diam / 2;

    }
    
    //console.log("pos y " + this.pos.y)
  }
  // this.accelerate = function(_x,_y) {
  //   this.acc=createVector(_x,_y);
  //   this.pvel = createVector(this.vel.x, this.vel.y)
  //   this.vel.x = this.vel.x + _x / frameRate();
  //   this.vel.y = this.vel.y + _y / frameRate()

  // }
  
  this.accelerate = function() {

    this.pvel = createVector(this.vel.x, this.vel.y)
    this.vel.y = this.vel.y + this.acc.y / frameRate()
    
    this.vel.x = this.vel.x + this.acc.x / frameRate()

  }

  this.applyForces = function() {
  //   //f=ma
  var addedForce=createVector(0,0);
  if(keyIsPressed){
      if(keyCode === LEFT_ARROW){
        addedForce.x-=this.accMag
      }else if(keyCode === RIGHT_ARROW){
        addedForce.x+=this.accMag
      }
      
    }
    this.acc.x = (-2  *
      this.vel.x * abs(this.vel.x) 
      + addedForce.x
      ) / this.mass;
      
      

  //   // 	this.acc.y = (accGravity.y*this.mass - 0.5 * density * this.dragConstant *
  //   //     pow(this.height / 2, 2) * PI *
  //   //     this.vel.y * abs(this.vel.y)) / this.mass;

  }

  this.bounce = function() {
    
    if (this.pos.x >= totalRealWidth - this.width) {
      this.vel.x = -abs(this.vel.x) * this.elasticity;
      this.pvel = createVector(this.vel.x, this.vel.y)
      //this.pos.x = totalRealWidth - this.width;
      //this.pos.x=0+totalRealWidth-this.diam/2;
      
    }
    if (this.pos.x <= 0 ) {
      this.vel.x = abs(this.vel.x) * this.elasticity;
      this.pvel = createVector(this.vel.x, this.vel.y)
      //this.pos.x=0+this.diam/2;
      
    }
    if (this.pos.y >= totalRealHeight - this.width / 2) {
      
      this.vel.y = -abs(this.vel.y) * this.elasticity;
      


    }
    if (this.pos.y <= 0 + this.width) {
      this.vel.y = abs(this.vel.y) * this.elasticity;
    }
  }

  this.display = function() {
    fill(this.color);
    //console.log(map(this.pos.x,0,totalRealHeight,0,width))
    // rect(
    //   map(this.pos.x, 0, totalRealWidth, 0, width),
    //   map(this.pos.y, 0, totalRealHeight, 0, height),
    //   map(this.width, 0, totalRealWidth, 0, width),
    //   map(this.height, 0, totalRealHeight, 0, height));
      
    //console.log(this.pos.y)
    rect(
      map(this.pos.x, 0, totalRealWidth, 0, width),
      map(this.pos.y, 0, totalRealHeight, 0, height),
      map(this.width, 0, totalRealWidth, 0, width),
      map(this.height, 0, totalRealHeight, 0, height));
    fill(0) 
    rect(
      map(this.pos.x, 0, totalRealWidth, 0, width),
      map(this.pos.y+this.height, 0, totalRealHeight, 0, height),
      map(this.width, 0, totalRealWidth, 0, width),
      30);
      
    
      fill(255,0,0);
      
      
      if(keyIsPressed && keyCode==LEFT_ARROW ){
        
        rect(
          map(this.pos.x+this.width, 0, totalRealWidth, 0, width),
          map(this.pos.y, 0, totalRealHeight, 0, height),
          4,
          map(this.height, 0, totalRealHeight, 0, height));
      }if(keyIsPressed && keyCode==RIGHT_ARROW){
        rect(
          map(this.pos.x, 0, totalRealWidth, 0, width),
          map(this.pos.y, 0, totalRealHeight, 0, height),
          -4,
          map(this.height, 0, totalRealHeight, 0, height));
      }
    
    
    
  }
  
  

}


