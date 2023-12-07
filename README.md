# PBT (Physical Backed Token) NFC Implementation + Bluetooth Implementation

This Proof of Concept documentation aims to provide 2 different implementations of PBTs.

You can find each documentation in their respective folder:

-   NFC technology: [PBT_POC/NFC](https://github.com/quantumtemple/PBT_POC/tree/develop/NFC)
-   Bluetooth/IoT devices: [PBT_POC/BLE](https://github.com/quantumtemple/PBT_POC/tree/develop/BLE)

[Code Documentation](https://docs.google.com/document/d/17YpDUsP-kI7ryguuF_aJeJ-cCMl3EjjGVyeWr_oob3w/edit?usp=sharing)

Both of them have different use cases with **Pros | Cons**

- **NFC**
  - Pros:
    - Small Chips easy to embed into Artifacts
    - Doesn't rely on and energy source
    - WaterProof
  - Cons:
    - Once the NFC Tag is written it cannot be undone.


- **BLE**
  - Pros:
    - Allow for better customization with Arduino
    - Better for complex PBT projects that need more than just a PBT [IoT]
    - EEPROM can be wiped and re-written to delete public/private key and update new ones
    - Debugging
  - Cons:
    - Relies on source of energy [MicroUSB]
    - Big Device in comparison to NFC so its harder to attach it to an Artifact 

![PBT-DIAGRAM](https://github.com/quantumtemple/PBT_POC/blob/develop/Assets/NFC-BLE.png?raw=true)

## PBT Requirements ##
[Requirements](https://docs.google.com/document/d/1X3Gj_YrRtGISXFhE5NlvLYIUZ_-zEIcj4OFGVsOPlXQ/edit?usp=sharing)

## Resources ##
[EIP-5791](https://eips.ethereum.org/EIPS/eip-5791)

## Desktop Web App + Mobile NFC Scanning + API

- Desktop Web App: https://pbt.quantumtemple.xyz/
- Mobile NFC Scanning: https://pbt.quantumtemple.xyz/scan
- EC2 Instance API: https://api.pbt.quantumtemple.xyz/

## PBT Flow Diagram
![PBT-DIAGRAM](https://github.com/quantumtemple/PBT_POC/blob/develop/Assets/PBT-DIAGRAM.png?raw=true)

### Tech Stack
-   Frontend [React]
-   Backend [NestJS]
-   DB [MongoDB]
-   Smart Contract [Solidity] 

