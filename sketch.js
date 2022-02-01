const Engine = Matter.Engine;
const Render = Matter.Render;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;
const Body = Matter.Body;
const Composites = Matter.Composites;
const Composite = Matter.Composite;

let engine;
let world;
var rope,fruit,ground;
var fruit_con;
var fruit_con_2;

var bg_img;
var food;
var rabbit;

var button;
var bunny;
var blink,eat,sad;

//Variables para los sonidos 
var bk_sound;
var cut_sound;
var sad_sound;
var eating_sound;
var air; 

var blower;
var mute_btn;
var star, star2, star3, star_img;
var score;

var empty_star, one_star, two_star,star3;

function preload(){
  bg_img = loadImage("background.png");
  food = loadImage("melon.png");
  rabbit = loadImage("Rabbit-01.png");
  blink = loadAnimation("blink_1.png","blink_2.png","blink_3.png");
  eat = loadAnimation("eat_0.png" , "eat_1.png","eat_2.png","eat_3.png","eat_4.png");
  sad = loadAnimation("sad_1.png","sad_2.png","sad_3.png");
  star_img = loadImage("star.png");
  empty_star = loadAnimation("empty.png");
  one_star = loadAnimation("one_star.png");
  two_star = loadAnimation("stars.png");
  star_3  = loadAnimation("3stars.png");
  //Precargar sonidos 
  bk_sound = loadSound("sound1.mp3");
  sad_sound = loadSound("sad.wav");
  cut_sound = loadSound("rope_cut.mp3");
  eating_sound = loadSound("eating_sound.mp3");
  air = loadSound("air.wav");

  //Habilitamos las animaciones 
  blink.playing = true;
  eat.playing = true;
  sad.playing = true;
  
  //evitamos que la animación se resprodusca una y otra vez 
  sad.looping= false;
  eat.looping = false; 
  }

function setup() {
  createCanvas(600,700);
  frameRate(80);
  //Variable que almacena el tipo de dispositivo móvil
  var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  if(isMobile){
    //Variables para ancho y alto de pantalla de computadora
    canW = displayWidth;
    canH = displayHeight;
    createCanvas(displayWidth+80, displayHeight);
  }
  else{
    //Variables para ancho y alto de pantalla de dispositivos móviles
    canW = windowWidth;
    canH = windowHeight;
    createCanvas(windowWidth,windowHeight);
  }

  //Sonido de fondo
  // bk_sound.play();
  bk_sound.setVolume(0.5);

  engine = Engine.create();
  world = engine.world;

  //Botón para cortar la cuerda 1
  button = createImg('cut_btn.png');
  button.position(100,170);
  button.size(50,50);
  button.mouseClicked(drop);

  //Botón para cortar la cuerda 2
  button2 = createImg('cut_btn.png');
  button2.position(450,170);
  button2.size(50,50);
  button2.mouseClicked(drop2);
  
  //Estrellas 
  star = createSprite(320,50,20,20);
  star.addImage(star_img);
  star.scale = 0.02;

  star2 = createSprite(50,370,20,20);
  star2.addImage(star_img);
  star2.scale = 0.02;

  star3 = createSprite(500,500,20,20);
  star3.addImage(star_img);
  star3.scale = 0.02;
  
  //Botón para soplador
  globe = createImg("baloon2.png");
  globe.position(260,370);
  globe.size(120,120);
  globe.mouseClicked(airblow);

  //Botón para el mute 
  mute_btn = createImg("mute.png");
  mute_btn.position(width-120,20);
  mute_btn.size(50,50);
  mute_btn.mouseClicked(mute);

  //Guardar molde de cuerda en variable 
  rope = new Rope(7,{x:120,y:190});
  rope2 = new Rope(8,{x:490,y:190});
 
  //Guardar molde del suelo en variable 
  ground = new Ground(width/2,height,width,20);
 
  //Configuramos la velocidad de la animación. 
  blink.frameDelay = 20;
  eat.frameDelay = 20;
  sad.frameDelay = 20;

  //Crear objeto del conejito
  bunny = createSprite(300,height-80,100,100);
  bunny.scale = 0.2;

  //Agregar animación a nuestro Sprite con etiqueta
  bunny.addAnimation('blinking',blink);
  
  //Cambiar animación
  bunny.addAnimation('eating',eat);
  bunny.addAnimation('crying',sad);
  bunny.changeAnimation('blinking');

  star_display = createSprite(100,20,30,30);
  star_display.scale = 0.2;
  star_display.addAnimation('empty',empty_star);
  star_display.addAnimation('one',one_star);
  star_display.addAnimation('two',two_star);
  star_display.addAnimation('tree',star_3);
  star_display.changeAnimation('empty');

  //Creamos cuerpo circular para la fruta 
  fruit = Bodies.circle(300,300,20);
  Matter.Composite.add(rope.body,fruit);

  //Guardar molde de restricción en variable 
  fruit_con = new Link(rope,fruit);
  fruit_con2 = new Link(rope2,fruit);
  

  rectMode(CENTER);
  ellipseMode(RADIUS);
  imageMode(CENTER);
  
}

