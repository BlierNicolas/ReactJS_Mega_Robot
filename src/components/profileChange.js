import React from 'react'
// import Link from 'gatsby-link'
import {
	Form,
	FormGroup,
	Label,
	Input,
	Button
} from 'reactstrap';
import lang_fr from '../langues/lang_fr.json';
import lang_en from '../langues/lang_en.json';
// import { auth, provider } from '../firebase.js';
import 'firebase/database';
import 'firebase/auth';
import firebase from 'firebase/app';
import { isNullOrUndefined } from 'util';

export default class ProfileChange extends React.Component {
	constructor(props) {
		super(props)

		/** Buffer de la langue par défaut */
		this.lang = lang_fr;

		/** Trouve la bonne langue */
		if (this.props.lang === "fr-CA") { this.lang = lang_fr; }
		if (this.props.lang === "en-US") { this.lang = lang_en; }

		this.state = {
			user: null,
			usersIndiv: [],
			loaded: false,
			username: "",
			newUsername: ""
		};

		this.userData = [];

		firebase.auth().onAuthStateChanged(user => {
			// currentUser is ready now.
			if (user) {
				//console.log(firebase.auth().currentUser);
				this.setState({ user: firebase.auth().currentUser })
				this.checkAccount();
				// User signed in. You can also access from firebase.auth().currentUser.
			} else {
				// User signed out.
			}
		});

		this.newUsernameInput = React.createRef();

		this.handleChangeUsername = this.handleChangeUsername.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleChangeUsername(e) {
		this.setState({ newUsername: e.target.value });
	}

	handleSubmit(e) {
		//alert('New username is: ' + this.state.newUsername);
		if (this.state.newUsername !== isNullOrUndefined) {
			let listUsers = firebase.database().ref('mr_users');
			listUsers.on('value', (snapshot) => {
				let usersIndiv = snapshot.val();
				let userFound = false;
				for (let item in usersIndiv) {
					if (!userFound) {
						if (usersIndiv[item].user === this.state.user.email) {
							//console.log(this.state.newUsername)
							usersIndiv[item].username = this.state.newUsername;

							//console.log(item);
							var updates = {}
							updates['/mr_users/' + item] = usersIndiv[item]

							firebase.database().ref().update(updates);
							//alert('Yeah, ' + usersIndiv[item].username)
						}
					}
				}

				if (!this.state.loaded) {
					this.setState({ loaded: true });
				}
			});
		}
		e.preventDefault();
		window.location.reload();
	}

	checkAccount() {
		if (typeof window !== "undefined") {
			if (this.state.user !== null) {
				let listUsers = firebase.database().ref('mr_users');
				if (!this.state.loaded) {
					listUsers.on('value', (snapshot) => {
						let usersIndiv = snapshot.val();
						let newState = [];
						let userFound = false;
						for (let item in usersIndiv) {
							if (!userFound) {
								if (usersIndiv[item].user === this.state.user.email) {
									newState.push({
										user: this.state.user.email,
										ferraille: usersIndiv[item].ferraille,
										prestige: usersIndiv[item].prestige,
										fightWin: usersIndiv[item].fightWin,
										fightLose: usersIndiv[item].fightLose,
										username: usersIndiv[item].username
									});
									//console.log("User trouvé")
									userFound = true;

									this.userData = usersIndiv[item]

									if (this.state.username === "") {
										this.setState({ username: this.userData.username })
									}

									this.props.callbackFromParent(this.userData.username)
								}
							}
						}

						if (!this.state.loaded) {
							this.setState({ loaded: true });
						}
					});
				}
				//console.log("loading done")
			}
		}
	}

	render() {
		return (
			<div>
				<Form onSubmit={this.handleSubmit}>
					<FormGroup>
						Pseudo actuel: {this.state.username}
					</FormGroup>
					<FormGroup>
						<Label for="newUsername">Nouveau pseudo</Label>
						<Input type="text" name="newUsername" id="newUsername" placeholder="Nouveau pseudo" onChange={this.handleChangeUsername} ref={this.newUsernameInput} />
					</FormGroup>
					<Button>Changer de pseudo</Button>
				</Form>
			</div>
		);
	}
}