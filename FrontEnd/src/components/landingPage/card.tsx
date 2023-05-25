import * as React from "react";
import moment from "moment";
import { DocumentCard, DocumentCardActivity, DocumentCardPreview, DocumentCardTitle, IDocumentCardPreviewProps, ImageFit, Spinner, SpinnerSize } from "@fluentui/react";
import unknownImage from "../../assets/unknown.png";
import archiveImage from "../../assets/archive.png";
import photoImage from "../../assets/photo.png";
import textImage from "../../assets/text.png";
import documentImage from "../../assets/document.png";
import { getToken } from "../../utils/getToken";

interface ICardProps{
    id?: string;
    userId?: string;
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

interface IUser{
    nickname: string;
    photo: string;
    email: string;
}

export default function Card({ id, userId, name, size, uploadedAt, ext, docType, modalHandler }: ICardProps){
    const [isLoadingUser, setIsLoadingUser] = React.useState(true);
    const [user, setUser] = React.useState<IUser>({nickname: "loading", photo: "loading photo", email: "loading"});
    const [DocumentCardActivityPeople, setDocumentCardActivityPeople] = React.useState([{ name: user.nickname, profileImageSrc: user.photo }])
    const [previewProps, setPreviewProps] = React.useState<IDocumentCardPreviewProps>({
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
    });

    React.useEffect(() => {
        fetch(`http://localhost:3000/users/getUser/${userId}`,
            { headers: { Authorization: getToken() } 
        }).then(resp => resp.json()).then(data => {
            setIsLoadingUser(false);
            setUser(data);
            setPreviewProps({
                previewImages: [
                    {
                        name: name,
                        linkProps: {
                            href: '/hello',
                            target: '_blank',
                        },
                        previewImageSrc: resolveSrc(docType),
                        imageFit: ImageFit.contain,
                        width: 120,
                        height: 120,
                    },
                ],
            })
    
            setDocumentCardActivityPeople([{ name: data.nickname, profileImageSrc: data.photo }])
        });

    }, [])

    return (
        <>
        {
            isLoadingUser ? <Spinner size={SpinnerSize.medium} /> : (
                <DocumentCard
                    aria-label="Default Document Card with large file name. Created by Annie Lindqvist a few minutes ago."
                    onClick={() => modalHandler(id)}
                >
                    <DocumentCardPreview {...previewProps} />
                    <DocumentCardTitle
                        title={`${name}`}
                        shouldTruncate
                    />
                    <DocumentCardActivity activity={`${moment(uploadedAt).format('MMMM Do YYYY, h:mm a')}`} people={DocumentCardActivityPeople} />
                </DocumentCard>
            )
        }
        </>
    )
}