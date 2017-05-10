/**
 * Fichier principal de l'application serveur
 */

// Récupération des dépendances
const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')

// Création d'une application Express
const app = express()

// Ce middleware va remplir l'objet "request.body" pour toutes les requêtes POST/PUT qui passent sur /api/**
app.use('/api', bodyParser())

// Récupération du module qui exporte les 5 fonctions de notre application (listée ci-après)
const contact = require('./contact.controller');

// Création des routes pour notre application
app.get('/api/contacts', contact.findAll) // Liste tous les contacts de la base de données Mongo
app.get('/api/contact/:id', contact.findById) // Affiche un contact précis
app.post('/api/contacts', contact.add) // Crée un nouveau contact dans la base Mongo
app.put('/api/contact/:id', contact.update) // Modifie un contact existant dans la base Mongo
app.delete('/api/contact/:id', contact.remove) // Supprime un contact existant


app.use(express.static(path.join(__dirname, 'client'))) // Permet de servir par défaut l'application AngularJS se trouvant dans le dossier /client/
app.use('/lib', express.static(path.join(__dirname, 'node_modules'))) // Redirige toutes les requêtes faites de /lib vers le dossier /node_modules

// Connexion à la base de données Mongo, et lancement du serveur
require('./db')()
	.then(() => console.log('Connexion établie avec la base MongoDB')) // La promesse a été résolue
	.then(() => {
		app.listen(1337, () => console.log('Le serveur écoute sur le port 1337 ...'))
	})
