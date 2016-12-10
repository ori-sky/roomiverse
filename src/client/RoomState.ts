module Roomiverse {
	export class RoomState extends Phaser.State {
		music: Phaser.Sound

		create() {
			this.music = this.add.audio('serenity')
			this.music.play()
		}
	}
}
