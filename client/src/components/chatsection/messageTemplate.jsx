/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from 'react';
import moment from 'moment'; // to format the date

export const MessageTemplate = ({ chat, userId }) => {
  const isSender = chat.sender._id === userId;
  const messageClass = isSender ? 'bg-deepblue-100 text-white' : 'bg-deepblue-800 text-white';
  const containerClass = isSender ? 'justify-end' : 'justify-start';

  return (
    <div className={`flex ${containerClass} my-2 mx-3`}>
      <div className={`max-w-xs md:max-w-sm lg:max-w-md px-4 py-2 rounded-lg shadow-md ${messageClass}`}>
        <div className="break-words">
          <p>{chat.content}</p>
        </div>
        <div className="text-xs text-gray-400 text-right mt-1">
          {moment(chat.createdAt).format('MMM DD, YYYY h:mm A')}
        </div>
      </div>
    </div>
  );
};
