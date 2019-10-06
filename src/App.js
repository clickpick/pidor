import React, { useState, useEffect } from 'react';
import connect from '@vkontakte/vk-connect';

import { View, ScreenSpinner } from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';

import Home from 'panels/Home';

import { getTimezoneOffset, parseQueryString } from 'helpers';
import { auth, friends, pidorOfTheDay } from 'api';

import './App.css';

const App = () => {
	const [popout, setPopout] = useState(<ScreenSpinner size="large" />);

	const [user, setUser] = useState(null);
	const [pidorDay, setPidorDay] = useState(null);
	const [friendsList, setFriendsList] = useState(undefined);

	const [notifications, setNotifications] = useState([]);

	function addNotification(title, subtitle, duration) {
		setTimeout(() => {
			const index = notifications.length;
			const nextNotifications = [...notifications].concat({ title, subtitle });
			
			setNotifications(nextNotifications);
			removeNotification(index);
		}, duration);
	}

	function removeNotification(index, duration = 4000) {
		setTimeout(() => {
			const nextNotifications = notifications.filter(filterNotification, index);
			setNotifications(nextNotifications);
		}, duration);
	}

	function filterNotification(_, index) {
		return index !== this;
	}

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
			return friends()
				.then(({ data }) => {
					setFriendsList(data);
				})
				.catch(({ response: { status } }) => {
					// закрытый профиль
					if (status === 403) {
						addNotification(
							'Твой профиль закрыт',
							'Мы не можем показать тебе, кто из твоих друзей пидор :(',
							5000
						);
					}
				})
				.then(callback, callback);
		}

		function fetchPidorOfTheDay(callback = f => f) {
			return pidorOfTheDay()
				.then(({ data }) => {
					setPidorDay(data);
				})
				.catch(() => console.log('fetch pidor'))
				.then(callback, callback);
		}

		function fetchAll() {
			Promise.all([fetchFriends(), fetchPidorOfTheDay()]).then(
				removePopout,
				() => console.log('err')
			)
		}

		function removePopout() {
			setPopout(null);
		}

		authorization(fetchAll);
		// eslint-disable-next-line react-hooks/exhaustive-deps
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
			<Home
				id="home"
				loading={!Boolean(popout)}
				user={user}
				pidorDay={pidorDay}
				friends={friendsList}
				notifications={notifications} />
		</View>
	);
}

export default App;

