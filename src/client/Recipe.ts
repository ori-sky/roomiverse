module Roomiverse {
	export class Recipe {
		result: ItemType
		needs: ItemType[]

		constructor(result: ItemType, needs: ItemType[]) {
			this.result = result
			this.needs = needs
		}

		get(): RecipeInstance {
			return new RecipeInstance(this.result, this.needs.slice())
		}
	}

	export class RecipeInstance {
		result: ItemType
		needs: ItemType[]
		consumes: Item[]

		constructor(result: ItemType, needs: ItemType[]) {
			this.result = result
			this.needs = needs
			this.consumes = []
		}

		complete(): boolean {
			return (this.needs.length === 0)
		}
	}
}
