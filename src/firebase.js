import firebase from 'firebase/app';
import 'firebase/auth';

const config = {
	apiKey: "AIzaSyDN76_Af2ZvRy8KHQLd9XbhusfWkLV5Adg",
	authDomain: "venatusuniverse-1f10d.firebaseapp.com",
	databaseURL: "https://venatusuniverse-1f10d.firebaseio.com",
	projectId: "venatusuniverse-1f10d",
	storageBucket: "venatusuniverse-1f10d.appspot.com",
	messagingSenderId: "948799971419",
};
if (!firebase.apps.length) {
	firebase.initializeApp(config);
}

var prov = "";
if (typeof window !== "undefined") {prov = new firebase.auth.GoogleAuthProvider();}
//provider.getCredential(null, null);

var aut = "";
if (typeof window !== "undefined") {aut = firebase.auth();}

export const provider = prov;
export const auth = aut;
export default firebase;