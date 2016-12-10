module Roomiverse {
	export class RoomState extends Phaser.State {
		group: Phaser.Group
		music: Phaser.Sound
		timeAccum: number = 0
		state: { [k: string]: boolean }

		player: Phaser.Group
		playerVelocity = new Point(0, 0)

		elementsGroup: Phaser.Group
		elements: Element[] = []

		create() {
			this.group = this.add.group()
			this.group.alpha = 0
			this.add.tween(this.group).to({alpha: 1}, 3000, Phaser.Easing.Linear.None, true)

			this.music = this.add.audio('serenity')
			//this.music.play()

			var graphics = this.add.graphics(0, 0, this.group)
			graphics.lineStyle(4, 0xffffff, 1)
			graphics.moveTo(400, 120)
			graphics.lineTo(880, 120)
			graphics.lineTo(880, 600)
			graphics.lineTo(400, 600)
			graphics.lineTo(400, 120)

			this.elementsGroup = this.add.group(this.group)

			this.player = this.add.group(this.group)
			this.player.x = this.world.centerX
			this.player.y = this.world.centerY

			var playerGraphics = this.add.graphics(0, 0, this.player)
			playerGraphics.beginFill(0xffffff, 1)
			playerGraphics.drawCircle(0, 0, 43)

			this.makeKeyState(Phaser.Keyboard.W, 'KeyW')
			this.makeKeyState(Phaser.Keyboard.A, 'KeyA')
			this.makeKeyState(Phaser.Keyboard.S, 'KeyS')
			this.makeKeyState(Phaser.Keyboard.D, 'KeyD')
			this.makeKeyState(Phaser.Keyboard.Z, 'KeyZ')
			this.makeKeyState(Phaser.Keyboard.X, 'KeyX')
			this.makeKeyState(Phaser.Keyboard.C, 'KeyC')
			this.makeKeyState(Phaser.Keyboard.V, 'KeyV')
		}

		update() {
			this.timeAccum += this.game.time.elapsed
			const timestep = 1000 / 60

			if(this.timeAccum >= timestep) {
				this.timeAccum -= timestep
				var seconds = timestep / 1000

				const playerAccel = 1
				const playerDecelFactor = 10
				const elementAccel = 20
				const elementDecelFactor = 0.13

				var direction = new Point(0, 0)
				if(this.state['KeyW']) { direction.y -= 1 }
				if(this.state['KeyA']) { direction.x -= 1 }
				if(this.state['KeyS']) { direction.y += 1 }
				if(this.state['KeyD']) { direction.x += 1 }

				if(direction.x != 0 || direction.y != 0) {
					direction = direction.normalized()
					this.playerVelocity.x += direction.x * playerAccel
					this.playerVelocity.y += direction.y * playerAccel
				}

				this.playerVelocity.x *= Math.max(0, 1 - playerDecelFactor * seconds)
				this.playerVelocity.y *= Math.max(0, 1 - playerDecelFactor * seconds)

				this.player.x += this.playerVelocity.x
				this.player.y += this.playerVelocity.y

				var types: ElementType[] = []

				if(this.rnd.integerInRange(0, 100000) < 500) {
					types.push(ElementType.Hydrogen)
				}
				if(this.rnd.integerInRange(0, 100000) < 300) {
					types.push(ElementType.Oxygen)
				}
				if(this.rnd.integerInRange(0, 100000) < 50) {
					types.push(ElementType.Magnesium)
				}

				if(this.state['KeyZ']) { types.push(ElementType.Hydrogen) }
				if(this.state['KeyX']) { types.push(ElementType.Sodium) }
				if(this.state['KeyC']) { types.push(ElementType.Magnesium) }
				if(this.state['KeyV']) { types.push(ElementType.Chlorine) }

				types.forEach(t => {
					var theta = this.rnd.realInRange(0, Math.PI * 2)
					var phi = this.rnd.realInRange(260, 680)
					var pos = new Point(640 + phi * Math.cos(theta), 360 + phi * Math.sin(theta))
					//var pos = new Point(this.rnd.integerInRange(440, 840), this.rnd.integerInRange(160, 560))
					var element = new Element(t, this, this.elementsGroup, pos)
					element.velocity.x = this.rnd.integerInRange(-20, 20)
					element.velocity.y = this.rnd.integerInRange(-20, 20)
					this.elements.push(element)
				})

				this.elements.forEach((e, k) => {
					e.age += seconds
					if(e.age > 1) {
						e.group.destroy()
						delete this.elements[k]
					}

					var diff = new Point(this.player.x - e.group.x, this.player.y - e.group.y)
					var dir = diff.normalized()
					e.velocity.x += dir.x * elementAccel * seconds
					e.velocity.y += dir.y * elementAccel * seconds
					e.velocity.x *= Math.max(0, 1 - elementDecelFactor * seconds)
					e.velocity.y *= Math.max(0, 1 - elementDecelFactor * seconds)

					e.group.x += e.velocity.x * seconds
					e.group.y += e.velocity.y * seconds
				})
			}
		}

		shutdown() {
			this.music.stop()
		}

		makeKeyState(keyCode: number, stateName: string) {
			var key = this.game.input.keyboard.addKey(keyCode)
			key.onDown.add(() => {
				this.state[stateName] = true
			})
			key.onUp.add(() => {
				this.state[stateName] = false
			})
		}
	}
}
