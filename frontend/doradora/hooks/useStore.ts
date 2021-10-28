import create, { GetState, SetState, StateCreator, StoreApi } from 'zustand';
import produce from 'immer';
import firebase from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged } from "firebase/auth";
import { getDatabase, ref as db_ref, set as db_set } from "firebase/database";
import app, { database as db, writeUserInfo } from './firebase';

type IUser = { uid: string }
type ISignIn = {};
type IPreferences = {};

type StateSlice<T extends object> = StateCreator<T> | StoreApi<T>;




interface IAuthSlice {
	userToken?: string;
	user?: IUser;
	signIn: () => Promise<void>;
	// writeUserInfo: (userId: string, name: string, email: string, imageUrl: string) => boolean;
}

const createAuthSlice: StateSlice<IAuthSlice> = (
	set,
	get,
) => ({
	isLoading: true,
	userToken: undefined,
	user: undefined,
	signIn: async () => {
		// const { access_token, user } = await _signIn();
		const auth = getAuth(app);
		if (auth.currentUser) {
			console.log('signed user', auth.currentUser.uid)
		} else {
			set(produce(state => { state.isLoading = true }));
			signInAnonymously(auth)
				.then((res) => {
					// Signed in..
					writeUserInfo(res.user.uid, { username: 'Anonymous' });
					console.log('signup anonymously', res.user.uid);
				})
				.catch((error) => {
					const errorCode = error.code;
					const errorMessage = error.message;
					console.log('wrr')
				});
		}
		onAuthStateChanged(auth, (auth_user) => {
			if (auth_user) {
				set(produce(state => {
					state.user = ({ uid: auth_user.uid});
					state.isLoading = false;
					// state.userToken = access_token;
					console.log('signIn', auth_user.uid);
				}
				))
			} else {
				// User is signed out
				// ...
			}
		});
	},

});

interface IPreferencesSlice {
	preferences?: IPreferences;
}

const createPreferencesSlice: StateSlice<IPreferencesSlice> = () => ({
	// [...]
});

interface IStore extends IAuthSlice, IPreferencesSlice { }

export const useStore = create<IStore>((set, get, api) => ({
	...createAuthSlice(
		set as unknown as SetState<IAuthSlice>,
		get as GetState<IAuthSlice>,
		api as unknown as StoreApi<IAuthSlice>,
	),
	...createPreferencesSlice(
		set as unknown as SetState<IPreferencesSlice>,
		get as GetState<IPreferencesSlice>,
		api as unknown as StoreApi<IPreferencesSlice>,
	),
}));