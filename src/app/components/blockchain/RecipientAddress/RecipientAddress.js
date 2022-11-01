import { CLAccountHash, CLKey, CLPublicKey } from 'casper-js-sdk';
export function createRecipientAddress(recipient) {
    if (recipient instanceof CLPublicKey) {
        console.log("hello");
        return new CLKey(new CLAccountHash(recipient.toAccountHash()));
    } else {
        return new CLKey(recipient);
    }
};
