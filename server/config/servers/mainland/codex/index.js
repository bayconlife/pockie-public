function formatDropTable(table) {
	const ids = [];

	Object.keys(table).forEach(tableId => {
		table[tableId].items.forEach(row => {
			ids.push(row[0]);
		})
	});

	return [...new Set(ids)];
}


module.exports = {
	PetTracing: formatDropTable(require('../dropTables/petTracing')),
	Tasks: formatDropTable(require('../dropTables/dailyTasks')),
	TicketBoss: formatDropTable(require('../dropTables/ticketBoss')),
}