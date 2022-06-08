import React, {useEffect, useState} from 'react';
import { ethers } from 'ethers';
import Contract_abi from './Contract_abi.json';

function ContractPage() {
    const contractAddress = '0xCb867CA1Cd09779D74e8c1F707c02d5285E0De44';    
    const [errorMessage, setErrorMessage] = useState(null);
    const [defaultAccount, setDefaultAccount] = useState(null);
    const [connButtonText, setConnButtonText] = useState('Connect Wallet');

    const [currentContractVal, setCurrentContractVal] = useState(null);

    const [provider, setProvider] = useState(null);
    const [signer, setSigner] = useState(null);
    const [contract, setContract] = useState(null);

    // 필요한 버튼 누르면 해당 계정에 들어가도록 함
    const connectWalletHandler = () => {
        // 창에 메타마스크가 있는지 확인
        if (window.ethereum) {
            // 메타마스크에 해당 계정 요청
            window.ethereum.request({method: 'eth_requestAccounts'})
            .then(result => {
                setConnButtonText('Wallet Connected!');
                accountChangedHandler(result[0]);
            })
        } else {
            // 메타마스크가 없으면 다음 에러 띄어줌
            setErrorMessage('메타마스크 설치 필요');
        }
    }

    const accountChangedHandler = (newAccount) => {
        setDefaultAccount(newAccount);
        updateEthers();
    }

    const updateEthers = () => {
        console.log('=== updateEthers ===');
        let tempProvider = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(tempProvider);

        let tempSigner = tempProvider.getSigner();
        setSigner(tempSigner);

        let tempContract = new ethers.Contract(contractAddress, Contract_abi, tempSigner);
        setContract(tempContract);

        console.log('tempProvider: ', provider);
        console.log('tempSigner: ', signer);
        console.log('tempContract: ', contract);

             
    }

    const getCurrentVal = async () => {
        updateEthers();


        let val = await contract.balanceOf(contractAddress);
        console.log('val: ', val);
        // // let val = await contract.get();
        // setCurrentContractVal(val);
    }

    const handleTransfer = (event) => {
        event.preventDefault(); // 전체 페이지 재로딩 막음
        console.log('보내는 주소: ', event.target.sendAddress.value);
        console.log('보내는 양: ', event.target.sendAmount.value);

        contract.transfer(event.target.sendAddress.value, event.target.sendAmount.value);
        // contract.set(event.target.setText.value);
    }

    return (<div>
        <h3> {"Get/Set Interaction with contract!"} </h3>
        <button onClick={connectWalletHandler}>{connButtonText}</button>
        <h3> Address: {defaultAccount} </h3>
        
        <form onSubmit={handleTransfer}>
            <div>
                To: <input id='sendAddress' type='text'></input>
            </div>
            <div>
                Amount: <input id='sendAmount' type='text'></input>
            </div>                
            <button type='submit'>Transfer</button>
        </form>

        {/* 가져오기 전에 무조건 setHandler 눌러서 설정해야함 */}
        <button onClick={getCurrentVal}>Get Current Value</button>
        {currentContractVal}
        {errorMessage}
    </div>)
}

export default ContractPage