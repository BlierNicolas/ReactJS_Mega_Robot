import React from "react"
import { Link } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"

const SecondPage = () => (
  <Layout>
    <SEO title="Page deux" />
    <h1>Salut de la page deux</h1>
    <p>Bienvenu sur la page 2</p>
    <Link to="/">Retourner sur l'accueil</Link>
  </Layout>
)

export default SecondPage
