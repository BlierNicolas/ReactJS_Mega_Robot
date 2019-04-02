import React, { Component } from 'react'
import { graphql } from "gatsby";
import { connect } from 'react-redux'
import PropTypes from 'prop-types';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
	Container,
	Jumbotron,
	Row,
	Col
} from 'reactstrap';
import Header from '../components/header'
import Footer from '../components/footer'
import EquivURL from '../components/equivURL';
import FightDisplayMember from '../components/fightDisplayMember';
import Helmet from 'react-helmet'
import lang_fr from '../langues/lang_fr.json';
import lang_en from '../langues/lang_en.json';
import 'firebase/database';
import 'firebase/auth';
import firebase from 'firebase/app';
import { chargeUserData } from '../state/app';

import Layout from '../components/layout'

class CombatPage extends Component {
	constructor(props) {
		super(props);
		this.state = {
			currentItem: '',
			username: '',
			items: [],
			connectedUser: null,
			lecteur: "vide"
		}

		/** Buffer de la langue par défaut */
		this.lang = lang_fr;

		/** Trouve la bonne langue */
		if (this.props.pageContext.lang === "fr-CA") { this.lang = lang_fr; }
		if (this.props.pageContext.lang === "en-US") { this.lang = lang_en; }

		if (localStorage.getItem('user_connect') == null) {
			localStorage.setItem('user_connect', "vide");
		}

		if (localStorage.getItem('user_connect') !== "vide") {
			this.state.lecteur = localStorage.getItem('user_connect')
		}
	}

	componentDidMount() {
		if (localStorage.getItem('user_connect') !== "vide") {
			this.setState({ isAuth: true })
			this.checkAccount()
		}
	}

	checkAccount() {
		if (typeof window !== "undefined") {
			if (this.props.user !== null) {
				let listUsers = firebase.database().ref('mr_users');
				listUsers.on('value', (snapshot) => {
					let usersIndiv = snapshot.val();
					let userFound = false;
					for (let item in usersIndiv) {
						if (!userFound) {
							if (usersIndiv[item].user === this.props.user.email) {
								this.props.dispatch(chargeUserData(usersIndiv[item]))
								userFound = true;
								this.checkFight(item)
							}
						}
					}
				});
			}
		}
	}

	checkFight(idUser) {
		let userFound = false;
		if (typeof window !== "undefined") {
			if (this.props.user !== null) {
				let listUsers = firebase.database().ref('mr_fight');
				listUsers.on('value', (snapshot) => {
					let usersIndiv = snapshot.val();
					for (let item in usersIndiv) {
						if (!userFound) {
							if (usersIndiv[item].user === idUser) {
								//this.props.dispatch(chargeUserData(usersIndiv[item]))
								userFound = true;

							}
						}
					}
				})

				if (!userFound) {
					this.createFight(idUser)
				}
			}
		}
	}

	createFight(idUser) {
		if (this.props.userData !== null) {
			let listFights = firebase.database().ref('mr_fight');

			const minVieAdv = 11
			const maxVieAdv = 15
			const randVieAdv = Math.round(minVieAdv + Math.random() * (maxVieAdv - minVieAdv))

			const minIdElem = 1
			const maxIdElem = 4
			let randElemBrasGauche = Math.round(minIdElem + Math.random() * (maxIdElem - minIdElem))
			let randElemBrasDroit = Math.round(minIdElem + Math.random() * (maxIdElem - minIdElem))
			let randElemCasque = Math.round(minIdElem + Math.random() * (maxIdElem - minIdElem))
			let randElemJambes = Math.round(minIdElem + Math.random() * (maxIdElem - minIdElem))

			if (randElemBrasGauche === 1) { randElemBrasGauche = "Neutre" }
			else if (randElemBrasGauche === 2) { randElemBrasGauche = "Eau" }
			else if (randElemBrasGauche === 3) { randElemBrasGauche = "Feu" }
			else if (randElemBrasGauche === 4) { randElemBrasGauche = "Terre" }

			if (randElemBrasDroit === 1) { randElemBrasDroit = "Neutre" }
			else if (randElemBrasDroit === 2) { randElemBrasDroit = "Eau" }
			else if (randElemBrasDroit === 3) { randElemBrasDroit = "Feu" }
			else if (randElemBrasDroit === 4) { randElemBrasDroit = "Terre" }

			if (randElemCasque === 1) { randElemCasque = "Neutre" }
			else if (randElemCasque === 2) { randElemCasque = "Eau" }
			else if (randElemCasque === 3) { randElemCasque = "Feu" }
			else if (randElemCasque === 4) { randElemCasque = "Terre" }

			if (randElemJambes === 1) { randElemJambes = "Neutre" }
			else if (randElemJambes === 2) { randElemJambes = "Eau" }
			else if (randElemJambes === 3) { randElemJambes = "Feu" }
			else if (randElemJambes === 4) { randElemJambes = "Terre" }

			const newFight = {
				idUser: idUser,
				tourJoueur: 1,
				// -brasGaucheVie1
				brasGaucheVieAdv: randVieAdv,
				// -brasGaucheElement1
				brasGaucheElementAdv: randElemBrasGauche,
				// -brasDroitVie1
				brasDroitVieAdv: randVieAdv,
				// -brasDroitElement1
				brasDroitElementAdv: randElemBrasDroit,
				// -casqueVie1
				casqueVieAdv: randVieAdv,
				// -casqueElement1
				casqueElementAdv: randElemCasque,
				// -jambesVie1
				jambesVieAdv: randVieAdv,
				// -jambesElement1
				jambesElementAdv: randElemJambes
				// -premierMembreDetruitJoueur
			}

			//listFights.push(newFight)
		}
	}

	loadFight(idUser) {

	}

	render() {
		return (
			<Layout>
				<div id="page-wrapper">
					<Helmet title={this.lang.header_accueil + this.lang.meta_title}></Helmet>

					<Header lang={this.props.pageContext.lang} />

					<EquivURL url={this.lang.other_lang_url + "/"} label={this.lang.other_lang_label} />

					<Jumbotron fluid>
						<Container fluid className="p-0">
							<div className="pb-5">
								<Row>
									<Col lg="4" md="6" xs="12">
										<Row>
											<Col lg="6" xs="12">
												<FightDisplayMember />
											</Col>
											<Col lg="6" xs="12">Nom bras gauche</Col>
											<Col lg="6" xs="12">Nom bras droit</Col>
											<Col lg="6" xs="12">Nom jambes</Col>
										</Row>
									</Col>
									<Col lg="4" md="6" xs="12">
										Bouton d'attaque
									</Col>
									<Col lg="4" md="6" xs="12">
										Infos adversaire
									</Col>
								</Row>
							</div>
						</Container>
					</Jumbotron>



					<Footer lang={this.props.pageContext.lang} />
				</div >
			</Layout >
		)
	}
}

CombatPage.propTypes = {
	data: PropTypes.object.isRequired
}

export default connect(state => ({
	user: state.app.user,
	userData: state.app.userData,
	userArmor: state.app.userArmor
}), null)(CombatPage)

export const pageQuery = graphql`query test5 {
	site {
		siteMetadata {
		  	title
		}
	}
  }`