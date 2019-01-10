import { Component, Input } from '@angular/core';
import { WebsocketProvider } from '../../providers/websocket/websocket';
import { MessagerProvider } from '../../providers/messager/messager';

declare var createjs: any;

@Component({
  selector: 'game',
  templateUrl: 'game.html',
  providers: [WebsocketProvider, MessagerProvider]
})
export class GameComponent {

  @Input() name;

  private stage: any;
  private w: any;
  private h: any;
  private manifest: any;
  public speed: number = -1;

  private sky: any;
  private ground: any
  private hill: any;
  private hill2: any;
  private grant: any;

  private grantSpeed: number = 150;
  private hillSpeed: number = 30;
  private hill2Speed: number = 50;

  private images: Map<string, any>;

  private message = {
		author: 'tutorialedge',
		message: 'this is a test message'
	}

  constructor(private messager: MessagerProvider) {
    messager.create('http://localhost:5000/')
    messager.messages.subscribe(msg => {
      console.log("Response from websocket: ", this.name, msg);
      this.speed = Number(msg.message)
    });
  }

  sendMsg() {
		console.log('Send message from client to websocket: ', this.message);
		this.messager.sendMsg(this.message);
	}

  ngAfterViewInit() {
    // drawing the game canvas from scratch here
    // In future we can pass stages as param and load indexes from arrays of background elements etc

    if (this.stage) {
    this.stage.autoClear = true;
    this.stage.removeAllChildren();
    this.stage.update();
    } else {
        this.stage = new createjs.Stage(this.name);
    }
    this.w = this.stage.canvas.width;
    this.h = this.stage.canvas.height;
    this.manifest = [
        {src: "assets/imgs/spritesheet_grant.png", id: "grant"},
        {src: "assets/imgs/sky.png", id: "sky"},
        {src: "assets/imgs/ground.png", id: "ground"},
        {src: "assets/imgs/hill1.png", id: "hill"},
        {src: "assets/imgs/hill2.png", id: "hill2"}
    ];

    this.loadImages(this.manifest, this.drawGame)
  }
  
  tick(event) {
    this.stage.update(event);
		var deltaS = event.delta / 1000;
		var position = this.grant.x + this.grantSpeed * deltaS;
		var grantW = this.grant.getBounds().width * this.grant.scaleX;
		this.grant.x = (position >= this.w + grantW) ? - grantW : position;
		this.ground.x = (this.ground.x - deltaS * this.grantSpeed) % this.ground.tileW;
		this.hill.x = (this.hill.x - deltaS * this.hillSpeed);
		if (this.hill.x + this.hill.image.width * this.hill.scaleX <= 0) {
			this.hill.x = this.w;
		}
		this.hill2.x = (this.hill2.x - deltaS * this.hill2Speed);
		if (this.hill2.x + this.hill2.image.width * this.hill2.scaleX <= 0) {
			this.hill2.x = this.w;
		}
		this.stage.update(event);
  }

  drawGame(scope) {
    scope.sky = new createjs.Shape();
    scope.sky.graphics.beginBitmapFill(scope.images.get('sky'), "repeat", null).drawRect(0, 0, scope.w, scope.h);

    let groundImg = scope.images.get('ground')
    scope.ground = new createjs.Shape();
    scope.ground.graphics.beginBitmapFill(groundImg, "repeat", null).drawRect(0, 0, scope.w + groundImg.width, groundImg.height);
    scope.ground.tileW = groundImg.width;
    scope.ground.y = scope.h - groundImg.height;

    scope.hill = new createjs.Bitmap(scope.images.get('hill'));
    scope.hill.setTransform(Math.random() * scope.w, scope.h - scope.hill.image.height * 4 - groundImg.height, 4, 4);
    scope.hill.alpha = 0.5;

    scope.hill2 = new createjs.Bitmap(scope.images.get('hill2'));
    scope.hill2.setTransform(Math.random() * scope.w, scope.h - scope.hill2.image.height * 3 - groundImg.height, 3, 3);

    let spriteSheet = new createjs.SpriteSheet({
      framerate: 30,
      "images": [scope.images.get('grant')],
      "frames": {"regX": 82, "height": 292, "count": 64, "regY": 0, "width": 165},
      "animations": {
        "run2": [0, 25, "run2", 2.0],
        "run1": [0, 25, "run1", 1.0],
        "jump": [26, 63, "run1"]
      }
    });

    scope.grant = new createjs.Sprite(spriteSheet, "run1");
		scope.grant.y = 35;
    scope.stage.addChild(scope.sky, scope.hill, scope.hill2, scope.ground, scope.grant);

    scope.stage.addEventListener("stagemousedown", scope.handleJumpStart.bind(scope));
		createjs.Ticker.timingMode = createjs.Ticker.RAF;
		createjs.Ticker.addEventListener("tick", scope.tick.bind(scope));
  }
  
  loadImages(manifest: any, callback: Function): void {
    this.images = new Map<string, any>()
    let loadedImages = 0;

    for(let im in manifest){
      let image = new Image();
      image.src = manifest[im].src;
      image.onload = () => { 
        loadedImages++;
        if (loadedImages == manifest.length){
          callback(this)
        }
      } 
      this.images.set(manifest[im].id, image);
    }
  }

  handleJumpStart(scope) {
		this.grant.gotoAndPlay("jump");
	}
}
