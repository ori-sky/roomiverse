module Roomiverse {
	export class Point {
		x: number
		y: number

		constructor(x: number, y: number) {
			this.x = x
			this.y = y
		}

		length(): number {
			return Math.sqrt(this.x * this.x + this.y * this.y)
		}

		normalizedTo(factor: number): Point {
			var factor = factor / this.length()
			return new Point(this.x * factor, this.y * factor)
		}

		normalized(): Point { return this.normalizedTo(1) }
	}
}
