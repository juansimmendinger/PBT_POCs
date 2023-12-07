import React, { useState, useEffect } from "react";
import "./App.css";
import {
  useContract,
  useContractWrite,
} from "@thirdweb-dev/react";
import { ConnectWallet } from "@thirdweb-dev/react";
import { useAddress } from "@thirdweb-dev/react";
import QRCode from "qrcode.react";
import postAddress from "../src/api/postAddress";
import getCurrentBlockHash from "./utils/getBlockhash";
import getMintAndTransferInfo from "./api/getMintAndTransferInfo";
import getStatus from "../src/api/getStatus";
import { useQuery } from "react-query";
import getBlock from "./utils/getBlock";
import bellImg from "../../../Assets/bell.jpg";


function App() {
  const userAddress = useAddress();

  // TODO: Pasar a constants
  const qrScanURL = "https://pbt.quantumtemple.xyz/scan";

  const contractAddress = "0x4DdE3b684615AA7c317465f4abf7F78396Bf3Bac";
  const { contract } = useContract(contractAddress);
  const [blockhash, setBlockhash] = useState("");
  const [statusMobile, setStatusMobile] = useState(false);
  const [blocknumber, setBlockNumber] = useState(0);
  const [signatureFromChip, setSignatureFromChip] = useState("");
  const [scanQR, setScanQR] = useState(false);
  const [mintTransfer, setMintTransfer] = useState(false);

  const handleMintTransfer = () => {
    setMintTransfer(!mintTransfer);
  };

  const handleScanQr = () => {
    setScanQR(!scanQR);
  };

  const getBlockHash = async () => {
    setBlockhash(await getCurrentBlockHash());
  };

  useEffect(() => {
    const fetchData = async () => {
      await getBlockHash();
      console.log("deploy");
      if (blockhash.length > 5 && userAddress) {
        setBlockNumber(getBlock(blockhash, userAddress));
      }
    };

    fetchData();
  }, [blockhash, userAddress]);

  const { data: status, refetch } = useQuery(
    "userAddress",
    async () => {
      if (userAddress) {
        return () => {
          getStatus({ userAddress: userAddress }).then((response) => {
            setStatusMobile(response.data.message);
            console.log(response.data.message);
            console.log(statusMobile);
          });
        };
      }
      return [];
    },
    {
      refetchInterval: 10000,
    }
  );

  // getMintAndTransferInfo in order to call Contracts functions: Mint(signature, blocknumber) | Transfer(signature, blocknumber)
  useEffect(() => {
    console.log("DEPLOY");
    const fetchData = async () => {
      if (statusMobile === false) {
        refetch();
      } else if (userAddress && statusMobile === true) {
        const data = {
          address: userAddress,
        };
        return () => {
          getMintAndTransferInfo(data).then((response) => {
            console.log(response);
            setBlockNumber(response.data.message.blockNumber);
            setSignatureFromChip(response.data.message.signatureFromChip);
          });
        };
      }
    };

    fetchData();
  }, [statusMobile, refetch, status, userAddress]);

  const qrData = {
    userAddress: userAddress,
    blockhash: blockhash,
  };

  const queryParams = new URLSearchParams(qrData).toString();
  const urlWithParams = `${qrScanURL}?${queryParams}`;

  useEffect(() => {
    if (userAddress) {
      postAddress({
        userAddress: userAddress,
      });
    }
  }, [userAddress]);

  // ###### Contract Write Functions ###### //
  const { mutateAsync: MintBellAlango } = useContractWrite(
    contract,
    "mintBellToAlango"
  );
  const { mutateAsync: transferTokenWithChip } = useContractWrite(
    contract,
    "transferTokenWithChip"
  );

  // ###### Contract Read Functions ###### //
  // const { data: name } = useContractRead(contract, "name");
  // const { data: symbol } = useContractRead(contract, "symbol");
  // const { data: canMint } = useContractRead(contract, "canMint");
  // const { data: totalSupply } = useContractRead(contract, "TOTAL_SUPPLY");
  // const { data: circulationSupply } = useContractRead(contract, "supply");
  // const { data: tokenIdFor, isLoading, error } = useContractRead(contract, "tokenIdFor");
  // const { data: tokenIdMappedFor, isLoading, error } = useContractRead(contract, "tokenIdMappedFor");

  return (
    <div className="App">
      <header className="App-header">
        <div className="top-div">
          {userAddress && !statusMobile && (
            <div className="addresCont">
              <button className="buttonScan" onClick={handleScanQr}>
                SCAN QR
                <QRCode className="qr-button" />
              </button>
            </div>
          )}
          <ConnectWallet theme="dark" btnTitle="Connect Wallet" />
        </div>
        {userAddress && scanQR && (
          <>
            <div className="modal-cont" onClick={handleScanQr}></div>
            <div className="modal-qr">
              <h1>Scan your QR code</h1>
              <QRCode value={urlWithParams} className="qr-img" />
            </div>
          </>
        )}

        {statusMobile && userAddress && mintTransfer && (
          <>
            <div className="modal-cont" onClick={handleMintTransfer}></div>
            <div className="modal-qr">
              <h1>Mint NFT</h1>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  try {
                    MintBellAlango({ args: [signatureFromChip, blocknumber] });
                  } catch (error) {
                    console.log(error);
                  }
                }}
                className="buttonMintT"
              >
                Mint PBT
              </button>
              <h1>Transfer NFT</h1>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  try {
                    transferTokenWithChip(signatureFromChip, blocknumber).then(
                      (data) => {
                        console.log(`Transfer was succesfull: ${data}`);
                        return data;
                      }
                    );
                  } catch (error) {
                    console.log(`Error Transfering PBT: ${error}`);
                  }
                }}
                className="buttonMintT"
              >
                Transfer PBT
              </button>
            </div>
          </>
        )}

        <div className="cont">
          <img className="imgBell" src={bellImg} alt="belImg" />
          {statusMobile && userAddress && !mintTransfer && (
            <button className="buttonNFT" onClick={handleMintTransfer}>
              MINT NFT
            </button>
          )}
        </div>
      </header>
    </div>
  );
}

export default App;
