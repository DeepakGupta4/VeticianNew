import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyCbZwYjRyLK9y7BTdCu1VkPc1Zuq09qfv4",
  authDomain: "vetician-cac18.firebaseapp.com",
  databaseURL: "https://vetician-cac18-default-rtdb.firebaseio.com",
  projectId: "vetician-cac18",
  storageBucket: "vetician-cac18.appspot.com",
  messagingSenderId: "962297137388",
  appId: "1:962297137388:android:3a9a0b1b8b22db3a813dc9"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const database = getDatabase(app);
export default firebaseConfig;
