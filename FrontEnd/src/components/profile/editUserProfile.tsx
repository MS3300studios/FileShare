/*import React, { useState } from 'react';
import { TextField, PrimaryButton } from '@fluentui/react';
import styles from './ProfileEditView.module.css';

const EditProfile: React.FC = () => {
    const [nickname, setNickname] = useState('');
    const [photo, setPhoto] = useState('');
    const [email, setEmail] = useState('');

    const handleNicknameChange = (_e: React.FormEvent<HTMLInputElement>, value?: string) => {
        setNickname(value || '');
    };

    const handlePhotoChange = (_e: React.FormEvent<HTMLInputElement>, value?: string) => {
        setPhoto(value || '');
    };

    const handleEmailChange = (_e: React.FormEvent<HTMLInputElement>, value?: string) => {
        setEmail(value || '');
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const data = {
            nickname,
            photo,
            email,
        };
        
        fetch('https://limba.wzks.uj.edu.pl/20_strusinski/aplikacja/api/user/edit', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            Authorization: '', // Add your authorization value here
            },
            body: JSON.stringify(data),
        })
        .then((response) => {
            if (response.ok) {
                // Handle success case
                console.log('Profile updated successfully!');
            } else {
                // Handle error case
                console.log('Error updating profile.');
            }
            })
            .catch((error) => {
            console.log('An error occurred:', error);
            });
        };      
    };

  return (
    <div className={styles['profile-edit-view']}>
      <h2>Edit Profile</h2>
      <form onSubmit={handleSubmit}>
        <div className={styles['form-group']}>
          <TextField
            label="Nickname"
            value={nickname}
            onChange={handleNicknameChange}
          />
        </div>
        <div className={styles['form-group']}>
          <TextField
            label="Photo"
            value={photo}
            onChange={handlePhotoChange}
          />
        </div>
        <div className={styles['form-group']}>
          <TextField
            label="Email"
            value={email}
            onChange={handleEmailChange}
          />
        </div>
        <PrimaryButton type="submit">Save</PrimaryButton>
      </form>
    </div>
  );
};

export default EditProfile; */


import * as React from "react";
import styles from "./editUserProfile.module.css";
import { getUser } from "../../utils/getUser";
import { getToken } from "../../utils/getToken";
import { MessageBar, MessageBarType, PrimaryButton, Spinner, SpinnerSize, TextField } from "@fluentui/react";
import moment from "moment";
import imageCompression from 'browser-image-compression';

const EditProfile = () => {
  const userData = getUser();
  const [isLoadingPhoto, setIsLoadingPhoto] = React.useState(true);
  const [photo, setPhoto] = React.useState<string | ArrayBuffer | null>("");
  const [messageBar, setMessageBar] = React.useState({show: false, type: MessageBarType.error, text: "an error occurred"});
  const [photoEdited, setPhotoEdited] = React.useState(false);
  const [emailEdited, setEmailEdited] = React.useState(false);
  const [nicknameEdited, setNicknameEdited] = React.useState(false);
  const [email, setEmail] = React.useState(userData.email);
  const [nickname, setNickname] = React.useState(userData.nickname);
  const [processingRequest, setProcessingRequest] = React.useState(false);
  

  React.useEffect(() => {
      fetch(`https://limba.wzks.uj.edu.pl/20_strusinski/aplikacja/api/users/userPhoto/${userData._id}`, {
          headers: { Authorization: getToken() }
      }).then((resp) => {
          return resp.json();
      }).then(data => {
          setIsLoadingPhoto(false);
          setPhoto(data.photo)
      }).catch(err => console.log(err))
  }, [])

  const uploadPhotoHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhotoEdited(true);
    setMessageBar({show: true, type: MessageBarType.info, text: "compressing image"})
    const file = e.target.files?.[0]

    if(file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const image = new Image();
        image.src = reader.result as string;
        image.onload = () => {
          imageCompression(file, { maxSizeMB: 0.3, maxWidthOrHeight: 1920}).then(compressedBlob => {
            const compressionReader = new FileReader();
            compressionReader.readAsDataURL(compressedBlob); 
            compressionReader.onloadend = () => {
              setPhoto(compressionReader.result)
              setMessageBar({show: false, type: MessageBarType.success, text: "Compression successful"})
            }
          }).catch(() => setMessageBar({show: true, type: MessageBarType.error, text: "Compression failed, reload the page and try again"}))
        };
        image.onerror = () => {
          setMessageBar({show: true, type: MessageBarType.warning, text: "Only images are allowed"})
        };
      };
      reader.readAsDataURL(file);
    }          
  }

  const handleUpload = () => {
    if(!photoEdited && !emailEdited && !nicknameEdited){
        setMessageBar({show: true, type: MessageBarType.warning, text: "No information was edited"})
        return
    }
    setMessageBar({show: false, type: MessageBarType.warning, text: "No information was edited"})
    setProcessingRequest(true);

    fetch(`https://limba.wzks.uj.edu.pl/20_strusinski/aplikacja/api/users/edit`, {
        headers: { "Authorization": getToken(), 'Content-Type': 'application/json' },
        method: "post",
        body: JSON.stringify({
            email: email,
            nickname: nickname,
            photo: photoEdited ? photo : ""
        })
    }).then((resp) => {
        if(resp.status === 409){
            setMessageBar({show: true, type: MessageBarType.error, text: "Nickname or email is already taken"})
            setProcessingRequest(false);
        } else if(resp.ok){
            setMessageBar({show: true, type: MessageBarType.success, text: "User data edited successfully"})
            const newUserData = { ...userData, nickname: nickname, email: email }

            if(localStorage.getItem("userData") === null){
                sessionStorage.setItem("userData", JSON.stringify(newUserData));
            } else {
                localStorage.setItem("userData", JSON.stringify(newUserData));
            }

            setProcessingRequest(false);
            setTimeout(() => {
                window.location.reload()
            }, 1500);
        }
    }).catch(err => console.log(err))
  }

  return (
    <div className={styles.mainContainer}>
        <div>
            <h1>Edit your profile</h1>
            <p>Your profile was created on {moment(userData.createdAt).format('Do MMMM YYYY, h:mm a')}</p>
            <TextField label="email" value={email} onChange={(e) => {setEmailEdited(true); setEmail(e.currentTarget.value)} }/>
            <TextField label="nickname" value={nickname} onChange={(e) => {setNicknameEdited(true); setNickname(e.currentTarget.value)} }/>
            <div className={styles.buttonWrapper}>
                <span className={styles.label}>Upload photo</span>
                <input 
                    type="file" 
                    name="upload" 
                    className={styles.upload} 
                    placeholder="Upload File" 
                    onChange={uploadPhotoHandler}
                    id="details"
                    />
            </div>
            { isLoadingPhoto ? <Spinner size={SpinnerSize.medium} /> : (
                <div style={{width: "100%", display: "flex", justifyContent: "center", marginBottom: "10px"}}>
                    <img src={(photo as any)} alt="user photo" className={styles.userImg} />
                </div>
            )}
            { messageBar.show &&
                <>
                <div style={{marginTop: "10px"}}></div>
                <MessageBar messageBarType={messageBar.type}>
                    {messageBar.text}
                </MessageBar> 
                <div style={{marginBottom: "10px"}}></div>
                </>
            }
            <PrimaryButton onClick={handleUpload}>{ processingRequest ? <Spinner size={SpinnerSize.medium} /> : "Save changes" }</PrimaryButton>
        </div>
    </div>
  )
}

export default EditProfile; 