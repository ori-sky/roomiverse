module Roomiverse {
	export class Player {
		context: any
		group: Phaser.Group
		graphics: Phaser.Graphics
		velocity: Point = new Point()
		decelFactor: number = 10

		constructor(context: any, group: Phaser.Group) {
			this.context = context

			this.group = this.context.add.group(group)
			this.group.x = this.context.world.centerX
			this.group.y = this.context.world.centerY

			this.graphics = this.context.add.graphics(0, 0, this.group)
			this.graphics.beginFill(0xffffff, 1)
			this.graphics.drawCircle(0, 0, 43)
		}

		tick(seconds: number) {
			this.velocity = this.velocity.scaled(Math.max(0, 1 - this.decelFactor * seconds))
			this.moveBy(this.velocity)

			// keep player in room
			// player diameter is 43, radius is 43/2, plus some leeway
			const radius = 43 / 2 + 3
			if(this.group.x < 400 + radius) { this.group.x = 400 + radius }
			if(this.group.y < 120 + radius) { this.group.y = 120 + radius }
			if(this.group.x > 880 - radius) { this.group.x = 880 - radius }
			if(this.group.y > 600 - radius) { this.group.y = 600 - radius }
		}

		accelBy(p: Point) {
			this.velocity = this.velocity.translatedBy(p)
		}

		moveBy(p: Point) {
			this.group.x += p.x
			this.group.y += p.y
		}
	}
}
