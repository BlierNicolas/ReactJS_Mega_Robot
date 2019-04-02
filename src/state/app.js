const initialState = {
    isDarkMode: false,
    user: "vide",
    userData: null,
    userArmor: null,
    idCasque: null,
    idBrasGauche: null,
    idBrasDroit: null,
    idJambes: null
};

const TOGGLE_DARKMODE = 'TOGGLE_DARKMODE';
const CHARGE_USER_INFO = 'CHARGE_USER_INGO';
const CHARGE_USERDATA = 'CHARGE_USERDATA';
const CHARGE_USERARMOR = 'CHARGE_USERARMOR';
const CHARGE_IDCASQUE = 'CHARGE_IDCASQUE';
const CHARGE_IDBRASGAUCHE = 'CHARGE_IDBRASGAUCHE';
const CHARGE_IDBRASDROIT = 'CHARGE_IDBRASDROIT';
const CHARGE_IDJAMBES = 'CHARGE_IDJAMBES';

export const toggleDarkMode = isDarkMode => ({ type: TOGGLE_DARKMODE, isDarkMode });
export const chargeUserInfo = user => ({ type: CHARGE_USER_INFO, user });
export const chargeUserData = userData => ({ type: CHARGE_USERDATA, userData });
export const chargeUserArmor = userArmor => ({ type: CHARGE_USERARMOR, userArmor });
export const chargeIdCasque = idCasque => ({ type: CHARGE_IDCASQUE, idCasque });
export const chargeIdBrasGauche = idBrasGauche => ({ type: CHARGE_IDBRASGAUCHE, idBrasGauche });
export const chargeIdBrasDroit = idBrasDroit => ({ type: CHARGE_IDBRASDROIT, idBrasDroit });
export const chargeIdJambes = idJambes => ({ type: CHARGE_IDJAMBES, idJambes });

export default (state = initialState, action) => {
    switch (action.type) {
        case TOGGLE_DARKMODE:
            return { ...state, isDarkMode: action.isDarkMode };
        case CHARGE_USER_INFO:
            return { ...state, user: action.user }
        case CHARGE_USERDATA:
            var def = { ferraille: 0, prestige: 0, username: '' }
            if (action.userData !== null) {
                def = action.userData
            }
            return { ...state, userData: def }
        case CHARGE_USERARMOR:
            return { ...state, userArmor: action.userArmor }
        case CHARGE_IDCASQUE:
            return { ...state, idCasque: action.idCasque }
        case CHARGE_IDBRASGAUCHE:
            return { ...state, idBrasGauche: action.idBrasGauche }
        case CHARGE_IDBRASDROIT:
            return { ...state, idBrasDroit: action.idBrasDroit }
        case CHARGE_IDJAMBES:
            return { ...state, idJambes: action.idJambes }
        default:
            return state;
    }
};