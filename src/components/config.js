import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/database';

var config = {
  credential: '********************************',
  databaseURL: 'https://something.firebaseio.com/',
  projectId: 'your-project-id',
};

firebase.initializeApp(config);
export default firebase;
