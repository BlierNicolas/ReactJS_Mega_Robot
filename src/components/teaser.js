import React from 'react'
import Link from 'gatsby-link'
import {
    Card,
    CardTitle,
    CardText
} from 'reactstrap';
import lang_fr from '../langues/lang_fr.json';
import lang_en from '../langues/lang_en.json';

export default class Teaser extends React.Component {
    constructor(props) {
        super(props)

        /** Buffer de la langue par défaut */
        this.lang = lang_fr;

        /** Trouve la bonne langue */
        if (this.props.lang === "fr-CA") { this.lang = lang_fr; }
        if (this.props.lang === "en-US") { this.lang = lang_en; }
    }

    render() {
        return (
            <div>
                <Link className="btn btn-secondary w-100" to={this.props.btn_url + "/"}>
                    <Card className="text-center border-0">
                        <CardTitle><h3>{this.props.titre}</h3></CardTitle>
                        <CardText>{this.props.desc}</CardText>
                    </Card>
                </Link>
            </div>
        );
    }
}