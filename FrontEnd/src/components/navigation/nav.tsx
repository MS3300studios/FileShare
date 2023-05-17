import * as React from "react";
import styles from "./nav.module.css";
import { Dropdown, DropdownMenuItemType, IDropdownOption } from '@fluentui/react/lib/Dropdown';
import { PrimaryButton, Spinner, SpinnerSize } from "@fluentui/react";
import { Link, useNavigate } from "react-router-dom";
import { getUser } from "../../utils/getUser";
import { getToken } from "../../utils/getToken";

export default function Navigation(){
    const [loadingPhoto, setLoadingPhoto] = React.useState<boolean>(true);
    const [userPhoto, setUserPhoto] = React.useState<string>("");
    const userData = getUser();

    React.useEffect(() => {
        fetch(`http://localhost:3000/users/userphoto/${userData._id}`, { headers: { Authorization: getToken() } }).then(resp => {
            return resp.json();
        }).then(data => {
            setLoadingPhoto(false);
            setUserPhoto(data.photo)
        }).catch(err => {
            console.log(err)
        });
    }, [])

    const navigate = useNavigate();
    const options: IDropdownOption[] = [
      { key: 'profileHeader', text: 'Your profile', itemType: DropdownMenuItemType.Header },
      { key: 'view', text: 'Go to your profile' },
      { key: 'edit', text: 'Edit your profile' },
      { key: 'divider_1', text: '-', itemType: DropdownMenuItemType.Divider },
      { key: 'actionHeader', text: 'Actions', itemType: DropdownMenuItemType.Header },
      { key: 'contacts', text: 'Go to your contacts' },
      { key: 'upload', text: 'Upload a file' },
      { key: 'logout', text: 'Log out' },
    ];

    const onDropdownSelectChange = (item?: IDropdownOption): void => {
        if(!item) return;
        switch (item.key) {
            case "upload":
                navigate("/file/add");
                break;
            case "logout":
                localStorage.clear();
                sessionStorage.clear();
                window.location.reload();
                break;
            case "contacts":
                navigate("/contacts");
                break;
            default:
                break;
        }
    }

    return(
        <nav className={styles.navContainer}>
            <Link to="/" className={styles.companyHeader}>
                <h1>FileShare</h1>
            </Link>
            <div className={styles.rightSideNav}>
                <Link to="/file/add">
                    <PrimaryButton 
                        text="Add file" 
                        allowDisabledFocus 
                        checked
                    />
                </Link>
                <Dropdown
                    placeholder="Navigate"
                    options={options}
                    className={styles.smallMenu}
                    onChange={(event, item) => onDropdownSelectChange(item)}
                />
                <p className={styles.usernickname}>{userData.nickname}</p>
                <div className={styles.profile}>
                    { loadingPhoto ? <Spinner size={SpinnerSize.medium} /> : <img src={userPhoto} alt="your profile picture" /> }
                </div>
            </div>
        </nav>
    )
}