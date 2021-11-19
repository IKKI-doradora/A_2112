import React from 'react';
import { RefreshControl, View, FlatList, SafeAreaView, ScrollView, StyleSheet, Text } from 'react-native';
import { Forms } from '../hooks/firebase'
import { useStore } from '../hooks/useStore';



const DATA = [
	{
		id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
		title: 'First Item',
	},
	{
		id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
		title: 'Second Item',
	},
	{
		id: '58694a0f-3da1-471f-bd96-145571e29d74',
		title: 'Third Item',
	},
	{
		id: '58694a0f-3da1-471f-bd96-145571e29d75',
		title: 'Third Item',
	},
	{
		id: '58694a0f-3da1-471f-bd96-145571e29d76',
		title: 'Third Item',
	},
	{
		id: '58694a0f-3da1-471f-bd96-145571e29d77',
		title: 'Third Item',
	},
	{
		id: '58694a0f-3da1-471f-bd96-145571e29d78',
		title: 'Third Item',
	},
];

interface Item {
	title: string
}

const Item = ({ title }: Item) => (
	<View style={styles.item}>
		<Text style={styles.title}>{title}</Text>
	</View>
);


const wait = (timeout: number) => {
	return new Promise(resolve => setTimeout(resolve, timeout));
}

const FormListScreen = () => {
	const user = useStore(s => s.user);
	const [refreshing, setRefreshing] = React.useState(false);
	const [forms, setForms] = React.useState();

	const renderItem = ({ item }: { item: Item }) => (
		<Item {...item} />
	);

	const onRefresh = React.useCallback(() => {
		setRefreshing(true);
		Forms.getList(user?.uid as string).then(d => { console.log(d); setRefreshing(false) });
		// wait(2000).then(() => setRefreshing(false));
	}, []);

	return (
		// <SafeAreaView style={styles.container}>
		<FlatList
			contentContainerStyle={styles.scrollView}
			data={DATA}
			renderItem={renderItem}
			keyExtractor={item => item.id}
			refreshControl={
				<RefreshControl
					refreshing={refreshing}
					onRefresh={onRefresh}
				/>
			}
		/>
		// </SafeAreaView >
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	scrollView: {
		flexGrow: 1,
		backgroundColor: 'pink',
		alignItems: 'center',
		justifyContent: 'center',
	},
	item: {
		backgroundColor: '#f9c2ff',
		padding: 20,
		marginVertical: 8,
		marginHorizontal: 16,
	},
	title: {
		fontSize: 32,
	},
});

export default FormListScreen;