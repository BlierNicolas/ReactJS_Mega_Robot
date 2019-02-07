import React from 'react'
import Link from 'gatsby-link'
import {
    Button,
    Card,
    CardBody,
    CardTitle,
    CardText
} from 'reactstrap';

export default class Teaser extends React.Component {
    render() {
        return (
            <div>
                <Card className="text-center border-0">
                    <CardTitle>{this.props.titre}</CardTitle>
                    <CardText>{this.props.desc}</CardText>
                    <Button>{this.props.btn_label}</Button>
                </Card>
            </div>
        );
    }
}