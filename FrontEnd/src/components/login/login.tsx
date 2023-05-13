import * as React from "react";
import styles from "./login.module.css";
import { Label, Pivot, PivotItem, PrimaryButton, TextField } from "@fluentui/react";
import { useId } from '@fluentui/react-hooks';

export function Login(){
    const emailId = useId('emailInput');
    const passwordId = useId('passwordInput');
    const nicknameId = useId('nicknameInput');

    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [nickname, setNickname] = React.useState("");

    const resolveDisabledRegister = () => {
        return (
            email.length <= 0 || 
            password.length <= 0 || 
            nickname.length <= 0
        );
    }

    const login = () => {
        fetch("http://localhost:3000/users/login", {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: "POST",
            body: JSON.stringify({email: email, password: password})
        }).then(res => {
            console.log(res)
        }).catch(err => {
            console.log(err)
        })
    }

    const register = () => {
        fetch("http://localhost:3000/users/register", {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: "POST",
            body: JSON.stringify({email: email, password: password, nickname: nickname})
        }).then(res => {
            console.log(res)
        }).catch(err => {
            console.log(err)
        })
    }

    return(
        <div className={styles.centralContainer}>
            <div className={styles.loginCard}>
                <h1>Welcome to FileShare</h1>
                <Pivot aria-label="Basic Pivot Example">
                    <PivotItem headerText="Log in">
                        <Label>E-mail</Label>
                        <TextField id={emailId} type="email" required onChange={(e) => setEmail(e.currentTarget.value)} value={email} />
                        <Label>Password</Label>
                        <TextField id={passwordId} type="password" required onChange={(e) => setPassword(e.currentTarget.value)} value={password} />
                        <div className={styles.centerButton}>
                            <PrimaryButton text="Log in" onClick={login} type="submit" disabled={email.length <= 0 || password.length <= 0}/>
                        </div>
                    </PivotItem>
                    <PivotItem headerText="Register">
                        <Label htmlFor={emailId}>E-mail</Label>
                        <TextField id={emailId} type="email" required onChange={(e) => setEmail(e.currentTarget.value)} value={email} />
                        <Label htmlFor={passwordId}>Password</Label>
                        <TextField id={passwordId} type="password" required onChange={(e) => setPassword(e.currentTarget.value)} value={password} />
                        <Label htmlFor={nicknameId}>Nickname</Label>
                        <TextField id={nicknameId} type="text" required onChange={(e) => setNickname(e.currentTarget.value)} value={nickname} />
                        <div className={styles.centerButton}>
                            <PrimaryButton text="Register" onClick={register} type="submit" disabled={resolveDisabledRegister()}/>
                        </div>
                    </PivotItem>
                </Pivot>
            </div>
        </div>
    )
}