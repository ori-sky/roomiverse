module Roomiverse {
	export class Point {
		x: number
		y: number

		constructor(x?: number, y?: number) {
			if(x === undefined) { x = 0 }
			if(y === undefined) { y = x }
			this.x = x
			this.y = y
		}

		static _pool: Point[] = new Array(1024)
		static _poolLength: number = 0

		static create(x?: number, y?: number): Point {
			if(x === undefined) { x = 0 }
			if(y === undefined) { y = x }

			if(Point._poolLength < 1) {
				return new Point(x, y)
			} else {
				var obj = Point._pool[--Point._poolLength]
				Point._pool[Point._poolLength] = undefined
				obj.x = x
				obj.y = y
				return obj
			}
		}

		pool(): Point {
			Point._pool[Point._poolLength++] = this
			if(Point._poolLength === Point._pool.length) {
				Point._pool.length *= 2
			}
			return this
		}

		length(): number {
			return Math.sqrt(this.x * this.x + this.y * this.y)
		}

		translated(x: number, y?: number): Point {
			if(y === undefined) { y = x }
			return Point.create(this.x + x, this.y + y)
		}

		scaled(x: number, y?: number): Point {
			if(y === undefined) { y = x }
			return Point.create(this.x * x, this.y * y)
		}

		normalized(x?: number, y?: number): Point {
			if(x === undefined) { x = 1 }
			if(y === undefined) { y = x }
			var len = this.length()
			return this.scaled(x / len, y / len)
		}

		translate(x: number, y?: number): Point {
			if(y === undefined) { y = x }
			this.x += x
			this.y += y
			return this
		}

		scale(x: number, y?: number): Point {
			if(y === undefined) { y = x }
			this.x *= x
			this.y *= y
			return this
		}

		normalize(x?: number, y?: number): Point {
			if(x === undefined) { x = 1 }
			if(y === undefined) { y = x }
			var len = this.length()
			return this.scale(x / len, y / len)
		}

		translatedBy(p: Point): Point { return this.translated(p.x, p.y) }
		scaledBy(p: Point):     Point { return this.scaled(p.x, p.y) }
		normalizedBy(p: Point): Point { return this.normalized(p.x, p.y) }

		translateBy(p: Point): Point { return this.translate(p.x, p.y) }
		scaleBy(p: Point):     Point { return this.scale(p.x, p.y) }
		normalizeBy(p: Point): Point { return this.normalize(p.x, p.y) }
	}
}
