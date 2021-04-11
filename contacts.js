const fs = require("fs").promises;
const path = require("path");
const shortid = require("shortid");
const { handleError } = require("./lib/handleerror");

const contactsPath = path.join("db", "contacts.json");
const readContacts = () =>
	fs.readFile(contactsPath).then((data) => JSON.parse(data.toString()));

// TODO: задокументировать каждую функцию
async function listContacts() {
	try {
		const contacts = await readContacts();
		console.table(contacts);
	} catch (error) {
		handleError(error);
	}
}

async function getContactById(contactId) {
	try {
		const contacts = await readContacts();
		const conditionId = Number(contactId) || contactId;
		const findContact = contacts.find((contact) => contact.id === conditionId);
		if (!findContact) {
			console.warn(`\x1B[31mId ${contactId} not found`);
			return;
		}
		console.table(findContact);
	} catch (error) {
		handleError(error);
	}
}

async function removeContact(contactId) {
	try {
		const contacts = await readContacts();
		const conditionId = Number(contactId) || contactId;
		const checkId = contacts.find((contact) => contact.id === conditionId);

		if (!checkId) {
			console.warn(`\x1B[31mId ${contactId} not found`);
			return;
		}
		const deleteContact = contacts.filter(
			(contact) => contact.id !== conditionId
		);
		await fs.writeFile(contactsPath, JSON.stringify(deleteContact));
	} catch (error) {
		handleError(error);
	}
}

async function addContact(contact) {
	try {
		const contacts = await readContacts();
		contact.id = shortid();
		contacts.push(contact);
		await fs.writeFile(contactsPath, JSON.stringify(contacts));
	} catch (error) {
		handleError(error);
	}
}

module.exports = {
	listContacts,
	getContactById,
	removeContact,
	addContact,
};
