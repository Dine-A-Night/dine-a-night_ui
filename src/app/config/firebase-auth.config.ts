import { firebaseui } from 'firebaseui-angular';
import firebase from 'firebase/compat/app';

export const firebaseUiAuthConfig: firebaseui.auth.Config = {
    signInFlow: 'popup',
    signInOptions: [
        {
            requireDisplayName: false,
            provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
        },
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    ],
    //term of service
    tosUrl: '<your-tos-link>',
    //privacy url
    privacyPolicyUrl: '<your-privacyPolicyUrl-link>',
    //credentialHelper:             firebaseui.auth.CredentialHelper.ACCOUNT_CHOOSER_COM

    credentialHelper: firebaseui.auth.CredentialHelper.NONE,
};
