import React from 'react'
// import Link from 'gatsby-link'
import { connect } from 'react-redux'
import {
	// Button,
	Card,
	CardTitle,
	CardText
} from 'reactstrap';
import cookie from 'react-cookies';
import lang_fr from '../langues/lang_fr.json';
import lang_en from '../langues/lang_en.json';
// import { auth, provider } from '../firebase.js';
import 'firebase/database';
import 'firebase/auth';
import firebase from 'firebase/app';
import { chargeUserData } from '../state/app';

class ArmorDisplayMember extends React.Component {
	constructor(props) {
		super(props)

		/** Buffer de la langue par défaut */
		this.lang = lang_fr;

		/** Trouve la bonne langue */
		if (this.props.lang === "fr-CA") { this.lang = lang_fr; }
		if (this.props.lang === "en-US") { this.lang = lang_en; }

		this.state = {
			loaded: false,
			isAuth: false
		};
	}

	componentDidMount() {
		if (cookie.load('lecteur_connect') !== "vide") {
			this.setState({ isAuth: true })
		}
	}

	checkAccount() {
		if (typeof window !== "undefined") {
			if (this.props.user !== null) {
				let listUsers = firebase.database().ref('mr_users');
				if (!this.state.loaded) {
					listUsers.on('value', (snapshot) => {
						let usersIndiv = snapshot.val();
						let userFound = false;
						for (let item in usersIndiv) {
							if (!userFound) {
								if (usersIndiv[item].user === this.props.user.email) {
									this.props.dispatch(chargeUserData(usersIndiv[item]))
									//console.log("User trouvé")
									userFound = true;
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
				<Card body>
					<CardTitle>[nom] [tier]</CardTitle>
					<CardText>
						Élément: [element]<br />
						Niveau: [niveau]<br />
						Expérience: [experience]/([niveau*10+10])<br />
						Vie: [vie] <br />
						Points d'amelioration: [ameliorationPoint] <br />
						Bonus 1: [bonus1]<br />
						Bonus 2: [bonus2]
					</CardText>
					{/* <Button>Changer pour un autre membre</Button> */}
				</Card>
			</div>
		);
	}
}

export default connect(state => ({
	user: state.app.user,
	userData: state.app.userData
}), null)(ArmorDisplayMember)