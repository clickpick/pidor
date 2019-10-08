import React from 'react';
import { string, arrayOf, object, func } from 'prop-types';
import classNames from 'classnames';

import './FriendsList.css';

import FriendsItem from 'components/FriendsItem';

const FriendsList = ({ className, data, givePidorRateFriend }) => {
    function renderFriendsItem(user, index) {
        const handleButtonClick = () => givePidorRateFriend(user);

        return <FriendsItem
            key={index}
            className="FriendsList__FriendsItem"
            user={user}
            onClick={handleButtonClick} />;
    }

    return <ul
        className={classNames(className, 'FriendsList')}
        children={data.map(renderFriendsItem)} />;
};

FriendsList.propTypes = {
    className: string,
    data: arrayOf(object).isRequired,
    givePidorRateFriend: func.isRequired
};

export default FriendsList;