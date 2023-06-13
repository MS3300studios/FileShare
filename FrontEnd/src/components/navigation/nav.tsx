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
    const [dropdownOption, setDropdownOption] = React.useState<string | undefined>("Navigate")
    const userData = getUser();

    React.useEffect(() => {
        fetch(`https://limba.wzks.uj.edu.pl/20_strusinski/aplikacja/api/users/userphoto/${userData._id}`, { headers: { Authorization: getToken() } }).then(resp => {
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
      { key: 'edit', text: 'Edit your profile' },
      { key: 'divider_1', text: '-', itemType: DropdownMenuItemType.Divider },
      { key: 'actionHeader', text: 'Actions', itemType: DropdownMenuItemType.Header },
      { key: 'contacts', text: 'Go to your contacts' }, 
      { key: 'conversations', text: 'Go to your conversations' }, 
      { key: 'shared', text: 'Go to files shared with me' }, 
      { key: 'upload', text: 'Upload a file' },
      { key: 'logout', text: 'Log out' },
    ];

    const onDropdownSelectChange = (item?: IDropdownOption): void => {
        if(!item) return;
        switch (item.key) {
            case "upload":
                navigate("/file/add");
                setDropdownOption("Navigate");
                break;
            case "logout":
                localStorage.clear();
                sessionStorage.clear();
                window.location.replace(window.location.origin)
                break;
            case "contacts":
                navigate("/contacts");
                setDropdownOption("Navigate");
                break;
            case "edit":
                navigate("/user/edit");
                setDropdownOption("Navigate");
                break;
            case "shared":
                navigate("/shared");
                setDropdownOption("Navigate");
                break;
            case "conversations":
                navigate("/conversations");
                setDropdownOption("Navigate");
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
                    selectedKey={dropdownOption}
                    options={options}
                    className={styles.smallMenu}
                    onChange={(event, item) => onDropdownSelectChange(item)}
                />
                <div style={{marginRight: "10px"}}></div>
                <p className={styles.usernickname}>{userData.nickname}</p>
                <div className={styles.profile}>
                    { loadingPhoto ? <Spinner size={SpinnerSize.medium} /> : <img src={userPhoto} alt="your profile picture" /> }
                </div>
            </div>
        </nav>
    )
}