/**
 * Fichier définissant le schéma Mongoose d'un `contact`
 */

const mongoose = require('mongoose')

// Mongoose permet d'utiliser des Promesses JavaScript. On lui précise qu'on souhaite utiliser les promesses natives de Node.js
mongoose.Promise = global.Promise

// Raccourci vers le type `ObjectId`
const ObjectId = mongoose.Schema.Types.ObjectId;

// Création d'un nouveau Schema mongoose : ce schéma permettra d'indiquer à mongoose quelle doit être la structure d'un document `contact` qui entre dans la base.
// C'est un peut comme définir les champs d'une table avec MySQL et phpMyAdmin
const contactSchema = mongoose.Schema({
	'_id'       : {type : ObjectId, required : true, index : true, auto: true},
	'firstname' : {type : String, required : true},
	'lastname'  : {type : String, required : true},
	'email'     : {type : String, required : true},
	'twitter'   : {type : String},
	'phone'     : {type : String},
	'photo'     : {type : String},
	'city'      : {type : String, required : true},
	'state'     : {type : String, required : true}
}, {collection : 'contacts', versionKey : false}) // Indique que la collection de données s'appelle également `contacts`

// Et sur la base de ce schéma, on exporte un nouveau modèle Mongoose qui permettra de manipuler et créer des documents de type `contact` dans la base
module.exports = mongoose.model('Contact', contactSchema)
