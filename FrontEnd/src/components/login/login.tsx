import * as React from "react";
import styles from "./login.module.css";
import { Label, MessageBar, MessageBarType, Pivot, PivotItem, PrimaryButton, TextField, Toggle } from "@fluentui/react";
import { useId } from '@fluentui/react-hooks';

interface MessageBarOptions{
    show: boolean, 
    type: MessageBarType, 
    text: string
}

export function Login(){
    const emailId = useId('emailInput');
    const passwordId = useId('passwordInput');
    const nicknameId = useId('nicknameInput');

    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [nickname, setNickname] = React.useState("");
    const [messageBar, setMessageBar] = React.useState<MessageBarOptions>({show: false, type: MessageBarType.error, text: "invalid credentials"});
    const [rememberLogin, setRememberLogin] = React.useState(false);

    const resolveDisabledRegister = () => {
        return (
            email.length <= 0 || 
            password.length <= 0 || 
            nickname.length <= 0
        );
    }

    const login = () => {
        if(email.length <= 0 || password.length <= 0)
            return

        fetch("https://limba.wzks.uj.edu.pl/20_strusinski/aplikacja/api/users/login", {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: "POST",
            body: JSON.stringify({email: email, password: password})
        }).then(async res => {
            if(res.status === 404 || res.status === 401) 
                return setMessageBar({show: true, type: MessageBarType.error, text: "invalid credentials"})
            const data = await res.json();
            if(rememberLogin){
                localStorage.setItem("token", data.token);
                localStorage.setItem("userData", data.userData);
                window.location.reload();
            }
            else{
                sessionStorage.setItem("token", data.token);
                sessionStorage.setItem("userData", data.userData);
                window.location.reload();
            }
        }).catch(err => {
            console.log(err)
        })
    }

    const register = () => {
        fetch("https://limba.wzks.uj.edu.pl/20_strusinski/aplikacja/api/users/register", {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: "POST",
            body: JSON.stringify({email: email, password: password, nickname: nickname})
        }).then(async res => {
            if(res.status === 201){
                setMessageBar({show: true, type: MessageBarType.success, text: "profile created successfuly"});
                setTimeout(() => {
                    window.location.reload()
                }, 1000);
                return;
            }

            const data = await res.json();
            if(res.status === 400){
                switch (data.error) {
                    case "email taken":
                        return setMessageBar({show: true, type: MessageBarType.blocked, text: "this email was already taken by another user"});
                    case "nickname taken":
                        return setMessageBar({show: true, type: MessageBarType.blocked, text: "this nickname was already taken by another user"});
                    case "invalid nickname length":
                        return setMessageBar({show: true, type: MessageBarType.blocked, text: "the nickname cannot be longer than 21 characters"});
                    case "invalid password length":
                        return setMessageBar({show: true, type: MessageBarType.blocked, text: "the password has to have between 8 and 20 characters"});
                    default:
                        break;
                }
            }
        }).catch(err => {
            setMessageBar({show: true, type: MessageBarType.warning, text: "an unexpected error occurred, please try again later."});
        })
    }

    const onRememberLoginChange = (ev: React.MouseEvent<HTMLElement>, checked?: boolean) => {
        setRememberLogin(!!checked)
    }

    return(
        <div className={styles.centralContainer}>
            <div className={styles.loginCard}>
                <h1>Welcome to FileShare</h1>
                <Pivot aria-label="Main Pivot">
                    <PivotItem headerText="Log in" itemKey="login">
                        <Label>E-mail</Label>
                        <TextField id={emailId} type="email" required onChange={(e) => setEmail(e.currentTarget.value)} value={email} />
                        <Label>Password</Label>
                        <TextField 
                            id={passwordId} 
                            type="password" 
                            required 
                            onChange={(e) => setPassword(e.currentTarget.value)} 
                            value={password} 
                            onKeyDown={e => e.code === "Enter" ? login() : null} 
                        />
                        <Toggle label="Remeber login" onText="on" offText="off" onChange={onRememberLoginChange}/>
                        { messageBar.show &&
                            <>
                            <div style={{marginTop: "10px"}}></div>
                            <MessageBar messageBarType={messageBar.type}>
                                {messageBar.text}
                            </MessageBar> 
                            </>
                        }
                        <div className={styles.centerButton}>
                            <PrimaryButton text="Log in" onClick={login} type="submit" disabled={email.length <= 0 || password.length <= 0}/>
                        </div>
                    </PivotItem>
                    <PivotItem headerText="Register" itemKey="register">
                        <Label htmlFor={emailId}>E-mail</Label>
                        <TextField id={emailId} type="email" required onChange={(e) => setEmail(e.currentTarget.value)} value={email} />
                        <Label htmlFor={passwordId}>Password</Label>
                        <TextField id={passwordId} type="password" required onChange={(e) => setPassword(e.currentTarget.value)} value={password} />
                        <Label htmlFor={nicknameId}>Nickname</Label>
                        <TextField id={nicknameId} type="text" required onChange={(e) => setNickname(e.currentTarget.value)} value={nickname} />
                        { messageBar.show &&
                            <>
                            <div style={{marginTop: "10px"}}></div>
                            <MessageBar messageBarType={messageBar.type}>
                                {messageBar.text}
                            </MessageBar> 
                            </>
                        }
                        <div className={styles.centerButton}>
                            <PrimaryButton text="Register" onClick={register} type="submit" disabled={resolveDisabledRegister()}/>
                        </div>
                    </PivotItem>
                </Pivot>
            </div>
        </div>
    )
}