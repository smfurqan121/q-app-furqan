import { useNavigate } from "react-router-dom";
import './home.css';
function Home() {
  const navigate = useNavigate()
  return (
    <>

      <div className="container p-5 my-5" class="main" >
        <div className="text-center mb-5">
          <span style={{fontSize:'40px',color:'white',margin:'0px 0px 0px 17px',position:'relative',top:'15px'}}>Q-App</span>
        </div>
        <div class="btns">
          <button class="btn1" className='btn btn-primary mx-2' onClick={() => navigate(`/company`)}>Company</button>
          <button class="btn2" className='btn btn-primary mx-2' style={{width:'150px'}} onClick={() => navigate("/user")}>Waiting For Token</button>
        </div>
      </div>
    </>
  )
}

export default Home