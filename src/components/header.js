import React from 'react'
import Link from 'gatsby-link'
import {
	Collapse,
	Navbar,
	NavbarToggler,
	Nav,
	NavItem,
	UncontrolledDropdown,
	DropdownToggle,
	DropdownMenu,
	DropdownItem,
	Button
} from 'reactstrap';
import FontAwesome from 'react-fontawesome';
import cookie from 'react-cookies';
import { auth, provider } from '../firebase.js';
import 'firebase/database';
import 'firebase/auth';
import firebase from 'firebase/app';
import lang_fr from '../langues/lang_fr.json';
import lang_en from '../langues/lang_en.json';

export default class Header extends React.Component {
	constructor(props) {
		super(props);

		this.onEntering = this.onEntering.bind(this);
		this.onEntered = this.onEntered.bind(this);
		this.onExiting = this.onExiting.bind(this);
		this.onExited = this.onExited.bind(this);

		this.toggle = this.toggle.bind(this);
		this.toggleNight = this.toggleNight.bind(this);
		this.login = this.login.bind(this);
		this.logout = this.logout.bind(this);
		// this.createMember = this.createMember.bind(this, 'idUser', 'Parameter', 'Parameter');
		// this.createArmor = this.createArmor.bind(this);

		/** Buffer de la langue par défaut */
		this.lang = lang_fr;

		/** Trouve la bonne langue */
		if (this.props.lang === "fr-CA") { this.lang = lang_fr; }
		if (this.props.lang === "en-US") { this.lang = lang_en; }

		this.state = {
			isOpen: false,
			user: null,
			status: this.lang.btn_nuit_inactif,
			usersIndiv: []
		};

		this.userData = [];

		this.nightMode = false
		//this.status = this.lang.btn_nuit_inactif
		this.mounted = undefined

		if (cookie.load('c_nightMode') !== "null") {
			this.mounted = cookie.load('c_nightMode');
			this.checkActif();
		}

		firebase.auth().onAuthStateChanged(user => {
			// currentUser is ready now.
			if (user) {
				//console.log(firebase.auth().currentUser);
				this.setState({ user: firebase.auth().currentUser })
				this.checkAccount();
				// User signed in. You can also access from firebase.auth().currentUser.
			} else {
				// User signed out.
				//console.log("Pas de user")
			}
		});
	}

	onEntering() {
		this.setState({ status: this.lang.btn_nuit_desactivation });
	}

	onEntered() {
		this.setState({ status: this.lang.btn_nuit_inactif });
		//cookie.save('c_nightMode', 'off', { path: '/' });
	}

	onExiting() {
		this.setState({ status: this.lang.btn_nuit_activation });
	}

	onExited() {
		this.setState({ status: this.lang.btn_nuit_actif });
		//cookie.save('c_nightMode', 'on', { path: '/' });
	}

	componentDidMount() {
		//this.nightMode = !this.nightMode;
		if (typeof window !== "undefined") {
			auth.onAuthStateChanged((user) => {
				if (user) {
					this.setState({ user });
				}
			});
		}
	}

	toggle() {
		this.setState({
			isOpen: !this.state.isOpen
		});
	}

	toggleNight() {
		//(this.nightMode === true) ? (this.nightMode = false) : (this.nightMode = true)
		this.nightMode = !this.nightMode;
		//console.log(this.nightMode);

		if (this.nightMode === true) {
			this.setState({ status: this.lang.btn_nuit_actif });
			//console.log(this.state.status);
			this.nightMode = true
			cookie.save('c_nightMode', 'on', { path: '/' });
			//console.log("ToggleNight: Actif");
		} else {
			this.setState({ status: this.lang.btn_nuit_inactif });
			//console.log(this.state.status);
			this.nightMode = false
			cookie.save('c_nightMode', 'off', { path: '/' });
			//console.log("ToggleNight: Inactif");
		}

		this.checkActif();
	}

	checkActif() {
		if (typeof document !== "undefined") {
			if (this.mounted === 'on') {
				this.nightMode = true;
				this.setState({ status: this.lang.btn_nuit_actif });
				this.mounted = undefined;
			}
			if (this.nightMode) {
				document.body.classList.add('darkClass')
			} else {
				document.body.classList.remove('darkClass')
			}
			//console.log("CheckActif: " + this.status);
		}
	}

