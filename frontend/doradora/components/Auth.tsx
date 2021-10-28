import { useStore } from '../hooks/useStore';
import React from 'react';

type AuthProps = {
	children: JSX.Element
}

export default function Auth(props: AuthProps) {
	const signIn = useStore(s => s.signIn);
	const user = useStore(s => s.user);


	if (user) {
		return (
			<>
				{props.children}
			</>
		)
	} else {
		signIn();
		return null
	}

}

