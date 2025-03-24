import React from "react";
import { User } from "../types";
import Image from "next/image";

interface ChatProfileProps {
  user: User;
}

export const ChatProfile: React.FC<ChatProfileProps> = ({ user }) => {
  // Mock data for profile
  const mutualFriends = 5;
  const mutualServers = 3;
  const attachments = {
    documents: { count: 23, size: "100 MB" },
    photos: { count: 23, size: "100 MB" },
    music: { count: 23, size: "210 MB" },
    videos: { count: 9, size: "10 GB" },
  };

  return (
    <div className="w-80 border-l border-gray-200 p-5 overflow-y-auto bg-white">
      <div className="flex flex-col items-center mb-6">
        <Image
          src={user.avatar}
          alt={user.name}
          height={96}
          width={96}
          className="w-24 h-24 rounded-full mb-3"
        />
        <h2 className="text-xl font-semibold">{user.name}</h2>
        <p className="text-gray-500">@{user.name.toLowerCase()}</p>
      </div>

      <div className="mb-6">
        <h3 className="font-medium mb-2">Biography:</h3>
        <p className="text-gray-600 text-sm leading-relaxed">
          {user.bio ||
            "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable."}
        </p>
      </div>

      <div className="flex mb-4 border-b border-gray-200 pb-4">
        <div className="flex-1 text-center">
          <h4 className="font-medium">
            Mutual Friends{" "}
            <span className="text-purple-600">{mutualFriends}</span>
          </h4>
        </div>
        <div className="flex-1 text-center">
          <h4 className="font-medium">
            Mutual Servers{" "}
            <span className="text-purple-600">{mutualServers}</span>
          </h4>
        </div>
      </div>

      <div className="space-y-3 mb-6">
        <div className="flex items-center justify-between p-2 hover:bg-purple-50 rounded">
          <div className="flex items-center">
            <Image
              src="/avatars/sakura.png"
              alt="Sakura"
              height={32}
              width={32}
              className="w-8 h-8 rounded-full mr-2"
            />
            <span>Sakura</span>
          </div>
          <div className="flex gap-2">
            <button className="p-1 rounded-full hover:bg-purple-100 text-gray-600 hover:text-purple-600">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
            </button>
            <button className="p-1 rounded-full hover:bg-purple-100 text-gray-600 hover:text-purple-600">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </button>
          </div>
        </div>
        <div className="flex items-center justify-between p-2 hover:bg-purple-50 rounded">
          <div className="flex items-center">
            <Image
              src="/avatars/naruto.png"
              alt="Naruto"
              height={32}
              width={32}
              className="w-8 h-8 rounded-full mr-2"
            />
            <span>Naruto</span>
          </div>
          <div className="flex gap-2">
            <button className="p-1 rounded-full hover:bg-purple-100 text-gray-600 hover:text-purple-600">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
            </button>
            <button className="p-1 rounded-full hover:bg-purple-100 text-gray-600 hover:text-purple-600">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-3 mb-6">
        <div className="flex items-center justify-between py-2 border-b border-gray-200">
          <span>Favorite</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" />
            <div className="w-10 h-5 bg-gray-200 rounded-full peer peer-checked:bg-purple-600 peer-focus:ring-1 peer-focus:ring-purple-300 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
          </label>
        </div>
        <div className="flex items-center justify-between py-2 border-b border-gray-200">
          <span>Notification</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" defaultChecked />
            <div className="w-10 h-5 bg-gray-200 rounded-full peer peer-checked:bg-purple-600 peer-focus:ring-1 peer-focus:ring-purple-300 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
          </label>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="font-medium mb-3">Attachments:</h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between p-3 border-b border-gray-200 hover:bg-purple-50">
            <div className="flex items-center">
              <div className="text-2xl mr-3">📄</div>
              <div>
                <h4 className="font-medium">Document</h4>
                <p className="text-xs text-gray-500">
                  {attachments.documents.count} files •{" "}
                  {attachments.documents.size}
                </p>
              </div>
            </div>
            <button className="text-gray-500 hover:text-purple-600">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 12h.01M12 12h.01M8 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </button>
          </div>
          <div className="flex items-center justify-between p-3 border-b border-gray-200 hover:bg-purple-50">
            <div className="flex items-center">
              <div className="text-2xl mr-3">📷</div>
              <div>
                <h4 className="font-medium">Photos</h4>
                <p className="text-xs text-gray-500">
                  {attachments.photos.count} files • {attachments.photos.size}
                </p>
              </div>
            </div>
            <button className="text-gray-500 hover:text-purple-600">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 12h.01M12 12h.01M8 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </button>
          </div>
          <div className="flex items-center justify-between p-3 border-b border-gray-200 hover:bg-purple-50">
            <div className="flex items-center">
              <div className="text-2xl mr-3">🎵</div>
              <div>
                <h4 className="font-medium">Music</h4>
                <p className="text-xs text-gray-500">
                  {attachments.music.count} files • {attachments.music.size}
                </p>
              </div>
            </div>
            <button className="text-gray-500 hover:text-purple-600">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 12h.01M12 12h.01M8 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </button>
          </div>
          <div className="flex items-center justify-between p-3 border-b border-gray-200 hover:bg-purple-50">
            <div className="flex items-center">
              <div className="text-2xl mr-3">🎥</div>
              <div>
                <h4 className="font-medium">Videos</h4>
                <p className="text-xs text-gray-500">
                  {attachments.videos.count} files • {attachments.videos.size}
                </p>
              </div>
            </div>
            <button className="text-gray-500 hover:text-purple-600">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 12h.01M12 12h.01M8 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
