
import React from 'react';
import { Profile } from '../types';

interface InboxScreenProps {
  currentUser: Profile | null;
}

const InboxScreen: React.FC<InboxScreenProps> = ({ currentUser }) => {
  const chats = [
    { id: 'c1', name: 'EventX Organizers', lastMsg: 'See you at the venue by 2 PM sharp!', time: '12:45', unread: true },
    { id: 'c2', name: 'Suresh (Coordinator)', lastMsg: 'Dress code updated to formal white.', time: 'Yesterday', unread: false }
  ];

  return (
    <div className="p-0 flex flex-col h-full bg-white min-h-[calc(100vh-144px)]">
      <div className="p-6 bg-white border-b">
        <h2 className="text-3xl font-extrabold text-[#054752]">Inbox</h2>
      </div>
      
      <div className="flex-1 divide-y divide-gray-50">
        {chats.map(chat => (
          <div key={chat.id} className="flex items-center space-x-4 p-5 hover:bg-gray-50 cursor-pointer transition-colors relative">
            <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center text-[#00AFF5] font-bold text-xl">
              {chat.name[0]}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-baseline">
                <h3 className={`font-bold truncate ${chat.unread ? 'text-black' : 'text-gray-600'}`}>{chat.name}</h3>
                <span className="text-[10px] text-gray-400 font-bold">{chat.time}</span>
              </div>
              <p className={`text-sm truncate mt-0.5 ${chat.unread ? 'text-[#054752] font-semibold' : 'text-gray-400 font-medium'}`}>
                {chat.lastMsg}
              </p>
            </div>
            {chat.unread && (
              <div className="absolute left-4 top-4 w-3 h-3 bg-[#00AFF5] rounded-full border-2 border-white shadow-sm" />
            )}
          </div>
        ))}
      </div>
      
      <div className="p-8 text-center bg-gray-50 flex flex-col items-center justify-center space-y-4">
        <svg className="h-12 w-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest max-w-[200px]">
          Chats are enabled once your application is accepted.
        </p>
      </div>
    </div>
  );
};

export default InboxScreen;
