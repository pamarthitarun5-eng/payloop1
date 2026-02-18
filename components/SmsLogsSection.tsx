
import React from 'react';
import { SmsLog } from '../types';
import { MessageSquareIcon } from './Icons';

interface SmsLogsSectionProps {
    logs: SmsLog[];
}

const SmsLogsSection: React.FC<SmsLogsSectionProps> = ({ logs }) => {
    return (
        <div className="animate-fadeIn">
            <h1 className="text-4xl md:text-5xl font-serif mb-8 pb-6 border-b border-gray-200">SMS Gateway Logs</h1>
            <div className="bg-white border border-gray-200 p-4 sm:p-8">
                {logs.length === 0 ? (
                    <p className="text-gray-500 text-center py-10">No SMS logs found. Logs will appear here after transactions.</p>
                ) : (
                    <div className="space-y-4">
                        {logs.slice().reverse().map((log, index) => (
                            <div key={index} className="bg-gray-50 border border-gray-200 p-4">
                                <div className="flex justify-between items-start text-xs text-gray-500 mb-2">
                                    <span className="font-mono">To: {log.recipient}</span>
                                    <span>{new Date(log.timestamp).toLocaleString()}</span>
                                </div>
                                <p className="text-sm text-gray-800 flex items-start gap-3">
                                    <MessageSquareIcon className="h-4 w-4 mt-0.5 flex-shrink-0 text-gray-400" />
                                    <span>{log.message}</span>
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SmsLogsSection;