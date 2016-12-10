module Roomiverse {
	export enum ElementType {
		Hydrogen,
		Carbon,
		Nitrogen,
		Oxygen,
		Sodium,
		Magnesium,
		Chlorine
	}

	export class Element {
		type: ElementType
		velocity: Point = new Point(0, 0)
		age: number = 0
		group: Phaser.Group

		static lettersForType(type: ElementType): string {
			switch(type) {
				case ElementType.Hydrogen:  return 'H'
				case ElementType.Carbon:    return 'C'
				case ElementType.Nitrogen:  return 'N'
				case ElementType.Oxygen:    return 'O'
				case ElementType.Sodium:    return 'Na'
				case ElementType.Magnesium: return 'Mg'
				case ElementType.Chlorine:  return 'Cl'
			}
		}

		static colorForType(type: ElementType): number {
			switch(type) {
				case ElementType.Hydrogen:
				case ElementType.Carbon:
				case ElementType.Nitrogen:
				case ElementType.Oxygen:
					return 0x33ff88
				case ElementType.Sodium:
					return 0xff33aa
				case ElementType.Magnesium:
					return 0xff8833
				case ElementType.Chlorine:
					return 0x33aaff
			}
		}

		constructor(type: ElementType, context: any, group: Phaser.Group, pos: Point) {
			this.type = type

			this.group = context.add.group(group)
			this.group.x = pos.x
			this.group.y = pos.y
			this.group.alpha = 0
			this.group.scale.setTo(0, 0)
			context.add.tween(this.group).to({alpha: 1}, 150, Phaser.Easing.Linear.None, true)
			context.add.tween(this.group.scale).to({x: 1, y: 1}, 150, Phaser.Easing.Bounce.InOut, true)

			var graphics = context.add.graphics(0, 0, this.group)
			graphics.beginFill(this.color(), 0.13)
			graphics.drawCircle(0, 0, 37)

			var text = context.add.text(0, 0, this.letters(), undefined, this.group)
			text.anchor.setTo(0.5, 0.45)
			text.font = 'VT323'
			text.fontSize = 32
			text.fill = '#' + this.color().toString(16)
		}

		letters(): string {
			return Element.lettersForType(this.type)
		}

		color(): number {
			return Element.colorForType(this.type)
		}
	}
}
