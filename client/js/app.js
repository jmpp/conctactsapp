/**
 * Fichier de l'application AngularJS
 */

angular
	.module('ContactsApp', [])
	.controller('MainCtrl', ['$http', function ($http) {

		var main = this;

		// Liste de contacts
		main.contacts = [];

		// Contiendra le contact à éditer (ou un objet vide sinon)
		// Le formulaire d'ajout/modification est basé sur cet objet 'edit':
		//	-> donc si jamais cet objet contient des informations, le formulaire sera déjà pré-rempli (pour modifier un contact)
		// 	-> et sinon si c'est un objet vide, le formulaire sera vide (pour créer un nouveau contact)
		main.edit = {};

		/**
		 * Initialisation du controller avec la liste des contacts de l'API
		 */

		// Demande au serveur la liste de tous les contacts
		$http.get('/api/contacts')
			.then(function(response) {
				main.contacts = response.data; // Retour du serveur qu'on assigne dans notre tableau main.contacts pour l'application AngularJS
			});

		
		/**
		 * Supprime un contact
		 */

		main.remove = function(contact) {

			// Cette méthode reçoit de la part du HTML l'objet contact à supprimer.

			var index = main.contacts.indexOf(contact); // Recherche dans le tableau (au cas où)
			if (index > -1) {
				// Si on le trouve, on envoie une requete DELETE au serveur avec l'id du contact
				$http.delete('/api/contact/' + contact._id)
					.then(function() {
						// Si le serveur à répondu correctement, on termine ici par la suppression du contact dans notre tableau (ce qui le fait disparaître instantanément sous nos yeux)
						main.contacts.splice(index, 1);
					})
					.catch(function(err) {
						console.error(err)
					})
			} else {
				console.error('Contact non trouvé!');
			}
		};

		/**
		 * Validation du formulaire
		 */

		main.sendForm = function() {
			
			// Si en mode édition (cad que l'objet main.edit contient qqch)
			if (main.edit._id) {

				// On envoie une requête PUT à notre serveur disant qu'on souhaite modifier ce contact, avec l'objet du contact modifié : main.edit
				$http.put('/api/contact/' + main.edit._id, main.edit)
					.then(function() {
						main.edit = {}; // Le serveur a fait son boulot et tout s'est bien passé => on vide l'objet main.edit

						$('#formModal').modal('hide'); // Et on ferme la #formModal de bootstrap
					})
					.catch(function(err) {
						console.error(err);
					})
			
			} else { // Sinon si en mode ajout d'un nouveau contact

				// Envoie d'un POST à notre serveur, avec les infos du nouveau contact
				$http.post('/api/contacts', main.edit)
					.then(function(response) {
						
						// Récupération de l'ID créé par le serveur pour ce contact
						var insertedId = response.data.id;
						main.edit._id = insertedId; // Et assignation dans l'objet courant avant de l'ajouter au tableau
						
						// Si le serveur a répondu OK, on ajoute manuellement ce nouveau contact dans notre tableau main.contacts pour l'app AngularJS
						main.contacts.unshift(main.edit);

						main.edit = {}; // Le serveur a fait son boulot et tout s'est bien passé => on vide l'objet main.edit

						$('#formModal').modal('hide'); // Et on ferme la #formModal de bootstrap
					})
					.catch(function(err) {
						console.error(err);
					})

			}

		};


	}]);