	logout() {
		if (typeof window !== "undefined") {
			auth.signOut()
				.then(() => {
					this.setState({
						user: null
					});
					cookie.save('lecteur_connect', "vide", { path: '/' });

					window.location.reload();
				});
		}
	}

	login() {
		if (typeof window !== "undefined") {
			auth.signInWithPopup(provider)
				.then((result) => {
					const user = result.user;
					this.setState({
						user
					});
					cookie.save('lecteur_connect', this.state.user, { path: '/' });
					this.checkAccount();
				});
		}

	}

	checkAccount() {
		let userFound = false;
		let scanDone = false;
		if (typeof window !== "undefined") {
			if (this.state.user !== null) {
				let listUsers = firebase.database().ref('mr_users');
				listUsers.on('value', (snapshot) => {
					let usersIndiv = snapshot.val();
					// let newState = [];
					for (let item in usersIndiv) {
						if (usersIndiv[item].user === this.state.user.email) {
							this.userData = usersIndiv[item];
							// newState.push({
							// 	id: item,
							// 	user: this.state.user.email,
							// 	ferraille: usersIndiv[item].ferraille,
							// 	prestige: usersIndiv[item].prestige,
							// 	fightWin: usersIndiv[item].fightWin,
							// 	fightLose: usersIndiv[item].fightLose,
							// 	username: usersIndiv[item].username,
							// 	isArmorGen: usersIndiv[item].isArmorGen
							// });
							//console.log("User trouvé")
							//console.log(item)
							userFound = true;
							this.checkArmor(item);

							usersIndiv[item].isArmorGen = true;

							//console.log(item);
							var updates = {}
							updates['/mr_users/' + item] = usersIndiv[item]

							firebase.database().ref().update(updates);
						}
					}

					scanDone = true

					if (!this.state.loaded) { this.setState({ loaded: true }); }
				})

				if (!userFound && scanDone) {
					const newUser = {
						user: this.state.user.email,
						username: this.state.user.displayName,
						ferraille: 0,
						prestige: 0,
						fightWin: 0,
						fightLose: 0,
						isArmorGen: false
					}

					listUsers.push(newUser);
					userFound = true;
					//console.log("New user créé")
					this.checkArmor();
				}
			}
		}
	}

	checkArmor(idUser) {
		if (!this.userData.isArmorGen) {
			//console.log(idUser)
			this.createMember(idUser, "Bras Gauche", "Eau")
			this.createMember(idUser, "Bras Droit", "Feu")
			this.createMember(idUser, "Casque", "Neutre")
			this.createMember(idUser, "Jambes", "Terre")

			let idBrasGauche = ""
			let idBrasDroit = ""
			let idCasque = ""
			let idJambes = ""
			let idFound = 0

			let listMembers = firebase.database().ref('mr_member');
			listMembers.on('value', (snapshot) => {
				let memberIndiv = snapshot.val();
				for (let item1 in memberIndiv) {
					if (memberIndiv[item1].userId === idUser) {
						if (memberIndiv[item1].nom === "Bras Gauche") { idBrasGauche = item1; console.log(idBrasGauche); idFound++ }
						if (memberIndiv[item1].nom === "Bras Droit") { idBrasDroit = item1; console.log(idBrasDroit); idFound++ }
						if (memberIndiv[item1].nom === "Casque") { idCasque = item1; console.log(idCasque); idFound++ }
						if (memberIndiv[item1].nom === "Jambes") { idJambes = item1; console.log(idJambes); idFound++ }
						if (idFound === 4) { this.createArmor(idUser, idBrasGauche, idBrasDroit, idCasque, idJambes) }
					}
				}
			})

		}
	}

