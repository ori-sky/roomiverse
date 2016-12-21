module Roomiverse {
	export class RoomState extends Phaser.State {
		group: Phaser.Group
		serenity: Phaser.Sound
		celestial: Phaser.Sound
		timeAccum: number = 0
		state: { [k: string]: boolean }

		player: Player

		nextID: number = 0
		itemsGroup: Phaser.Group
		items: { [id: number]: Item } = {}

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

			this.player = new Player(this, this.group)

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
		}

		update() {
			this.timeAccum += this.game.time.elapsed / 1000
			const timestep = 1 / 60

			if(this.timeAccum >= timestep) {
				this.timeAccum -= timestep
				this.tick(timestep)
			}
		}

		tick(seconds: number) {
			this.recipeAccum += seconds

			const playerAccel = 4000
			const elementAccel = 20
			const elementDecelFactor = 0.13

			var direction = new Point()
			if(this.state['KeyW']) { direction.y -= 1 }
			if(this.state['KeyA']) { direction.x -= 1 }
			if(this.state['KeyS']) { direction.y += 1 }
			if(this.state['KeyD']) { direction.x += 1 }

			if(direction.length() !== 0) {
				direction.normalize(playerAccel * seconds);
				this.player.accelBy(direction)
			}

			this.player.tick(seconds)

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
				if(this.state['KeyFive']) {
					this.recipe = recipes[4].get()
					this.recipeAccum = 0
				}
			}

			// crafting
			if(this.recipe !== null && this.recipe.complete()) {
				types.push(this.recipe.result)
				this.recipe.consumes.forEach(item => {
					if(!item.dying) {
						item.die()
						this.items[item.id] = undefined
						delete this.items[item.id]
					}
				})
				this.recipe = null
			}

			types.forEach(t => {
				var theta = this.rnd.realInRange(0, Math.PI * 2)
				var phi = this.rnd.realInRange(260, 680)
				var pos = new Point(640 + phi * Math.cos(theta), 360 + phi * Math.sin(theta))

				var id = this.nextID++
				var element = new Item(id, t, this, this.itemsGroup, pos)
				element.velocity.x = this.rnd.integerInRange(-20, 20)
				element.velocity.y = this.rnd.integerInRange(-20, 20)
				this.items[id] = element
			})

			Object.keys(this.items).forEach(k => {
				var item = this.items[k]
				item.ttl -= seconds

				// crafting
				if(this.recipe && !item.attached) {
					for(var i = 0; i < this.recipe.needs.length; ++i) {
						if(this.recipe.needs[i] === item.type) {
							item.attached = true
							item.factor = 20
							item.graphics.alpha = 0.5
							this.recipe.needs.splice(i, 1)
							this.recipe.consumes.push(item)
							break
						}
					}
				}

				if(item.ttl <= 0 && !item.attached) {
					if(!item.dying) {
						item.die()
						this.items[k] = undefined
						delete this.items[k]
					}
				}

				var dir = new Point(this.player.group.x - item.group.x, this.player.group.y - item.group.y)
				dir.normalize()

				// player is 43 radius, plus some leeway
				const radius = 43 + 10
				if(Math.sqrt(Math.pow(this.player.group.x - item.group.x, 2) + Math.pow(this.player.group.y - item.group.y, 2)) < radius) {
					dir.scale(-3)
				}

				item.velocity.x += dir.x * Math.abs(dir.x) * elementAccel * item.factor * seconds
				item.velocity.y += dir.y * Math.abs(dir.y) * elementAccel * item.factor * seconds
				item.velocity = item.velocity.scaled(Math.max(0, 1 - elementDecelFactor * seconds))

				item.group.x += item.velocity.x * seconds
				item.group.y += item.velocity.y * seconds
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
			var chance = 5 / Math.pow(Item.initialTTLForType(type), 1.2)
			if(this.rnd.realInRange(0, 100) < chance) {
				types.push(type)
			}
		}
	}
}
