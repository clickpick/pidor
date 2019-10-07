import React from 'react';
import { string, shape, number } from 'prop-types';
import classNames from 'classnames';

import './FriendsItem.css';

import Button from 'components/Button';
import { ReactComponent as IconPlus } from 'svg/plus.svg';

const FriendsItem = ({ className, user, onClick, ...restProps }) => {
    const name = `${user.first_name} ${user.last_name}`;

    function handleButtonClick(e) {
        e.preventDefault();
        e.stopPropagation();

        if (onClick) {
            onClick();
        }
    }

    return (
        <li className={classNames(className, 'FriendsItem')} {...restProps}>
            <a
                className="FriendsItem__link"
                href={`https://vk.com/id${user.vk_user_id}`}
                target="_blank"
                rel="noopener noreferrer">
                <div className="FriendsItem__before">
                    <img className="FriendsItem__avatar" src={user.avatar_200} alt={name} />
                </div>
                <div className="FriendsItem__main">
                    <h3 className="FriendsItem__name" children={name} />
                    <p className="FriendsItem__rate" children={`Пидор на ${user.pidor_rate}%`} />
                </div>
                <div className="FriendsItem__aside">
                    <Button
                        className="FriendsItem__Button"
                        children={<IconPlus />}
                        shape="circle"
                        onClick={handleButtonClick} />
                </div>
            </a>
        </li>
    );
};

FriendsItem.propTypes = {
    className: string,
    user: shape({
        vk_user_id: number,
        first_name: string,
        last_name: string,
        avatar_200: string,
        pidor_rate: number
    })
};

export default FriendsItem;