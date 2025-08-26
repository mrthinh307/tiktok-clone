import supabase from '~/config/supabaseClient';

/**
 * Create a new conversation between two users with a system message
 * @param {string} senderId - ID of the current user (who clicks message)
 * @param {string} receiverId - ID of the target user (profile owner)
 * @param {string} receiverNickname - Nickname of the target user
 * @param {string} senderFullName - Full name of the current user
 * @returns {Promise<{success: boolean, conversationId?: string, error?: string}>}
 */
export const createConversationWithSystemMessage = async (
  senderId,
  receiverId, 
  receiverNickname,
  senderFullName
) => {
  try {
    // Check if conversation already exists
    const { data: existingConversation } = await supabase
      .from('messages')
      .select('id')
      .or(`and(sender_id.eq.${senderId},receiver_id.eq.${receiverId}),and(sender_id.eq.${receiverId},receiver_id.eq.${senderId})`)
      .limit(1);

    if (existingConversation && existingConversation.length > 0) {
      // Conversation already exists, just return success
      return {
        success: true,
        conversationExists: true
      };
    }

    // Create system message to initiate conversation
    const systemMessageContent = `${senderFullName} wants to start a conversation with you! 👋`;
    
    const { data: newMessage, error: messageError } = await supabase
      .from('messages')
      .insert({
        sender_id: senderId,
        receiver_id: receiverId,
        content: systemMessageContent,
        type: 'system' // Use system type for initial messages
      })
      .select('id')
      .single();

    if (messageError) {
      console.error('Error creating system message:', messageError);
      return {
        success: false,
        error: 'Failed to create conversation'
      };
    }

    return {
      success: true,
      conversationId: newMessage.id,
      conversationExists: false
    };

  } catch (error) {
    console.error('Error in createConversationWithSystemMessage:', error);
    return {
      success: false,
      error: 'Failed to create conversation'
    };
  }
};

/**
 * Navigate to messages page with specific user selected
 * @param {string} receiverId - ID of the user to start conversation with
 * @param {Object} receiverInfo - Information about the receiver
 * @param {Function} navigate - React Router navigate function
 */
export const navigateToConversation = (receiverId, receiverInfo, navigate) => {
  // Navigate to messages page with state to pre-select the conversation
  navigate('/messages', {
    state: {
      selectedUserId: receiverId,
      selectedUserInfo: receiverInfo
    }
  });
};
