module Roomiverse {
	export class BootState extends Phaser.State {
		preload() {
			this.load.image('bar', 'img/bar.png')
		}

		create() {
			this.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL
			this.game.state.start('Preload')
		}
	}
}
