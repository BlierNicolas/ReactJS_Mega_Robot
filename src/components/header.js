import React from 'react'
import Link from 'gatsby-link'
import { connect } from 'react-redux'
import {
	Collapse,
	Navbar,
	NavbarToggler,
	Nav,
	NavItem,
	Button
} from 'reactstrap';
import FontAwesome from 'react-fontawesome';
import 'firebase/database';
import 'firebase/auth';
import lang_fr from '../langues/lang_fr.json';
import lang_en from '../langues/lang_en.json';
import UserConnector from './UserConnector';
import UserMetaInfo from './UserMetaInfo';
import { toggleDarkMode } from '../state/app';

class Header extends React.Component {
	constructor(props) {
		super(props);

		this.toggle = this.toggle.bind(this);
		this.toggleDark = this.toggleDark.bind(this);

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

		this.mounted = undefined
	}

	componentDidMount() {
		if (localStorage.getItem('c_nightMode') !== "null") {
			this.mounted = localStorage.getItem('c_nightMode');
			if (this.mounted === "true") {
				document.body.classList.add('darkClass')
				this.setState({ status: this.lang.btn_nuit_actif });
			} else if (this.mounted === "false") {
				document.body.classList.remove('darkClass')
				this.setState({ status: this.lang.btn_nuit_inactif });
			}
		} else {
			localStorage.setItem('c_nightMode', this.props.isDarkMode);
		}
	}

	toggle() {
		this.setState({
			isOpen: !this.state.isOpen
		});
	}

	toggleDark() {
		this.props.dispatch(toggleDarkMode(!this.props.isDarkMode))
		//console.log("Toggle... Darkmode: " + this.props.isDarkMode)
		localStorage.setItem('c_nightMode', this.props.isDarkMode);
		this.checkActif()
	}

	checkActif() {
		if (typeof document !== "undefined") {
			//console.log("Check... Darkmode: " + this.props.isDarkMode)

			if (this.props.isDarkMode) {
				//console.log("Hey")
				document.body.classList.add('darkClass')
				this.setState({ status: this.lang.btn_nuit_actif });
			} else {
				//console.log("Ho")
				document.body.classList.remove('darkClass')
				this.setState({ status: this.lang.btn_nuit_inactif });
			}
			if (this.mounted === "true") {
				this.mounted = undefined
			}
		}
	}

	render() {
		//console.log("Render... Darkmode: " + this.props.isDarkMode)

		return (
			<div>
				<Navbar color="dark" dark expand="md">
					<NavbarToggler onClick={this.toggle} />
					<Collapse isOpen={this.state.isOpen} navbar>
						<Nav className="ml-auto nav-center" pills>
							<NavItem>
								<Button color="primary" onClick={() => this.props.dispatch(toggleDarkMode(!this.props.isDarkMode), this.toggleDark())}>
									<FontAwesome
										name='moon'
										className='mr-2'
										style={{ textShadow: '0 1px 0 rgba(0, 0, 0, 0.1)' }}
									/>
									{this.lang.btn_nuit} {/*  + ((!this.props.isDarkMode) ? (this.lang.btn_nuit_actif) : (this.lang.btn_nuit_inactif))} */}
								</Button>
							</NavItem>
							<UserMetaInfo />
							<NavItem>
								<Link to={this.lang.header_accueil_url} className="text-white nav-link">{this.lang.header_accueil}</Link>
							</NavItem>
							<NavItem>
								<Link to={this.lang.header_regles_url} className="text-white nav-link">{this.lang.header_regles}</Link>
							</NavItem>
							<UserConnector lang={this.lang} />
						</Nav>
					</Collapse>
				</Navbar>
			</div>
		);
	}
}

export default connect(state => ({
	isDarkMode: state.app.isDarkMode
}), null)(Header)