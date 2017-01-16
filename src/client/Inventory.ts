module Roomiverse {
	class InventoryItem {
		context: any
		group: Phaser.Group
		text: Phaser.Text
		item: Item
		amount: number = 0

		constructor(context: any, group: Phaser.Group, p: Point, type: ItemType) {
			this.context = context

			this.group = this.context.add.group(group)
			this.group.x = p.x
			this.group.y = p.y

			this.item = new Item(-1, type, context, this.group, Point.create())

			this.text = context.add.text(13, 19, '0', undefined, this.group)
			this.text.anchor.setTo(0.5, 0.45)
			this.text.font = 'VT323'
			this.text.fontSize = 20
			this.text.fill = '#fff'
		}

		add(amount: number) {
			this.amount += amount
			this.text.setText(Math.floor(this.amount).toString())
		}
	}

	export class Inventory {
		context: any
		group: Phaser.Group
		graphics: Phaser.Graphics
		items: { [type: number]: InventoryItem } = {}

		constructor(context: any, group: Phaser.Group) {
			this.context = context

			this.group = this.context.add.group(group)
			this.group.x = 880 + 20 // right edge of room + leeway
			this.group.y = 120 - 20 // top align of room - leeway
		}

		create(type: ItemType) {
			if(this.items[type] === undefined) {
				var pos = Point.create((type % 4) * 100 + 50, Math.floor(type / 4) * 80 + 40)
				this.items[type] = new InventoryItem(this.context, this.group, pos, type)
			}
		}

		add(type: ItemType, amount: number) {
			this.create(type)
			this.items[type].add(amount)
		}
	}
}
