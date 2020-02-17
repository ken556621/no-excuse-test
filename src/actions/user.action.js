import firebase from '../components/common/firebase';

export function updateUser(uid, name, email, photo, cb) {
    return  {
        type: "UPDATE_USER",
        uid,
        name,
        email,
        photo
    };
}

export function signInWithEmailAndPassword(email, password){
    return dispatch => {
        // firebase.auth().signInWithEmailAndPassword(email, password).catch((error) => {
        //     // Handle Errors here.
        //     const errorCode = error.code;
        //     this.setState({
        //         emailValid: true,
        //         errorMessage: errorCode
        //     })
        // }).then(res => {
        //     if(!res){
        //         return
        //     }
        //     const { uid, displayName, email, photoURL } = res.user;
        //     dispatch(updateUser(uid, displayName, email, photoURL));
        //     dispatch({ type: 'LOGIN_SUCCESS' });
        //     history.push('/member');
        // });
    };
}