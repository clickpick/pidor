import React, { useState, useEffect } from 'react';
import connect from '@vkontakte/vk-connect';

import { View, ScreenSpinner } from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';

import Home from 'panels/Home';

import { getTimezoneOffset, parseQueryString } from 'helpers';
import { auth, friends } from 'api';

import './App.css';

const App = () => {
	const [popout, setPopout] = useState(<ScreenSpinner size="large" />);

	const [user, setUser] = useState(null);
	const [friendsList, setFriendsList] = useState(undefined);

	/**
	 * Авторизация
	 */
	useEffect(() => {
		window.axios = window.axios.create({
			baseURL: process.env.REACT_APP_API_URL,
			headers: {
				'Vk-Params': window.btoa(JSON.stringify({
					...parseQueryString(window.location.search),
					'utc_offset': getTimezoneOffset(),
				})),
				'Accept': 'application/json'
			},
		});

		function authorization(callback = f => f) {
			auth()
				.then(({ data }) => {
					setUser(data);
					callback();
				})
				.catch(() => console.log('auth'));
		}

		function fetchFriends(callback = f => f) {
			friends()
				.then(({ data }) => {
					setFriendsList(data);
				})
				.catch(({ response: { status } }) => {
					// закрытый профиль
					if (status === 403) {
						setFriendsList(null);
					}
				})
				.then(callback, callback);
		}

		function removePopout() {
			setPopout(null);
		}

		authorization(() => fetchFriends(removePopout));
	}, []);

	/**
	 * Подписка на события vk connect
	 */
	useEffect(() => {
		connect.subscribe(({ detail: { type, data }}) => {
			if (type === 'VKWebAppUpdateConfig') {
				const schemeAttribute = document.createAttribute('scheme');
				schemeAttribute.value = data.scheme ? data.scheme : 'client_light';
				document.body.attributes.setNamedItem(schemeAttribute);
			}
		});
	}, []);

	return (
		<View activePanel="home" popout={popout}>
			<Home id="home" user={user} friends={friendsList} />
		</View>
	);
}

export default App;

