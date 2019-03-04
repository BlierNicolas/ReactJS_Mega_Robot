import React, { Component } from 'react'
import { graphql } from "gatsby";
import PropTypes from 'prop-types';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
	Container,
	Jumbotron,
	Row,
	Col,
	TabContent,
	TabPane,
	Nav,
	NavItem,
	NavLink
} from 'reactstrap';
import Header from '../components/header'
import Footer from '../components/footer'
import EquivURL from '../components/equivURL';
import ArmorDisplayMember from '../components/armorDisplayMember';
import classnames from 'classnames';
import cookie from 'react-cookies';
import Helmet from 'react-helmet'
import lang_fr from '../langues/lang_fr.json';
import lang_en from '../langues/lang_en.json';

import Layout from '../components/layout'

class ArmureriePage extends Component {
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

		this.toggle = this.toggle.bind(this);
		this.state = {
			activeTab: '1',
			username: ""
		};

		if (cookie.load('lecteur_connect') == null) {
			cookie.save('lecteur_connect', "vide", { path: '/' });
		}

		if (cookie.load('lecteur_connect') !== "vide") {
			this.state.lecteur = cookie.load('lecteur_connect')
		}
	}

	myCallback = (dataFromChild) => {
		this.setState({username : dataFromChild})
	}

	toggle(tab) {
		if (this.state.activeTab !== tab) {
			this.setState({
				activeTab: tab
			});
		}
	}

	render() {
		return (
			<Layout>
				<div id="page-wrapper">
					<Helmet title={this.lang.header_armurerie + this.lang.meta_title}></Helmet>

					<Header lang={this.props.pageContext.lang} />

					<EquivURL url={this.lang.other_lang_url + "/"} label={this.lang.other_lang_label} />

					<Jumbotron fluid>
						<Container fluid>
							<h1 className="display-3 display-title">{this.lang.armurerie_jumbo_titre}</h1>
							<p className="lead">{this.lang.armurerie_jumbo_parag_1}</p>
						</Container>
					</Jumbotron>

					<Container fluid>
						<div className="pb-5">
							<Nav pills>
								<NavItem className="cursor-update">
									<NavLink className={classnames({ active: this.state.activeTab === '1' })} onClick={() => { this.toggle('1'); }}>
										Nom de l'armure 1
            						</NavLink>
								</NavItem>
								<NavItem className="cursor-update">
									<NavLink className={classnames({ active: this.state.activeTab === '2' })} onClick={() => { this.toggle('2'); }}>
										Moar Tabs
            						</NavLink>
								</NavItem>
							</Nav>
							<TabContent activeTab={this.state.activeTab}>
								<TabPane tabId="1">
									<Row>
										<Col lg="3" md="6" sm="12" className="my-3">
											<ArmorDisplayMember callbackFromParent={this.myCallback} />
										</Col>
										<Col lg="3" md="6" sm="12" className="my-3">
											<ArmorDisplayMember callbackFromParent={this.myCallback} />
										</Col>
										<Col lg="3" md="6" sm="12" className="my-3">
											<ArmorDisplayMember callbackFromParent={this.myCallback} />
										</Col>
										<Col lg="3" md="6" sm="12" className="my-3">
											<ArmorDisplayMember callbackFromParent={this.myCallback} />
										</Col>
									</Row>
								</TabPane>
								<TabPane tabId="2">
									<Row className="my-3">
										<Col sm="6">

										</Col>
										<Col sm="6">

										</Col>
									</Row>
								</TabPane>
							</TabContent>
						</div>
					</Container>

					<Footer lang={this.props.pageContext.lang} />
				</div >
			</Layout >
		)
	}
}

ArmureriePage.propTypes = {
	data: PropTypes.object.isRequired
}

export default ArmureriePage

export const pageQuery = graphql`query test3 {
		site {
		siteMetadata {
				title
		}
	}
	}`