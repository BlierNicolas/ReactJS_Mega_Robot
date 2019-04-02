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
import Helmet from 'react-helmet'
import lang_fr from '../langues/lang_fr.json';
import lang_en from '../langues/lang_en.json';

import Layout from '../components/layout'

class IndexPage extends Component {
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
								<Col lg="4" sm="6" xs="12" className="pb-2">
									<Teaser titre="Règles" desc="Mega Robot est régie par plusieurs règles en ce qui attrait des combats." btn_url={this.lang.header_regles_url} />
								</Col>
								{
									this.state.lecteur !== "vide" ?
										(<React.Fragment>
											<Col lg="4" sm="6" xs="12" className="pb-2">
												<Teaser titre="Profil" desc="Pour voir votre profil et d'autres information à votre sujet." btn_url={this.lang.header_profil_url}/>
											</Col>
											<Col lg="4" sm="6" xs="12" className="pb-2">
												<Teaser titre="Armurerie" desc="Voyez et gérez vos robots ici." btn_url={this.lang.header_armurerie_url}/>
											</Col>
											<Col lg="4" sm="6" xs="12" className="pb-2">
												<Teaser titre="Magasin" desc="C'est ici que vous vous procurerez les nouveautés et les équipements bonus." btn_url={this.lang.header_magasin_url}/>
											</Col>
											<Col lg="4" sm="6" xs="12" className="pb-2">
												<Teaser titre="Histoire" desc="Si vous voulez suivre les aventures de nos deux protagonistes, c'est ici." btn_url={this.lang.header_histoire_url}/>
											</Col>
											<Col lg="4" sm="6" xs="12" className="pb-2">
												<Teaser titre="Tournois" desc="Pour accéder aux tournois c'est ici." btn_url={this.lang.header_tournois_url}/>
											</Col>
											<Col lg="4" sm="6" xs="12" className="pb-2">
												<Teaser titre="Club" desc="Le club est là, vous avez sans doutes des quêtes à accomplir." btn_url={this.lang.header_club_url}/>
											</Col>
											<Col lg="4" sm="6" xs="12" className="pb-2">
												<Teaser titre="Combat aléatoire" desc="C'est le moment d'affronter un robot aléatoire pour s'entraîner." btn_url="combat/"/>
											</Col>
										</React.Fragment>) :
										(<React.Fragment>
											<Col lg="4" sm="6" xs="12" className="pb-2">
												<Teaser titre="Démo" desc="Une demo est disponible pour mieux comprendre le système de combat." btn_url={this.lang.header_demo_url} />
											</Col>
											<Col lg="4" sm="6" xs="12" className="pb-2">
												<Teaser titre="Tournois" desc="Plusieurs tournois sont organisés pour voir qui possède la meilleure équipe." btn_url={this.lang.header_tournois_url} />
											</Col>
											<Col lg="4" sm="6" xs="12" className="pb-2">
												<Teaser titre="Histoire" desc="Venez vivre l'histoire de nos deux protagonistes qui chercherons à monter sur les podiums de leur catégorie." btn_url={this.lang.header_histoire_url} />
											</Col>
											<Col lg="4" sm="6" xs="12" className="pb-2">
												<Teaser titre="Club" desc="Il y a des clubs qui se sont formés pour que les amis puissent s'entraîner, viens voir si tes amis font déjà parti d'un club." btn_url={this.lang.header_club_url} />
											</Col>
										</React.Fragment>)
								}
							</Row>
						</div>
					</Container>

					<Footer lang={this.props.pageContext.lang} />
				</div >
			</Layout >
		)
	}
}

IndexPage.propTypes = {
	data: PropTypes.object.isRequired
}

export default IndexPage

export const pageQuery = graphql`query test {
	site {
		siteMetadata {
		  	title
		}
	}
  }`