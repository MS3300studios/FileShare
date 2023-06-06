import React, { useState } from 'react';
import { TextField, PrimaryButton, MessageBarType, MessageBar, Spinner, SpinnerSize } from '@fluentui/react';
import styles from './chat.module.css';
import { v4 as uuid } from "uuid";
import { useLocation, useNavigate } from 'react-router-dom';
import { getToken } from '../../utils/getToken';
import { getUser } from '../../utils/getUser';
import moment from 'moment';

export interface ISocketMessage{
    userId: string; //socket uuid
    message: {
        conversationId: string, 
        text: string, 
        authorNickname: string,
        createdAt?: string
    }
}

// const ChatComponent = ({socket, onChatUnload}: any) => {
const ChatComponent = ({socket, onChatUnload}: any) => {
    const [loadingMessages, setLoadingMessages] = useState(true);
    const [messages, setMessages] = useState<ISocketMessage["message"][]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [messageBar, setMessageBar] = useState({show: false, type: MessageBarType.error, text: "an error occurred, please reload the page and try again"});
    const [currentConversation, setCurrentConversation] = useState<any>(null);

    const location = useLocation();
    const navigate = useNavigate();
    const contactId = location.pathname.slice(location.pathname.lastIndexOf('/')+1, location.pathname.length)
    const userData = getUser();
    const messagesEndRef = React.useRef(null);
    const afterMsgAnchor = React.useRef(null);
    
    React.useEffect(() => {
        socket.on("receiveMessage", (message: ISocketMessage) => {
            setMessages(prevMessages => [...prevMessages, message.message]);
            setTimeout(() => {
                (messagesEndRef.current as any).scrollIntoView({ behavior: "smooth" })
            }, 200);
        })

        fetch(`http://localhost:3000/conversation/${contactId}`, 
            { headers: { Authorization: getToken() } 
        }).then(resp => {
            return resp.json();
        }).then(data => {
            setMessages(data.messages);
            setLoadingMessages(false);
            setCurrentConversation(data);

            if(data.messages.length === 0){
                socket.emit('join', { conversationId: (data as any)._id });
            }
        }).catch(err => {
            console.log(err)
            setLoadingMessages(false)
            setMessageBar({show: true, type: MessageBarType.error, text: "an error occurred, please reload the page and try again"})
        });

        return () => {
            socket.off("receiveMessage");
            // onChatUnload()
        };
    }, [])

    React.useEffect(() => {
        if(!loadingMessages){
            (afterMsgAnchor.current as any).scrollIntoView({ behavior: "smooth" });
        }
    }, [loadingMessages])

    const handleSendMessage = () => {
        if (newMessage.trim() === '') return;

        const message = {
            conversationId: currentConversation._id,
            text: newMessage,
            authorNickname: userData.nickname
        };

        socket.emit("message", message)
        setNewMessage('');
    };

    const selfUser = getUser();
    let otherUser: any;
    if(!loadingMessages){
        otherUser = currentConversation.participants.filter((el: any) => el.nickname !== selfUser.nickname)[0]
    }

    const handleKeyboardEvent = (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if(e.code === "Enter")
            handleSendMessage();
    }

    return (
        <div className={styles.container}>
            {
                loadingMessages ? <Spinner size={SpinnerSize.large} /> : (
                    <>
                    { messageBar.show &&
                        <>
                            <div style={{marginTop: "10px"}}></div>
                            <MessageBar messageBarType={messageBar.type}>
                                {messageBar.text}
                            </MessageBar> 
                        </>
                    }
                    <div className={styles.messagesContainer}>
                        <div className={styles.chatHeaderContainer}>
                            <img src={otherUser.photo} alt={`${otherUser.nickname}'s photo`} />
                            <h1>{otherUser.nickname}</h1>
                        </div>
                        {
                            messages.map((msg, id) => {
                                const isSelf = msg.authorNickname === userData.nickname;
                                const messageDate = moment(msg.createdAt).format("MMMM Do YYYY, h:mm a")
                                return (
                                    <div key={id} className={styles.messageWrapper} style={isSelf ? { justifyContent: "flex-end" } : { justifyContent: "flex-start"} } >
                                        <div className={styles.message} style={isSelf ? { backgroundColor: "hsl(214.9, 96.1%, 80%)" } : { backgroundColor: "hsl(215, 60%, 60%)" }}>
                                            <div className={styles.messageInfoContainer}>
                                                <h3 style={{maxWidth: "180px"}}>{msg.authorNickname}</h3>
                                                <p style={{marginLeft: "3px"}}>{messageDate}</p>
                                            </div>
                                            <p>{msg.text}</p>
                                        </div>
                                        { messages.length-1 === id ? <div ref={messagesEndRef}></div> : null }
                                    </div>
                                )
                            })
                        }
                        <div ref={afterMsgAnchor}></div>
                    </div>
                    <div className={styles.inputContainer}>
                        <TextField
                            value={newMessage}
                            onChange={(_, newValue) => setNewMessage(newValue || '')}
                            placeholder="Type a message..."
                            onKeyDown={handleKeyboardEvent}
                            className={styles.inputField}
                        />
                        <PrimaryButton text="Send" onClick={handleSendMessage} />
                        <div style={{marginLeft: "5px"}}></div>
                        <PrimaryButton text="Scroll to bottom" onClick={() => {
                            (messagesEndRef.current as any).scrollIntoView({ behavior: "smooth" })
                        }} />
                    </div>
                    {messages.length === 0 && <div className={styles.noMessages}>No messages have been sent yet</div>}
                    </>
                )
            }
        </div>
    );
};

export default ChatComponent;