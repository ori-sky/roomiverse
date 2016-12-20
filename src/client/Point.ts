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

		length(): number {
			return Math.sqrt(this.x * this.x + this.y * this.y)
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
			return this.scale(1 / this.length()).scale(x, y)
		}

		translated(x: number, y?: number): Point {
			if(y === undefined) { y = x }
			return new Point(this.x + x, this.y + y)
		}

		scaled(x: number, y?: number): Point {
			if(y === undefined) { y = x }
			return new Point(this.x * x, this.y * y)
		}

		normalized(x?: number, y?: number): Point {
			if(x === undefined) { x = 1 }
			if(y === undefined) { y = x }
			return this.scaled(x / this.length(), y / this.length())
		}

		translatedBy(p: Point): Point { return this.translated(p.x, p.y) }
		scaledBy(p: Point):     Point { return this.scaled(p.x, p.y) }
		normalizedBy(p: Point): Point { return this.normalized(p.x, p.y) }

		translateBy(p: Point): Point { return this.translate(p.x, p.y) }
		scaleBy(p: Point):     Point { return this.scale(p.x, p.y) }
		normalizeBy(p: Point): Point { return this.normalize(p.x, p.y) }
	}
}
