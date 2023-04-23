import styles from "./nav.module.css";
import profile from "../../assets/youngWomanProfilePic.jpg";
import { Dropdown, DropdownMenuItemType, IDropdownOption } from '@fluentui/react/lib/Dropdown';

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

    return(
        <nav className={styles.navContainer}>
            <h1 className={styles.companyHeader}>FileShare</h1>
            <div className={styles.rightSideNav}>
                <Dropdown
                    placeholder="Navigate"
                    options={options}
                    className={styles.smallMenu}
                />
                <div className={styles.profile}>
                    <img src={profile} alt="profile picture" />
                </div>
            </div>
        </nav>
    )
}