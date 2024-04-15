const functions = require('firebase-functions');
const axios = require('axios');

exports.generateParagraph = functions.https.onCall(async (data, context) => {
    const huggingFaceKey = functions.config().huggingface.key;
    const playerInfo = data;

    const apiUrl = 'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.1';

    try {
        const response = await axios.post(apiUrl, {
            inputs: playerInfo,
            options: {
                wait_for_model: true  // Set to true to wait for model to generate the response
            }
        }, {
            headers: {
                'Authorization': `Bearer ${huggingFaceKey}`
            }
        });

        if (response.data && response.data.generated_text) {
            return { paragraph: response.data.generated_text };
        } else {
            throw new Error("No generated text found");
        }
    } catch (error) {
        console.error('Error calling Hugging Face API:', error);
        throw new functions.https.HttpsError('internal', 'Failed to generate paragraph', error.message);
    }
});
