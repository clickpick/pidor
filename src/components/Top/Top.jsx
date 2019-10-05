import React from 'react';
import { string, number, shape, object } from 'prop-types';
import classNames from 'classnames';

import './Top.css';

import wreath from 'svg/wreath.svg';
import wreathBg from 'svg/wreath-bg.svg';

const Top = ({ className, user, style, ...restProps }) => {
    const name = `${user.first_name} ${user.last_name}`;
    style = {
        ...style,
        '--top-werath': `url('${wreath}')`,
        '--top-werath-bg': `url('${wreathBg}')`,
    };

    return (
        <a
            className={classNames(className, 'Top')}
            href={`https://vk.com/id${user.vk_user_id}`}
            target="_blank"
            rel="noopener noreferrer"
            style={style}
            {...restProps}>
            <div className="Top__avatar">
                <img src={user.avatar_200} alt={name} />
            </div>
            <h2 className="Top__name" children={name} />
            <p className="Top__status" children="Пидор дня" />
        </a>
    );
};

Top.propTypes = {
    className: string,
    user: shape({
        vk_user_id: number,
        avatar_200: string,
    }),
    style: object
};

export default Top;