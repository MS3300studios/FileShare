import * as React from "react";
import styles from "./landingPage.module.css";
import Card from "./card";

const data = [
    {
        name: "Photo1.jpg",
        size: 1200,
        uploadedAt: new Date().getDate(),
        ext: "jpg",
        docType: "photo"
    },
    {
        name: "Notes.txt",
        size: 14,
        uploadedAt: new Date().getDate(),
        ext: "txt",
        docType: "text"
    },
    {
        name: "archive.zip",
        size: 4200,
        uploadedAt: new Date().getDate(),
        ext: "zip",
        docType: "archive"
    },
    {
        name: "information.pdf",
        size: 2048,
        uploadedAt: new Date().getDate(),
        ext: "pdf",
        docType: "document"
    },
    {
        name: "names.c",
        size: 20,
        uploadedAt: new Date().getDate(),
        ext: "c",
        docType: "unknown"
    },
    {
        name: "names.c",
        size: 20,
        uploadedAt: new Date().getDate(),
        ext: "c",
        docType: "unknown"
    },
    {
        name: "names.c",
        size: 20,
        uploadedAt: new Date().getDate(),
        ext: "c",
        docType: "unknown"
    },
    {
        name: "names.c",
        size: 20,
        uploadedAt: new Date().getDate(),
        ext: "c",
        docType: "unknown"
    },
    {
        name: "names.c",
        size: 20,
        uploadedAt: new Date().getDate(),
        ext: "c",
        docType: "unknown"
    },
    {
        name: "names.c",
        size: 20,
        uploadedAt: new Date().getDate(),
        ext: "c",
        docType: "unknown"
    },
    {
        name: "names.c",
        size: 20,
        uploadedAt: new Date().getDate(),
        ext: "c",
        docType: "unknown"
    },
    {
        name: "names.c",
        size: 20,
        uploadedAt: new Date().getDate(),
        ext: "c",
        docType: "unknown"
    },
    {
        name: "names.c",
        size: 20,
        uploadedAt: new Date().getDate(),
        ext: "c",
        docType: "unknown"
    },
    {
        name: "names.c",
        size: 20,
        uploadedAt: new Date().getDate(),
        ext: "c",
        docType: "unknown"
    },
    {
        name: "names.c",
        size: 20,
        uploadedAt: new Date().getDate(),
        ext: "c",
        docType: "unknown"
    },
    {
        name: "names.c",
        size: 20,
        uploadedAt: new Date().getDate(),
        ext: "c",
        docType: "unknown"
    },
    {
        name: "names.c",
        size: 20,
        uploadedAt: new Date().getDate(),
        ext: "c",
        docType: "unknown"
    },
    {
        name: "names.c",
        size: 20,
        uploadedAt: new Date().getDate(),
        ext: "c",
        docType: "unknown"
    },
    {
        name: "names.c",
        size: 20,
        uploadedAt: new Date().getDate(),
        ext: "c",
        docType: "unknown"
    },
    {
        name: "names.c",
        size: 20,
        uploadedAt: new Date().getDate(),
        ext: "c",
        docType: "unknown"
    },
    {
        name: "infiltration.c",
        size: 20,
        uploadedAt: new Date().getDate(),
        ext: "c",
        docType: "unknown"
    },
    {
        name: "information.mp3",
        size: 48,
        uploadedAt: new Date().getDate(),
        ext: "mp3",
        docType: "unknown"
    }
]

export default function LandingPage(){
    return(
        <main>
            <h1>Your files</h1>
            <article>
                <div className={styles.cardsContainer}>
                    {data.map((el, index) => {
                        return (
                            <Card 
                                key={index}
                                name={el.name}
                                uploadedAt={el.uploadedAt}
                                docType={el.docType}
                                ext={el.ext}
                                size={el.size}
                            />
                        )
                    })}
                </div>
            </article>
        </main>
    )
} 