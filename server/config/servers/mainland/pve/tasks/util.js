const QuestType = {
	Collect: 1,
	Kill: 2,
	Talk: 3,
	GiveItem: 6
};

module.exports = {
	QuestType,
	createCollectStep: (monster, item, amount, rate) => {
		return { type: 1, monster, item, amount, rate, current: 0 }
	},
	createGiveItemStep: (item, amount) => {
		return { type: QuestType.GiveItem, item, amount };
	},
	createKillMonsterStep: (monster, amount) => {
		return { type: QuestType.Kill, monster, amount, current: 0 };
	},
	createTalkStep(npc) {
		return { type: QuestType.Talk, npc };
	}
}
