const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const fetch = require('node-fetch');
const app = express();

admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    databaseURL: "https://no-excuse-1579439547243.firebaseio.com"
});

app.get('/test', (req, res) => {
    res.send('test success!')
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
    res.send('test');
});

exports.getMapData = functions.https.onRequest((req, res) => {
    const db = admin.firestore();
    fetch('https://maps.googleapis.com/maps/api/place/textsearch/json?query=basketball&location=121,25&radius=10000&key=AIzaSyAOCD6zBK2oD6Lrz3gN5zNxM-GNDatpE-o')
    .then(res => res.json())
    .then(data => {
        // data.results.forEach(place => {
        //     //存入 DB
        //     db.collection("locations").doc(place.id).set({
        //         id: place.id,
        //         name: place.name,
        //         address: place.formatted_address,
        //         lat: place.geometry.location.lat,
        //         lng: place.geometry.location.lng,
        //         global_code: place.plus_code.global_code
        //     })
        //     .then(function() {
        //         console.log("Document successfully written!");
        //     })
        //     .catch(function(error) {
        //         console.error("Error writing document: ", error);
        //     });
        // })
        db.collection("users").doc().get().then(doc => {
            if (doc.exists) {
                console.log("Document data:", doc.data());
            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }
        }).catch(function(error) {
            console.log("Error getting document:", error);
        });
        res.send(data);
    });
    // axios.get(`https://us-central1-no-excuse-1579439547243.cloudfunctions.net/createUser
    // `).then(data => {
    //         data.results.forEach(place => {
    //                 //存入 DB
    //             admin.collection("locations").doc(place.id).set({
    //                 id: place.id,
    //                 name: place.name,
    //                 address: place.formatted_address,
    //                 lat: place.geometry.location.lat,
    //                 lng: place.geometry.location.lng,
    //                 global_code: place.plus_code.global_code
    //             })
    //             .then(function() {
    //                 console.log("Document successfully written!");
    //             })
    //             .catch(function(error) {
    //                 console.error("Error writing document: ", error);
    //             });
    //         })
    //         res.json(data);
    //     }).catch(err => console.log(err));
});



exports.api = functions.https.onRequest(app);


