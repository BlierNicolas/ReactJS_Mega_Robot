// import React from 'react'
// import cookie from 'react-cookies';
// import { auth, provider } from '../firebase.js';
// import 'firebase/database';
// import 'firebase/auth';
// import firebase from 'firebase/app';

// // class MrManager extends React {
// // 	constructor(props) {
// // 		super(props);

// // 		this.login = this.login.bind(this);
// // 		this.logout = this.logout.bind(this);
// // 		// this.createMember = this.createMember.bind(this, 'idUser', 'Parameter', 'Parameter');
// // 		// this.createArmor = this.createArmor.bind(this);

// // 		this.state = {
// // 			user: null,
// // 			usersIndiv: [],
// // 			idUser: null
// // 		};

// // 		this.userData = [];

// // 		firebase.auth().onAuthStateChanged(user => {
// // 			if (user) {
// // 				//console.log(firebase.auth().currentUser);
// // 				this.setState({ user: firebase.auth().currentUser })
// // 				this.checkAccount();
// // 			}
// // 		});
// // 	}

// // 	render() {
// // 		return (
// // 			<div></div>
// // 		);
// // 	}
// // }

// export var login = () => {
// 	if (typeof window !== "undefined") {

// 		auth.signInWithPopup(provider)
// 			.then((result) => {
// 				const user = result.user;
				
// 				console.log("Login done!")

// 				localStorage.setItem('user_connect', user, { path: '/' });
// 				checkAccount();

// 				console.log("User " + user);
// 				// console.log("UserData " + this.userData)
// 				//this.state.user && this.userData à retourner
// 				return  {
// 					user: user
// 				}
// 			});
// 	}
// }

// export const logout = () => {
// 	if (typeof window !== "undefined") {
// 		auth.signOut()
// 			.then(() => {
// 				this.setState({
// 					user: null
// 				});
// 				localStorage.setItem('user_connect', "vide", { path: '/' });

// 				window.location.reload();
// 			});
// 	}
// }

// const checkAccount = () => {
// 	let userFound = false;
// 	let scanDone = false;
// 	if (typeof window !== "undefined") {
// 		if (this.state.user !== null) {
// 			let listUsers = firebase.database().ref('mr_users');
// 			listUsers.on('value', (snapshot) => {
// 				let usersIndiv = snapshot.val();
// 				// let newState = [];
// 				for (let item in usersIndiv) {
// 					if (usersIndiv[item].user === this.state.user.email) {
// 						this.userData = usersIndiv[item];

// 						this.props.getUserData(this.userData);
// 						this.props.getUser(this.state.user);

// 						this.setState({ idUser: item });
// 						// newState.push({
// 						// 	id: item,
// 						// 	user: this.state.user.email,
// 						// 	ferraille: usersIndiv[item].ferraille,
// 						// 	prestige: usersIndiv[item].prestige,
// 						// 	fightWin: usersIndiv[item].fightWin,
// 						// 	fightLose: usersIndiv[item].fightLose,
// 						// 	username: usersIndiv[item].username,
// 						// 	isArmorGen: usersIndiv[item].isArmorGen
// 						// });
// 						//console.log("User trouvé")
// 						//console.log(item)
// 						userFound = true;
// 						checkArmor(item);

// 						usersIndiv[item].isArmorGen = true;

// 						//console.log(item);
// 						var updates = {}
// 						updates['/mr_users/' + item] = usersIndiv[item]

// 						firebase.database().ref().update(updates);
// 					}
// 				}

// 				scanDone = true

// 				if (!this.state.loaded) { this.setState({ loaded: true }); }
// 			})

// 			if (!userFound && scanDone) {
// 				const newUser = {
// 					user: this.state.user.email,
// 					username: this.state.user.displayName,
// 					ferraille: 0,
// 					prestige: 0,
// 					fightWin: 0,
// 					fightLose: 0,
// 					isArmorGen: false
// 				}

// 				listUsers.push(newUser);
// 				userFound = true;
// 				//console.log("New user créé")
// 				checkArmor();
// 			}
// 		}
// 	}
// }

// const checkArmor = (idUser) => {
// 	if (!this.userData.isArmorGen) {
// 		//console.log(idUser)
// 		createMember(idUser, "Bras Gauche", "Eau")
// 		createMember(idUser, "Bras Droit", "Feu")
// 		createMember(idUser, "Casque", "Neutre")
// 		createMember(idUser, "Jambes", "Terre")

// 		let idBrasGauche = ""
// 		let idBrasDroit = ""
// 		let idCasque = ""
// 		let idJambes = ""
// 		let idFound = 0

// 		let listMembers = firebase.database().ref('mr_member');
// 		listMembers.on('value', (snapshot) => {
// 			let memberIndiv = snapshot.val();
// 			for (let item1 in memberIndiv) {
// 				if (memberIndiv[item1].userId === idUser) {
// 					if (memberIndiv[item1].nom === "Bras Gauche") { idBrasGauche = item1; console.log(idBrasGauche); idFound++ }
// 					if (memberIndiv[item1].nom === "Bras Droit") { idBrasDroit = item1; console.log(idBrasDroit); idFound++ }
// 					if (memberIndiv[item1].nom === "Casque") { idCasque = item1; console.log(idCasque); idFound++ }
// 					if (memberIndiv[item1].nom === "Jambes") { idJambes = item1; console.log(idJambes); idFound++ }
// 					if (idFound === 4) { this.createArmor(idUser, idBrasGauche, idBrasDroit, idCasque, idJambes) }
// 				}
// 			}
// 		})

// 	}
// }

// const createMember = (idUser, nomMembre, elementMembre) => {
// 	let listMembres = firebase.database().ref('mr_member');

// 	const newMember = {
// 		userId: idUser,
// 		nom: nomMembre,
// 		vie: 10,
// 		tier: "A",
// 		niveau: 1,
// 		experience: 0,
// 		element: elementMembre,
// 		isLock: true,
// 		ameliorationPoint: 0,
// 		bonus1: null,
// 		bonus2: null,
// 		eau1: 0,
// 		eau2: 0,
// 		eau3: 0,
// 		feu1: 0,
// 		feu2: 0,
// 		feu3: 0,
// 		terre1: 0,
// 		terre2: 0,
// 		terre3: 0,
// 		neutre1: 0
// 	}
// 	//console.log(newMember.nom)
// 	listMembres.push(newMember)
// }

// const createArmor = (idUser, idBrasGauche, idBrasDroit, idCasque, idJambes) => {
// 	let listArmures = firebase.database().ref('mr_armor');

// 	const newArmure = {
// 		userId: idUser,
// 		nom: "Armure de base",
// 		idBrasGauche: idBrasGauche,
// 		idBrasDroit: idBrasDroit,
// 		idCasque: idCasque,
// 		idJambes: idJambes
// 	}

// 	//console.log(newArmure)
// 	listArmures.push(newArmure)
// }