import './style.css'

const canvas = document.createElement('canvas')

canvas.width = 640
canvas.height = 360

const ctx: CanvasRenderingContext2D = canvas.getContext('2d')!

ctx.fillStyle = '#006DCF'

ctx.fillRect(0, 0, canvas.width, canvas.height)

const state = {
  lastTime: Date.now(),
  deltaTime: 0,
}

const box = {
  x: 0,
  y: 0,
  w: 32,
  h: 32,
  vx: 1,
  vy: 1,
  spd: 130,
}

const mainLoop = () => {
  const currTime = Date.now()
  state.deltaTime = (currTime - state.lastTime) * 0.001
  state.lastTime = currTime

  box.x += box.vx * box.spd * state.deltaTime
  box.y += box.vy * box.spd * state.deltaTime

  if (box.x > canvas.width || box.x < 0) {
    box.vx = -box.vx
  }
  if (box.y > canvas.height || box.y < 0) {
    box.vy = -box.vy
  }

  ctx.fillStyle = '#006DCF'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  ctx.fillStyle = '#fff'
  ctx.fillRect(box.x, box.y, box.w, box.h)

  window.requestAnimationFrame(mainLoop)
}

mainLoop()

document.querySelector<HTMLDivElement>('#app')?.appendChild(canvas)
