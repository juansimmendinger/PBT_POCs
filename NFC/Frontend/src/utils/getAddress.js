import secp from 'ethereum-cryptography/secp256k1'
import { keccak256 } from "ethereum-cryptography/keccak"

function getAddress(publicKey) {
    let publicKeyRaw = publicKey

    const publicKeyBytes = Uint8Array.from(Buffer.from(publicKeyRaw, "hex"));
    // slice of the first byte of the Uint8Array publicKey
    const sliceKey = publicKeyBytes.slice(1);

    // hash the rest of the public key => returns a Uint8Array keccak256 hash
    const hashKey = keccak256(sliceKey);

    // return last 20 bytes of the Uint8Array keccak256 hash
    const address = hashKey.slice(-20)

    // convert each byte to its two-digit hexadecimal representation and concatenate them with join
    const addressBytes = new Uint8Array(address);
    const addressString = "0x" + Array.prototype.map.call(addressBytes, byte => byte.toString(16).padStart(2, "0")).join("");

    console.log(addressString)
    return addressString

}

export default getAddress;