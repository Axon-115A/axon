import React from "react";
import { GithubButton } from "./GithubButton";
import { GoogleButton } from "./GoogleButton";

interface Props {
	onOauthConfirm: (provider: string) => void;
}

const OauthButtons: React.FC<Props> = ({onOauthConfirm}) => {
    return (
        <>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: "center", flexDirection: 'column', marginBottom: '1.5rem', gap: '0.5rem'}}>
                <GithubButton onClick={() => {onOauthConfirm('github')}} style={{ width: '100%', height: '40px' }}>Sign In With Github</GithubButton>
                <GoogleButton onClick={() => {onOauthConfirm('google')}} style={{ width: '100%', height: '40px' }}>Sign In With Google</GoogleButton>
            </div>
        </>
    )
}			

export default OauthButtons;
