import React, { useCallback, useState } from 'react';
import { useChatbot } from './ChatbotContext';
import { MdOutlineFileUpload, MdPictureAsPdf } from 'react-icons/md';
import { IoDocumentText } from 'react-icons/io5';
import { RiDeleteBin6Line } from 'react-icons/ri';
import DocViewer from '@/components/Chatbot/ChatSection/doc-viewer';
import { ReferenceLinkType } from 'types/apps/chatbot/api.type.ts';
import Tooltip from '@/components/Tooltip';
import { cn } from '@repo/utils';
import { set } from 'zod';

const PDFUploadBox: React.FC = () => {
  const { uploadPDFContext, mediaFiles, setMediaFiles } = useChatbot();

  const handleRemoveFile = useCallback(
    (index: number) => {
      setMediaFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
    },
    [setMediaFiles]
  );
};

export default PDFUploadBox;