import React from 'react';
import { string, shape, number, bool, arrayOf, object, func } from 'prop-types';

import './Home.css';

import { Panel } from '@vkontakte/vkui';
import Level from 'components/Level';
import PidorDay from 'components/PidorDay';
import Button from 'components/Button';
import FriendsList from 'components/FriendsList';

import * as USER_ACTION from 'constants/userAction';
import { DONATE_LINK } from 'constants/vk';

const Home = ({ id, loading, user, pidorDay, friends, disabledPostStory, getPreviewStory }) => {
    return (
        <Panel id={id} className="Home">
            {(loading) && <>
                <Level
                    className="Home__Level"
                    progress={user.pidor_rate}
                    avatar={user.avatar_200}
                    gif={user.gif}
                    title={user.phrase.title}
                    subtitle={user.phrase.subtitle} />

                <div className="Home__actions">
                    <div className="Home__action">
                        <Button
                            className="Home__Button"
                            size="medium"
                            children={(Boolean(user.published_stories.find((action) => action === USER_ACTION.CONFESSION))
                                ? 'Поделиться'
                                : 'Убрать 20%')}
                            full
                            onClick={getPreviewStory}
                            data-to="preview"
                            disabled={disabledPostStory} />
                        <p className="Home__hint">
                            Cторис<br/>с признанием
                        </p>
                    </div>
                    <div className="Home__action">
                        <Button
                            href={DONATE_LINK}
                            className="Home__Button"
                            size="medium"
                            children="Убрать до 0%"
                            full />
                        <p className="Home__hint">
                            Плоти, и никто<br/>не узнает
                        </p>
                    </div>
                </div>

                {(pidorDay) && <PidorDay className="Home__PidorDay" user={pidorDay} />}

                {(Array.isArray(friends) && friends.length > 0) && <>
                    <h2 className="Home__title">Твои друзия – пидоры</h2>
                    <FriendsList className="Home__FriendsList" data={friends} />
                </>}
            </>}
        </Panel>
    );
};

Home.propTypes = {
    id: string.isRequired,
    loading: bool,
    user: shape({
        vk_user_id: number,
        first_name: string,
        last_name: string,
        avatar_200: string,
        utc_offset: number,
        messages_are_enabled: bool,
        notifications_are_enabled: bool,
        is_pidor: bool,
        pidor_rate: number,
        published_stories: arrayOf(string),
    }),
    pidorDay: shape({
        vk_user_id: number,
        first_name: string,
        last_name: string,
        avatar_200: string,
        utc_offset: number,
        messages_are_enabled: bool,
        notifications_are_enabled: bool,
        is_pidor: bool,
        pidor_rate: number
    }),
    friends: arrayOf(object),
    disabledPostStory: bool,
    getPreviewStory: func.isRequired
};

export default Home;