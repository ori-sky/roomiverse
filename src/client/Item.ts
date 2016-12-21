module Roomiverse {
	export var recipes: Recipe[] = []

	export enum ItemType {
		Hydrogen,
		Carbon,
		Nitrogen,
		Oxygen,
		Sodium,
		Magnesium,
		Aluminium,
		Silicon,
		Chlorine,
		Water,
		Soil,
		Food,
		PCB,
		Computer
	}

	export class Item {
		context: any
		group: Phaser.Group
		graphics: Phaser.Graphics

		id: number
		type: ItemType
		velocity: Point = Point.create(0, 0)
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
			text.cacheAsBitmap = true

			this.ttl = this.initialTTL()
		}

		letters(): string {
			return Item.lettersForType(this.type)
		}

		color(): number {
			return Item.colorForType(this.type)
		}

		initialTTL(): number {
			return Item.initialTTLForType(this.type)
		}

		die() {
			this.dying = true
			this.context.add.tween(this.group).to({alpha: 0}, 130, Phaser.Easing.Linear.None, true)
			var t = this.context.add.tween(this.group.scale).to({x: 1.5, y: 1.5}, 130, Phaser.Easing.Bounce.InOut, true)
			t.onComplete.add(() => { this.group.destroy() }, this)
		}

		static lettersForType(type: ItemType): string {
			switch(type) {
				default: return ItemType[type]
				case ItemType.Hydrogen:  return 'H'
				case ItemType.Carbon:    return 'C'
				case ItemType.Nitrogen:  return 'N'
				case ItemType.Oxygen:    return 'O'
				case ItemType.Sodium:    return 'Na'
				case ItemType.Magnesium: return 'Mg'
				case ItemType.Aluminium: return 'Al'
				case ItemType.Silicon:   return 'Si'
				case ItemType.Chlorine:  return 'Cl'
			}
		}

		static colorForType(type: ItemType): number {
			switch(type) {
				default:
					return 0xffffff
				// very common non-metals
				case ItemType.Hydrogen:
				case ItemType.Carbon:
				case ItemType.Nitrogen:
				case ItemType.Oxygen:
					return 0x33ff88
				// common metals
				case ItemType.Sodium:
				case ItemType.Magnesium:
				case ItemType.Aluminium:
				case ItemType.Silicon:
					return 0xff8833
				// common non-metals
				case ItemType.Chlorine:
					return 0x33aaff
				case ItemType.Water:
					return 0xaaccff
				case ItemType.Soil:
					return 0x883300
				case ItemType.Food:
					return 0x44cc22
				// valuables
				case ItemType.PCB:
					return 0x116611
				case ItemType.Computer:
					return 0xbbbccc
			}
		}

		static initialTTLForType(type: ItemType): number {
			switch(type) {
				default:
					return 17
				// very common non-metals
				case ItemType.Hydrogen:
				case ItemType.Carbon:
				case ItemType.Nitrogen:
				case ItemType.Oxygen:
					return 7
				// common metals
				case ItemType.Sodium:
				case ItemType.Magnesium:
				case ItemType.Aluminium:
				case ItemType.Silicon:
					return 27
				// common non-metals
				case ItemType.Chlorine:
					return 23
				// perishables
				case ItemType.Water:
					return 53
				case ItemType.Soil:
					return 123
				case ItemType.Food:
					return 300
				// valuables
				case ItemType.PCB:
				case ItemType.Computer:
					return Infinity
			}
		}
	}
}
