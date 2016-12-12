module Roomiverse {
	export var recipes: Recipe[] = []

	export enum ItemType {
		Hydrogen,
		Carbon,
		Nitrogen,
		Oxygen,
		Sodium,
		Magnesium,
		Aluminium,
		Silicon,
		Chlorine,
		Water,
		Soil,
		Food,
		PCB,
		Computer
	}


	export function lettersForType(type: ItemType): string {
		switch(type) {
			default: return ItemType[type]
			case ItemType.Hydrogen:  return 'H'
			case ItemType.Carbon:    return 'C'
			case ItemType.Nitrogen:  return 'N'
			case ItemType.Oxygen:    return 'O'
			case ItemType.Sodium:    return 'Na'
			case ItemType.Magnesium: return 'Mg'
			case ItemType.Aluminium: return 'Al'
			case ItemType.Silicon:   return 'Si'
			case ItemType.Chlorine:  return 'Cl'
		}
	}

	export function colorForType(type: ItemType): number {
		switch(type) {
			default:
				return 0xffffff
			// very common non-metals
			case ItemType.Hydrogen:
			case ItemType.Carbon:
			case ItemType.Nitrogen:
			case ItemType.Oxygen:
				return 0x33ff88
			// common metals
			case ItemType.Sodium:
			case ItemType.Magnesium:
			case ItemType.Aluminium:
			case ItemType.Silicon:
				return 0xff8833
			// common non-metals
			case ItemType.Chlorine:
				return 0x33aaff
			case ItemType.Water:
				return 0xaaccff
			case ItemType.Soil:
				return 0x883300
			case ItemType.Food:
				return 0x44cc22
			// valuables
			case ItemType.PCB:
				return 0x116611
			case ItemType.Computer:
				return 0xbbbccc
		}
	}

	export function ttlForType(type: ItemType): number {
		switch(type) {
			default:
				return 17
			// very common non-metals
			case ItemType.Hydrogen:
			case ItemType.Carbon:
			case ItemType.Nitrogen:
			case ItemType.Oxygen:
				return 7
			// common metals
			case ItemType.Sodium:
			case ItemType.Magnesium:
			case ItemType.Aluminium:
			case ItemType.Silicon:
				return 27
			// common non-metals
			case ItemType.Chlorine:
				return 23
			// perishables
			case ItemType.Water:
				return 53
			case ItemType.Soil:
				return 123
			case ItemType.Food:
				return 300
			// valuables
			case ItemType.PCB:
			case ItemType.Computer:
				return Infinity
		}
	}
}
