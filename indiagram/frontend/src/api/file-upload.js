import { v4 } from 'uuid';
import { bucket } from "./firebase";
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export const fileUpload =async (file, location) =>{
    try {
        console.log(location);
        const fileRef =ref(bucket, `bucket/${location}/${v4()}`);
        await uploadBytes(fileRef, file);
        return {filepath: await getDownloadURL(fileRef)};
    } catch ({message}) {
        return message;
    }
}