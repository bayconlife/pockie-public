const Location = {
	Scene: 0,
	Hall: 1
}

const Npc = {
	FIRE_VILLAGE_CHIEF: 11001,
	FIRE_ARENA_MASTER: 11002,
	FIRE_BLACKSMITH: 11003,
	Fire_Merchant: 11005,
	Angel_City_Elder: 16001,
	Angel_City_Merchant: 16005,
	Genin: 21001,
	Pakkun: 21002,
	Mysterious_Merchant: 21003,
	Hunter: 21004,
	Master_Yuan: 26001,
	Feng: 26002,
	Chef: 26003,
	Kabuki: 26004,
	Toad: 26005,
	Craftsman: 26006,
	Sentry: 26007,
	Priest: 26008,
	Witch: 26009,
	Robber: 26010,
	Shaman: 26011,
	Samurai: 26012,
	Old: 26013
}

const Npcs = {
	[Npc.FIRE_VILLAGE_CHIEF]: {
		location: Location.Hall
	}
}

module.exports = {
	Npc,
	Npcs
}