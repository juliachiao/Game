let sprites = {
  // 第一個角色的精靈圖
  player1: {
    idle: {
      img: null,
      width: 165,
      height: 188,
      frames: 16
    },
    walk: {
      img: null,
      width: 166,
      height: 177,
      frames: 6
    },
    punch: {
      img: null,
      width: 228,
      height: 177,
      frames: 10
    }
  },
  // 第二個角色的精靈圖
  player2: {
    idle: {
      img: null,
      width: 88,
      height: 191,
      frames: 8
    },
    walk: {
      img: null,
      width: 177,
      height: 177,
      frames: 11
    },
    punch: {
      img: null,
      width: 221,
      height: 185,
      frames: 12
    }
  },
  explosion: {
    img: null,
    width: 133,
    height: 100,
    frames: 4
  }
};

// 載入圖片
function preload() {
  // 載入第一個角色的精靈圖
  sprites.player1.idle.img = loadImage('player1_idle.png');
  sprites.player1.walk.img = loadImage('player1_walk.png');
  sprites.player1.punch.img = loadImage('player1_punch.png');
  
  // 載入第二個角色的精靈圖
  sprites.player2.idle.img = loadImage('player2_idle.png');
  sprites.player2.walk.img = loadImage('player2_walk.png');
  sprites.player2.punch.img = loadImage('player2_punch.png');
  
  // 載入爆炸圖
  sprites.explosion.img = loadImage('explosion.png');
}

// 玩家類別
class Player {
  constructor(spriteData, controls, startX, startY) {
    this.x = startX;
    this.y = startY;
    this.velocityX = 0;
    this.velocityY = 0;
    this.speed = 5;
    this.currentState = 'idle';
    this.spriteData = spriteData;
    this.controls = controls;
    this.direction = 1;
    this.frameCount = 0;
    this.currentFrame = 0;
    this.animationSpeed = 0.01;    // 調整動畫速度
    this.isPunching = false;
    this.lastTime = 0;
    this.elapsedTime = 0;
    this.frameUpdateTime = 0;     // 新增：用於控制幀更新
    this.frameDelay = 1000/3000;    // 新增：每幀延遲時間（30fps）
  }

  update() {
    let currentTime = millis();
    
    // 更新動作狀態
    if (keyIsDown(this.controls.punch) && !this.isPunching) {
      this.currentState = 'punch';
      this.isPunching = true;
      this.frameCount = 0;
      this.frameUpdateTime = currentTime;
    }
    
    if (!this.isPunching) {
      if (keyIsDown(this.controls.left)) {
        this.velocityX = -this.speed;
        this.currentState = 'walk';
        this.direction = -1;
      } else if (keyIsDown(this.controls.right)) {
        this.velocityX = this.speed;
        this.currentState = 'walk';
        this.direction = 1;
      } else {
        this.velocityX = 0;
        this.currentState = 'idle';
      }
    }

    // 更新位置
    this.x += this.velocityX;
    
    // 更新動畫幀
    if (currentTime - this.frameUpdateTime >= this.frameDelay) {
      let currentAnim = this.spriteData[this.currentState];
      if (currentAnim) {
        this.frameCount = (this.frameCount + 1) % currentAnim.frames;
        
        // 如果出拳動畫播放完畢，回到閒置狀態
        if (this.isPunching && this.frameCount >= currentAnim.frames - 1) {
          this.isPunching = false;
          this.currentState = 'idle';
          this.frameCount = 0;
        }
      }
      this.frameUpdateTime = currentTime;
    }
  }

  draw() {
    let currentSprite = this.spriteData[this.currentState];
    if (!currentSprite || !currentSprite.img) return;

    push();
    translate(this.x, this.y);
    scale(this.direction, 1);
    
    let sx = this.frameCount * currentSprite.width;
    
    if (sx < currentSprite.img.width) {
      image(
        currentSprite.img,
        -currentSprite.width/2,
        -currentSprite.height/2,
        currentSprite.width,
        currentSprite.height,
        sx,
        0,
        currentSprite.width,
        currentSprite.height
      );
    }
    pop();
  }
}

let player1, player2;

function setup() {
  createCanvas(800, 600);
  frameRate(120);
  imageMode(CENTER);
  pixelDensity(1);
  smooth();  // 添加平滑處理
  
  // 設定玩家1的控制鍵（WASD + F）
  const player1Controls = {
    left: 65,  // A
    right: 68, // D
    punch: 70  // F
  };

  // 設定玩家2的控制鍵（方向鍵 + L）
  const player2Controls = {
    left: LEFT_ARROW,
    right: RIGHT_ARROW,
    punch: 76  // L
  };

  // 創建玩家實例
  player1 = new Player(sprites.player1, player1Controls, 200, height - 200);
  player2 = new Player(sprites.player2, player2Controls, 600, height - 200);
}

function draw() {
  background(220);
  
  // 更新和繪製玩家
  player1.update();
  player1.draw();
  
  player2.update();
  player2.draw();
} 