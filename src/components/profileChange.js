// import React from 'react'
// // import Link from 'gatsby-link'
// import {
// 	Form,
// 	FormGroup,
// 	Label,
// 	Input,
// 	Button
// } from 'reactstrap';
// import lang_fr from '../langues/lang_fr.json';
// import lang_en from '../langues/lang_en.json';
// // import { auth, provider } from '../firebase.js';
// import 'firebase/database';
// import 'firebase/auth';
// import firebase from 'firebase/app';
// import { isNullOrUndefined } from 'util';

// export default class ProfileChange extends React.Component {
// 	constructor(props) {
// 		super(props)

// 		/** Buffer de la langue par défaut */
// 		this.lang = lang_fr;

// 		/** Trouve la bonne langue */
// 		if (this.props.lang === "fr-CA") { this.lang = lang_fr; }
// 		if (this.props.lang === "en-US") { this.lang = lang_en; }

// 		this.state = {
// 			user: null,
// 			usersIndiv: [],
// 			loaded: false,
// 			username: "",
// 			newUsername: ""
// 		};

// 		this.userData = [];

// 		firebase.auth().onAuthStateChanged(user => {
// 			// currentUser is ready now.
// 			if (user) {
// 				//console.log(firebase.auth().currentUser);
// 				this.setState({ user: firebase.auth().currentUser })
// 				this.checkAccount();
// 				// User signed in. You can also access from firebase.auth().currentUser.
// 			} else {
// 				// User signed out.
// 			}
// 		});

// 		this.newUsernameInput = React.createRef();

// 		this.handleChangeUsername = this.handleChangeUsername.bind(this);
// 		this.handleSubmit = this.handleSubmit.bind(this);
// 	}

	

	

// 	render() {
// 		return (
// 			<div>
// 				<Form onSubmit={this.handleSubmit}>
// 					<FormGroup>
// 						Pseudo actuel: {this.state.username}
// 					</FormGroup>
// 					<FormGroup>
// 						<Label for="newUsername">Nouveau pseudo</Label>
// 						<Input type="text" name="newUsername" id="newUsername" placeholder="Nouveau pseudo" onChange={this.handleChangeUsername} ref={this.newUsernameInput} />
// 					</FormGroup>
// 					<Button>Changer de pseudo</Button>
// 				</Form>
// 			</div>
// 		);
// 	}
// }