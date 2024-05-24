import "./style.css";

const canvas = document.createElement("canvas");

canvas.width = 640;
canvas.height = 360;

const ctx: CanvasRenderingContext2D = canvas.getContext("2d")!;

ctx.fillStyle = "#006DCF";

ctx.fillRect(0, 0, canvas.width, canvas.height);

const state = {
  lastTime: Date.now(),
  deltaTime: 0,
};

const box = {
  x: 0,
  y: 0,
  w: 32,
  h: 32,
  vx: 1,
  vy: 1,
  spd: 130,
};

function normalized({ x, y }: { x: number; y: number }): {
  x: number;
  y: number;
} {
  const normalizedVector = { x, y };
  const magnitude = Math.sqrt(x * x + y * y);
  if (magnitude != 0.0) {
    normalizedVector.x /= magnitude;
    normalizedVector.y /= magnitude;
  }
  return normalizedVector;
}

const input = {
  up: false,
  down: false,
  left: false,
  right: false,
};

function setupInputEventHandlers() {
  const validKeys = [
    "UpArrow",
    "DownArrow",
    "LeftArrow",
    "RightArrow",
    "w",
    "s",
    "a",
    "d",
  ];
  window.addEventListener(
    "keydown",
    (keyEvent: KeyboardEvent) => {
      console.log(keyEvent.key);
      if (validKeys.includes(keyEvent.key)) {
        keyEvent.preventDefault();
        if (keyEvent.key === "UpArrow") {
          input.up = true;
        } else if (keyEvent.key === "DownArrow") {
          input.down = true;
        } else if (keyEvent.key === "LeftArrow") {
          input.left = true;
        } else if (keyEvent.key === "RightArrow") {
          input.right = true;
        }
      }
    },
    false
  );

  window.addEventListener(
    "keyup",
    (keyEvent: KeyboardEvent) => {
      if (validKeys.includes(keyEvent.key)) {
        keyEvent.preventDefault();
        if (keyEvent.key === "UpArrow") {
          input.up = false;
        } else if (keyEvent.key === "DownArrow") {
          input.down = false;
        } else if (keyEvent.key === "LeftArrow") {
          input.left = false;
        } else if (keyEvent.key === "RightArrow") {
          input.right = false;
        }
      }
    },
    false
  );
}

const mainLoop = () => {
  const currTime = Date.now();
  state.deltaTime = (currTime - state.lastTime) * 0.001;
  state.lastTime = currTime;

  box.vx = 0;
  box.vy = 0;

  if (input.up) {
    box.vy = -1;
  } else if (input.down) {
    box.vy = 1;
  }

  if (input.left) {
    box.vx = -1;
  } else if (input.right) {
    box.vx = 1;
  }

  const boxVelocityVector = normalized({ x: box.vx, y: box.vy });

  box.x += boxVelocityVector.x * box.spd * state.deltaTime;
  box.y += boxVelocityVector.y * box.spd * state.deltaTime;

  if (box.x > canvas.width || box.x < 0) {
    box.vx = -box.vx;
  }
  if (box.y > canvas.height || box.y < 0) {
    box.vy = -box.vy;
  }

  ctx.fillStyle = "#006DCF";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#fff";
  ctx.fillRect(box.x, box.y, box.w, box.h);

  window.requestAnimationFrame(mainLoop);
};

setupInputEventHandlers();
mainLoop();

document.querySelector<HTMLDivElement>("#app")?.appendChild(canvas);
