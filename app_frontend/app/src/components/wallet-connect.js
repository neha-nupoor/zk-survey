/* eslint-disable radix */
import React, { useState, useEffect, Fragment } from "react"
// material
import { Button, Chip } from '@mui/material';
import { CheckCircle as CheckCircleIcon } from '../icons/check-circle';
import { storeWallet } from "../utils/storage"
import { connectSemaphoreContract } from "../services/logic"


export default function WalletConnect() {
    const [currentAccount, setCurrentAccount] = useState(null)

    const checkWalletIsConnected = async () => {
        let ethereum
        if (window != "undefined") {
            ethereum = window.ethereum
        }

        if (!ethereum) {
            alert("Make sure you have Metamask installed!")
            return;
        }

        const accounts = await ethereum.request({ method: "eth_accounts" })
        // const chainId = await ethereum.request({ method: 'eth_chainId' })

        // if (chainId !== 1337) {
        //   await ethereum.request({
        //     method: 'wallet_switchEthereumChain',
        //     params: [{ chainId: '0x1' }]
        //   })
        // }

        if (accounts.length !== 0) {
            const account = accounts[0]
            setCurrentAccount(account)
            storeWallet(account)
            connectSemaphoreContract()
        }
    }

    const connectWalletHandler = async () => {
        if (!ethereum) {
            alert("Please install Metamask!")
        }

        try {
            const accounts = await ethereum.request({
                method: "eth_requestAccounts"
            })
            setCurrentAccount(accounts[0])
            connectSemaphoreContract()
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        checkWalletIsConnected()
    }, [currentAccount])

    return (
        <Fragment>
            {currentAccount ? (
                <Chip label="Wallet Connected" icon={<CheckCircleIcon color="primary"/>}  color="success" variant="outlined" />
            ) : (
                <Button
                    variant="contained"
                    onClick={connectWalletHandler}
                >
                    Connect Wallet
                </Button>
            )}
        </Fragment>
    )
}