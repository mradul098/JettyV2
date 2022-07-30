export const incNumber = (num) => {
    return {
        type: 'INCREMENT'
    }
}

export const checkLoggedin= () =>{
    return {
        type:'LOGINCHECK'
    }
}

export const decNumber = () => {
    return {
        type: 'DECREMENT'
    }
};