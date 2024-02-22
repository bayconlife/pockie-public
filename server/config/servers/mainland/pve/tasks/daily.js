const { QuestType, createCollectStep, createGiveItemStep, createKillMonsterStep, createTalkStep } = require("./util");


module.exports = {
	Scores: {
		2: 2,
		3: 5,
		4: 8,
		5: 10
	},
	Quests: {
		26303:   { 
			level: 10, 
			grade: 4, 
			steps: [
				createGiveItemStep(141007, 1), 
				createGiveItemStep(141008, 1), 
				createGiveItemStep(141009, 1)
			], 
			rewards: { items: [[150316, 1]]}, 
			weight: 10
		},
		// 2210100: { level: 16, grade: 2, steps: [createCollectStep(33017, 140017, 9, 85)], rewards: { exp: 1000, dropId: 4000073 }, weight: 4 },
		// 2210200: { level: 16, grade: 2, steps: [createCollectStep(33006, 140006, 9, 85)], rewards: { exp: 1000, dropId: 4000073 }, weight: 4 },
		// 2210300: { level: 16, grade: 2, steps: [createCollectStep(33026, 140026, 9, 85)], rewards: { exp: 1000, dropId: 4000073 }, weight: 4 },
		// 2210400: { level: 16, grade: 2, steps: [createCollectStep(33001, 140057, 9, 85)], rewards: { exp: 1000, dropId: 4000073 }, weight: 4 },
		// 2210501: { level: 16, grade: 3, steps: [createCollectStep(33018, 140018, 12, 85)], rewards: { exp: 1200, dropId: 4000064 }, weight: 4 },
		// 2210502: { level: 16, grade: 2, steps: [createCollectStep(33018, 140018, 9, 85)], rewards: { exp: 1120, dropId: 4000073 }, weight: 2 },
		// 2210501: { level: 16, grade: 4, steps: [createCollectStep(33018, 140018, 12, 85)], rewards: { exp: 1375, dropId: 4000055 }, weight: 3 },

		2000001: { group: 20000, level: 16, grade: 5, weight: 10, rewards: { exp: 2500, table: 4000110 }, steps: [
			createGiveItemStep(141001, 3), 
			createGiveItemStep(141002, 1), 
			createGiveItemStep(141003, 1),
			createGiveItemStep(141004, 1), 
			createGiveItemStep(141005, 1), 
			createGiveItemStep(141006, 1)
		]},
		2000002: { group: 20000, level: 16, grade: 5, weight: 10, rewards: { exp: 2800, table: 4000110 }, steps: [
			createGiveItemStep(141001, 3), 
			createGiveItemStep(141002, 1), 
			createGiveItemStep(141003, 1),
			createGiveItemStep(141004, 1), 
			createGiveItemStep(141005, 1), 
			createGiveItemStep(141006, 1)
		]},

		2110100: { group: 21001, level: 16, grade: 2, weight: 2, rewards: { exp: 1200 }, steps: [createKillMonsterStep(33017, 9)]},
		2110101: { group: 21001, level: 16, grade: 2, weight: 2, rewards: { exp: 1200 }, steps: [createKillMonsterStep(33017, 9)]},
		2110200: { group: 21001, level: 16, grade: 2, weight: 2, rewards: { exp: 1200 }, steps: [createKillMonsterStep(33006, 9)]},
		2110201: { group: 21001, level: 16, grade: 2, weight: 2, rewards: { exp: 1200 }, steps: [createKillMonsterStep(33006, 9)]},
		2110300: { group: 21001, level: 16, grade: 2, weight: 2, rewards: { exp: 1200 }, steps: [createKillMonsterStep(33026, 9)]},
		2110301: { group: 21001, level: 16, grade: 2, weight: 2, rewards: { exp: 1200 }, steps: [createKillMonsterStep(33026, 9)]},
		2110400: { group: 21001, level: 16, grade: 2, weight: 2, rewards: { exp: 1200 }, steps: [createKillMonsterStep(32001, 9)]},
		2110401: { group: 21001, level: 16, grade: 2, weight: 2, rewards: { exp: 1200 }, steps: [createKillMonsterStep(32001, 9)]},
		2110501: { group: 21001, level: 16, grade: 3, weight: 4, rewards: { exp: 1440 }, steps: [createKillMonsterStep(33018, 12)]},
		2110502: { group: 21001, level: 16, grade: 2, weight: 2, rewards: { exp: 1344 }, steps: [createKillMonsterStep(33018, 9)]},
		2110601: { group: 21001, level: 16, grade: 4, weight: 3, rewards: { exp: 1650 }, steps: [createKillMonsterStep(33008, 15)]},
		2110602: { group: 21001, level: 16, grade: 2, weight: 2, rewards: { exp: 1344 }, steps: [createKillMonsterStep(33008, 9)]},
		2110701: { group: 21001, level: 16, grade: 5, weight: 1, rewards: { exp: 1875 }, steps: [createKillMonsterStep(33027, 18)]},
		2110702: { group: 21001, level: 16, grade: 2, weight: 2, rewards: { exp: 1344 }, steps: [createKillMonsterStep(33027, 9)]},
		2110801: { group: 21001, level: 16, grade: 3, weight: 4, rewards: { exp: 1440 }, steps: [createKillMonsterStep(33011, 12)]},
		2110802: { group: 21001, level: 16, grade: 2, weight: 2, rewards: { exp: 1344 }, steps: [createKillMonsterStep(33011, 9)]},

		2210100: { group: 21101, level: 16, grade: 2, weight: 2, rewards: { exp: 1000, table: 4000073 }, steps: [createCollectStep(33017, 140017, 9, 85)]},
		2210101: { group: 21101, level: 16, grade: 2, weight: 2, rewards: { exp: 1000, table: 4000073 }, steps: [createCollectStep(33017, 140017, 9, 85)]},
		2210200: { group: 21101, level: 16, grade: 2, weight: 2, rewards: { exp: 1000, table: 4000073 }, steps: [createCollectStep(33006, 140006, 9, 85)]},
		2210201: { group: 21101, level: 16, grade: 2, weight: 2, rewards: { exp: 1000, table: 4000073 }, steps: [createCollectStep(33006, 140006, 9, 85)]},
		2210300: { group: 21101, level: 16, grade: 2, weight: 2, rewards: { exp: 1000, table: 4000073 }, steps: [createCollectStep(33026, 140026, 9, 85)]},
		2210301: { group: 21101, level: 16, grade: 2, weight: 2, rewards: { exp: 1000, table: 4000073 }, steps: [createCollectStep(33026, 140026, 9, 85)]},
		2210400: { group: 21101, level: 16, grade: 2, weight: 2, rewards: { exp: 1000, table: 4000073 }, steps: [createCollectStep(32001, 140057, 9, 85)]},
		2210401: { group: 21101, level: 16, grade: 2, weight: 2, rewards: { exp: 1000, table: 4000073 }, steps: [createCollectStep(32001, 140057, 9, 85)]},
		2210501: { group: 21101, level: 16, grade: 3, weight: 4, rewards: { exp: 1200, table: 4000064 }, steps: [createCollectStep(33018, 140018, 12, 85)]},
		2210502: { group: 21101, level: 16, grade: 2, weight: 2, rewards: { exp: 1120, table: 4000073 }, steps: [createCollectStep(33018, 140018, 9, 85)]},
		2210601: { group: 21101, level: 16, grade: 4, weight: 3, rewards: { exp: 1375, table: 4000055 }, steps: [createCollectStep(33008, 140008, 15, 85)]},
		2210602: { group: 21101, level: 16, grade: 2, weight: 2, rewards: { exp: 1120, table: 4000073 }, steps: [createCollectStep(33008, 140008, 9, 85)]},
		2210701: { group: 21101, level: 16, grade: 5, weight: 1, rewards: { exp: 1562, table: 4000046 }, steps: [createCollectStep(33027, 140027, 18, 85)]},
		2210702: { group: 21101, level: 16, grade: 2, weight: 2, rewards: { exp: 1120, table: 4000073 }, steps: [createCollectStep(33027, 140027, 9, 85)]},
		2210801: { group: 21101, level: 16, grade: 3, weight: 4, rewards: { exp: 1200, table: 4000064 }, steps: [createCollectStep(33011, 140011, 12, 85)]},
		2210802: { group: 21101, level: 16, grade: 2, weight: 2, rewards: { exp: 1120, table: 4000073 }, steps: [createCollectStep(33011, 140011, 9, 85)]},

		2300001: { group: 21400, level: 16, grade: 2, weight: 20, rewards: { exp: 1562, stones: 3600 }, steps: [createGiveItemStep(141013, 1)]},
		2300002: { group: 21400, level: 16, grade: 2, weight: 20, rewards: { exp: 1750, stones: 4049 }, steps: [createGiveItemStep(141013, 1)]},

		2300101: { group: 21401, level: 16, grade: 2, weight: 2, rewards: { exp: 800, stones: 1747 }, steps: [createGiveItemStep(141012, 1)]},
		2300102: { group: 21401, level: 16, grade: 2, weight: 2, rewards: { exp: 896, stones: 1965 }, steps: [createGiveItemStep(141012, 1)]},
		2300201: { group: 21401, level: 16, grade: 2, weight: 2, rewards: { exp: 800, stones: 1747 }, steps: [createGiveItemStep(141012, 1)]},
		2300202: { group: 21401, level: 16, grade: 2, weight: 2, rewards: { exp: 896, stones: 1965 }, steps: [createGiveItemStep(141012, 1)]},
		2300301: { group: 21401, level: 16, grade: 2, weight: 2, rewards: { exp: 800, stones: 1747 }, steps: [createGiveItemStep(141012, 1)]},
		2300302: { group: 21401, level: 16, grade: 2, weight: 2, rewards: { exp: 896, stones: 1965 }, steps: [createGiveItemStep(141012, 1)]},
		2300401: { group: 21401, level: 16, grade: 2, weight: 2, rewards: { exp: 800, stones: 1747 }, steps: [createGiveItemStep(141012, 1)]},
		2300402: { group: 21401, level: 16, grade: 2, weight: 2, rewards: { exp: 896, stones: 1965 }, steps: [createGiveItemStep(141012, 1)]},
		2300501: { group: 21401, level: 16, grade: 3, weight: 4, rewards: { exp: 960, stones: 1764 }, steps: [createGiveItemStep(141012, 1)]},
		2300502: { group: 21401, level: 16, grade: 3, weight: 4, rewards: { exp: 1075, stones: 1985 }, steps: [createGiveItemStep(141012, 1)]},
		2300601: { group: 21401, level: 16, grade: 3, weight: 4, rewards: { exp: 960, stones: 1764 }, steps: [createGiveItemStep(141012, 1)]},
		2300602: { group: 21401, level: 16, grade: 3, weight: 4, rewards: { exp: 1075, stones: 1985 }, steps: [createGiveItemStep(141012, 1)]},
		2300701: { group: 21401, level: 16, grade: 4, weight: 3, rewards: { exp: 1100, stones: 1782 }, steps: [createGiveItemStep(141012, 1)]},
		2300702: { group: 21401, level: 16, grade: 4, weight: 3, rewards: { exp: 1232, stones: 2004 }, steps: [createGiveItemStep(141012, 1)]},
		2300801: { group: 21401, level: 16, grade: 5, weight: 1, rewards: { exp: 1250, stones: 1800 }, steps: [createGiveItemStep(141012, 1)]},
		2300802: { group: 21401, level: 16, grade: 5, weight: 1, rewards: { exp: 1400, stones: 2024 }, steps: [createGiveItemStep(141012, 1)]},

		2310101: { group: 21201, level: 16, grade: 4, weight: 30, rewards: { exp: 1100, table: 4000010 }, steps: [createTalkStep(11001)]},
	}
}

// 26303 -> requires collect item 141007 -> which is dropped from table 1000500 which is dropped by npc n310010 who is on the ticket boss npc table which requires i150078 which is the demon proof but isn't dropped anywherE??, 141008 and 141009
// gives i150316 which contains gems