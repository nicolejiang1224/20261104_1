// 宣告停止狀態的精靈圖變數，讓角色在未按方向鍵時播放 stop.png
let stopSprite; // 停止狀態的精靈圖

// 宣告走路狀態的精靈圖變數，讓角色在按鍵時播放 walk.png
let walkSprite; // 走路狀態的精靈圖

// 建立角色物件，記錄位置、方向、是否走路與移動速度
let player = {
  x: 0, // 角色的 X 座標
  y: 0, // 角色的 Y 座標
  direction: 1, // 1 表示面向右，-1 表示面向左
  walking: false, // 是否正在走路
  speed: 5, // 每幀移動的速度
};

// 設定動畫幀記錄，讓精靈圖可以依時間切換到下一張
let currentFrame = 0; // 目前播放到第幾幀
let lastFrameTime = 0; // 上一次更新動畫的時間

// preload() 會先載入圖片，避免動畫在圖片尚未準備好時出錯
function preload() {
  // 載入 stop.png，這張圖片共有 5 格，尺寸為 185 x 72
  stopSprite = loadImage('photos/stop/stop.png'); // 載入停止動畫圖片

  // 載入 walk.png，這張圖片共有 8 格，尺寸為 307 x 71
  walkSprite = loadImage('photos/walk/walk.png'); // 載入走路動畫圖片
}

// setup() 建立畫布與初始設定
function setup() {
  // 建立全螢幕畫布，讓背景覆蓋整個視窗
  createCanvas(windowWidth, windowHeight); // 建立全螢幕畫布

  // 設定背景色為天空色 #caf0f8
  background('#caf0f8'); // 背景填滿天空藍色

  // 讓圖片以中心點繪製，較方便控制角色位置
  imageMode(CENTER); // 以圖片中心為基準繪製

  // 角色初始出現在畫面中央
  player.x = width / 2; // 角色的 X 位置設為畫面中央
  player.y = height / 2; // 角色的 Y 位置設為畫面中央

  // 設定動畫的初始時間，讓角色一開始就能正常播放
  lastFrameTime = millis(); // 記錄現在的時間
}

// draw() 每幀都會重繪畫面，製造動畫效果
function draw() {
  // 每一幀都先填滿天空色，讓背景維持固定
  background('#caf0f8'); // 重置背景為天空藍

  // 先更新角色狀態，例如移動、動畫播放與方向變化
  updatePlayer(); // 更新角色控制與動畫

  // 顯示鍵盤控制提示字樣，讓使用者知道左右鍵的方向
  drawDirectionHint(); // 繪製左右方向提示

  // 再依照角色狀態繪製角色圖片
  drawPlayer(); // 繪製角色動畫
}

// updatePlayer() 負責處理鍵盤輸入與角色動畫更新
function updatePlayer() {
  // 檢查使用者是否按下方向鍵，若有則進行走路動畫
  const moveRight = keyIsDown(RIGHT_ARROW); // 檢查右方向鍵是否被按住
  const moveLeft = keyIsDown(LEFT_ARROW); // 檢查左方向鍵是否被按住

  // 如果按住右鍵，角色要改為走路動畫並向右移動
  if (moveRight) {
    player.direction = 1; // 設定方向為右
    player.walking = true; // 設定角色正在走路
    player.x += player.speed; // 向右移動一段距離

    // 限制角色不要超出畫面右邊界
    if (player.x > width - 80) {
      player.x = width - 80; // 把角色鎖在右邊界內
    }
  }
  // 如果按住左鍵，角色要改為走路動畫並向左移動
  else if (moveLeft) {
    player.direction = -1; // 設定方向為左
    player.walking = true; // 設定角色正在走路
    player.x -= player.speed; // 向左移動一段距離

    // 限制角色不要超出畫面左邊界
    if (player.x < 80) {
      player.x = 80; // 把角色鎖在左邊界內
    }
  }
  // 如果沒有按鍵，角色回到停止狀態
  else {
    player.walking = false; // 設定角色不走路
  }

  // 選取當前要播放的精靈圖與幀數
  const activeSprite = player.walking ? walkSprite : stopSprite; // 依狀態選擇精靈圖
  const totalFrames = player.walking ? 8 : 5; // 走路有 8 幀，停止有 5 幀
  const frameDuration = player.walking ? 90 : 130; // 走路動畫速度較快，停止動畫稍慢

  // 根據時間更新動畫幀，讓圖片循環播放
  if (millis() - lastFrameTime >= frameDuration) {
    lastFrameTime = millis(); // 更新上一幀播放時間
    currentFrame = (currentFrame + 1) % totalFrames; // 讓幀數循環在 0 到 totalFrames-1 之間
  }

  // 若角色切換狀態，確保幀數回到 0，避免動畫顯示錯誤
  if (player.walking && activeSprite === walkSprite && currentFrame >= 8) {
    currentFrame = 0; // 走路動畫回到第一幀
  }
  if (!player.walking && activeSprite === stopSprite && currentFrame >= 5) {
    currentFrame = 0; // 停止動畫回到第一幀
  }
}

