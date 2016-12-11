module Roomiverse {
	export class RoomState extends Phaser.State {
		group: Phaser.Group
		serenity: Phaser.Sound
		celestial: Phaser.Sound
		timeAccum: number = 0
		state: { [k: string]: boolean }

		player: Phaser.Group
		playerVelocity = new Point(0, 0)

		nextID: number = 0
		itemsGroup: Phaser.Group
		items: { [id: number]: Element } = {}

		recipe: RecipeInstance = null
		recipeAccum: number = 0

		create() {
			this.group = this.add.group()
			this.group.alpha = 0
			this.add.tween(this.group).to({alpha: 1}, 3000, Phaser.Easing.Linear.None, true)

			this.serenity = this.add.audio('serenity')
			this.celestial = this.add.audio('celestial')

			this.serenity.onStop.add(() => {
				this.celestial.play()
			})
			this.celestial.onStop.add(() => {
				this.serenity.play()
			})

			this.serenity.play()

			var graphics = this.add.graphics(0, 0, this.group)
			graphics.lineStyle(4, 0xffffff, 1)
			graphics.moveTo(400, 120)
			graphics.lineTo(880, 120)
			graphics.lineTo(880, 600)
			graphics.lineTo(400, 600)
			graphics.lineTo(400, 120)

			this.itemsGroup = this.add.group(this.group)

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
			this.makeKeyState(Phaser.Keyboard.ONE,   'KeyOne')
			this.makeKeyState(Phaser.Keyboard.TWO,   'KeyTwo')
			this.makeKeyState(Phaser.Keyboard.THREE, 'KeyThree')
			this.makeKeyState(Phaser.Keyboard.FOUR,  'KeyFour')
			this.makeKeyState(Phaser.Keyboard.FIVE,  'KeyFive')
			this.makeKeyState(Phaser.Keyboard.SIX,   'KeySix')
			this.makeKeyState(Phaser.Keyboard.SEVEN, 'KeySeven')
			this.makeKeyState(Phaser.Keyboard.EIGHT, 'KeyEight')
			this.makeKeyState(Phaser.Keyboard.NINE,  'KeyNine')
		}

		update() {
			this.timeAccum += this.game.time.elapsed
			const timestep = 1000 / 60

			if(this.timeAccum >= timestep) {
				this.timeAccum -= timestep
				this.tick(timestep / 1000)
			}
		}

		tick(seconds: number) {
			this.recipeAccum += seconds

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

			var types: ItemType[] = []

			this.chanceSpawn(types, ItemType.Hydrogen,  0.5) // 0.5% chance per tick
			this.chanceSpawn(types, ItemType.Oxygen,    0.3)
			this.chanceSpawn(types, ItemType.Silicon,   0.15)
			this.chanceSpawn(types, ItemType.Aluminium, 0.12)

			if(this.state['KeyZ']) { types.push(ItemType.Hydrogen) }
			if(this.state['KeyX']) { types.push(ItemType.Sodium) }
			if(this.state['KeyC']) { types.push(ItemType.Magnesium) }
			if(this.state['KeyV']) { types.push(ItemType.Chlorine) }

			// craft water (H2O)
			if(this.recipe === null && this.recipeAccum >= 0.5) {
				if(this.state['KeyOne']) {
					this.recipe = recipes[0].get()
					this.recipeAccum = 0
				}
				if(this.state['KeyTwo']) {
					this.recipe = recipes[1].get()
					this.recipeAccum = 0
				}
				if(this.state['KeyThree']) {
					this.recipe = recipes[2].get()
					this.recipeAccum = 0
				}
				if(this.state['KeyFour']) {
					this.recipe = recipes[3].get()
					this.recipeAccum = 0
				}
				/*
				if(this.state['KeyFive']) {
					this.recipe = recipes[4].get()
					this.recipeAccum = 0
				}
				if(this.state['KeySix']) {
					this.recipe = recipes[5].get()
					this.recipeAccum = 0
				}
				if(this.state['KeySeven']) {
					this.recipe = recipes[6].get()
					this.recipeAccum = 0
				}
				if(this.state['KeyEight']) {
					this.recipe = recipes[7].get()
					this.recipeAccum = 0
				}
				if(this.state['KeyNine']) {
					this.recipe = recipes[8].get()
					this.recipeAccum = 0
				}
				*/
			}

			// crafting
			if(this.recipe !== null && this.recipe.complete()) {
				types.push(this.recipe.result)
				this.recipe.consumes.forEach(e => {
					if(!e.dying) {
						e.die()
						this.items[e.id] = undefined
						delete this.items[e.id]
					}
				})
				this.recipe = null
			}

			types.forEach(t => {
				var theta = this.rnd.realInRange(0, Math.PI * 2)
				var phi = this.rnd.realInRange(260, 680)
				var pos = new Point(640 + phi * Math.cos(theta), 360 + phi * Math.sin(theta))

				var id = this.nextID++
				var element = new Element(id, t, this, this.itemsGroup, pos)
				element.velocity.x = this.rnd.integerInRange(-20, 20)
				element.velocity.y = this.rnd.integerInRange(-20, 20)
				this.items[id] = element
			})

			Object.keys(this.items).forEach(k => {
				var e = this.items[k]
				e.ttl -= seconds

				// crafting
				if(this.recipe && !e.attached) {
					for(var i = 0; i < this.recipe.needs.length; ++i) {
						if(this.recipe.needs[i] === e.type) {
							e.attached = true
							e.factor = 20
							e.graphics.alpha = 0.5
							this.recipe.needs.splice(i, 1)
							this.recipe.consumes.push(e)
							break
						}
					}
				}

				if(e.ttl <= 0 && !e.attached) {
					if(!e.dying) {
						e.die()
						this.items[k] = undefined
						delete this.items[k]
					}
				}

				var diff = new Point(this.player.x - e.group.x, this.player.y - e.group.y)
				var dir = diff.normalized()
				e.velocity.x += dir.x * Math.abs(dir.x) * elementAccel * e.factor * seconds
				e.velocity.y += dir.y * Math.abs(dir.y) * elementAccel * e.factor * seconds
				e.velocity.x *= Math.max(0, 1 - elementDecelFactor * seconds)
				e.velocity.y *= Math.max(0, 1 - elementDecelFactor * seconds)

				e.group.x += e.velocity.x  * seconds
				e.group.y += e.velocity.y  * seconds
			})
		}

		shutdown() {
			this.serenity.stop()
			this.celestial.stop()
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

		chanceSpawn(types: ItemType[], type: ItemType, percent: number) {
			var chance = 5 / Math.pow(ttlForType(type), 1.2)
			if(this.rnd.realInRange(0, 100) < chance) {
				types.push(type)
			}
		}
	}
}
