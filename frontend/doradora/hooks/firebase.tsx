import { fromTexture } from "@tensorflow/tfjs-react-native";
import Constants from "expo-constants";
// import 'firebase/firestore';
import firebase, { initializeApp } from 'firebase/app';
import { getDatabase, set, ref, push, update, get } from 'firebase/database';
import { getStorage } from 'firebase/storage';
import { GameDetail } from "../types";


// import { getAuth, onAuthStateChanged, FacebookAuthProvider, signInWithCredential, signInAnonymously, signInWithEmailAndPassword } from 'firebase/auth';


const app = initializeApp(Constants.manifest?.extra?.firebaseConfig);

export const database = getDatabase(app);
export const storage = getStorage(app);

export function writeUserInfo(userId: string, { username = '', email = '', imageUrl = '' }) {
	update(ref(database, 'users/' + userId), {
		username: username,
		// email: email,
		// profile_picture: imageUrl
	});
	return true
}

// gameIDは後で
export function PushGameDetail(userID: string, detail: GameDetail): void {
	update(ref(database, "games/adsfasgasdfadsfasdg/uids/" + userID), {
		...detail
	});
};

export const Forms = {
	getList: async function getFormList(uid: string) {
		uid = '4r7K0FAau3hkQI7l9SnCC3iYcje2'
		const forms = await get(ref(database, `forms/${uid}`))
		return forms
	}
}


console.log(storage)

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

