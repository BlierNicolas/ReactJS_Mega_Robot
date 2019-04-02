import React from 'react';
import Link from 'gatsby-link';
import { connect } from 'react-redux'
import {
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    Button
} from 'reactstrap';
import { auth, provider } from '../firebase.js';
import 'firebase/database';
import 'firebase/auth';
import firebase from 'firebase/app';
import { chargeUserInfo, chargeUserData } from '../state/app';

class UserConnector extends React.Component {
    constructor(props) {
        super(props);

        this.login = this.login.bind(this);
        this.logout = this.logout.bind(this);
        this.checkAccount = this.checkAccount.bind(this);
        this.createMember = this.createMember.bind(this, 'idUser', 'Parameter', 'Parameter');
        this.createArmor = this.createArmor.bind(this);

        this.state = {
            userData: { ferraille: 0, prestige: 0, username: '' },
            user: null,
            isAuth: false,
            username: ''
        }

    }

    componentDidMount() {
        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                this.props.dispatch(chargeUserInfo(firebase.auth().currentUser))
                this.setState({ user: firebase.auth().currentUser })
                this.checkAccount();
            }
        });

        if (localStorage.getItem('user_connect') !== "vide") {
            this.props.dispatch(chargeUserInfo(localStorage.getItem('user_connect')))
            this.setState({ isAuth: true })
        }
    }

    login() {
        if (typeof window !== "undefined") {
            auth.signInWithPopup(provider)
                .then((result) => {
                    const user = result.user;

                    localStorage.setItem('user_connect', user);
                    this.checkAccount();
                    //this.state.user   à set state 
                    this.setState({ isAuth: true, user: user })

                    this.props.dispatch(chargeUserInfo(result.user))
                });
        }
    }

    logout() {
        if (typeof window !== "undefined") {
            auth.signOut()
                .then(() => {
                    this.setState({
                        user: null,
                        isAuth: false
                    });
                    localStorage.setItem('user_connect', "vide");
                    window.location.reload();
                });
        }
    }

    checkAccount = () => {
        let userFound = false;
        let scanDone = false;
        if (typeof window !== "undefined") {
            if (this.props.user !== null) {
                let listUsers = firebase.database().ref('mr_users');
                listUsers.on('value', (snapshot) => {
                    let usersIndiv = snapshot.val();
                    for (let item in usersIndiv) {
                        if (usersIndiv[item].user === this.props.user.email) {
                            this.props.dispatch(chargeUserData(usersIndiv[item]))
                            //this.setState({ userData: usersIndiv[item] });

                            this.setState({ idUser: item });

                            userFound = true;
                            this.checkArmor(item);

                            usersIndiv[item].isArmorGen = true;

                            var updates = {}
                            updates['/mr_users/' + item] = usersIndiv[item]

                            firebase.database().ref().update(updates);
                        }
                    }

                    scanDone = true

                    if (!this.state.loaded) { this.setState({ loaded: true }); }
                })

                if (!userFound && scanDone) {
                    const newUser = {
                        user: this.props.user.email,
                        username: this.props.user.displayName,
                        ferraille: 0,
                        prestige: 0,
                        fightWin: 0,
                        fightLose: 0,
                        isArmorGen: false
                    }

                    listUsers.push(newUser);
                    userFound = true;
                    this.checkArmor();
                }
            }
        }
    }

    checkArmor(idUser) {
        if (this.props.userData !== null) {
            if (!this.props.userData.isArmorGen) {
                this.createMember(idUser, "Bras Gauche", "Eau")
                this.createMember(idUser, "Bras Droit", "Feu")
                this.createMember(idUser, "Casque", "Neutre")
                this.createMember(idUser, "Jambes", "Terre")

                let idBrasGauche = ""
                let idBrasDroit = ""
                let idCasque = ""
                let idJambes = ""
                let idFound = 0

                let listMembers = firebase.database().ref('mr_member');
                listMembers.on('value', (snapshot) => {
                    let memberIndiv = snapshot.val();
                    for (let item1 in memberIndiv) {
                        if (memberIndiv[item1].userId === idUser) {
                            if (memberIndiv[item1].nom === "Bras Gauche") { idBrasGauche = item1; idFound++ }
                            if (memberIndiv[item1].nom === "Bras Droit") { idBrasDroit = item1; idFound++ }
                            if (memberIndiv[item1].nom === "Casque") { idCasque = item1; idFound++ }
                            if (memberIndiv[item1].nom === "Jambes") { idJambes = item1; idFound++ }
                            if (idFound === 4) { this.createArmor(idUser, idBrasGauche, idBrasDroit, idCasque, idJambes) }
                        }
                    }
                })
            }
        }
    }

    createMember(idUser, nomMembre, elementMembre) {
        let listMembres = firebase.database().ref('mr_member');

        const newMember = {
            userId: idUser,
            nom: nomMembre,
            vie: 10,
            tier: "A",
            niveau: 1,
            experience: 0,
            element: elementMembre,
            isLock: false,
            ameliorationPoint: 0,
            bonus1: null,
            bonus2: null,
            eau1: 0,
            eau2: 0,
            eau3: 0,
            feu1: 0,
            feu2: 0,
            feu3: 0,
            terre1: 0,
            terre2: 0,
            terre3: 0,
            neutre1: 0
        }
        listMembres.push(newMember)
    }

    createArmor(idUser, idBrasGauche, idBrasDroit, idCasque, idJambes) {
        let listArmures = firebase.database().ref('mr_armor');

        const newArmure = {
            userId: idUser,
            nom: "Armure de base",
            idBrasGauche: idBrasGauche,
            idBrasDroit: idBrasDroit,
            idCasque: idCasque,
            idJambes: idJambes
        }

        listArmures.push(newArmure)
    }


    render() {
        return (<UncontrolledDropdown nav inNavbar>
            <DropdownToggle nav caret className="text-white">
                {this.state.isAuth ? (this.props.userData !== null ? this.props.userData.username : '') : <span>{this.props.lang.header_connexion}</span>}
            </DropdownToggle>
            <DropdownMenu right className="no-padding">
                {this.state.isAuth ? <>
                    <DropdownItem>
                        <Link to={this.props.lang.header_armurerie_url + "/"}>{this.props.lang.header_armurerie}</Link>
                    </DropdownItem>
                    <DropdownItem>
                        <Link to={this.props.lang.header_magasin_url + "/"}>{this.props.lang.header_magasin}</Link>
                    </DropdownItem>
                    <DropdownItem>
                        <Link to={this.props.lang.header_histoire_url + "/"}>{this.props.lang.header_histoire}</Link>
                    </DropdownItem>
                    <DropdownItem>
                        <Link to={this.props.lang.header_tournois_url + "/"}>{this.props.lang.header_tournois}</Link>
                    </DropdownItem>
                    <DropdownItem>
                        <Link to={this.props.lang.header_club_url + "/"}>{this.props.lang.header_club}</Link>
                    </DropdownItem>
                    <DropdownItem>
                        <Link to={this.props.lang.header_profil_url + "/"}>{this.props.lang.header_profil}</Link>
                    </DropdownItem>
                    <div>
                        <Button color="primary" onClick={this.logout}>{this.props.lang.header_logout}</Button>
                    </div>
                </> : <div>
                        <Button color="primary" onClick={this.login}>{this.props.lang.header_login}</Button>
                    </div>}
            </DropdownMenu>
        </UncontrolledDropdown>);
    }
}

export default connect(state => ({
    user: state.app.user,
    userData: state.app.userData
}), null)(UserConnector)