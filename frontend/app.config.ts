export default ({ config }: any) => {
	const firebaseConfig = {
		apiKey: "AIzaSyBd30plRPVtsD_mOPk48o2HtGEwXGBsK1Y",
		authDomain: "doradora-e51d2.firebaseapp.com",
		projectId: "doradora-e51d2",
		storageBucket: "doradora-e51d2.appspot.com",
		messagingSenderId: "225292847012",
		appId: "1:225292847012:web:358049f3416d042f902331",
		measurementId: "G-E412CS6VQH",
		databaseURL:"https://doradora-e51d2-default-rtdb.asia-southeast1.firebasedatabase.app/",
	};
	return {
		...config,
		extra: {
			firebaseConfig,
		},
	};
};