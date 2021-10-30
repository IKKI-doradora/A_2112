import Constants from "expo-constants";
// import 'firebase/firestore';
import firebase, { initializeApp } from 'firebase/app';
import { getDatabase, set, ref, push, update } from 'firebase/database';

// import { getAuth, onAuthStateChanged, FacebookAuthProvider, signInWithCredential, signInAnonymously, signInWithEmailAndPassword } from 'firebase/auth';


const app = initializeApp(Constants.manifest?.extra?.firebaseConfig);

export const database = getDatabase(app);

export function writeUserInfo(userId: string, { username = '', email = '', imageUrl = '' }) {
	update(ref(database, 'users/' + userId), {
		username: username,
		// email: email,
		// profile_picture: imageUrl
	});
	return true
}



export default app;




// auth()
// 	.createUserWithEmailAndPassword('jane.doe@example.com', 'SuperSecretPassword!')
// 	.then(() => {
// 		console.log('User account created & signed in!');
// 	})
// 	.catch(error => {
// 		if (error.code === 'auth/email-already-in-use') {
// 			console.log('That email address is already in use!');
// 		}

// 		if (error.code === 'auth/invalid-email') {
// 			console.log('That email address is invalid!');
// 		}

// 		console.error(error);
// 	});
// export const auth = getAuth();
// let email = 'test@test.com'; let password = 'doradora';

// signInWithEmailAndPassword(auth, email, password)
// 	.then((userCredential) => {
// 		// Signed in
// 		const user = userCredential.user;
// 		console.log('signed,', user);
// 		// ...
// 	})
// 	.catch((error) => {
// 		const errorCode = error.code;
// 		const errorMessage = error.message;
// 		console.log(errorMessage);
// 	});

