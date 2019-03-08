import React from 'react';
import {
    NavItem
} from 'reactstrap';

export default class UserMetaInfo extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            userData: [],
            isAuth: false
        };
    }

    render() {
        return (
            this.state.isAuth ?
                (<div>
                    <NavItem>
                        <div className="text-white nav-link">Ferraille: {this.state.userData.ferraille}</div>
                    </NavItem>
                    <NavItem>
                        <div className="text-white nav-link">Prestige: {this.state.userData.prestige}</div>
                    </NavItem>
                </div>) :
                ('')
        );
    }
}
