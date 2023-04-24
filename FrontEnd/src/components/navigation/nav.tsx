import styles from "./nav.module.css";
import profile from "../../assets/youngWomanProfilePic.jpg";
import { Dropdown, DropdownMenuItemType, IDropdownOption } from '@fluentui/react/lib/Dropdown';
import { PrimaryButton } from "@fluentui/react";
import { Link, redirect } from "react-router-dom";

export default function Navigation(){
    
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
        if(!item)
            return;
        console.log(item)
        switch (item.key) {
            case "upload":
                redirect("/file/add");
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
                <div className={styles.profile}>
                    <img src={profile} alt="profile picture" />
                </div>
            </div>
        </nav>
    )
}