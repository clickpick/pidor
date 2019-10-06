import React from 'react';
import { string } from 'prop-types';

import './Notification.css';

import persik from 'images/persik.png';

const Notification = ({ title, subtitle, ...restProps }) =>
    <div className="Notification" {...restProps}>
        <div className="Notification__before">
            <img className="Notification__persik" src={persik} alt="persik" />
        </div>
        <div className="Notification__main">
            <h2 className="Notification__title" children={title} />
            <p className="Notification__subtitle" children={subtitle} />
        </div>
    </div>;

Notification.propTypes = {
    title: string.isRequired,
    subtitle: string.isRequired
};

export default Notification;