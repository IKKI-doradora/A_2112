import Constants from "expo-constants";
// import 'firebase/firestore';
import firebase, { initializeApp } from 'firebase/app';
import { getDatabase, ref, update, off, DataSnapshot, set, onChildAdded } from 'firebase/database';
import { Round } from "../types";

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

// round を登録する
export function RegisterRound(gameId: string, userId: string, roundCount: number, round: Round) {
	set(ref(database, `games/${gameId}/uids/${userId}/rounds/${roundCount}`), round);
};

// roundが追加されるのを監視する
// 返り値は監視を止めるための関数
export function ObserveRoundAdded(gameId: string, userId: string, callbackFn: (snapshot: DataSnapshot) => void) {
	const databaseRef = ref(database, `games/${gameId}/uids/${userId}/rounds`);
	onChildAdded(databaseRef, callbackFn);
	return () => off(databaseRef, "child_added");
};

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

