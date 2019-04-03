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
import { chargeUserData, chargeUserArmor, chargeIdCasque, chargeIdBrasDroit, chargeIdBrasGauche, chargeIdJambes } from '../state/app';

import Layout from '../components/layout'

class CombatPage extends Component {
	constructor(props) {
		super(props);
		this.state = {
			currentItem: '',
			username: '',
			items: [],
			connectedUser: null,
			lecteur: "vide",
			casque: '',
			brasGauche: '',
			brasDroit: '',
			jambes: '',
			casqueAdv: '',
			brasGaucheAdv: '',
			brasDroitAdv: '',
			jambesAdv: '',
			unFight: null,
			newFight: null
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

			this.loadArmor(idUser)

			const minVieAdv = 11
			const maxVieAdv = 15
			const randVieAdv = Math.round(minVieAdv + Math.random() * (maxVieAdv - minVieAdv))

			console.log("Random vie " + randVieAdv)

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

			console.log("Random elem " + randElemBrasGauche + " " + randElemBrasDroit + " " + randElemCasque + " " + randElemJambes)
			this.state.brasGaucheAdv = { vie: randVieAdv, element: randElemBrasGauche, elementAdvConnu: true, nom: "Bras Gauche" }
			this.state.brasDroitAdv = { vie: randVieAdv, element: randElemBrasDroit, elementAdvConnu: false, nom: "Bras Droit" }
			this.state.casqueAdv = { vie: randVieAdv, element: randElemCasque, elementAdvConnu: false, nom: "Casque" }
			this.state.jambesAdv = { vie: randVieAdv, element: randElemJambes, elementAdvConnu: false, nom: "Jambes" }

			this.state.newFight = {
				idUser: idUser,
				tourJoueur: 1,
				brasGaucheVieAdv: randVieAdv,
				brasGaucheElementAdv: randElemBrasGauche,
				brasGaucheElementAdvConnu: false,
				brasDroitVieAdv: randVieAdv,
				brasDroitElementAdv: randElemBrasDroit,
				brasDroitElementAdvConnu: false,
				casqueVieAdv: randVieAdv,
				casqueElementAdv: randElemCasque,
				casqueElementAdvConnu: false,
				jambesVieAdv: randVieAdv,
				jambesElementAdv: randElemJambes,
				jambesElementAdvConnu: false,
				premierMembreDetruitJoueur: 0
			}

			console.log(this.state.newFight)
			//listFights.push(this.state.newFight)
		}
	}

	loadArmor(idUser) {
		if (typeof window !== "undefined") {
			if (this.props.user !== null) {
				let listArmors = firebase.database().ref('mr_armor');
				listArmors.on('value', (snapshot) => {
					let armorIndiv = snapshot.val();
					let armorFound = false;
					for (let item in armorIndiv) {
						if (!armorFound) {
							if (armorIndiv[item].userId === idUser) {
								this.props.dispatch(chargeUserArmor(armorIndiv[item]))

								console.log("Associer membre")
								this.loadMembre(armorIndiv[item].idCasque, "Casque")
								this.loadMembre(armorIndiv[item].idBrasGauche, "Bras gauche")
								this.loadMembre(armorIndiv[item].idBrasDroit, "Bras droit")
								this.loadMembre(armorIndiv[item].idJambes, "Jambes")

								armorFound = true;
							}
						}
					}
				});
			}
		}
	}

	loadMembre(idMembre, kind) {
		if (typeof window !== "undefined") {
			if (this.props.user !== null) {
				let unMembre = firebase.database().ref('mr_member');
				unMembre.on('value', (snapshot) => {
					let unMembre = snapshot.val();
					for (let item in unMembre) {
						if (item === idMembre && this.state.newFight != null) {
							if (kind === "Casque") {
								this.props.dispatch(chargeIdCasque(unMembre[item]))
								this.state.newFight["casqueVieJ"] = unMembre[item].vie
								this.state.newFight["casqueElementJ"] = unMembre[item].element
								this.setState({ casque: unMembre[item] })
							}
							if (kind === "Bras gauche") {
								this.props.dispatch(chargeIdBrasGauche(unMembre[item]))
								this.state.newFight["brasGaucheVieJ"] = unMembre[item].vie
								this.state.newFight["brasGaucheElementJ"] = unMembre[item].element
								this.setState({ brasGauche: unMembre[item] })
							}
							if (kind === "Bras droit") {
								this.props.dispatch(chargeIdBrasDroit(unMembre[item]))
								this.state.newFight["brasDroitVieJ"] = unMembre[item].vie
								this.state.newFight["brasDroitElementJ"] = unMembre[item].element
								this.setState({ brasDroit: unMembre[item] })
							}
							if (kind === "Jambes") {
								this.props.dispatch(chargeIdJambes(unMembre[item]))
								this.state.newFight["jambesVieJ"] = unMembre[item].vie
								this.state.newFight["jambesElementJ"] = unMembre[item].element
								this.setState({ jambes: unMembre[item] })
							}

							console.log(unMembre[item])
						}
					}
				});
			}
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
												{this.state.casque !== null ?
													<FightDisplayMember membre={this.state.casque} /> :
													<FightDisplayMember />
												}
											</Col>
											<Col lg="6" xs="12">
												{this.state.brasGauche !== null ?
													<FightDisplayMember membre={this.state.brasGauche} /> :
													<FightDisplayMember />
												}
											</Col>
											<Col lg="6" xs="12">
												{this.state.brasDroit !== null ?
													<FightDisplayMember membre={this.state.brasDroit} /> :
													<FightDisplayMember />
												}
											</Col>
											<Col lg="6" xs="12">
												{this.state.jambes !== null ?
													<FightDisplayMember membre={this.state.jambes} /> :
													<FightDisplayMember />
												}
											</Col>
										</Row>
									</Col>
									<Col lg="4" md="6" xs="12">
										Bouton d'attaque
									</Col>
									<Col lg="4" md="6" xs="12">
										<Row>
											<Col lg="6" xs="12">
												{this.state.casqueAdv !== null ?
													<FightDisplayMember membre={this.state.casqueAdv} /> :
													<FightDisplayMember />
												}
											</Col>
											<Col lg="6" xs="12">
												{this.state.brasGaucheAdv !== null ?
													<FightDisplayMember membre={this.state.brasGaucheAdv} /> :
													<FightDisplayMember />
												}
											</Col>
											<Col lg="6" xs="12">
												{this.state.brasDroitAdv !== null ?
													<FightDisplayMember membre={this.state.brasDroitAdv} /> :
													<FightDisplayMember />
												}
											</Col>
											<Col lg="6" xs="12">
												{this.state.jambesAdv !== null ?
													<FightDisplayMember membre={this.state.jambesAdv} /> :
													<FightDisplayMember />
												}
											</Col>
										</Row>
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