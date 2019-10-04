import React from 'react';
import { string, shape, number, bool } from 'prop-types';

import { Panel, PanelHeader } from '@vkontakte/vkui';

const Home = ({ id, user }) => {
    return (
        <Panel id={id}>
            <PanelHeader>{(user) ? 'Пидор дня' : 'Погоди...'}</PanelHeader>
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
    })
};

export default Home;