import { FabricObject } from 'fabric';

class Arrow extends FabricObject {
  static type = 'arrow';

  x1 = 0;
  y1 = 0;
  x2 = 0;
  y2 = 0;
  arrowheadLength = 20;
  arrowheadWidth = 20;

  constructor(options) {
    super(options);
    this.x1 = options.x1 || 0;
    this.y1 = options.y1 || 0;
    this.x2 = options.x2 || 100;
    this.y2 = options.y2 || 100;
    this.arrowheadLength = options.arrowheadLength || 20;
    this.arrowheadWidth = options.arrowheadWidth || 20;

  }

  _updateBoundingBox() {
    const minX = Math.min(this.x1, this.x2);
    const minY = Math.min(this.y1, this.y2);
    const maxX = Math.max(this.x1, this.x2);
    const maxY = Math.max(this.y1, this.y2);

    this.width = maxX - minX;
    this.height = maxY - minY;
    this.left = minX;
    this.top = minY;
    
    this.pathOffset = {
      x: this.width / 2,
      y: this.height / 2
    };
  }

  _render(ctx) {
    const relX1 = this.x1 - this.left;
    const relY1 = this.y1 - this.top;
    const relX2 = this.x2 - this.left;
    const relY2 = this.y2 - this.top;
    const angle = Math.atan2(relY2 - relY1, relX2 - relX1);

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(relX1, relY1);
    ctx.lineTo(relX2, relY2);
    ctx.lineWidth = this.strokeWidth;
    ctx.strokeStyle = this.stroke;
    ctx.stroke();
    ctx.restore();

    ctx.save();
    ctx.translate(relX2, relY2);
    ctx.rotate(angle);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(-this.arrowheadLength, this.arrowheadWidth / 2);
    ctx.moveTo(0, 0);
    ctx.lineTo(-this.arrowheadLength, -this.arrowheadWidth / 2);
    ctx.lineWidth = this.strokeWidth;
    ctx.strokeStyle = this.stroke;
    ctx.stroke();
    ctx.restore();
  }

  toObject(propertiesToInclude) {
    return super.toObject();
  }

  static fromObject(object) {
    return Promise.resolve(new Arrow(object));
  }
}

export default Arrow;