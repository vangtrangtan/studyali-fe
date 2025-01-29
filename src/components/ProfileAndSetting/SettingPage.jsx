import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import useSignIn from 'react-auth-kit/hooks/useSignIn';
import useSignOut from 'react-auth-kit/hooks/useSignOut';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

import {
    MDBContainer,
    MDBInput,
    MDBBtn,
    MDBDropdown,
    MDBDropdownToggle,
    MDBDropdownItem,
    MDBDropdownMenu,
    MDBCol,
    MDBRow,
    MDBCard,
    MDBCardBody,
} from 'mdb-react-ui-kit';
import 'bootstrap/dist/css/bootstrap.min.css';
import { CHINESE, ENGLISH, SERVER } from '../fileWithConstants';
import useAuthHeader from 'react-auth-kit/hooks/useAuthHeader';
// import '../../App.css';
import '../../css/profile.css'
import ConfirmationDialog from '../Confirm/ConfirmationDialog';


function SettingPage({ profileData, setProfileData }) {

    const [email, setEmail] = useState((profileData.profileEntity.email === null ? '' : profileData.profileEntity.email));
    const [slogan, setSlogan] = useState((profileData.profileEntity.slogan === null ? '' : profileData.profileEntity.slogan));
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [oldPassword, setOldPassword] = useState('');
    const [error, setError] = useState('');
    const [lang, changeLang] = useState((profileData.profileEntity.defaultServer === null ? ENGLISH : profileData.profileEntity.defaultServer));
    const MAX_SLOGAN_LENGTH = 250;
    const limitSloganColor = (slogan.length >= MAX_SLOGAN_LENGTH ? "red" : "grey");
    const history = useNavigate(); // Get the history object for redirection
    const authHeader = useAuthHeader();
    const handleChangeLang = (e) => {
        changeLang(e.target.value);
    };

    const handleSlogan = (e) => {
        if (e.target.value.length <= MAX_SLOGAN_LENGTH) setSlogan(e.target.value);
    };

    const saveChange = async () => {
        try {
            if (newPassword.length > 0) {
                if (newPassword !== confirmPassword) {
                    setError('Confirm new password do not match/không khớp !');
                    return;
                }
                else if (oldPassword.length === 0) {
                    setError('hãy nhập password hiện tại/fill old password');
                    return;
                }
                else if (/\s/.test(newPassword)) {
                    setError('No space ! không cho phép khoảng trắng trong password');
                    return;
                }
            }

            if (email !== profileData.profileEntity.email) {
                if (oldPassword.length === 0) {
                    setError('hãy nhập password hiện tại/Old password');
                    return;
                }
            }

            if (slogan.length > MAX_SLOGAN_LENGTH) {
                setError('slogan quá dài, maximum length is ' + MAX_SLOGAN_LENGTH);
                return;
            }
            const obj = {};
            if (email !== profileData.profileEntity.email) obj.email = email;
            if (slogan !== profileData.profileEntity.slogan) obj.slogan = slogan;
            if (lang !== profileData.profileEntity.defaultServer) obj.default_server = lang;
            if (newPassword.length > 0) obj.new_password = newPassword;
            if (oldPassword.length > 0) obj.password = oldPassword;

            const response = await axios.patch(SERVER + '/auth/update/' + profileData.profileEntity.username, obj,
                {
                    headers: { "Accept": "application/json, text/plain", "Content-Type": "application/json", 'Authorization': authHeader }
                }
            );
            // Handle successful signup
            if (response.data.status === false) {
                alert(response.data.message);
            }
            else {
                alert("update succcess !");
                if (newPassword.length > 0) {
                    history("/logout");
                }
                else history("/home");
            }

        } catch (error) {
            // Handle signup error
            console.error('update failed:', error.response ? error.response.data : error.message);
            setError(error.response ? error.response.data : error.message);
        }
    };
    const cancelHandle = (e) => {
        history(-1);
    };

    if (profileData === null) {
        return <div>unvailable setting</div>;
    }
    return (
        <div className="d-flex justify-content-center align-items-center vh-50" style={{ backgroundColor: "#f3e7d1d9" }}>
            <div className="p-4" style={{ width: '500px', height: 'auto' }}>
                <MDBContainer className="p-3">
                    <h2 className="mb-4 text-center">{profileData.profileEntity.username}</h2>
                    <p className="mb-0">Email:</p>
                    <label style={{ fontSize: "12px", color: "gray", marginLeft: "5px" }} className="form-label">*Dùng để khôi phục mật khẩu khi quên</label>
                    <MDBInput wrapperClass='mb-2' placeholder='Email' id='email' value={email} type='text' onChange={(e) => setEmail(e.target.value)} />
                    <div className="mb-2 sloganDiv">
                        <MDBRow>
                            <MDBCol >  <label className="form-label">Slogan:</label></MDBCol >
                            <MDBCol lg="4"  >   <p style={{ fontSize: "12px", color: limitSloganColor }}>{slogan.length}/{MAX_SLOGAN_LENGTH} characters</p></MDBCol >
                        </MDBRow>
                        <textarea maxLength={MAX_SLOGAN_LENGTH} style={{ fontSize: "13px" }} className="form-control" onChange={handleSlogan} value={slogan}></textarea>
                    </div>
                    <div style={{ display: "flex", fontSize: "16px" }}>
                        <div>Default Server: </div>
                        <select style={{ fontSize: "18px", marginBottom: "20px", position: "relative", marginLeft: "10px" }} value={lang} onChange={handleChangeLang}>
                            <option value={ENGLISH} >English</option>
                            <option value={CHINESE} >Chinese</option>
                        </select>
                    </div>
                    <p>Change password: (để trống nếu không muốn thay đổi mật khẩu)</p>
                    <MDBInput wrapperClass='mb-2' placeholder='New password' id='password1' type='password' value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                    <MDBInput wrapperClass='mb-3' disabled={newPassword.length === 0} placeholder='Confirm new password' id='password2' type='password' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                    <p>nhập password hiện tại để xác nhận thay đổi</p>
                    <MDBInput wrapperClass='mb-5' disabled={newPassword.length === 0 && email === profileData.profileEntity.email} placeholder='Current password' id='password3' type='password' value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} />
                    {error && <p className="text-danger">{error}</p>} {/* Render error message if exists */}
                    <div style={{ alignItems: "center", justifyContent: "center", display: "flex" }} >
                        <button type="button" className="btn btn-secondary btn-rounded col-3" data-mdb-ripple-init onClick={cancelHandle}>Cancel</button>
                        <ConfirmationDialog response={saveChange} >
                            {(showDialog) => (
                                <button type="button" className="btn btn-primary btn-rounded col-3 ms-3" data-mdb-ripple-init onClick={showDialog}>Save</button>
                            )}
                        </ConfirmationDialog>
                        {/* <button type="button" className="btn btn-primary btn-rounded col-3  ms-2" data-mdb-ripple-init onClick={saveChange}>Save</button> */}
                    </div>
                    {/* <div > <button className="mb-2 d-block btn-primary" style={{ marginLeft: "30%", height: '40px', width: '140px' }} onClick={saveChange}>Save changes</button> </div> */}


                </MDBContainer>
            </div>
        </div>
    );
}


export default SettingPage;