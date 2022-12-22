export class SnowFlake {
  private counter;
  private sign: number;

  constructor(
    private x: number,
    private y: number,
    private opacity: number,
    private speed: number,
    private radius: number,
    private maxHeight: number
  ) {
    this.counter = 0;
    this.sign = Math.random() < 0.5 ? -1 : 1;
  }

  setMaxHeight(maxHeight: number) {
    this.maxHeight = maxHeight;
  }

  // The function responsible for actually moving our snowflake
  update(delta: number) {
    // using some trigonometry to determine our x and y position
    this.counter += (this.speed / 5000) * delta;
    this.x += (this.sign * delta * this.speed * Math.cos(this.counter)) / 40;
    this.y += Math.sin(this.counter) / 40 + (this.speed * delta) / 30;

    // if snowflake goes below the browser window, move it back to the top
    if (this.y > this.maxHeight) {
      this.y = -50;
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    const gradient = ctx.createRadialGradient(
      this.x,
      this.y,
      0,
      this.x,
      this.y,
      this.radius
    );

    gradient.addColorStop(0.0, `rgba(255, 255, 255, ${this.opacity})`); // white
    gradient.addColorStop(0.8, `rgba(210, 236, 242, ${this.opacity})`); // bluish
    gradient.addColorStop(1.0, `rgba(237, 247, 249, ${this.opacity})`); // lighter bluish

    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.fillStyle = gradient;
    ctx.fill();
  }
}
