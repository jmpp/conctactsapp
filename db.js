/**
 * Fichier permettant de se connecter à la base de données
 */

const mongoose = require('mongoose')

// Lance l'ouverture d'une connexion à MongoDB (par défaut sur le port localhost:27017, du coup inutile de le préciser ici)
// et ont précise qu'on veut utiliser la base de données appelée `contacts`
mongoose.connect('mongodb://localhost/contacts')

const db = mongoose.connection // Récupération de l'objet 'connection' de mongoose, grâce auquel on pourra savoir l'état de la connexion

// Export d'une fonction qui renvoie une promesse JavaScript :
// Cette promesse sera dite "rejetée" si un événement `error` se produit sur l'objet `db` => connexion à la base Mongo échouée
// Sinon, cette promesse sera "résolue" si un événement `open` se produit sur l'objet `db` => connexion à la base Mongo OK
module.exports = function() {
	return new Promise( (resolve, reject) => {
		db.on('error', () => reject(new Error('Impossible de se connecter à la base MongoDB `contacts`')))

		db.on('open', () => resolve(db))
	} )
}