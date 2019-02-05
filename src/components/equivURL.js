import React from 'react'
import Link from 'gatsby-link'
import {
    Button
} from 'reactstrap';

export default class EquivURL extends React.Component {
    render() {
        return (
            <div className="equiv">
                <Link className="text-white" to={this.props.url}>
                    <Button className="float-right" color="primary">{this.props.label}</Button>
                </Link>
            </div>
        );
    }
}