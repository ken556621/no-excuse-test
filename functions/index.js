const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const fetch = require('node-fetch');
const app = express();

const serviceAccount = require("./no-excuse-1579439547243-firebase-adminsdk-5kbyo-351635ddfa");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://no-excuse-1579439547243.firebaseio.com"
});

app.get('/test', (req, res) => {
    res.send('test success!')
});

exports.createUser = functions.https.onRequest((req, res) => {
    res.send('test');
});

exports.getMapData = functions.https.onRequest((req, res) => {
    const db = admin.firestore();
    fetch('https://maps.googleapis.com/maps/api/place/textsearch/json?query=basketball&location=121,25&radius=50000&key=AIzaSyAOCD6zBK2oD6Lrz3gN5zNxM-GNDatpE-o')
    .then(res => res.json())
    .then(data => {
        data.results.forEach(place => {
            //check if place exist, prevent duplicated storage
            const docRef = db.collection("locations").doc(place.id);

            docRef.get().then(function(doc) {
                if (doc.exists) {
                    console.log("Document data is existed:", doc.data());
                } else {
                    // doc.data() will be undefined in this case
                    console.log("No such document!");
                    //store db
                    db.collection("locations").doc(place.id).set({
                        id: place.id,
                        name: place.name,
                        address: place.formatted_address,
                        photo: place.photos[0].photo_reference,
                        location: new admin.firestore.GeoPoint(place.geometry.location.lat, place.geometry.location.lng),
                        global_code: place.plus_code.global_code,
                        compound_code: place.plus_code.compound_code
                    })
                    .then(function() {
                        console.log("Document successfully written!");
                    })
                    .catch(function(error) {
                        console.error("Error writing document: ", error);
                    });
                }
            }).catch(function(error) {
                console.log("Error getting document:", error);
            });
        })
        res.send(data);
    });
});



exports.api = functions.https.onRequest(app);


