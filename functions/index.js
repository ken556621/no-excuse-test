const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const fetch = require('node-fetch');
const app = express();
const geohash = require('ngeohash');
const cors = require('cors')({origin: true});

const serviceAccount = require("./no-excuse-1579439547243-firebase-adminsdk-5kbyo-351635ddfa");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://no-excuse-1579439547243.firebaseio.com"
});

exports.getMapData = functions.https.onRequest((req, res) => {
    const db = admin.firestore();
    fetch('https://maps.googleapis.com/maps/api/place/textsearch/json?query=basketball&location=24.9936185,121.5022254&radius=10000&key=AIzaSyAOCD6zBK2oD6Lrz3gN5zNxM-GNDatpE-o')
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
                    console.log("No such document!", doc.data());
                    //store db
                    db.collection("locations").doc(place.id).set({
                        id: place.id,
                        name: place.name,
                        address: place.formatted_address,
                        photo: place.photos[0].photo_reference,
                        location: new admin.firestore.GeoPoint(place.geometry.location.lat, place.geometry.location.lng),
                        global_code: place.plus_code.global_code,
                        compound_code: place.plus_code.compound_code,
                        store_time: new Date()
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
        return cors(request, response, () => {
            return response.status(200).send(data);
        })
    });
});

exports.getGymDataFromLocal = functions.https.onRequest((req, res) => {
    const db = admin.firestore();
    const origin_URL = "https://iplay.sa.gov.tw/api/GymSearchAllList?$format=application/json;odata.metadata=none&Keyword=信義區&City=臺北市&GymType=籃球場&Latitude=22.6239746&Longitude=120.305267"; 
    process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
    const encoded_URL = encodeURI(origin_URL); 
    fetch(encoded_URL)
    .then(res => res.json())
    .then(data => {
        data.forEach(place => {
            let lat = place.LatLng.split(',')[0];
            let lng = place.LatLng.split(',')[1];

            const docRef = db.collection("locations").doc("local" + place.GymID);

            //prevent duplicated
            docRef.get().then((doc) => {
                if (doc.exists) {
                    console.log("Document data:", doc.data());
                } else {
                    console.log("No such document!");
                    db.collection("locations").doc("local" + place.GymID).set({
                        id: "local" + place.GymID,
                        name: place.Name,
                        address: place.Address,
                        phone: place.OperationTel,
                        photo: place.Photo1,
                        category: place.GymFuncList,
                        rentState: place.RentState,
                        openState: place.OpenState,
                        detail: place.Declaration,
                        placeStatus: place.LandAttrName,
                        location: new admin.firestore.GeoPoint(Number(lat), Number(lng)),
                        geoHash: geohash.encode(Number(lat), Number(lng)),
                        store_time: new Date()
                    }).then(() => {
                        console.log("Document successfully written!");
                    }).catch((error) => {
                        console.error("Error writing document: ", error);
                    });
                }
            }).catch((error) => {
                console.log("Error getting document:", error);
            });
        
        })
        return cors(request, response, () => {
            return response.status(200).send(data);
        })
    }).catch(err => console.log(err));
});



