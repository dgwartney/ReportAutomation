const express = require('express');
const app = express();
const axios = require('axios');

const apiUrl = 'https://demo-bots.kore.ai:443/chatbot/v2/webhook/st-60787ea9-b329-576d-80e1-0c8b71505ec9/hookInstance/ivrInst-6ad846f2-75b0-55a1-8029-aab86de09817';
const authToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBJZCI6ImNzLTg5ZTNiZGMyLTNiYTgtNWU4Ni1hODZmLTg4ZTZhZmZmNDU3ZCIsInN1YiI6InJlcG9ydGF1dG9tYXRpb24ifQ.QMszvgE-NLEB-HqUN0f1oQxQCFJ9pdv9NZPDf4jepFE'; // Replace with your actual auth token

const testCases = require('./TestCases/2.json');
const axiosInstance = axios.create({
    baseURL: apiUrl,
    headers: {
        Authorization: `Bearer ${authToken}`
    },
});

// Message comparison function
function messageCompare(actual, expected) {
    if (actual.type === "text") {
        actual = actual.val.toLowerCase().replace(/[^a-z0-9]+/g, ' ');
        expected = expected.toLowerCase().replace(/[^a-z0-9]+/g, ' ');

        console.log("Actual:", actual);
        console.log("Expected:", expected);

        const expectedWords = expected.split(' ');
        const foundAllWords = expectedWords.every(word => actual.includes(word));

        if (foundAllWords) {
            console.log("-----Pass------");
            return true;
        } else {
            console.log("-----Fail------");
            return false;
        }
    } else if (actual.type === "form") {
        console.log("Form");
        console.log("-----Pass------");
        return true;
    }
}

// Main function to handle responses and messages
async function handleResponse(response, expectedMessages, counter) {
    const data = response.data.data;
    
    for (let i = 0; i < data.length; i++) {
        if (i < expectedMessages.length) {
            if (!messageCompare(data[i], expectedMessages[i].contains)) {
                console.log("Task ended1");
                return;
            }
        } else {
            console.log("Task ended2");
            return;
        }
    }

    if (counter < testCases.testCases[0].messages.length) {
        const message = testCases.testCases[0].messages[counter].input;
        const output = testCases.testCases[0].messages[counter].output;
        
        await sendMessage(message, output, counter + 1);
    } else {
        console.log('Task ended3');
    }
}

// Function to send a message
async function sendMessage(message, expected, counter) {
    const requestData = {
        session: {
            new: counter === 1
        },
        message: {
            type: 'text',
            val: message
        },
        from: {
            id: 'U12345',
            userInfo: {
                firstName: 'Hari',
                lastName: 'Guptha',
                email: 'hariguptha.anbalagan@kore.com'
            }
        },
        mergeIdentity: true
    };

    try {
        const response = await axiosInstance.post('', requestData);
        await handleResponse(response, expected, counter);
    } catch (error) {
        console.error('Error:', error);
    }
}

app.listen(4001, () => {
    console.log("Script running");
    sendMessage(testCases.testCases[0].messages[0].input, testCases.testCases[0].messages[0].output, 1);
});
