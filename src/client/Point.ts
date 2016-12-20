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

		scaled(x: number, y?: number): Point {
			if(y === undefined) { y = x }
			return new Point(this.x * x, this.y * y)
		}

		normalized(x?: number, y?: number): Point {
			if(x === undefined) { x = 1 }
			if(y === undefined) { y = x }
			return this.scaled(x / this.length(), y / this.length())
		}
	}
}
