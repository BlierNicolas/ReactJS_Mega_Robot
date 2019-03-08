import React from 'react'
import Link from 'gatsby-link'
import {
	Collapse,
	Navbar,
	NavbarToggler,
	Nav,
	NavItem,
	Button
} from 'reactstrap';
import FontAwesome from 'react-fontawesome';
import cookie from 'react-cookies';
import 'firebase/database';
import 'firebase/auth';
import lang_fr from '../langues/lang_fr.json';
import lang_en from '../langues/lang_en.json';
import UserConnector from './UserConnector';
import UserMetaInfo from './UserMetaInfo';

export default class Header extends React.Component {
	constructor(props) {
		super(props);

		this.onEntering = this.onEntering.bind(this);
		this.onEntered = this.onEntered.bind(this);
		this.onExiting = this.onExiting.bind(this);
		this.onExited = this.onExited.bind(this);

		this.toggle = this.toggle.bind(this);
		this.toggleNight = this.toggleNight.bind(this);

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
		this.mounted = undefined

		if (cookie.load('c_nightMode') !== "null") {
			this.mounted = cookie.load('c_nightMode');
			this.checkActif();
		}
	}

	onEntering() {
		this.setState({ status: this.lang.btn_nuit_desactivation });
	}

	onEntered() {
		this.setState({ status: this.lang.btn_nuit_inactif });
	}

	onExiting() {
		this.setState({ status: this.lang.btn_nuit_activation });
	}

	onExited() {
		this.setState({ status: this.lang.btn_nuit_actif });
	}

	componentDidMount() {

	}

	toggle() {
		this.setState({
			isOpen: !this.state.isOpen
		});
	}

	toggleNight() {
		this.nightMode = !this.nightMode;

		if (this.nightMode === true) {
			this.setState({ status: this.lang.btn_nuit_actif });
			this.nightMode = true
			cookie.save('c_nightMode', 'on', { path: '/' });
		} else {
			this.setState({ status: this.lang.btn_nuit_inactif });
			this.nightMode = false
			cookie.save('c_nightMode', 'off', { path: '/' });
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
		}
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