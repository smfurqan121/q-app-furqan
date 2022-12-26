import { useState, useEffect } from "react";
import { onSnapshot, collection } from "firebase/firestore";
import { db, buyToken } from "../config/firebase";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import { ArrowDownRight } from "react-bootstrap-icons";


function UserPage() {
  const navigate = useNavigate()

  const [Data, setData] = useState([])
  const [TokensData, setTokensData] = useState([])
  const [isUpdate, setIsUpdate] = useState(false)
  const [messageApi, contextHolder] = message.useMessage();


  const error = (e) => {
    messageApi.open({
      type: 'error',
      content: e,
    });
  };

  useEffect(() => {
    const companies =
      onSnapshot(collection(db, "company"), (snapshot) => {
        setData([]);
        snapshot.docs.forEach((doc) => {
          setData((prev) => [...prev, { id: doc.id, data: doc.data() }]);
        });
      });
    return () => {
      setIsUpdate(true)
      companies()
    }
  }, [isUpdate])

  useEffect(() => {
    onSnapshot(collection(db, "users"), (snapshot) => {
      setTokensData([]);
      snapshot.docs.forEach((doc) => {
        console.log(doc.data());
        setTokensData((data) => [...data, { id: doc.id, data: doc.data() }]);
      });
    });
  }, [isUpdate])

  const getToken = (...args) => {
    const [companyId, totalTokens, soldTokens, company] = args;
    if (totalTokens <= soldTokens) {
      error("All Tokens sold for today")
    } else {
      buyToken(companyId, company, soldTokens);
    }
  }

  const setId = (e) => {
    const btns = document.querySelectorAll(".collapse");
    btns[e].classList.toggle("show")
  }
  return (
    <div className="container-fluid">
      {contextHolder}
      <div className="row">
        <div className="col-md-3">
          <div>
            <button className='icon' onClick={() => navigate("/")}><ArrowDownRight/></button>
           <div className="com-heading"> <h1>Q-APP</h1></div>
          </div>
            <div className="py-3"><h2>User Page</h2></div>
            
            <div className="my-token" style={{position:'absolute',}}>
          <div className='py-4'>
            <h3>My Token </h3>
          </div>
          {TokensData.map((items) => {
            return (
              items.data.myTokens.map((tokens) => {
                return (
                  <ul className='p-0 border small rounded'>
                    <li >Company: {tokens.companyName} </li><span>Token Number: {tokens.tokenNumber}</span>
                  </ul>
                )
              })
            )
          })}
          </div>
        </div>
        <div >
          {Data.map((item, key) => {
            return (
              <>
                <div className="my3">
                  <div   id="mygroup">
                    <div >
                      <h3 className='col'>{item.data.company} </h3>
                      <span onClick={() => setId(key)}>
                        <h4 className="detail">
                          Details:
                        </h4>
                      </span>
                    </div>

                    <div className="collapse" id="collapseExample" >
                      <div className="card card-body bg-dark p-0">
                        <div className="d-flex justify-content-between border my-2">
                          <span className="open">Opening Time: {item.data.openingTime}</span>
                          <span className="close">Closing Time: {item.data.closingTime}</span>
                        </div>
                        <div className=" my-2">
                          {item.data.totalTokens === 0 ? <span></span> :
                            <div className='border d-flex justify-content-between'>
                              <span className="sell">Total Tokens: {item.data.totalTokens}</span>
                              <span className="buy">Total Sold Tokens: {item.data.totalSoldToken}</span>
                            </div>
                          }
                        </div>
                        <div className=' my-2'>
                          {item.data.activeToken >= 1 ?
                          <div className='d-flex justify-content-between border'>
                            <span>Currently Serving: {item.data.activeToken}</span>
                            <span> next token in {item.data.each_token_time} minutes</span>
                          </div>
                          : <span></span>
                        }</div>
                        <div className="d-flex justify-content-center">
                          {item.data.totalTokens === 0 ? <p>No tokens available now</p> :
                            <button id="buy-btn" className="btn w-25 btn-secondary" onClick={() => getToken(item.id, item.data.totalTokens, item.data.totalSoldToken, item.data.company)} >Buy Token</button>
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )
          })}
        </div>
        
      </div>
    </div>
  )
}

export default UserPage