const Type = {
	Level: 0,
	Location: 1,
}

const RewardType = {
	Title: 0
}

const data = {
	Type,
	RewardType,
	Achievements: {
		1: { requirements: [Type.Level, 20], rewards: [[RewardType.Title, 1]] },
		2: { requirements: [Type.Level, 30], rewards: [[RewardType.Title, 2]] },
		3: { requirements: [Type.Level, 40], rewards: [[RewardType.Title, 3]] },
		4: { requirements: [Type.Level, 50], rewards: [[RewardType.Title, 4]] },
	},
	AchievementsByType: {
		[Type.Level]: {},
		[Type.Location]: {},
	}
}

Object.keys(data.Achievements).forEach(id => {
	const requirements = data.Achievements[id].requirements;

	if (requirements[0] === Type.Level) {
		if (!(requirements[1] in data.AchievementsByType[Type.Location])) {
			data.AchievementsByType[Type.Level][requirements[1]] = [];
		}

		data.AchievementsByType[Type.Level][requirements[1]].push(Number(id));
	}

	if (requirements[0] === Type.Location) {
		if (!(requirements[1] in data.AchievementsByType[Type.Location])) {
			data.AchievementsByType[Type.Location][requirements[1]] = [];
		}

		data.AchievementsByType[Type.Location][requirements[1]].push(Number(id));
	}
});

module.exports = data;