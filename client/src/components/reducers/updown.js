const initialState = 0;
const isloggedin=sessionStorage.getItem("patterq-isLoggedIn") === "LOGGED_IN" ? true:false;

const changeTheNumber = (state = initialState, action) => {
    switch (action.type) {
        case "INCREMENT": return state + 1;
        case "DECREMENT": return state - 1;
        case "LOGINCHECK": return isloggedin;
        default: return state;
    }
}

export default changeTheNumber;