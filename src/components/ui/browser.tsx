'use client';

import { useRef, useState } from 'react';

interface BrowserProps {
    className?: string;
    initialUrl?: string;
}

export default function Browser({ className = '', initialUrl = 'https://www.google.com' }: BrowserProps) {
    const [url, setUrl] = useState(initialUrl);
    const [currentUrl, setCurrentUrl] = useState(initialUrl);
    const [isLoading, setIsLoading] = useState(false);
    const iframeRef = useRef<HTMLIFrameElement>(null);

    const handleNavigate = () => {
        if (url.trim()) {
            let formattedUrl = url.trim();

            // Add https:// if no protocol is specified
            if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
                formattedUrl = 'https://' + formattedUrl;
            }

            setCurrentUrl(formattedUrl);
            setIsLoading(true);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleNavigate();
        }
    };

    const handleBack = () => {
        if (iframeRef.current && iframeRef.current.contentWindow) {
            iframeRef.current.contentWindow.history.back();
        }
    };

    const handleForward = () => {
        if (iframeRef.current && iframeRef.current.contentWindow) {
            iframeRef.current.contentWindow.history.forward();
        }
    };

    const handleRefresh = () => {
        if (iframeRef.current) {
            iframeRef.current.src = currentUrl;
            setIsLoading(true);
        }
    };

    const handleLoad = () => {
        setIsLoading(false);
    };

    return (
        <div className={`flex flex-col h-full bg-white border border-gray-300 rounded-lg overflow-hidden ${className}`}>
            {/* Browser Controls */}
            <div className="flex items-center gap-2 p-3 bg-gray-100 border-b border-gray-300">
                {/* Navigation Buttons */}
                <div className="flex gap-1">
                    <button
                        onClick={handleBack}
                        className="p-2 rounded hover:bg-gray-200 transition-colors"
                        title="Geri"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <button
                        onClick={handleForward}
                        className="p-2 rounded hover:bg-gray-200 transition-colors"
                        title="İleri"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                    <button
                        onClick={handleRefresh}
                        className="p-2 rounded hover:bg-gray-200 transition-colors"
                        title="Yenile"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                    </button>
                </div>

                {/* URL Input */}
                <div className="flex-1 flex items-center gap-2">
                    <input
                        type="text"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="URL girin..."
                    />
                    <button
                        onClick={handleNavigate}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                    >
                        Git
                    </button>
                </div>

                {/* Loading Indicator */}
                {isLoading && (
                    <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                    </div>
                )}
            </div>

            {/* Browser Content */}
            <div className="flex-1 relative">
                <iframe
                    ref={iframeRef}
                    src={currentUrl}
                    className="w-full h-full border-0"
                    onLoad={handleLoad}
                    sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                    title="Browser Content"
                />
            </div>
        </div>
    );
}