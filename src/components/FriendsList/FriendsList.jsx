import React from 'react';
import { string, arrayOf, object } from 'prop-types';
import classNames from 'classnames';

import './FriendsList.css';

import FriendsItem from 'components/FriendsItem';

const FriendsList = ({ className, data }) => {
    function renderFriendsItem(user, index) {
        return <FriendsItem key={index} className="FriendsList__FriendsItem" user={user} />
    }

    return <ul
        className={classNames(className, 'FriendsList')}
        children={data.map(renderFriendsItem)} />;
};

FriendsList.propTypes = {
    className: string,
    data: arrayOf(object).isRequired,
};

export default FriendsList;