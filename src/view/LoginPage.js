import { FacebookAuthProvider, signInWithPopup } from "firebase/auth"
import { useNavigate } from "react-router-dom"
import { addUserToDb, auth } from '../config/firebase'
import { useSelector } from 'react-redux'



function Login() {

  
    // const theme = useSelector(state => state.theme)
  const navigate = useNavigate()

  const signInWithFacebook = () => {
    const provider = new FacebookAuthProvider()
    signInWithPopup(auth, provider)
      .then((res) => {
        addUserToDb(res);
        navigate("/")
      })
      .catch((err) => {
        console.log(err)
      })

  }
  return (
    <>
    {/* <body style={{ background: theme, height: 400, width: 400 }}></body> */}

      {/* <div className="bg-img">
        <div className="content"> */}
        <div className="head">
          <h1>Q-APP</h1>
        </div>
         
          
          <div className="links">
            <div className="headingface"><h2>Login With Facebook</h2></div>
            <div className="facebook">
              <i className="fab fa-facebook-f"><div className="face-main" onClick={signInWithFacebook}>Facebook</div></i>
            </div>
            
          </div>
          
        {/* </div>
      </div> */}
    </>
  )
}

export default Login