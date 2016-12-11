module Roomiverse {
	export class PreloadState extends Phaser.State {
		group : Phaser.Group

		preload() {
			this.group = this.add.group()
			this.group.alpha = 0
			this.add.tween(this.group).to({ alpha: 1 }, 1000, Phaser.Easing.Linear.None, true)

			var bar = this.add.sprite(this.world.centerX - 400, this.world.centerY + 60, 'bar', 0, this.group)
			this.load.setPreloadSprite(bar)

			this.load.audio('serenity', 'audio/serenity.ogg', true)
			this.load.audio('celestial', 'audio/celestial.ogg', true)

			var text = this.add.text(this.world.centerX, this.world.centerY, 'Loading', undefined, this.group)
			text.anchor.setTo(0.5, 0.5)
			text.font = 'Iceland'
			text.fontSize = 60
			text.fill = '#acf'

			recipes.push(new Recipe(ItemType.Water,    [ItemType.Hydrogen, ItemType.Oxygen, ItemType.Hydrogen]))
			recipes.push(new Recipe(ItemType.Soil,     [ItemType.Oxygen, ItemType.Oxygen, ItemType.Silicon, ItemType.Aluminium]))
			recipes.push(new Recipe(ItemType.PCB,      [ItemType.Silicon, ItemType.Silicon, ItemType.Oxygen]))
			recipes.push(new Recipe(ItemType.Computer, [ItemType.PCB, ItemType.PCB, ItemType.Silicon]))
		}

		create() {
			var tween = this.add.tween(this.group).to({ alpha: 0 }, 1000, Phaser.Easing.Linear.None, true)
			tween.onComplete.add(() => this.game.state.start('Room'))
		}
	}
}
