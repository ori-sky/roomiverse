module Roomiverse {
	class InventoryItem {
		context: any
		group: Phaser.Group
		graphics: Phaser.Graphics
		amount: number = 0

		constructor(context: any, group: Phaser.Group, p: Point) {
			this.context = context

			this.group = this.context.add.group(group)
			this.group.x = p.x
			this.group.y = p.y

			this.graphics = this.context.add.graphics(0, 0, this.group)
			this.graphics.beginFill(0xffffff, 1)
			this.graphics.drawCircle(0, 0, 5)
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
				var pos = Point.create((type % 4) * 80, Math.floor(type / 4) * 80)
				this.items[type] = new InventoryItem(this.context, this.group, pos)
			}
		}

		add(type: ItemType, amount: number) {
			this.create(type)
			this.items[type].amount += amount
		}
	}
}
