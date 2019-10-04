import React from 'react';
import { string, shape, number, bool, func } from 'prop-types';

import { Panel, PanelHeader, Div, Avatar, Button } from '@vkontakte/vkui';

import './Home.css';

const Home = ({ id, user, go }) => {
    return (
        <Panel id={id} className="Home">
            <PanelHeader>{(user) ? 'Пидор дня' : 'Погоди...'}</PanelHeader>

            {(user) && <> 
                <Div>
                    <Avatar src={user.avatar_200} size={80} /> 
                    {(user.is_pidor) ? 'Ты пидор' : 'Сегодня ты не пидор'}
                </Div>
                <Div>
                    <Button
                        className="Home__Button"
                        size="xl"
                        level="secondary"
                        children="Найти пидора в друзей"
                        data-to="friends"
                        onClick={go} />
                    <Button className="Home__Button" size="xl" level="secondary">Топ пидоров</Button>
                    <Button className="Home__Button" size="xl" level="primary">Не хочу быть пидором</Button>
                </Div>
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
    go: func.isRequired
};

export default Home;