import addBookMark from './addBookMark'
import getBookMarks from './getBookMarks'

import BookMark from './BookMark';


type AppSyncEvent = {
    info: {
        fieldName: string
    },
    arguments: {
        bookmark: BookMark
    }
}

exports.handler = async (event: AppSyncEvent) => {
    switch (event.info.fieldName) {
        case "addBookMark":
            return await addBookMark(event.arguments.bookmark);
        case "getBookMarks":
            return await getBookMarks();
        default:
            return null;
    }
}