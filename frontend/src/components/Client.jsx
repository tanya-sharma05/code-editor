import React from 'react';
import Avatar from 'react-avatar';

const avatarColors = ['#FFFFFF', '#DDDDDD', '#BBBBBB'];

const Client = ({ username, isCurrentUser }) => {
    return (
        <div className={`client ${isCurrentUser ? 'currentUser' : ''}`}>
            <Avatar
                name={username}
                size="40"
                round={true}
                colors={avatarColors}
                fgColor="#000000"
            />
            <span className="userName">{username}</span>
        </div>
    );
};

export default Client;