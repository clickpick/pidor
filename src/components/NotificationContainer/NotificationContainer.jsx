import React from 'react';
import { createPortal } from 'react-dom';

import './NotificationContainer.css';

const notificationsRoot = document.getElementById('notifications');

const NotificationContainer = ({ children }) => {
    const container = (
        <div className="NotificationContainer" children={children} />
    );

    return createPortal(container, notificationsRoot);
};

export default NotificationContainer;