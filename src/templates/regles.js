import React, { Component } from 'react'
import { graphql } from "gatsby";
import PropTypes from 'prop-types';
import Link from 'gatsby-link'
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
import Teaser from '../components/teaser';
import cookie from 'react-cookies';
import Helmet from 'react-helmet'
import lang_fr from '../langues/lang_fr.json';
import lang_en from '../langues/lang_en.json';

import Layout from '../components/layout'

class ReglesPage extends Component {
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

		if (cookie.load('lecteur_connect') == null) {
			cookie.save('lecteur_connect', "vide", { path: '/' });
		}

		if (cookie.load('lecteur_connect') !== "vide") {
			this.state.lecteur = cookie.load('lecteur_connect')
		}
	}

	render() {
		return (
			<Layout>
				<div id="page-wrapper">
					<Helmet title={this.lang.header_accueil + this.lang.meta_title}></Helmet>

					<Header lang={this.props.pageContext.lang} />

					<EquivURL url={this.lang.other_lang_url + "/"} label={this.lang.other_lang_label} />

					<Jumbotron fluid>
						<Container fluid>
							<h1 className="display-3 display-title">{this.lang.accueil_jumbo_titre}</h1>
							<p className="lead">{this.lang.accueil_jumbo_parag_1}</p>
							<p className="lead">{this.lang.accueil_jumbo_parag_2}</p>
							<Link className="btn btn-primary" to={this.lang.header_regles_url + "/"}>{this.lang.accueil_jumbo_btn_titre}</Link>
						</Container>
					</Jumbotron>

					<Container fluid className="p-0">
						<div className="pb-5">
							<Row>
								<Col lg="4" md="4" sm="6" xs="12">
									<Teaser titre="Test" desc="Description" btn_label="Label" />
								</Col>
								<Col lg="4" md="4" sm="6" xs="12">
									<Teaser titre="Test" desc="Description" btn_label="Label" />
								</Col>
								<Col lg="4" md="4" sm="6" xs="12">
									<Teaser titre="Test" desc="Description" btn_label="Label" />
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

ReglesPage.propTypes = {
	data: PropTypes.object.isRequired
}

export default ReglesPage

export const pageQuery = graphql`query test9 {
	site {
		siteMetadata {
		  	title
		}
	}
  }`