import '../App.css'
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { where, query } from 'firebase/firestore';

import {
    setCompanyToDb,
    setTokensToDb,
    db,
    updateCurrentToken,
    makeTokensNull,
    auth
} from "../config/firebase";
import { collection, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import { Modal, message } from "antd";
import { LeftOutlined } from "@ant-design/icons";

function CompanyPage() {
    const navigate = useNavigate()

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModal2Open, setIsModal2Open] = useState(false);
    const [isUpdate, setIsUpdate] = useState(false);
    const [companyToUpdateToken, setcompanyToUpdateToken] = useState("");
    const [prev, setData] = useState([]);
    const [messageApi, messageAlert] = message.useMessage();

    const success = (e) => {
        messageApi.open({
            type: 'success',
            content: e,
        });
    };

    const error = (e) => {
        messageApi.open({
            type: 'error',
            content: e,
        });
    };

    const warning = (e) => {
        messageApi.open({
            type: 'warning',
            content: e,
        });
    };

    const showModal = () => {
        setIsModalOpen(true);
    };
    const showModal2 = () => {
        setIsModal2Open(true);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
        setIsModal2Open(false);
        var allinput = document.querySelectorAll("input")
        allinput.forEach((item) => {
            item.value = ''
        })
    };
    const fetchUserLocation = () => {
        navigator.geolocation.getCurrentPosition((position) => {
            const latitudes = position.coords.latitude;
            const longtitudes = position.coords.longitude;
            document.getElementById("latitude").value = latitudes;
            document.getElementById("longtitude").value = longtitudes;
            success("Location recieved")
        });
    };
    const postCompanyData = () => {
        let company_name = document.getElementById("company_name");
        let since = document.getElementById("since");
        let openingTime = document.getElementById("openingTime");
        let closingTime = document.getElementById("closingTime");
        let location = {
            latitude: document.getElementById("latitude").value,
            longitude: document.getElementById("longtitude").value,
        };
        let openingTimeFormat = onTimeChange(openingTime);
        let closingTimeFormat = onTimeChange(closingTime);
        if (company_name.value === "" || since.value === "" || openingTime.value === "" || closingTime.value === "" || location.latitude === "") {
            error("all fields required");
            return;
        }
        function onTimeChange(e) {
            let timeSplit = e.value.split(':'),
                hours,
                minutes,
                meridian;
            hours = timeSplit[0];
            minutes = timeSplit[1];
            if (hours > 12) {
                meridian = 'PM';
                hours -= 12;
            } else if (hours < 12) {
                meridian = 'AM';
                if (hours === 0) {
                    hours = 12;
                }
            } else {
                meridian = 'PM';
            }
            return (hours + ':' + minutes + ' ' + meridian);
        }
        setCompanyToDb(
            company_name.value,
            since.value,
            openingTimeFormat,
            closingTimeFormat,
            location
        );
        success(`${company_name.value} added successfully`)
        handleCancel();
    };

    useEffect(() => {
        const q = query(collection(db, "company"), where(`userId`, "==", `${auth.currentUser.uid}`));
        const companies = onSnapshot(q, (snapshot) => {
            setData([]);
            snapshot.docs.forEach((doc) => {
                setData((prev) => [...prev, { id: doc.id, data: doc.data() }]);
            });
            setIsUpdate(true)
        });
        return () => {
            companies()
        }
    }, [])


    useEffect(() => {
        for (let item of prev) {
            if (item.data.createdAt === null) {
                return
            }
            else {
                let data = item.data.createdAt.toDate().toDateString();
                let today = new Date().toDateString();
                if (data > today) {
                    makeTokensNull(item.id)
                }
            }
        }
    }, [isUpdate]);

    const Generate = (e) => {
        showModal2();
        setcompanyToUpdateToken(e);
    };

    const postToken = () => {
        var no_of_tokens = document.getElementById("no_of_tokens");
        var each_token_time = document.getElementById("each_token_time");
        if (no_of_tokens.value === "" || each_token_time.value === "") {
            warning("fill both the values")
            return
        }
        setTokensToDb(
            +no_of_tokens.value,
            +each_token_time.value,
            companyToUpdateToken
        );
        success("tokens updated successfully")
        handleCancel();
    };

    const DeleteCompany = (e) => {
        deleteDoc(doc(db, "company", `${e}`));
        error("deleted successfully")
    };

    const IncreamentToken = (...args) => {
        const [companyId, totalTokens, activeTokens] = args;

        activeTokens >= totalTokens ? error("invalid tokens") : updateCurrentToken(companyId)

    }

    const DisableTokens = (e, ...args) => {
        makeTokensNull(e, args)
    }

    return (
        <>
            {messageAlert}
            <Modal
                title="Add your Company or clinic"
                open={isModalOpen}
                onOk={postCompanyData}
                onCancel={handleCancel}
            >
                <input
                    type="text"
                    id="company_name"
                    className="form-control my-2"
                    placeholder="Company Name"
                />
                <input
                    type="text"
                    id="since"
                    className="form-control my-2"
                    placeholder="Since"
                />
                <div className='d-flex my-2 align-items-center'>
                    <label className='w-25'>Opening Time: </label>
                    <input
                        type="time"
                        id="openingTime"
                        className="form-control"
                        placeholder="timings"
                    />
                </div>
                <div className='d-flex my-2 align-items-center'>
                    <label className='w-25'>Closing Time: </label>

                    <input
                        type="time"
                        id="closingTime"
                        className="form-control my-2"
                        placeholder="timings"
                    />
                </div>
                
                <button className="form-control" onClick={fetchUserLocation}>
                    Add your Current Location
                </button>
                <div>
                    <input type="hidden" id="latitude" className="form-control" />
                    <input type="hidden" id="longtitude" className="form-control" />
                </div>
            </Modal>
            <Modal
                title="Add or Update Tokens"
                open={isModal2Open}
                onOk={postToken}
                onCancel={handleCancel}
            >
                <input
                    type="number"
                    id="no_of_tokens"
                    className="form-control my-2"
                    placeholder="No of Tokens Available For Today"
                />
                <input
                    type="number"
                    id="each_token_time"
                    className="form-control my-2"
                    placeholder="Each Token Time"
                />
            </Modal>
            <div className="container-fluid bg-light">
                <div className="row">
                    <div className="col-md-3 border ">
                        <div className='d-flex align-items-center'>
                            <button className='icon' onClick={() => navigate(-1)}><LeftOutlined /></button>
                        </div>
                        <div className='com-heading'><h1>Q-APP</h1></div>
                        <h2 className="py-3">Company</h2>
                        <div className='add-com'>
                            <h3>Add Company</h3>
                        </div>
                        <div className="py-5">
                            
                            <button className="btn btn-outline-dark w-100 py-2 my-3" onClick={showModal}>+</button>
                        </div>
                    </div>
                    <div id='main-detail' className="col-md-9 border ">
                        {prev.map((item, key) => {
                            return (
                                <div key={key} className='row-2'>
                                    <div style={{display:'flex'}} className='col-md-12 bg-secondary p-4 d-flex justify-content-between'>
                                        <div id='com-name' className='col-md-8'>
                                            Company Name: {item.data.company}
                                        </div>
                                        <div style={{margin:'0px 0px 0px 25px '}} className='col-md-4'>
                                            <button id='update' className='btn btn-primary mx-2' onClick={() => Generate(item.id)}>Update Tokens</button>
                                            <button id='delete' className='btn btn-danger' onClick={() => DeleteCompany(item.id)}>Delete</button>
                                            <button id='disable' className='btn btn-warning mx-2' onClick={() => DisableTokens(item.id, item.data.soldTo)}>Disable</button>
                                        </div>
                                    </div>
                                    <div className="col-md-12 d-flex justify-content-between" >
                                        <div className='token' style={{display:'flex'}}>
                                        <p className=''>Total Tokens : </p>
                                        <span className=' mx-3'> {item.data.totalTokens}</span>
                                        </div>
                                        <div className='time' style={{display:'flex'}}>
                                        <span className=' mx-3'>Each Token Time : </span>
                                        <p className="">{item.data.each_token_time} minutes</p>
                                        </div>
                                        <div className='sold' style={{display:'flex'}}>
                                        <span className=' mx-3'>Total Sold Token : </span>
                                        <p className="">{item.data.totalSoldToken}</p>
                                        </div>
                                    </div>
                                    <div className='d-flex justify-content-between py-2 border'>
                                        <div className='serving' style={{display:'flex'}}>
                                            <span className='ser-1'>Currently serving: </span>
                                            <span className=" mx-3">{item.data.activeToken}</span>
                                        </div>
                                        <button
                                            id='done'
                                            className='btn btn-secondary'
                                            onClick={() =>
                                                IncreamentToken(
                                                    item.id,
                                                    item.data.totalSoldToken,
                                                    item.data.activeToken
                                                )
                                            }
                                        >
                                            Done
                                        </button>
                                    </div>
                                    <div>
                                        <div id='token-num' className="row gy-2 p-1">
                                            {item.data.soldTo.map((items) => {
                                                return (
                                                    <div className='col-md-4 border'>
                                                        <p className='small '>Token Number: {items.tokenNumber}</p>
                                                        <p className='small'>Patient Name: {items.name}</p>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>

                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </>
    );
}

export default CompanyPage;
