import Constants from "expo-constants";
// import 'firebase/firestore';
import firebase, { initializeApp } from 'firebase/app';
import { getDatabase, ref, update, off, DataSnapshot, set, onValue } from 'firebase/database';
import { Dart, Round } from "../types";

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

// dart を登録する
export function RegisterDart(gameId: string, userId: string, roundCount: number, dartsCount: number, dart: Dart) {
	set(ref(database, `games/${gameId}/uids/${userId}/rounds/${roundCount}/darts/${dartsCount}`), dart);
};

// round の score を登録する
export function RegisterRoundScore(gameId: string, userId: string, roundCount: number, score: number) {
	set(ref(database, `games/${gameId}/uids/${userId}/rounds/${roundCount}/score`), score);
};

// game の totalScore を登録する
export function RegisterTotalScore(gameId: string, userId: string, totalScore: number) {
	set(ref(database, `games/${gameId}/uids/${userId}/totalScore`), totalScore);
};

// roundが追加されるのを監視する
// 返り値は監視を止めるための関数
export function ObserveDartAdded(gameId: string, userId: string, round: number, dartsCount: number, callbackFn: (snapshot: DataSnapshot) => void) {
	const databaseRef = ref(database, `games/${gameId}/uids/${userId}/rounds/${round}/darts/${dartsCount}`);
	onValue(databaseRef, callbackFn);
	return () => off(databaseRef, "value");
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

