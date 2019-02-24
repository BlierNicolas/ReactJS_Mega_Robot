import React from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
import { StaticQuery, graphql } from 'gatsby'

import '../../css/style.css'

const Layout = ({ children }) => (
	<StaticQuery
		query={graphql`
			query SiteTitleQuery {
				site {
					siteMetadata {
						title
					}
				}
			}
		`}
		render={data => (
			<>
				<Helmet
					htmlAttributes={{ lang: "fr" }}
					title="Mega Robot"
					meta={[
						{ name: 'description', content: 'Site web du jeu Mega Robot' },
						{ name: 'msapplication-TileColor', content: '#da532c' },
						{ name: 'theme-color', content: '#007bff' },
					]}
					link={[
						{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
						{ rel: "apple-touch-icon", sizes: "180x180", href: "/apple-touch-icon.png" },
						{ rel: "icon", type: "image/png", sizes: "32x32", href: "/favicon-32x32.png" },
						{ rel: "icon", type: "image/png", sizes: "16x16", href: "/favicon-16x16.png" },
						{ rel: "manifest", href: "/site.webmanifest" },
						{ rel: "mask-icon", href: "/safari-pinned-tab.svg", color: "#5bbad5" },
					]}
				/>
				<div id="wrapper">
					<div>
						<div>
							{children}
						</div>
					</div>
				</div>
			</>
		)}
	/>
)

Layout.propTypes = {
	children: PropTypes.node.isRequired,
}

export default Layout
