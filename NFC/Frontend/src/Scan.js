import React, { useState, useEffect } from "react";
import "./App.css";
import {
  getPublicKeysFromScan,
  getSignatureFromScan,
} from "pbt-chip-client/kong";
import getAddress from "./utils/getAddress";
import { useLocation } from "react-router-dom";
import postSigAndBlockhash from "../src/api/postSigAndBlockhash";
import postPublicKeyRaw from "../src/api/postPublicKeyRaw";

function Scan() {
  // NFC Scan Read Public Key & Get Signature
  const [keys, setKeys] = useState(null);
  const [sig, setSig] = useState(null);

  // queryParams
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const userAddress = queryParams.get("userAddress");
  const blockhash = queryParams.get("blockhash");

  useEffect(() => {
    if(sig) {
      postSigAndBlockhash({
        signature: sig,
        blockhash: blockhash,
        userAddress: userAddress,
      });
    }
  }, [sig, blockhash, userAddress])
  
  return (
    <div className="App">
      <header className="App-header">
        <div className="subCont">
          <div className="cont">
            <h3>PublicKeysFromScan</h3>
            <button
              onClick={(e) => {
                e.preventDefault();
                getPublicKeysFromScan().then((keys) => {
                  setKeys(keys);
                  const keyRaw = keys;
                  // POST primaryPublicKeyRaw
                  if (keys && userAddress) {
                    const data = {
                      primaryPublicKeyRaw: keyRaw.primaryPublicKeyRaw,
                      userAddress: userAddress,
                    };
                    postPublicKeyRaw(data);
                  }
                });
              }}
              className="buttonNFT"
            >
              Click Me To Initiate NFC Scan
            </button>
            {keys && (
              <div className="cont">
                <p className="keys-title">
                  Primary Hash: <br /> {keys.primaryPublicKeyHash}
                </p>
                <p className="keys-title">
                  Primary Raw: <br /> {keys.primaryPublicKeyRaw}
                </p>
                <p className="keys-title">
                  Address: <br /> {getAddress(keys.primaryPublicKeyRaw)}
                </p>
              </div>
            )}
          </div>
          {keys && (
            <div className="cont">
              <h3>SignatureFromScan</h3>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  try {
                    getSignatureFromScan({
                      chipPublicKey: keys.primaryPublicKeyRaw.toString(),
                      address: userAddress.toString(),
                      hash: blockhash,
                    }).then((sig) => {
                      setSig(sig);
                      alert('Return to the desktop application');
                    });
                  } catch (error) {
                    alert(error);
                    console.log(error);
                  }
                }}
                className="buttonNFT"
              >
                Click Me To Sign EOA+blockhash w/ Chip
              </button>
              {/* {sig && <h5>{sig}</h5>} */}
            </div>
          )}
        </div>
      </header>
    </div>
  );
}

export default Scan;
