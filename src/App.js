import React, { useState, useEffect } from 'react';
import connect from '@vkontakte/vk-connect';

import { View, ScreenSpinner } from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';

import Home from 'panels/Home';

import { getTimezoneOffset, parseQueryString } from 'helpers';
import { auth, friends, pidorOfTheDay, postStory } from 'api';
import * as VK from 'constants/vk';

import './App.css';

const App = () => {
	const [activePanel, setActivePanel] = useState('home');
	const [popout, setPopout] = useState(<ScreenSpinner size="large" />);

	const [user, setUser] = useState(null);
	const [pidorDay, setPidorDay] = useState(null);
	const [friendsList, setFriendsList] = useState(undefined);
	const [notifications, setNotifications] = useState([]);

	const [disabledPostStory, setDisabledPostStory] = useState(false);

	/**		
 	 * Организация переходов по панелям		
 	 */
	function changeActivePanel(e) {
		if (e.state) {
			setActivePanel(e.state.panel);
		} else {
			setActivePanel('home')
			window.history.pushState({ panel: 'home' }, 'home');
		}
	}

	function go(e) {
		setActivePanel(e.currentTarget.dataset.to)
		window.history.pushState({ panel: e.currentTarget.dataset.to }, e.currentTarget.dataset.to);
	}

	function goBack() {
		window.history.back();
	}

	useEffect(() => {
		window.addEventListener('popstate', (e) => {
			e.preventDefault();
			changeActivePanel(e);
		});

		window.history.pushState({ panel: activePanel }, activePanel);
		// eslint-disable-next-line react-hooks/exhaustive-deps		
	}, []);

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

	function startPostingStory() {
		addNotification(
			'Начинаем постить твою историю',
			'Погоди-ка чутка...',
			0
		);
	}

	function successPostedStory() {
		addNotification('Ура!', 'Ну ты не пидор', 500);
	}

	function failPostedStory() {
		addNotification(
			'Что-то пошло не так',
			'Не получилось у нас опубликовать твою историю',
			500
		);
	}

	function failGetPhotoUploadServer() {
		addNotification(
			'У нас не получилось запостить',
			'Тогда так и оставайся пидором',
			1000
		);
	}

	function deniedPostStory() {
		addNotification(
			'Не хочешь постить историю?',
			'Тогда так и оставайся пидором',
			500
		);
	}

	function disablePostStoryButton() {
		setDisabledPostStory(true);
	}

	function enablePostStoryButton() {
		setDisabledPostStory(false);
	}

	function postingStory() {
		disablePostStoryButton();

		connect.sendPromise('VKWebAppGetAuthToken', { app_id: VK.APP_ID, scope: 'stories' })
			.then(({ access_token }) => {
				connect.sendPromise('VKWebAppCallAPIMethod', {
					method: 'stories.getPhotoUploadServer',
					params: {
						access_token,
						add_to_news: 1,
						user_ids: [user.vk_user_id],
						link_text: 'open',
						link_url: 'https://vk.com/app' + VK.APP_ID,
						v: VK.API_VERSION
					}
				})
					.then(({ response }) => {
						startPostingStory();

						const uploadUrl = response.upload_url;
						
						postStory(uploadUrl)
							.then(({ status, data }) => {
								if (status === 200) {
									successPostedStory();
									setUser(data);
								}
							})
							.catch(failPostedStory)
							.then(enablePostStoryButton, enablePostStoryButton);
					})
					.catch(failGetPhotoUploadServer)
					.then(f => f, enablePostStoryButton);
			})
			.catch(deniedPostStory)
			.then(f => f, enablePostStoryButton);
	}

	return (
		<View activePanel={activePanel} popout={popout}>
			<Home
				id="home"
				loading={!Boolean(popout)}
				user={user}
				pidorDay={pidorDay}
				friends={friendsList}
				notifications={notifications}
				postingStory={postingStory}
				disabledPostStory={disabledPostStory} />
		</View>
	);
}

export default App;

