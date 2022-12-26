import { initializeApp } from "firebase/app";
import { getAuth,onAuthStateChanged,signOut} from "firebase/auth";
import { setDoc,doc,getFirestore,updateDoc, increment, serverTimestamp,arrayUnion} from "firebase/firestore";
const firebaseConfig = {
    apiKey: "AIzaSyCHMpD9CYz0-TByF_jAarJF6F-mK2yb9Ng",
    authDomain: "q-app-d5357.firebaseapp.com",
    projectId: "q-app-d5357",
    storageBucket: "q-app-d5357.appspot.com",
    messagingSenderId: "992131455692",
    appId: "1:992131455692:web:f843aa767a12b8c2cac069"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Firebase
const auth = getAuth(app);
const db = getFirestore(app)

function addUserToDb(userInfo) {

    const userId = auth.currentUser.uid;
    const { email, displayName, photoURL } = userInfo.user
    return setDoc(doc(db, "users", userId), { email, displayName, photoURL, userId, myTokens: [] })

}

function setCompanyToDb(...data) {
    const [company_name, since, openingTime, closingTime, location] = data;
    const company = {
        company: company_name,
        since: since,
        openingTime: openingTime,
        closingTime: closingTime,
        location: location,
        userId: auth.currentUser.uid,
        totalTokens: 0,
        each_token_time: 0,
        soldTo: [],
        activeToken: 0,
        totalSoldToken: 0,
        createdAt: serverTimestamp()
    }
        ;
    const companyId = `${auth.currentUser.uid}${Date.now()}`
    return setDoc(doc(db, "company", companyId), company)
}

function setTokensToDb(...data) {
    const [totalTokens, each_token_time, companyId] = data
    const Token = {
        totalTokens: totalTokens,
        each_token_time: each_token_time,
        activeToken: 0,
        totalSoldToken: 0,
        soldTo: []
    }
        ;
    return updateDoc(doc(db, "company", companyId), Token)

}
async function makeTokensNull(id, args) {
    const TokensRef = doc(db, "company", id)
    updateDoc(TokensRef, { activeToken: 0, each_token_time: 0, totalTokens: 0, totalSoldToken: 0, createdAt: serverTimestamp(), soldTo: [] })
    const users = Object.values(args[0])
    for (let item of users) {
        const UserTokensRef = doc(db, "users", item.userId)
        await updateDoc(UserTokensRef, { myTokens: [] })
    }


}

function updateCurrentToken(e) {
    const UpdateRef = doc(db, "company", e)
    updateDoc(UpdateRef, { activeToken: increment(1) })
}


function userSignOut() {
    signOut(auth).then(() => {
        // Sign-out successful.
    }).catch((error) => {
        console.log(error);
        // An error happened.
    });

}

function buyToken(...args) {
    const [id, company, totalSold] = args
    const updateSoldToken = doc(db, "company", id)
    updateDoc(updateSoldToken, { totalSoldToken: increment(1), soldTo: arrayUnion({ userId: auth.currentUser.uid, name: auth.currentUser.displayName, tokenNumber: totalSold + 1 }) })
    const updateMyToken = doc(db, "users", auth.currentUser.uid)
    updateDoc(updateMyToken, {
        myTokens:
            arrayUnion({ companyName: company, tokenNumber: totalSold + 1 })
    })
}


export {
    auth,
    db,
    addUserToDb,
    setCompanyToDb,
    onAuthStateChanged,
    userSignOut,
    setTokensToDb,
    updateCurrentToken,
    makeTokensNull,
    buyToken
}


export { app }

