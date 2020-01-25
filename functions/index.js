const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();


exports.helloWorld = functions.https.onRequest((req, res) => {
    res.send('hello world')
});

exports.auth = functions.https.onRequest((req, res) => {
    const userInfo = {
        userEmail: req.body.email,
        userPassword: req.body.password
    };
    const email = userInfo.userEmail;
    const password = userInfo.userPassword;
    res.send(req.body);  
});

exports.createUser = functions.https.onRequest((req, res) => {
    admin.auth().createUser({
        email: 'user@example.com',
        emailVerified: false,
        phoneNumber: '+11234567890',
        password: 'secretPassword',
        displayName: 'John Doe',
        photoURL: 'http://www.example.com/12345678/photo.png',
        disabled: false
      })
        .then(function(userRecord) {
          // See the UserRecord reference doc for the contents of userRecord.
          console.log('Successfully created new user:', userRecord.uid);
      })
        .catch(function(error) {
          console.log('Error creating new user:', error);
      });
      res.send(req);
});


