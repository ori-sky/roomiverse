module Roomiverse {
	export class Element {
		context: any
		group: Phaser.Group
		graphics: Phaser.Graphics

		id: number
		type: ItemType
		velocity: Point = new Point(0, 0)
		factor: number = 1
		ttl: number = 0
		dying: boolean = false
		attached: boolean = false

		constructor(id: number, type: ItemType, context: any, group: Phaser.Group, pos: Point) {
			this.id = id
			this.type = type
			this.context = context

			this.group = context.add.group(group)
			this.group.x = pos.x
			this.group.y = pos.y
			this.group.alpha = 0
			this.group.scale.setTo(0, 0)
			this.context.add.tween(this.group).to({alpha: 1}, 150, Phaser.Easing.Linear.None, true)
			this.context.add.tween(this.group.scale).to({x: 1, y: 1}, 150, Phaser.Easing.Bounce.InOut, true)

			this.graphics = context.add.graphics(0, 0, this.group)
			this.graphics.beginFill(0xffffff, 1)
			this.graphics.drawCircle(0, 0, 37)
			this.graphics.tint = this.color()
			this.graphics.alpha = 0.13

			var text = context.add.text(0, 0, this.letters(), undefined, this.group)
			text.anchor.setTo(0.5, 0.45)
			text.font = 'VT323'
			text.fontSize = 32
			text.fill = '#' + this.color().toString(16)

			this.ttl = this.initialTTL()
		}

		letters(): string {
			return lettersForType(this.type)
		}

		color(): number {
			return colorForType(this.type)
		}

		initialTTL(): number {
			return ttlForType(this.type)
		}

		die() {
			this.dying = true
			this.context.add.tween(this.group).to({alpha: 0}, 130, Phaser.Easing.Linear.None, true)
			var t = this.context.add.tween(this.group.scale).to({x: 1.5, y: 1.5}, 130, Phaser.Easing.Bounce.InOut, true)
			t.onComplete.add(() => { this.group.destroy() }, this)
		}
	}
}
