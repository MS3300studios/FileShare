import * as React from "react";
import styles from "./landingPage.module.css";
import { BiImageAlt, BiPhotoAlbum } from "react-icons/bi";
import { AiOutlineFileText, AiFillFileZip, AiOutlineFileExclamation } from "react-icons/ai";
import { HiDocument } from "react-icons/hi";
import moment from "moment";
import { DocumentCard, DocumentCardActivity, DocumentCardPreview, DocumentCardTitle, IDocumentCardPreviewProps } from "@fluentui/react";
import unknownImage from "../../assets/unknown.png";
import archiveImage from "../../assets/archive.png";
import photoImage from "../../assets/photo.png";
import textImage from "../../assets/text.png";
import documentImage from "../../assets/document.png";
import profilePic from "../../assets/youngWomanProfilePic.jpg";

interface ICardProps{
    id?: string;
    name: string;
    size: number;
    uploadedAt?: string;
    ext: string;
    docType: string;
    modalHandler: (id: string | undefined) => void;
}

const resolveSrc = (docType: string) => {
    switch (docType) {
        case "photo":
            return photoImage;

        case "text":
            return textImage;

        case "archive":
            return archiveImage;

        case "document":
            return documentImage;
    
        default:
            return unknownImage;
    }
}

export default function Card({ id, name, size, uploadedAt, ext, docType, modalHandler }: ICardProps){
    const previewProps: IDocumentCardPreviewProps = {
        previewImages: [
            {
                name: name,
                linkProps: {
                    href: '/hello',
                    target: '_blank',
                },
                previewImageSrc: resolveSrc(docType),
                width: 200,
                height: 200,
            },
        ],
    };
    const DocumentCardActivityPeople = [{ name: 'Annie Lindqvist', profileImageSrc: profilePic }];

    return (
        <DocumentCard
            aria-label="Default Document Card with large file name. Created by Annie Lindqvist a few minutes ago."
            onClick={() => modalHandler(id)}
        >
            <DocumentCardPreview {...previewProps} />
            <DocumentCardTitle
                title={`${name} - ${size} kb`}
                shouldTruncate
            />
            <DocumentCardActivity activity={`${uploadedAt}`} people={DocumentCardActivityPeople} />
        </DocumentCard>
    )

    // return (
    //     <div className={styles.cardContainer}>
    //         <div className={styles.iconContainer}>
    //             {resolveSrc(docType)}
    //         </div>
    //         <div className={styles.infoContainer}>
    //             <p>{name}</p>
    //         </div>
    //     </div>
    // )
}