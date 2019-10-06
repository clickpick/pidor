import React from 'react';
import { string, shape, number, bool, arrayOf, object } from 'prop-types';

import './Home.css';

import { Panel } from '@vkontakte/vkui';
import Level from 'components/Level';
import Top from 'components/Top';
import Button from 'components/Button';
import FriendsList from 'components/FriendsList';

const Home = ({ id, user, friends }) => {
    return (
        <Panel id={id} className="Home">
            {(user) && <> 
                <Level
                    className="Home__Level"
                    progress={user.pidor_rate}
                    avatar={user.avatar_200}
                    title="Не, ну ты прям пидор..."
                    subtitle="К тебе часто парни подкатывают?" />

                <div className="Home__actions">
                    <div className="Home__action">
                        <Button
                            className="Home__Button"
                            size="medium"
                            children="Убрать 20%"
                            full />
                        <p className="Home__hint" children="Cторис с признанием" />
                    </div>
                    <div className="Home__action">
                        <Button
                            className="Home__Button"
                            size="medium"
                            children="Убрать 20%"
                            full />
                        <p className="Home__hint" children="Плоти и никто не узнает" />
                    </div>
                </div>

                <Top className="Home__Top" user={user} />

                {(friends === null) && 'Дай список друзуй'}

                {(Array.isArray(friends) && friends.length > 0) &&
                    <FriendsList className="Home__FriendsList" data={friends} />}
                {
                    // mock
                }
                <FriendsList className="Home__FriendsList" data={[user, user]} />
            </>}
        </Panel>
    );
};

Home.propTypes = {
    id: string.isRequired,
    user: shape({
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
};

export default Home;