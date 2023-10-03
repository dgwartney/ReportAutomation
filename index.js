const express = require('express');
const app = express();
const axios = require('axios');

const apiUrl = 'https://demo-bots.kore.ai:443/chatbot/v2/webhook/st-60787ea9-b329-576d-80e1-0c8b71505ec9/hookInstance/ivrInst-6ad846f2-75b0-55a1-8029-aab86de09817';
const authToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBJZCI6ImNzLTg5ZTNiZGMyLTNiYTgtNWU4Ni1hODZmLTg4ZTZhZmZmNDU3ZCIsInN1YiI6InJlcG9ydGF1dG9tYXRpb24ifQ.QMszvgE-NLEB-HqUN0f1oQxQCFJ9pdv9NZPDf4jepFE';

var globlelenght = 1
var counter = 1
var session = true
var flag = true
const testCases = require('./TestCases/2.json');
const axiosInstance = axios.create({
    baseURL: apiUrl,
    headers: {
        Authorization: `Bearer ${authToken}`
    },
});

// message cmpare
function MessageCompare(actual, expected) {
    if(actual.type == "text"){
        actual = actual.val
         // Convert actual and expected to lowercase
    actual = actual.toLowerCase();
    expected = expected.toLowerCase();

    // Replace special symbols with spaces
    actual = actual.replace(/[^a-z0-9]+/g, ' ');
    expected = expected.replace(/[^a-z0-9]+/g, ' ');

    console.log("Actual:", actual + "\n");
    console.log("Expected:", expected + "\n");

    const expectedWords = expected.split(' ');
    const foundAllWords = expectedWords.every(word => actual.includes(word));

    if (foundAllWords) {
        console.log("-----Pass------" + '\n');
        flag = true;
    } else {
        console.log("-----fail------" + '\n');
        flag = false;
    }
    } else if(actual.type == "form"){
        console.log("form" + '\n')
        console.log("-----Pass------" + '\n');
        flag = true;
        globlelenght = globlelenght -2
    }
}


function main(response, expected) {
    globlelenght = response.data.data.length
    var len = response.data.data.length;
    for (i = 0; i <= len - 1; i++) {
        if (flag == true) {
            if(i < expected.length){
                MessageCompare(response.data.data[i], expected[i].contains)
            }
        } else {
            console.log("task end")
            break
        }
    }
    if (flag == true) {
    if(testCases.testCases[0].messages.length > 1){
        session = false
        if(counter <= globlelenght ){
            sendMessage(testCases.testCases[0].messages[counter].input, testCases.testCases[0].messages[counter].output)
            counter++
        }else{
            console.log("task end")
        }
    }
    else{
        console.log('task ended')
    }
}else{
    console.log('task ended')
}
}



// api trigger
function sendMessage(message, expected) {
    const requestData = {
        session: {
            new: session
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

    axiosInstance.post('', requestData)
        .then((response) => {
            main(response, expected)
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}




app.listen(4001, () => {
    console.log("Script running" + '\n');
    sendMessage(testCases.testCases[0].messages[0].input, testCases.testCases[0].messages[0].output);
});