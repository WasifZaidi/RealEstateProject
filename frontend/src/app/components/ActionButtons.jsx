"use client"
import { HeartIcon, ShareIcon, } from '@heroicons/react/24/solid';
import {
    HeartIcon as HeartSolid,
    ShareIcon as ShareSolid,
} from "@heroicons/react/24/solid";
import React from 'react'

const ActionButtons = ({ isFeatured, isPremium }) => {
    const [isFavorited, setIsFavorited] = React.useState(false);
    const [isShared, setIsShared] = React.useState(false);
    return (
        <div className="flex space-x-3">
            <button
                onClick={() => setIsFavorited(!isFavorited)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-[50px] border transition-colors duration-200 ${isFavorited
                        ? 'bg-red-50 border-red-200 text-red-600'
                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
            >
                {isFavorited ? (
                    <HeartSolid className="w-5 h-5" />
                ) : (
                    <HeartIcon className="w-5 h-5" />
                )}
                <span>Save</span>
            </button>

            <button
                onClick={() => {
                    setIsShared(true);
                    navigator.clipboard.writeText(window.location.href);
                    setTimeout(() => setIsShared(false), 2000);
                }}
                className={`flex items-center space-x-2 px-4 py-2 rounded-[50px] border transition-colors duration-200 ${isShared
                        ? 'bg-green-50 border-green-200 text-green-600'
                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
            >
                {isShared ? (
                    <ShareSolid className="w-5 h-5" />
                ) : (
                    <ShareIcon className="w-5 h-5" />
                )}
                <span>{isShared ? 'Copied!' : 'Share'}</span>
            </button>
        </div>
    );
}

export default ActionButtons