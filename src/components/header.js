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
		if (typeof window !== "undefined") {
			if (this.state.user !== null) {
				let listUsers = firebase.database().ref('mr_users');
				listUsers.on('value', (snapshot) => {
					let usersIndiv = snapshot.val();
					let newState = [];
					let userFound = false;
					for (let item in usersIndiv) {
						if (usersIndiv[item].user === this.state.user.email) {
							this.userData = usersIndiv[item];
							newState.push({
								id: item,
								user: this.state.user.email,
								ferraille: usersIndiv[item].ferraille,
								prestige: usersIndiv[item].prestige,
								fightWin: usersIndiv[item].fightWin,
								fightLose: usersIndiv[item].fightLose,
								username: usersIndiv[item].username,
								isArmorGen: usersIndiv[item].isArmorGen
							});
							//console.log("User trouvé")
							console.log(item)
							userFound = true;
						}
					}

					if (!userFound) {
						const newUser = {
							user: this.state.user.email,
							username: this.state.user.displayName,
							ferraille: 0,
							prestige: 0,
							fightWin: 0,
							fightLose: 0,
							isArmorGen: true
						}

						listUsers.push(newUser);
						
						//console.log("New user créé")
						//CreateIt
					} else {
						//LoadIt
					}

					if (!this.state.loaded) {
						this.setState({ loaded: true });
					}
				});
			}
		}
	}

	createArmor(idUser) {
		let listArmures = firebase.database().ref('mr_armor');

		const newArmure = {

		}
	}

	createMember(idUser) {
	// 	let listMembres = firebase.database().ref('mr_member');

	// 	const newMemberLeftArm = {
	// 		userId:
	// 		// - idUser
	// 		// - nom
	// 		// - vie
	// 		// - tier
	// 		// - niveau
	// 		// - experience
	// 		// - element
	// 		// - isLock
	// 		// - bonus1
	// 		// - bonus2
	// 		// - ameliorationPoint
	// 		// - eau1
	// 		// - eau2
	// 		// - eau3
	// 		// - feu1
	// 		// - feu2
	// 		// - feu3
	// 		// - terre1
	// 		// - terre2
	// 		// - terre3
	// 		// - neutre1
	// }
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