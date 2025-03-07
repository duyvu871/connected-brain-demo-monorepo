import React from 'react';
import { Dialog, DialogDescription, DialogOverlay, DialogTitle, DialogTrigger } from '@ui/shadcn-ui/ui/dialog.tsx';
import { Cross2Icon } from '@radix-ui/react-icons';
import { DialogPortal } from '@radix-ui/react-dialog';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { cn } from '@repo/utils';
import * as VisuallyHidden from '@radix-ui/react-visually-hidden';
import { Progress } from '@ui/shadcn-ui/ui/progress';
import { AiOutlineFile, AiOutlineFilePdf } from 'react-icons/ai';

interface UploadStatus {
    id: string;
    file: File;
    status: "uploading" | "success" | "error" | "canceled" | "pending";
    progress: number;
    error?: string;
}

interface UploadStatusModalProps {
    uploadStatuses: UploadStatus[];
    onClose?: () => void;
}

const FileIcon = ({ type }: { type: string }) => {
    if (type === 'application/pdf') {
        return <AiOutlineFilePdf className="w-8 h-8 text-red-500" />;
    }
    return <AiOutlineFile className="w-8 h-8 text-gray-500" />;
};

const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const StatusBadge = ({ status }: { status: UploadStatus['status'] }) => {
    const getStatusColor = () => {
        switch (status) {
            case 'success':
                return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
            case 'error':
                return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
            case 'uploading':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
        }
    };

    return (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor()}`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
    );
};

function UploadStatusModal({ uploadStatuses, onClose }: UploadStatusModalProps) {
    const [open, setOpen] = React.useState(true);

    const handleOpenChange = (newOpen: boolean) => {
        setOpen(newOpen);
        if (!newOpen && onClose) {
            onClose();
        }
    };

    return (
        <Dialog onOpenChange={handleOpenChange} open={open}>
            <DialogPortal>
                <DialogOverlay className="z-[330]" />
                <DialogPrimitive.Content
                    className={cn(
                        'fixed left-[50%] top-[50%] z-[350] grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg',
                    )}
                >
                    <VisuallyHidden.Root asChild>
                        <DialogTitle>Upload Status</DialogTitle>
                    </VisuallyHidden.Root>
                    <VisuallyHidden.Root asChild>
                        <DialogDescription>File upload status and progress</DialogDescription>
                    </VisuallyHidden.Root>

                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold">Upload Status</h2>
                        <div className="space-y-4">
                            {uploadStatuses.map((status) => (
                                <div key={status.id} className="p-4 border rounded-lg dark:border-gray-700">
                                    <div className="flex items-start space-x-4">
                                        <FileIcon type={status.file.type} />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium truncate">{status.file.name}</p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                {formatFileSize(status.file.size)}
                                            </p>
                                            <div className="mt-2 space-y-2">
                                                <Progress value={status.progress} />
                                                <div className="flex justify-between items-center">
                                                    <StatusBadge status={status.status} />
                                                    <span className="text-sm text-gray-500 dark:text-gray-400">
                                                        {status.progress}%
                                                    </span>
                                                </div>
                                                {status.error && (
                                                    <p className="text-sm text-red-500">{status.error}</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <DialogPrimitive.Close
                        className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
                        <Cross2Icon className="h-4 w-4" />
                        <span className="sr-only">Close</span>
                    </DialogPrimitive.Close>
                </DialogPrimitive.Content>
            </DialogPortal>
        </Dialog>
    );
}

export default UploadStatusModal;