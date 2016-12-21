module Roomiverse {
	export class Game extends Phaser.Game {
		constructor() {
			super(1280, 720, Phaser.CANVAS, 'content', null)

			this.state.add('Boot', BootState, true)
			this.state.add('Preload', PreloadState)
			this.state.add('Room', RoomState)
		}
	}
}