function draw() {
  background(51);
  image(bg_img,width/2,height/2,width,height);

  push();
  imageMode(CENTER);
  //Solo queremos mostrar la fruta si su cuerpo existe
  if(fruit!=null){
    image(food,fruit.position.x,fruit.position.y,70,70);
  }
  pop();

  //Mostrar la cuerda
  rope.display();
  rope2.display();
 
  Engine.update(engine);

  //Mostar suelo
  ground.display();
  

  //Condición para detectar colisión de la fruta
  if(collide(fruit,bunny)==true){
    //Si colisiona con el conejo cambia de animación
    bunny.changeAnimation('eating');
    eating_sound.play();
  }
  if(fruit!=null && fruit.position.y>=height-50){
    bunny.changeAnimation('crying');
    bk_sound.stop();
    sad_sound.play();
    fruit=null;  
   }
  if(collide2(fruit,star,20)==true){
    //Haremos visible a la estrella 
    star.visible = false;
    star_display.changeAnimation('one');
  }
  if(collide2(fruit,star2,20)==true){
    //Haremos visible a la estrella 
    star2.visible = false;
    star_display.changeAnimation('two');
  }
  if(collide2(fruit,star3,20)==true){
    //Haremos visible a la estrella 
    star3.visible = false;
    star_display.changeAnimation('tree');
  }
  drawSprites();
}

//Función que corta la fruta
function drop(){
  cut_sound.play();
  rope.break();
  fruit_con.dettach();
  fruit_con = null; 
}

function drop2(){
  cut_sound.play();
  rope2.break();
  fruit_con2.dettach();
  fruit_con2 = null; 
}

function collide(body,sprite){
  //Condición para verificar si el cuerpo (fruta) existe o no
  if(body!=null){ 
    //Comprobar la distancia entre la fruta y el conejito usando la posicion de cada uno
    var d = dist(body.position.x,body.position.y,sprite.position.x,sprite.position.y);
      //Condición que comprueba la distancia  
      if(d<=80){
          //Removeremos la fruta del mundo
          World.remove(engine.world,fruit);
          //Anulamos la fruta 
          fruit = null;
          //Regresamos al inicio para comprobar otra fruta 
          return true; 
        }
        //Si no se cumple la colisión
        else{
          //Regresaremos a un valor falso 
          return false;

        }
  }
}

//Función para detectar la colisión
function collide2(body,sprite,x){
  //Condición para verificar si el cuerpo (fruta) existe o no
  if(body!=null){ 
    //Comprobar la distancia entre la fruta y el conejito usando la posicion de cada uno
    var d = dist(body.position.x,body.position.y,sprite.position.x,sprite.position.y);
      //Condición que comprueba la distancia  
      if(d<=x){
          //Regresamos al inicio para comprobar otra fruta 
          return true; 
        }
        //Si no se cumple la colisión
        else{
          //Regresaremos a un valor falso 
          return false;

        }
  }
}

function airblow(){
  //Determinar el cuerpo al que se le aplicara la fruta, los puntos de dirección
  Matter.Body.applyForce(fruit,{x:0,y:0},{x:0,y:-0.03});
  air.play(); //Reproducir sonido del aire
}

function mute(){
  if(bk_sound.isPlaying()){
    bk_sound.stop(); //Detiene cualquier sonido
  }
  else{
    bk_sound.play();//Reproduce el sonido 
  }
}


