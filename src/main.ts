import "./style.css";

const input = {
  state: {
    moveLeft: false,
    moveRight: false,
    moveUp: false,
    moveDown: false,
  },
  actionMap: {
    moveLeft: ["a", "ArrowLeft"],
    moveRight: ["d", "ArrowRight"],
    moveUp: ["w", "ArrowUp"],
    moveDown: ["s", "ArrowDown"],
  },
};

type InputActionMapType = typeof input.actionMap;
type InputActionNameType = keyof InputActionMapType;
type InputActionsType = { [P in keyof InputActionMapType]: string };

const InputActions: InputActionsType = Object.keys(input.actionMap).reduce(
  (actions, inputActionName) => {
    return { ...actions, [inputActionName]: inputActionName };
  },
  {} as InputActionsType
);

const getInputActionKeyBindings = (inputActionName: string): string[] => {
  const inputActionKeyBindings: string[] =
    input.actionMap[inputActionName as InputActionNameType];
  return inputActionKeyBindings;
};

const setInputStateForAction = (
  inputActionName: string,
  nextState: boolean
) => {
  input.state[inputActionName as InputActionNameType] = nextState;
};

const isInputActionPressed = (inputActionName: string): boolean => {
  return input.state[inputActionName as keyof typeof input.state];
};

const handleKeyEvent = (keyEvent: KeyboardEvent, isDown: boolean) => {
  const inputActionNames: string[] = Object.keys(input.actionMap);
  for (const inputActionName of inputActionNames) {
    const inputActionKeyBindings: string[] =
      getInputActionKeyBindings(inputActionName);
    if (inputActionKeyBindings.includes(keyEvent.key)) {
      keyEvent.preventDefault();
      setInputStateForAction(inputActionName, isDown);
      break;
    }
  }
};

const handleKeyDownEvent = (keyEvent: KeyboardEvent) => {
  handleKeyEvent(keyEvent, true);
};

const handleKeyUpEvent = (keyEvent: KeyboardEvent) => {
  handleKeyEvent(keyEvent, false);
};

const setupInputEventHandlers = () => {
  window.addEventListener("keydown", handleKeyDownEvent, false);
  window.addEventListener("keyup", handleKeyUpEvent, false);
};

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

const mainLoop = () => {
  const currTime = Date.now();
  state.deltaTime = (currTime - state.lastTime) * 0.001;
  state.lastTime = currTime;

  box.vx = 0;
  box.vy = 0;

  if (isInputActionPressed(InputActions.moveUp)) {
    box.vy = -1;
  } else if (isInputActionPressed(InputActions.moveDown)) {
    box.vy = 1;
  }

  if (isInputActionPressed(InputActions.moveLeft)) {
    box.vx = -1;
  } else if (isInputActionPressed(InputActions.moveRight)) {
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