// drawDirectionHint() 顯示使用者的控制說明文字，標示左右鍵會如何移動
function drawDirectionHint() {
  // 設定文字樣式：顏色、字型大小與位置
  fill(60, 90, 110); // 設定文字顏色為深藍灰
  noStroke(); // 取消文字邊框
  textSize(28); // 設定字體大小
  textAlign(LEFT, TOP); // 文字左對齊，靠上對齊

  // 依照現在的方向顯示不同的提示文字
  let directionText = '按 ← 鍵：往左走   按 → 鍵：往右走';

  // 計算文字顯示位置，放在畫面左上角
  text(directionText, 30, 30); // 在畫面左上顯示控制說明

  // 另外加上一行動態方向提示：告訴使用者目前角色正在往哪個方向
  const statusText = player.direction === -1 ? '目前方向：向左走' : '目前方向：向右走';
  textSize(22); // 異動較小的字體
  text(statusText, 30, 75); // 顯示目前方向
}

// drawPlayer() 負責繪製角色的單張精靈圖
function drawPlayer() {
  // 根據角色狀態選擇精靈圖
  const activeSprite = player.walking ? walkSprite : stopSprite; // 走路時用 walk.png，否則用 stop.png
  const columns = player.walking ? 8 : 5; // 走路有 8 欄，停止有 5 欄

  // 每一格精靈圖的寬度，因為圖片是橫向排列的
  const frameWidth = activeSprite.width / columns; // 每格的寬度
  const frameHeight = activeSprite.height; // 每格的高度

  // 目前要裁切的來源 X 座標
  const sourceX = currentFrame * frameWidth; // 找到要抓的幀位置

  // 讓繪圖環境移到角色位置上，方便控制角色座標
  push(); // 儲存目前繪圖設定
  translate(player.x, player.y); // 移動座標原點到角色位置

  // 如果角色朝左走，就水平翻轉圖片，讓角色看起來面向左側
  if (player.direction === -1) {
    scale(-1, 1); // 水平鏡像翻轉
  }

  // 使用 image() 裁切出一格精靈圖並繪製在畫面上
  image(
    activeSprite, // 要繪製的精靈圖
    0, // X 座標
    0, // Y 座標
    frameWidth * 2.8, // 繪製後的寬度
    frameHeight * 2.8, // 繪製後的高度
    sourceX, // 裁切起點 X
    0, // 裁切起點 Y
    frameWidth, // 裁切寬度
    frameHeight // 裁切高度
  );

  // 恢復先前的繪圖設定，避免影響後續元素
  pop(); // 還原座標與變形設定
}

// windowResized() 當視窗尺寸改變時同步更新畫布與角色位置
function windowResized() {
  // 重新調整畫布尺寸，使畫布始終保持全螢幕
  resizeCanvas(windowWidth, windowHeight); // 調整視窗大小

  // 角色重新回到畫面中央，避免被畫面邊緣卡住
  player.x = width / 2; // 重設 X 位置
  player.y = height / 2; // 重設 Y 位置
}
