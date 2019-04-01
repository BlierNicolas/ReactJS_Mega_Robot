const initialState = {
    isDarkMode: false,
    user: "vide",
    userData: null,
    userArmor: null
};

const TOGGLE_DARKMODE = 'TOGGLE_DARKMODE';
const CHARGE_USER_INFO = 'CHARGE_USER_INGO';
const CHARGE_USERDATA = 'CHARGE_USERDATA';
const CHARGE_USERARMOR = 'CHARGE_USERARMOR';
export const toggleDarkMode = isDarkMode => ({ type: TOGGLE_DARKMODE, isDarkMode });
export const chargeUserInfo = user => ({ type: CHARGE_USER_INFO, user });
export const chargeUserData = userData => ({ type: CHARGE_USERDATA, userData });
export const chargeUserArmor = userArmor => ({ type: CHARGE_USERARMOR, userArmor });

export default (state = initialState, action) => {
    switch (action.type) {
        case TOGGLE_DARKMODE:
            //console.log("Action: " + action.isDarkMode)
            return { ...state, isDarkMode: action.isDarkMode };
        case CHARGE_USER_INFO:
            //console.log(action.user)
            return { ...state, user: action.user }
        case CHARGE_USERDATA:
            var def = { ferraille: 0, prestige: 0, username: '' }
            if (action.userData !== null) {
                def = action.userData
            }
            return { ...state, userData: def }
        case CHARGE_USERARMOR:
            return { ...state, userArmor: action.userArmor }
        default:
            return state;
    }
};