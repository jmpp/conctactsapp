const mongoose = require('mongoose')

// Récupération du modèle Mongo qui représente les objets de type 'Contact' pour notre application.
// C'est grâce à ce modèle que l'on pourra créer de nouvelles entrées dans la base, et en modifier ou en supprimer.
const ContactModel = require('./contact.model')


/**
 * Liste tous les contacts de la base de données Mongo
 */
exports.findAll = function findAllContacts(req, res) {
	
	ContactModel
		.find({}) // ... va chercher tous les `contacts` présents dans la collection
		.sort({_id:1}) // ... trie dans un ordre décroissant avec l'_id
		.lean() // ... transforme en objet JSON pur (sans les trucs en plus de Mongoose)
		.exec() // ... exécute la requête
		.then(contacts => { // ... récupère les contacts au format JSON
			res.status(200).json(contacts) // ... et notre serveur Express répond au client avec cet objet
		})

}

/**
 * Affiche un contact précis
 */
exports.findById = function findContactById(req, res) {
	
	/* L'URL si on arrive sur cette route prend normalement la forme suivante :
			/api/contact/:id
			Grâce à Express, on peut récupérer cet :id dans l'objet req.params
			On vérifie donc avec la méthode isValid() de Mongoose que c'est un _id valide, et pas un truc bidon qu'aurait tapé un utilisateur (never trust user !)
			*/
	if (!mongoose.Types.ObjectId.isValid(req.params.id))
		return res.status(500).json({error: 1, message: 'Invalid ID'})

	// Si tout s'est bien passé, on va chercher dans la base Mongo le contact demandé
	ContactModel
		.findById(req.params.id) // ... recherche par identifiant
		.lean()
		.exec()
		.then(contact => {

			// Il est possible que l'utilisateur demandé n'ait pas été trouvé dans la base, auquel cas il faut le signaler au client
			if (null === contact)
				return res.status(500).json({error: 1, message:'User does not exists'})
			
			// Sinon, on le renvoie sous forme de JSON
			res.status(200).json(contact)
		})

}

/**
 * Crée un nouveau contact dans la base Mongo
 */
exports.add = function addContact(req, res) {
	
	// Ici, on a normalement affaire à une requête HTTP de type "POST", où le client à normalement envoyé les données de notre contact à créer en base.
	// Si il a bien fait son boulot, il devrait nous avoir envoyé tous les champs (firstname, lastname, ... etc) qui arrivent ici dans notre objet "req.body" (grâce au middleware bodyParser())

	// On tente donc de créer un nouveau modèle sur la base de ce qui se trouve dans req.body
	const newContact = new ContactModel(req.body);

	// ... et on tente de l'enregistrer en base
	newContact.save()
		.then(() => res.status(200).json({message:'Contact correctement ajouté !'}))  // Si tout s'est bien passé, alors c'est nickel
		.catch(err => res.status(500).json({error: 1, message: err})) // Sinon, c'est que le modèle a refusé la sauvegarde en base, on retourne donc l'erreur au client

}

/**
 * Modifie un contact existant dans la base Mongo
 */
exports.update = function updateContact(req, res) {
	
	// Même remarque que pour 'findById()' => on vérifie le format de l'id du contact à modifier
	if (!mongoose.Types.ObjectId.isValid(req.params.id))
		return res.status(500).json({error: 1, message:'Invalid ID'})

	// On tente de récupérer ce contact dans la base ...
	ContactModel
		.findById({_id:req.params.id})
		.exec()
		.then(contact => {

			// S'il n'a pas été trouvé, on renvoie une promesse échoué avec un message, qui sera "catché" plus bas
			if (!contact)
				return Promise.reject('Contact non trouvé')

			// Sinon, on modifie manuellement tous les champs de notre objet 'contact'
			contact.firstname = req.body.firstname || contact.firstname;
			contact.lastname  = req.body.lastname || contact.lastname;
			contact.email     = req.body.email || contact.email;
			contact.twitter   = req.body.twitter || contact.twitter;
			contact.phone     = req.body.phone || contact.phone;
			contact.photo     = req.body.photo || contact.photo;
			contact.city      = req.body.city || contact.city;
			contact.state     = req.body.state || contact.state;

			// Et on sauvegarde ces modifications via le modèle Mongoose
			return contact.save()
		})
		.then(() => res.status(200).json({message:'Contact correctement modifié'})) // Tout est OK, on répond au client avec un petit message de confirmation
		.catch(err => res.status(500).json({error: 1, message: err})) // Sinon, on lui retourne l'erreur

}

/**
 * Supprime un contact existant
 */
exports.remove = function removeContact(req, res) {

	// Encore une fois, on vérifie le format de l'id du contact que le client souhaite supprimer de la base...
	if (!mongoose.Types.ObjectId.isValid(req.params.id))
		return res.status(500).json({error: 1, message:'Invalid ID'})
	
	// Et via le modèle, on utilise une petite fonction préfabriquée 'findOneAndRemove' pour faire cela
	ContactModel
		.findOneAndRemove({_id:req.params.id})
		.exec()
		.then(() => res.status(200).json({message:'Contact correctement supprimé'}))
		.catch(err => res.status(500).json({error: 1, message: err}))
		
}