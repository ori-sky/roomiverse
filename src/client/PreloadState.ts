module Roomiverse {
	export class PreloadState extends Phaser.State {
		group : Phaser.Group

		preload() {
			this.group = this.add.group()
			this.group.alpha = 0
			this.add.tween(this.group).to({ alpha: 1 }, 1000, Phaser.Easing.Linear.None, true)

			var bar = this.add.sprite(this.world.centerX - 400, this.world.centerY + 60, 'bar1', 0, this.group)
			this.load.setPreloadSprite(bar)

			this.load.audio('serenity', 'audio/serenity.ogg', true)

			var text = this.add.text(this.world.centerX, this.world.centerY, 'Loading', undefined, this.group)
			text.anchor.setTo(0.5, 0.5)
			text.font = 'Iceland'
			text.fontSize = 60
			text.fill = '#acf'
		}

		create() {
			var tween = this.add.tween(this.group).to({ alpha: 0 }, 1000, Phaser.Easing.Linear.None, true)
			tween.onComplete.add(() => this.game.state.start('Connect'))
		}
	}
}
