import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, signOut, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc, deleteDoc } from 'firebase/firestore'
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyDVE6lx2YbnXSzzA78tpFcTi77TjWJkCw8",
    authDomain: "atomic-habits-fb63e.firebaseapp.com",
    projectId: "atomic-habits-fb63e",
    storageBucket: "atomic-habits-fb63e.appspot.com",
    messagingSenderId: "1059800409445",
    appId: "1:1059800409445:web:81a1d565b6a4cf6a4e6d8c",
    measurementId: "G-L9BCJ63KPJ"
};

const app = initializeApp(firebaseConfig);
getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app)
const storage = getStorage(app)

const logInWithEmailAndPassword = async (email, password) => {
    try {
        await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
        console.error(err);
        alert(err.message);
    }
};

const logout = () => {
    signOut(auth);
};

const deleteArticle = (articleID) => {
    return deleteDoc(doc(db, "articles", articleID))
}

const saveArticle = (title, image, text, description) => {

    const storageRef = ref(storage, 'articles/' + title + '/banner.jpg');

    const uploadTask = uploadBytesResumable(storageRef, image);


    // Register three observers:
    // 1. 'state_changed' observer, called any time the state changes
    // 2. Error observer, called on failure
    // 3. Completion observer, called on successful completion
    uploadTask.on('state_changed',
        (snapshot) => {
            // Observe state change events such as progress, pause, and resume
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
            switch (snapshot.state) {
                case 'paused':
                    console.log('Upload is paused');
                    break;
                case 'running':
                    console.log('Upload is running');
                    break;
                default:
                    console.log('Upload is paused');
                    break;
            }
        },
        (error) => {
            console.log(error);
            return
        },
        () => {
            // Handle successful uploads on complete
            // For instance, get the download URL: https://firebasestorage.googleapis.com/...
            getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
                const data = {
                    title: title,
                    image: downloadURL,
                    description: description,
                    text: text.blocks,
                    date: text.time
                }
                await setDoc(doc(db, "articles", data.title.toLowerCase().split(" ").join("-")), data)
                    .catch((err) => console.log(err))
            });
        }
    );
}

export {
    auth,
    db,
    logInWithEmailAndPassword,
    logout,
    saveArticle,
    deleteArticle
};