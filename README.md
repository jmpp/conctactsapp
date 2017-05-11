# ContactsApp

Simple MEAN application for demo and learning purposes.

## Get started

1. Clone the repository : `git clone https://github.com/jmpp/contactsapp.git`
2. Go to application directory : `cd contactsapp`
3. Install dependencies : `npm install`
4. Import data in MongoDB database : `npm run dbinit` (this will create a `contacts` collection into the database `contacts`)
5. Start Mongo deamon : `mongod`
6. Run the application : `node index.js`

Then, navigate to `http://localhost:1337` to see your application.

--

*Note : You can drop the database by doing this shortcut : `npm run dbclean`*

![DEMO GIF](http://i.imgur.com/L03Xxmr.gif)
