import React from 'react'
import { graphql } from "gatsby";
import PropTypes from 'prop-types';
// import Link from 'gatsby-link'
import 'bootstrap/dist/css/bootstrap.min.css';
import {
	Container,
	Jumbotron,
	Row,
	Col,
	Form,
	FormGroup,
	Label,
	Input,
	Button
} from 'reactstrap';
import Header from '../components/header'
import Footer from '../components/footer'
import EquivURL from '../components/equivURL';
// import ProfileChange from '../components/profileChange';
import cookie from 'react-cookies';
import Helmet from 'react-helmet'
import lang_fr from '../langues/lang_fr.json';
import lang_en from '../langues/lang_en.json';
import 'firebase/database';
import 'firebase/auth';
import firebase from 'firebase/app';
import { isNullOrUndefined } from 'util';

import Layout from '../components/layout'

class ProfilPage extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			currentItem: '',
			user: null,
			usersIndiv: [],
			loaded: false,
			username: "",
			newUsername: "",
			items: [],
			connectedUser: null,
			lecteur: "vide"
		}

		/** Buffer de la langue par défaut */
		this.lang = lang_fr;

		/** Trouve la bonne langue */
		if (this.props.pageContext.lang === "fr-CA") { this.lang = lang_fr; }
		if (this.props.pageContext.lang === "en-US") { this.lang = lang_en; }

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

		if (cookie.load('lecteur_connect') == null) {
			cookie.save('lecteur_connect', "vide", { path: '/' });
		}

		if (cookie.load('lecteur_connect') !== "vide") {
			this.state.lecteur = cookie.load('lecteur_connect')
		}
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

	render() {
		return (
			<Layout>
				<div id="page-wrapper">
					<Helmet title={this.lang.header_profil + this.lang.meta_title}></Helmet>

					<Header lang={this.props.pageContext.lang} />

					<EquivURL url={this.lang.other_lang_url + "/"} label={this.lang.other_lang_label} />

					<Jumbotron fluid>
						<Container fluid>
							<h1 className="display-3 display-title">Profil de {this.state.username}</h1>
						</Container>
					</Jumbotron>

					<Container fluid className="p-0">
						<div className="pb-5">
							<Row>
								<Col lg={{ size: 6, offset: 3 }}>
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
								</Col>
							</Row>
						</div>
					</Container>

					<Footer lang={this.props.pageContext.lang} />
				</div >
			</Layout >
		)
	}
}

ProfilPage.propTypes = {
	data: PropTypes.object.isRequired
}

export default ProfilPage

export const pageQuery = graphql`query test8 {
	site {
		siteMetadata {
		  	title
		}
	}
  }`