	createMember(idUser, nomMembre, elementMembre) {
		let listMembres = firebase.database().ref('mr_member');

		const newMember = {
			userId: idUser,
			nom: nomMembre,
			vie: 10,
			tier: "A",
			niveau: 1,
			experience: 0,
			element: elementMembre,
			isLock: true,
			ameliorationPoint: 0,
			bonus1: null,
			bonus2: null,
			eau1: 0,
			eau2: 0,
			eau3: 0,
			feu1: 0,
			feu2: 0,
			feu3: 0,
			terre1: 0,
			terre2: 0,
			terre3: 0,
			neutre1: 0
		}
		//console.log(newMember.nom)
		listMembres.push(newMember)
	}

	createArmor(idUser, idBrasGauche, idBrasDroit, idCasque, idJambes) {
		let listArmures = firebase.database().ref('mr_armor');

		const newArmure = {
			userId: idUser,
			nom: "Armure de base",
			idBrasGauche: idBrasGauche,
			idBrasDroit: idBrasDroit,
			idCasque: idCasque,
			idJambes: idJambes
		}

		//console.log(newArmure)
		listArmures.push(newArmure)
	}

	render() {
		return (
			<div>
				<Navbar color="dark" dark expand="md">
					<NavbarToggler onClick={this.toggle} />
					<Collapse isOpen={this.state.isOpen} navbar>
						<Nav className="ml-auto nav-center" pills>
							<NavItem>
								<Button color="primary" onClick={this.toggleNight}>
									<FontAwesome
										name='moon'
										className='mr-2'
										style={{ textShadow: '0 1px 0 rgba(0, 0, 0, 0.1)' }}
									/>
									{this.lang.btn_nuit + ((this.nightMode) ? (this.lang.btn_nuit_actif) : (this.lang.btn_nuit_inactif))}
								</Button>

								<Collapse
									isOpen={this.nightMode}
									onEntering={this.onEntering}
									onEntered={this.onEntered}
									onExiting={this.onExiting}
									onExited={this.onExited}
								>
								</Collapse>
							</NavItem>
							<NavItem>
								{this.state.user ?
									(<div className="text-white nav-link">Ferraille: {this.userData.ferraille}</div>)
									:
									('')
								}
							</NavItem>
							<NavItem>
								{this.state.user ?
									(<div className="text-white nav-link">Prestige: {this.userData.prestige}</div>)
									:
									('')
								}
							</NavItem>
							<NavItem>
								<Link to={this.lang.header_accueil_url} className="text-white nav-link">{this.lang.header_accueil}</Link>
							</NavItem>
							<NavItem>
								<Link to={this.lang.header_regles_url} className="text-white nav-link">{this.lang.header_regles}</Link>
							</NavItem>
							<UncontrolledDropdown nav inNavbar>
								<DropdownToggle nav caret className="text-white">
									{this.state.user ?
										this.userData.username
										:
										<span>{this.lang.header_connexion}</span>
									}
								</DropdownToggle>
								<DropdownMenu right className="no-padding">
									{this.state.user ?
										(
											<>
												<DropdownItem>
													<Link to={this.lang.header_armurerie_url + "/"}>{this.lang.header_armurerie}</Link>
												</DropdownItem>
												<DropdownItem>
													<Link to={this.lang.header_magasin_url + "/"}>{this.lang.header_magasin}</Link>
												</DropdownItem>
												<DropdownItem>
													<Link to={this.lang.header_histoire_url + "/"}>{this.lang.header_histoire}</Link>
												</DropdownItem>
												<DropdownItem>
													<Link to={this.lang.header_tournois_url + "/"}>{this.lang.header_tournois}</Link>
												</DropdownItem>
												<DropdownItem>
													<Link to={this.lang.header_club_url + "/"}>{this.lang.header_club}</Link>
												</DropdownItem>
												<DropdownItem>
													<Link to={this.lang.header_profil_url + "/"}>{this.lang.header_profil}</Link>
												</DropdownItem>
												<div>
													<Button color="primary" onClick={this.logout}>{this.lang.header_logout}</Button>
												</div>
											</>
										)
										:
										<div>
											<Button color="primary" onClick={this.login}>{this.lang.header_login}</Button>
										</div>
									}
								</DropdownMenu>
							</UncontrolledDropdown>
						</Nav>
					</Collapse>
				</Navbar>
			</div>
		);
	}
}