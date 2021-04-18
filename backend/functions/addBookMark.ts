const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();
import BookMark from './BookMark';

async function addBookMark(bookmark: BookMark) {
    const params = {
        TableName: process.env.BOOKMARK_TABLE,
        Item: bookmark
    }
    try {
        await docClient.put(params).promise();
        return bookmark;
    } catch (err) {
        console.log('DynamoDB error: ', err);
        return null;
    }
}

export default addBookMark;