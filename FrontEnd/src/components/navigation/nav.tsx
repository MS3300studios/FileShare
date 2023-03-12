import * as React from "react";
import styles from "./nav.module.css";

export default function Navigation(){
    return(
        <nav className={styles.navContainer}>
            <a href="#">Main</a>
            <a href="#">Profile</a>
            <a href="#">About</a>
        </nav>
    )
} 