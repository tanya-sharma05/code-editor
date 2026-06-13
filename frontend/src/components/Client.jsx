import React from 'react';
// react-avatar automatically creates user profile images using the user's name initials.
import Avatar from 'react-avatar';

// react-avatar will randomly pick one color from this array for different users.
const avatarColors = ['#FFFFFF', '#DDDDDD', '#BBBBBB'];

const Client = ({username, isCurrentUser}) => {
    return (
        /*
            Normal user: className="client"
            Current logged-in user: className="client currentUser"

            if isCurrentUser === true:
                add "currentUser"
            otherwise:
                add empty string ""
        */
        <div className={`client ${isCurrentUser ? 'currentUser' : ''}`}>
            {/* Avatar Component creates automatic profile avatar using initials */}
            <Avatar
                name={username}
                size="40"
                round={true}
                colors={avatarColors}
                /*
                    Foreground color controls text color inside avatar.
                */
                fgColor="#000000"
            />

            <span className="userName">{username}</span>
        </div>
    );
};

export default Client;