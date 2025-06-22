// Test file for markdown formatting
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

// Test cases
const testCases = [
    {
        name: "Bullet points in paragraph",
        input: "Here are the requirements: • Age 18-65 • Weight 50kg • Good health",
        expected: "Here are the requirements:\n\n• Age 18-65\n\n• Weight 50kg\n\n• Good health"
    },
    {
        name: "Mixed content with headers",
        input: "## Donation Process Here's what happens: • Registration • Health check 1. Check-in 2. Screening",
        expected: "## Donation Process\n\nHere's what happens:\n\n• Registration\n\n• Health check\n\n1. Check-in\n\n2. Screening"
    },
    {
        name: "Bold text formatting",
        input: "Blood donation **saves lives** and • Helps community • Provides screening",
        expected: "Blood donation\n\n**saves lives**\n\nand\n\n• Helps community\n\n• Provides screening"
    }
];

console.log("Testing Markdown Formatting...\n");

testCases.forEach((testCase, index) => {
    console.log(`Test ${index + 1}: ${testCase.name}`);
    console.log("Input:", JSON.stringify(testCase.input));
    
    const result = formatAIResponse(testCase.input);
    console.log("Output:", JSON.stringify(result));
    console.log("Expected:", JSON.stringify(testCase.expected));
    console.log("Match:", result === testCase.expected ? "✅" : "❌");
    console.log("---");
});

console.log("Test complete!"); 