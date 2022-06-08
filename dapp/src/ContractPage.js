import React, {useEffect, useState} from 'react';
import {ethers} from 'ethers';
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

    useEffect(() => {
        console.log('=== useEffect ===');
        // 메타마스크 다른 account 연결시, account 재연결
        window
            .ethereum
            .on('accountsChanged', function (accounts) {
                console.log('accounts[0]: ', accounts[0]);
                accountChangedHandler(accounts[0]);
                // Time to reload your interface with accounts[0]!
            });
    })

    // 필요한 버튼 누르면 해당 계정에 들어가도록 함
    const connectWalletHandler = () => {
        console.log('=== connectWalletHandler ===');

        // 창에 메타마스크가 있는지 확인
        if (window.ethereum) {
            // 메타마스크에 해당 계정 요청
            window
                .ethereum
                .request({method: 'eth_requestAccounts'})
                .then(result => {
                    setConnButtonText('Wallet Connected!');
                    console.log('result[0]: ', result[0]);
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

        // MetaMask injects a Web3 Provider as "web3.currentProvider", so we can wrap it
        // up in the ethers.js Web3Provider, which wraps a Web3 Provider and exposes the
        // ethers.js Provider API.
        let tempProvider = new ethers
            .providers
            .Web3Provider(window.ethereum);
        setProvider(tempProvider);

        // There is only ever up to one account in MetaMask exposed
        let tempSigner = tempProvider.getSigner();
        setSigner(tempSigner);

        let tempContract = new ethers.Contract(
            contractAddress,
            Contract_abi,
            tempSigner
        );
        setContract(tempContract);

        console.log('tempProvider: ', provider);
        console.log('tempSigner: ', signer);
        console.log('tempContract: ', contract);
    }

    const getCurrentVal = async () => {
        updateEthers();

        // const balance = await provider.getBalance(contractAddress); 
        // balance); console.log('balance2: ', balance2);
        console.log('contract: ', contract);
        console.log('defaultAccount: ', defaultAccount);
        let tempVal = await contract.balanceOf(defaultAccount);
        let balance =ethers.utils.formatEther(tempVal); 

        // // console.log('val: ', val._hex);
        setCurrentContractVal(balance);
        // let val = await contract.get();
        // setCurrentContractVal(val);
    }

    const handleTransfer = (event) => {
        event.preventDefault(); // 전체 페이지 재로딩 막음
        console.log('보내는 주소: ', event.target.sendAddress.value);
        console.log('보내는 양: ', event.target.sendAmount.value);

        contract.transfer(
            event.target.sendAddress.value,
            event.target.sendAmount.value
        );
        // contract.set(event.target.setText.value);
    }

    return (
        <div className='mt-10'>
            <h3 className='text-3xl font-bold'>
                {"Interaction with contract!"}
            </h3>
            <div className='mt-3'>
                <button
                    className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
                    onClick={connectWalletHandler}>{connButtonText}</button>
                <button
                    className='ml-3 bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded'
                    onClick={getCurrentVal}>Get Current Value</button>
                <h3 className='mt-3'>
                    Address: {defaultAccount}
                </h3>
                <div className='mt-3'>
                    balanceOf: {currentContractVal}
                </div>
            </div>

            <div className='mt-5'>
                <div className='text-2xl font-bold'>Trnasfer Test</div>
                <form className='' onSubmit={handleTransfer}>
                    <div className='mt-3'>
                        <div class="md:flex md:items-center mb-6">
                            <div class="md:w-1/3">
                                <label
                                    class="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
                                    for="sendAddress">
                                    Send To
                                </label>
                            </div>
                            <div>
                                <input
                                    class="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-96 py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                                    id="sendAddress"
                                    type="text"
                                    placeholder="0x0"/>
                            </div>
                        </div>
                        <div class="md:flex md:items-center mb-6">
                            <div class="md:w-1/3">
                                <label
                                    class="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
                                    for="sendAmount">
                                    Amount
                                </label>
                            </div>
                            <div>
                                <input
                                    class="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-96 py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                                    id="sendAmount"
                                    type="text"
                                    placeholder="100.."/>
                            </div>
                        </div>
                    </div>

                    {/* <div>
                        To:
                        <input id='sendAddress' type='text'></input>
                    </div>
                    <div>
                        Amount:
                        <input id='sendAmount' type='text'></input>
                    </div> */
                    }
                    <button
                        className='shadow bg-cyan-500 hover:bg-purple-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded'
                        type='submit'>Transfer</button>
                </form>
            </div>

            {currentContractVal}
            {errorMessage}
        </div>
    )
}

export default ContractPage