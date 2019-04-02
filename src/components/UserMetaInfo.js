import React from 'react';
import { connect } from 'react-redux'
import {
    NavItem
} from 'reactstrap';

class UserMetaInfo extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isAuth: false
        };
    }

    componentDidMount() {
        if (localStorage.getItem('user_connect') !== "vide") {
            this.setState({isAuth: true})
		}
    }

    render() {
        return (
            this.state.isAuth ?
                (<React.Fragment>
                    <NavItem>
                        <div className="text-white nav-link">Ferraille: {this.props.userData !== null ? this.props.userData.ferraille : 0}</div>
                    </NavItem>
                    <NavItem>
                        <div className="text-white nav-link">Prestige: {this.props.userData !== null ? this.props.userData.prestige : 0}</div>
                    </NavItem>
                </React.Fragment>) :
                ('')
        );
    }
}

export default connect(state => ({
    userData: state.app.userData
}), null)(UserMetaInfo)