const path = require('path')

exports.createPages = ({ graphql, actions }) => {
	const { createPage } = actions
	return new Promise((resolve, reject) => {
		const indexTemplate = path.resolve('src/templates/index.js')
		const reglesTemplate = path.resolve('src/templates/regles.js')
		const profilTemplate = path.resolve('src/templates/profil.js')
		const armurerieTemplate = path.resolve('src/templates/armurerie.js')
		const ameliorationTemplate = path.resolve('src/templates/amelioration.js')
		const magasinTemplate = path.resolve('src/templates/magasin.js')
		const histoireTemplate = path.resolve('src/templates/histoire.js')
		const combatTemplate = path.resolve('src/templates/combat.js')
		const tournoisTemplate = path.resolve('src/templates/tournois.js')
		const clubTemplate = path.resolve('src/templates/club.js')
		// const listePersonnageTemplate = path.resolve('src/templates/personnages.js')
		// const listePouvoirTemplate = path.resolve('src/templates/pouvoirs.js')
		// const listeNouvelleTemplate = path.resolve('src/templates/nouvelles.js')
		// const listeGroupeTemplate = path.resolve('src/templates/groupes.js')
		// const listeTheorieTemplate = path.resolve('src/templates/encyclopedie.js')
		// const nombreTemplate = path.resolve('src/templates/nombre.js')
		// const calendrierTemplate = path.resolve('src/templates/calendrier.js')
		// const contributeursTemplate = path.resolve('src/templates/contributeurs.js')
		// const mondeTemplate = path.resolve('src/templates/monde.js')
		// const paysTemplate = path.resolve('src/templates/pays.js')
		// const villeTemplate = path.resolve('src/templates/ville.js')
		// const evenementsTemplate = path.resolve('src/templates/evenements.js');
		// const listeProjetsTemplate = path.resolve('src/templates/projets.js')
		// const projetTemplate = path.resolve('src/templates/projet.js')

		/** Cette fonction s'occupe de créer des pages qui ne seront présentes qu'une seule fois dans le site. 
		 * pat: Paramètre qui contient la portion de l'url de la page
		 * temp: Paramètre qui contient la constante du template
		 * lang: Paramètre qui contient le string qui sera utilisé pour détecté la langue de la page
		*/
		function singlePage(pat, temp, lang) {
			createPage({
				path: pat,
				component: temp,
				context: {
					lang: lang
				}
			})
		}

		/** Cette fonction s'occupe de créer des pages.
		 * graphQL: Paramètre qui contient la section de code graphQL pour le fetch des datas
		 * kindData: Paramètre qui sert à savoir quel genre de data on cherche
		 * pat: Paramètre qui contient la portion de l'url de la page
		 * temp: Paramètre qui contient la constante du template
		 * lang: Paramètre qui contient le string qui sera utilisé pour détecté la langue de la page
		*/
		function multiPage(graphQL, kindData, pat, temp, lang) {
			graphql(graphQL).then((result) => {
				if (result.errors) { reject(result.errors) }
				dat = extractKindOfData(result)
				if (dat != null) {
					dat.edges.forEach((edge) => {
						if ((edge.node.id = kindData) && (edge.node.slug != null)) {
							createPage({
								path: pat + edge.node.slug,
								component: temp,
								context: {
									slug: edge.node.slug,
									lang: lang
								}
							})
						}
					})
				}
				return
			})
		}

		/** Cette fonction s'occupe de créer des pages
		 * variante... elle vérifie qu'on génère la bonne source de donnée
		 * graphQL: Paramètre qui contient la section de code graphQL pour le fetch des datas
		 * kindData: Paramètre qui sert à savoir quel genre de data on cherche
		 * pat: Paramètre qui contient la portion de l'url de la page
		 * temp: Paramètre qui contient la constante du template
		 * lang: Paramètre qui contient le string qui sera utilisé pour détecté la langue de la page
		*/
		function multiPageSpe(graphQL, kindData, pat, temp, lang) {
			graphql(graphQL).then((result) => {
				if (result.errors) { reject(result.errors) }
				dat = extractKindOfData(result)
				if (dat != null) {
					dat.edges.forEach((edge) => {
						if ((edge.node.id = kindData) && (edge.node.slug != null)) {
							if (edge.node.slug == 'giervia') {
								createPage({
									path: pat + edge.node.slug,
									component: temp,
									context: {
										slug: edge.node.slug,
										lang: lang
									}
								})
							}
						}
					})
				}
				return
			})
		}

		/** Cette fonction s'occupe de créer des pages
		 * variante... elle ajoute une nouvelle section au path 
		 * graphQL: Paramètre qui contient la section de code graphQL pour le fetch des datas
		 * kindData: Paramètre qui sert à savoir quel genre de data on cherche
		 * pat: Paramètre qui contient la portion de l'url de la page
		 * temp: Paramètre qui contient la constante du template
		 * lang: Paramètre qui contient le string qui sera utilisé pour détecté la langue de la page
		*/
		function multiPageSpe2(graphQL, kindData, pat, temp, lang) {
			graphql(graphQL).then((result) => {
				if (result.errors) { reject(result.errors) }
				dat = extractKindOfData(result)
				if (dat != null) {
					dat.edges.forEach((edge) => {
						if ((edge.node.id = kindData) && (edge.node.slug != null)) {
							createPage({
								path: pat + edge.node.slugPaysParent + '/' + edge.node.slug,
								component: temp,
								context: {
									slug: edge.node.slug,
									lang: lang
								}
							})
						}
					})
				}
				return
			})
		}

		/** Cette fonction s'occupe de créer des pages
		 * variante... elle vérifie qu'on génère la bonne source de donnée
		 * res: Paramètre qui contient le résultat de graphQL
		*/
		function extractKindOfData(res) {
			var x = Object.keys(res.data);
			return x != null ? res.data[x[0]] : null;
		}

		/** S'occupe de générer toutes les sortes de pages sous les deux langues disponibles */
		resolve(
			singlePage('/', indexTemplate, "fr-CA"),
			singlePage('en/', indexTemplate, "en-US"),
			singlePage('regles', reglesTemplate, "fr-CA"),
			singlePage('en/rules', reglesTemplate, "en-US"),
			singlePage('profil', profilTemplate, "fr-CA"),
			singlePage('en/profile', profilTemplate, "en-US"),
			singlePage('armurerie', armurerieTemplate, "fr-CA"),
			singlePage('en/weaponry', armurerieTemplate, "en-US"),
			singlePage('amelioration', ameliorationTemplate, "fr-CA"),
			singlePage('en/upgrade', ameliorationTemplate, "en-US"),
			singlePage('magasin', magasinTemplate, "fr-CA"),
			singlePage('en/shop', magasinTemplate, "en-US"),
			singlePage('histoire', histoireTemplate, "fr-CA"),
			singlePage('en/storie', histoireTemplate, "en-US"),
			singlePage('combat', combatTemplate, "fr-CA"),
			singlePage('en/fight', combatTemplate, "en-US"),
			singlePage('tournois', tournoisTemplate, "fr-CA"),
			singlePage('en/tournament', tournoisTemplate, "en-US"),
			singlePage('club', clubTemplate, "fr-CA"),
			singlePage('en/club', clubTemplate, "en-US")
		)
	})
}