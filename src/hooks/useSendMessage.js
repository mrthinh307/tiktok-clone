import { useCallback } from 'react';
import supabase from '~/config/supabaseClient';
import { uploadFileWithProgress } from '~/services/apiServices/uploadService';
import { useAuth } from '~/contexts/AuthContext';

const useSendMessage = (receiverInfo, messages, onSetMessages) => {
  const { user } = useAuth();

  // Function wrapper để tương thích với interface cũ
  const setMessages = useCallback(
    (messagesOrUpdater) => {
      if (typeof messagesOrUpdater === 'function') {
        // Nếu là function updater, gọi với messages hiện tại
        // Nhưng cần lấy state mới nhất, không phải từ closure
        onSetMessages(receiverInfo.partner_id, (currentMessages) => {
          return messagesOrUpdater(currentMessages);
        });
      } else {
        // Nếu là array trực tiếp
        onSetMessages(receiverInfo.partner_id, messagesOrUpdater);
      }
    },
    [onSetMessages, receiverInfo.partner_id],
  );

  const handleSendMessage = useCallback(
    async (e, newMessage, setNewMessage) => {
      e.preventDefault();
      if (newMessage.trim() === '' || !receiverInfo) return;

      const messageToSend = {
        sender_id: user.sub,
        receiver_id: receiverInfo.partner_id,
        content: newMessage,
        type: 'text',
      };

      const optimisticId = `temp_${Date.now()}`;
      const optimisticMessage = {
        id: optimisticId,
        ...messageToSend,
        created_at: new Date().toISOString(),
      };

      setNewMessage('');
      setMessages((prev) => [...prev, optimisticMessage]);

      const { error } = await supabase.from('messages').insert(messageToSend);

      if (error) {
        console.alert('Error sending message:', error);
        setMessages((prev) => prev.filter((m) => m.id !== optimisticId));
        return;
      }
    },
    [receiverInfo, user.sub, setMessages],
  );

  // Simple file validation
  const validateFile = useCallback((file) => {
    const maxImageSize = 5 * 1024 * 1024; // 5MB
    const maxVideoSize = 50 * 1024 * 1024; // 100MB
    const allowedImageTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
    ];
    const allowedVideoTypes = ['video/mp4', 'video/webm', 'video/quicktime'];

    const fileType = file.type.split('/')[0];

    // Check if file type is supported
    if (fileType !== 'image' && fileType !== 'video') {
      throw new Error('Only images and videos are allowed');
    }

    // Check specific mime types and file size
    if (fileType === 'image') {
      if (!allowedImageTypes.includes(file.type)) {
        throw new Error(
          'Unsupported image format. Allowed: JPEG, PNG, GIF, WebP',
        );
      }
      if (file.size > maxImageSize) {
        throw new Error('Image size too large. Maximum 5MB allowed');
      }
    } else if (fileType === 'video') {
      if (!allowedVideoTypes.includes(file.type)) {
        throw new Error(
          'Unsupported video format. Allowed: MP4, WebM, QuickTime',
        );
      }
      if (file.size > maxVideoSize) {
        throw new Error('Video size too large. Maximum 50MB allowed');
      }
    }

    return fileType;
  }, []);

  const handleFileUpload = useCallback(
    async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      let fileType;
      let localFileUrl;
      const tempId = `temp_${Date.now()}`;

      try {
        // Validate file before processing
        fileType = validateFile(file);
        localFileUrl = URL.createObjectURL(file);

        // 1. Create and display temporary message
        const optimisticMessage = {
          id: tempId,
          sender_id: user.sub,
          receiver_id: receiverInfo.partner_id,
          content: localFileUrl, // URL tạm thời để preview
          created_at: new Date().toISOString(),
          type: fileType,
          status: 'uploading', // Thêm trạng thái
        };
        setMessages((prev) => [...prev, optimisticMessage]);

        const fileName = `${user.sub}/${Date.now()}_${file.name}`;

        // 2. Start upload
        const uploadedUrl = await uploadFileWithProgress(
          `message-${fileType}s`,
          fileName,
          file,
          () => {}, // Empty callback vì không cần progress
        );

        // 3. Send message to Supabase
        const messageToSend = {
          sender_id: user.sub,
          receiver_id: receiverInfo.partner_id,
          content: uploadedUrl,
          type: fileType,
        };

        const { data: insertedMessage, error } = await supabase
          .from('messages')
          .insert(messageToSend)
          .select()
          .single();

        if (error) {
          throw error;
        }

        // 4. Update temporary message with real data
        setMessages((prev) => {
          return prev.map((msg) => {
            if (msg.id === tempId) {
              return {
                ...msg,
                id: insertedMessage.id,
                content: insertedMessage.content,
                created_at: insertedMessage.created_at,
                status: 'sent',
              };
            }
            return msg;
          });
        });
      } catch (error) {
        console.error('Error processing file:', error);
        // Show error message to user
        // TODO: Replace with proper toast notification or error UI
        console.error('File upload error:', error.message);
        // Example: showToast({ type: 'error', message: error.message || 'Error uploading file. Please try again.' });        // Remove optimistic message if it was added
        setMessages((prev) => prev.filter((msg) => msg.id !== tempId));
      } finally {
        // Clean up object URL if it was created
        if (localFileUrl) {
          URL.revokeObjectURL(localFileUrl);
        }
      }
    },
    [user.sub, receiverInfo, setMessages, validateFile],
  );

  const handleSendSticker = useCallback((sticker, setNewMessage) => {
    setNewMessage((prev) => prev + sticker);
  }, []);

  return {
    handleSendMessage,
    handleFileUpload,
    handleSendSticker,
  };
};

export default useSendMessage;
