import React from 'react'
// import Link from 'gatsby-link'
import { connect } from 'react-redux'
import {
	// Button,
	Card,
	CardTitle,
	CardText
} from 'reactstrap';
import lang_fr from '../langues/lang_fr.json';
import lang_en from '../langues/lang_en.json';
// import { auth, provider } from '../firebase.js';
import 'firebase/database';
import 'firebase/auth';

class ArmorDisplayMember extends React.Component {
	constructor(props) {
		super(props)

		/** Buffer de la langue par défaut */
		this.lang = lang_fr;

		/** Trouve la bonne langue */
		if (this.props.lang === "fr-CA") { this.lang = lang_fr; }
		if (this.props.lang === "en-US") { this.lang = lang_en; }

		this.membre = undefined
	}

	render() {
		return (
			<div>
				<Card body className="text-center">
					{
						this.props.membre !== undefined ?
							(<>
								<CardTitle>{this.props.membre.nom + " Tier: " + this.props.membre.tier}</CardTitle>
								<CardText>
									Élément: {this.props.membre.element}<br />
									Niveau: {this.props.membre.niveau}<br />
									Expérience: {this.props.membre.experience}/{(this.props.membre.niveau-1)*10+10}<br />
									Vie: {this.props.membre.vie} <br />
									Points d'amelioration: {this.props.membre.ameliorationPoint}
								</CardText>
							</>) :
							('')
					}
					{/* <Button>Changer pour un autre membre</Button> */}
				</Card>
			</div>
		);
	}
}

export default connect(state => ({
	user: state.app.user,
	userData: state.app.userData,
	userArmor: state.app.userArmor
}), null)(ArmorDisplayMember)