import * as React from "react";
import styles from "./landingPage.module.css";
import { BiPhotoAlbum } from "react-icons/bi";
import { AiOutlineFileText, AiFillFileZip, AiOutlineFileExclamation } from "react-icons/ai";
import { HiDocument } from "react-icons/hi";
import moment from "moment";

interface ICardProps{
    name: string;
    size: number;
    uploadedAt: number;
    ext: string;
    docType: string;
}

const resolveSrc = (docType: string) => {
    switch (docType) {
        case "photo":
            return <BiPhotoAlbum  size="large" />;

        case "text":
            return <AiOutlineFileText  size="large" />;

        case "archive":
            return <AiFillFileZip  size="large" />;

        case "document":
            return <HiDocument  size="large" />;
    
        default:
            return <AiOutlineFileExclamation size="large" />
    }
}

export default function Card({ name, size, uploadedAt, ext, docType }: ICardProps){
    return (
        <div className={styles.cardContainer}>
            {resolveSrc(docType)}
            <div className={styles.infoContainer}>
                <p>{name}</p>
            </div>
        </div>
    )
}