const Groq = require('groq-sdk');
const Conversation = require('../models/Conversation');
const { searchKnowledge, getKnowledgeResponse, formatResponse } = require('../services/knowledgeBase');
const { v4: uuidv4 } = require('uuid');

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

// Function to ensure proper markdown formatting in AI responses
const formatAIResponse = (response) => {
    if (!response || typeof response !== 'string') {
        return response;
    }
    
    let formatted = response;
    
    // First, normalize line breaks
    formatted = formatted.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    
    // Fix bullet points - ensure they're properly separated
    formatted = formatted.replace(/([^:\n])\s*•\s*/g, '$1\n\n• ');
    formatted = formatted.replace(/:\s*•\s*/g, ':\n\n• ');
    formatted = formatted.replace(/^\s*•\s*/gm, '• ');
    
    // Fix numbered lists - ensure they're properly separated  
    formatted = formatted.replace(/([^:\n])\s*(\d+\.)\s*/g, '$1\n\n$2 ');
    formatted = formatted.replace(/:\s*(\d+\.)\s*/g, ':\n\n$1 ');
    formatted = formatted.replace(/^\s*(\d+\.)\s*/gm, '$1 ');
    
    // Fix headers - ensure proper spacing around them
    formatted = formatted.replace(/([^\n])\s*(#{1,6})\s*([^\n]+)/g, '$1\n\n$2 $3\n\n');
    formatted = formatted.replace(/^\s*(#{1,6})\s*([^\n]+)/gm, '$1 $2\n\n');
    
    // Fix bold sections that should be on their own lines
    formatted = formatted.replace(/([^\n*])\s*\*\*([^*]+)\*\*:\s*/g, '$1\n\n**$2:**\n\n');
    
    // Clean up excessive line breaks but preserve intentional spacing
    formatted = formatted.replace(/\n{4,}/g, '\n\n\n');
    formatted = formatted.replace(/\n{3}/g, '\n\n');
    
    // Clean up leading/trailing whitespace
    formatted = formatted.trim();
    
    return formatted;
};

const systemPrompt = `You are a friendly and knowledgeable AI assistant for Light Charity, a blood donation organization. Your primary role is to help users with:

**Core Responsibilities:**
• Blood donation information and education
• Donor eligibility requirements and preparation
• Donation process and what to expect
• Blood types and compatibility information
• Website navigation and feature explanations
• Appointment scheduling assistance
• Emergency blood needs and responses

**Communication Style:**
• Be warm, encouraging, and supportive
• Always use proper markdown formatting for clear, readable responses
• Emphasize the life-saving impact of blood donation
• Break down complex information into digestible parts
• Use emojis sparingly but appropriately (🩸 ❤️ 🏥)

**CRITICAL MARKDOWN FORMATTING RULES:**
• **Use double line breaks** between sections and paragraphs (\\n\\n)
• **For bullet points**: Always start each bullet point on a NEW LINE with proper spacing:
  - Use • for bullet points (not -, not *, not +)
  - Format: "\\n• First point\\n• Second point\\n• Third point\\n"
  - Never put multiple bullet points on the same line
• **For numbered lists**: Each number on a new line:
  - Format: "\\n1. First step\\n2. Second step\\n3. Third step\\n"
• **For headers**: Use # ## ### with proper spacing:
  - Format: "\\n## Header Name\\n\\n" (note the double line breaks)
• **For bold text**: Use **text** with spaces around important terms
• **Always separate different sections with double line breaks (\\n\\n)**

**Response Structure Template:**
\`\`\`
Brief introductory paragraph.

## Main Section Header

• First bullet point
• Second bullet point  
• Third bullet point

## Another Section

Content here with proper spacing.

**Important Note:** Bold emphasis when needed.

Is there anything else I can help you with?
\`\`\`

**Knowledge Base:**
You have access to comprehensive information about blood donation, including eligibility requirements, the donation process, blood types, and Light Charity's services. Always provide accurate, well-structured information with proper markdown formatting.

**Website Features to Help With:**
• Registration as a donor
• Finding donation centers and locations
• Scheduling appointments
• Checking blood availability
• Understanding donation history
• Learning about mobile blood drives

Remember: Every conversation could lead to a life-saving blood donation. Be encouraging and make the process seem approachable and rewarding. ALWAYS use proper markdown formatting with appropriate line breaks and spacing.`;

const chatWithBot = async (req, res) => {
    try {
        const { messages, message, sessionId, userId } = req.body;

        if (!message || message.trim() === '') {
            return res.status(400).json({ 
                error: 'Message is required',
                success: false 
            });
        }

        // Generate session ID if not provided
        const currentSessionId = sessionId || uuidv4();

        // Find or create conversation
        const conversation = await Conversation.findOrCreateConversation(
            currentSessionId, 
            userId || 'anonymous'
        );

        // Add user message to conversation
        await conversation.addMessage('user', message);

        // Get recent messages for context
        const recentMessages = conversation.getRecentMessages(8);

        // Check knowledge base first
        const knowledgeResults = searchKnowledge(message);
        let knowledgeContext = '';
        
        if (knowledgeResults.length > 0) {
            knowledgeContext = `\n\nRelevant Knowledge Base Information:\n${knowledgeResults[0].content}`;
        }

        // Create the messages array for Groq (filter out unsupported properties)
        const enhancedMessages = [
            { role: "system", content: systemPrompt + knowledgeContext },
            ...recentMessages.slice(0, -1).map(msg => ({
                role: msg.role === 'user' ? 'user' : 'assistant',
                content: msg.content
            })), // Exclude the current message as it's added separately
            { role: "user", content: message }
        ];

        // Call Groq API for streaming response
        const stream = await groq.chat.completions.create({
            messages: enhancedMessages,
            model: "llama3-8b-8192",
            stream: true,
            max_tokens: 1200,
            temperature: 0.6,
        });

        // Set headers for streaming
        res.writeHead(200, {
            'Content-Type': 'text/plain; charset=utf-8',
            'Transfer-Encoding': 'chunked',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type',
        });

        let fullResponse = '';

        // Stream the response
        try {
            for await (const chunk of stream) {
                const content = chunk.choices[0]?.delta?.content;
                if (content) {
                    fullResponse += content;
                    res.write(content);
                }
            }
        } catch (error) {
            console.error("Streaming error:", error);
            const errorMsg = "I apologize, but I encountered an error. Please try again, and if the problem persists, contact our support team.";
            fullResponse += errorMsg;
            res.write(errorMsg);
        } finally {
            // Save bot response to conversation
            if (fullResponse.trim()) {
                const formattedResponse = formatAIResponse(fullResponse);
                await conversation.addMessage('bot', formattedResponse);
            }
            res.end();
        }

    } catch (error) {
        console.error("Error in chat API:", error);
        
        if (!res.headersSent) {
            return res.status(500).json({ 
                error: 'I apologize, but our chat service is temporarily unavailable. Please try again in a moment or contact our support team directly.',
                success: false,
                technical_error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }
};

// Non-streaming version for simpler integration
const chatWithBotSimple = async (req, res) => {
    try {
        const { messages, message, sessionId, userId } = req.body;

        if (!message || message.trim() === '') {
            return res.status(400).json({ 
                error: 'Message is required',
                success: false 
            });
        }

        // Generate session ID if not provided
        const currentSessionId = sessionId || uuidv4();

        // Find or create conversation
        const conversation = await Conversation.findOrCreateConversation(
            currentSessionId, 
            userId || 'anonymous'
        );

        // Add user message to conversation
        await conversation.addMessage('user', message);

        // Get recent messages for context
        const recentMessages = conversation.getRecentMessages(8);

        // Check knowledge base first
        const knowledgeResults = searchKnowledge(message);
        let knowledgeContext = '';
        
        if (knowledgeResults.length > 0) {
            knowledgeContext = `\n\nRelevant Knowledge Base Information:\n${knowledgeResults[0].content}`;
        }

        // Create the messages array for Groq (filter out unsupported properties)
        const enhancedMessages = [
            { role: "system", content: systemPrompt + knowledgeContext },
            ...recentMessages.slice(0, -1).map(msg => ({
                role: msg.role === 'user' ? 'user' : 'assistant',
                content: msg.content
            })), // Exclude the current message as it's added separately
            { role: "user", content: message }
        ];

        // Call Groq API
        const completion = await groq.chat.completions.create({
            messages: enhancedMessages,
            model: "llama3-8b-8192",
            max_tokens: 1200,
            temperature: 0.6,
        });

        const response = completion.choices[0]?.message?.content;

        if (!response) {
            throw new Error('No response generated from AI model');
        }

        // Post-process the response to ensure proper markdown formatting
        const formattedResponse = formatAIResponse(response);

        // Save bot response to conversation
        await conversation.addMessage('bot', formattedResponse);

        res.json({
            success: true,
            response: formattedResponse,
            sessionId: currentSessionId,
            conversationId: conversation._id,
            timestamp: new Date().toISOString(),
            messageCount: conversation.messages.length
        });

    } catch (error) {
        console.error("Error in simple chat API:", error);
        
        // Provide helpful error messages
        let errorMessage = 'I apologize, but I\'m having trouble responding right now.';
        
        if (error.message?.includes('API key')) {
            errorMessage = 'Chat service configuration issue. Please contact support.';
        } else if (error.message?.includes('rate limit')) {
            errorMessage = 'I\'m receiving too many requests. Please wait a moment and try again.';
        } else if (error.message?.includes('network')) {
            errorMessage = 'Network connectivity issue. Please check your connection and try again.';
        }

        res.status(500).json({ 
            error: errorMessage,
            success: false,
            fallback: 'Please try refreshing the page or contact our support team for assistance.',
            technical_error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Get conversation history
const getConversationHistory = async (req, res) => {
    try {
        const { sessionId } = req.params;
        
        if (!sessionId) {
            return res.status(400).json({
                error: 'Session ID is required',
                success: false
            });
        }

        const conversation = await Conversation.findOne({ sessionId });
        
        if (!conversation) {
            return res.status(404).json({
                error: 'Conversation not found',
                success: false
            });
        }

        res.json({
            success: true,
            conversation: {
                sessionId: conversation.sessionId,
                messages: conversation.messages,
                createdAt: conversation.createdAt,
                updatedAt: conversation.updatedAt,
                messageCount: conversation.messages.length
            }
        });

    } catch (error) {
        console.error("Error fetching conversation history:", error);
        res.status(500).json({
            error: 'Unable to fetch conversation history',
            success: false
        });
    }
};

// Clear conversation history
const clearConversation = async (req, res) => {
    try {
        const { sessionId } = req.params;
        
        if (!sessionId) {
            return res.status(400).json({
                error: 'Session ID is required',
                success: false
            });
        }

        const conversation = await Conversation.findOne({ sessionId });
        
        if (!conversation) {
            return res.status(404).json({
                error: 'Conversation not found',
                success: false
            });
        }

        conversation.messages = [];
        conversation.updatedAt = new Date();
        await conversation.save();

        res.json({
            success: true,
            message: 'Conversation cleared successfully',
            sessionId: sessionId
        });

    } catch (error) {
        console.error("Error clearing conversation:", error);
        res.status(500).json({
            error: 'Unable to clear conversation',
            success: false
        });
    }
};

// Get chatbot analytics/stats
const getChatbotStats = async (req, res) => {
    try {
        const totalConversations = await Conversation.countDocuments();
        const activeConversations = await Conversation.countDocuments({ isActive: true });
        const totalMessages = await Conversation.aggregate([
            { $unwind: '$messages' },
            { $count: 'total' }
        ]);

        const recentConversations = await Conversation.find({
            updatedAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
        }).countDocuments();

        res.json({
            success: true,
            stats: {
                totalConversations,
                activeConversations,
                totalMessages: totalMessages[0]?.total || 0,
                recentConversations,
                averageMessagesPerConversation: totalMessages[0]?.total ? 
                    Math.round((totalMessages[0].total / totalConversations) * 100) / 100 : 0
            }
        });

    } catch (error) {
        console.error("Error fetching stats:", error);
        res.status(500).json({
            error: 'Unable to fetch chatbot statistics',
            success: false
        });
    }
};

module.exports = {
    chatWithBot,
    chatWithBotSimple,
    getConversationHistory,
    clearConversation,
    getChatbotStats
}; 