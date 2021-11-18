import Constants from "expo-constants";
// import 'firebase/firestore';
import firebase, { initializeApp } from 'firebase/app';
import { getDatabase, ref, update, off, DataSnapshot, set, onValue, push, runTransaction, remove } from 'firebase/database';
import { Dart, Game } from "../types";

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

// dart が追加されるのを監視する．返り値は監視を止めるための関数
export function ObserveDartAdded(gameId: string, userId: string, round: number, dartsCount: number, callbackFn: (snapshot: DataSnapshot) => void) {
	const databaseRef = ref(database, `games/${gameId}/uids/${userId}/rounds/${round}/darts/${dartsCount}`);
	onValue(databaseRef, callbackFn);
	return () => off(databaseRef, "value");
};

// ゲームを作成する
export function CreateGame(game: Game) {
	const pushRef = push(ref(database, 'games'), game);
	console.log(`new game id is ${pushRef.key}`);
	return pushRef.key; // key が null になるのは root に push した時のみ
};

// ゲーム削除
export function RemoveGame(gameId: string) {
	remove(ref(database, `games/${gameId}`));
};

// 部屋を建てる
export function CreateRoom(gameId: string, userId: string) {
	const pushRef = push(ref(database, 'rooms'), {gameId: gameId, host: userId});
	console.log(`new room id is ${pushRef.key}`);
	return pushRef.key;
};

// 部屋に参加する．
type Room = {gameId: string, host: string, opponent?: string};
type JoinRoomRes = {gameId?: string, host?: string, joined: boolean, isExist: boolean,};

export async function JoinRoom(roomId: string, opponentId: string): Promise<JoinRoomRes> {
	const result = await runTransaction(ref(database, `rooms/${roomId}`), (room: Room | null) => {
		if (room === null) { // null の時はそのまま返す必要がある．
			return room;
		} else if (room.opponent) { // 既に room に2人入っていたら
			// return; // 何も返さないことで result.committed == false になる
		} else { // 2人入っていなかったら
			room.opponent = opponentId;
			return room;
		}
	});

	if (result.committed) {
		const room: Room | null = result.snapshot.val(); // 部屋がない時は null になる
		console.log(room ? `join ${roomId}` : `room ${roomId} is not exist`);
		return {gameId: room?.gameId, host: room?.host, joined: !!room, isExist: !!room};
	} else { // 既に2人いた時
		console.log(`room ${roomId} is full`);
		return {joined: false, isExist: true};
	}
};

// 部屋に参加するのを監視する．返り値は監視をやめさせる関数
export function ObserveRoomJoined(roomId: string, callbackFn: (snapshot: DataSnapshot) => void) {
	const databaseRef = ref(database, `rooms/${roomId}/opponent`);
	onValue(databaseRef, callbackFn);
	return () => off(databaseRef, "value");
};

// 部屋削除
export function RemoveRoom(roomId: string) {
	remove(ref(database, `rooms/${roomId}`))
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

