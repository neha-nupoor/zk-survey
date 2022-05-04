// ** React Imports
import React, { useState, Fragment } from "react";
import { useRouter } from 'next/router';
import { Button, Chip } from '@mui/material';
import { CheckCircle as CheckCircleIcon } from '../icons/check-circle';
import { hasId } from "src/utils/storage"
import { registerIdentity } from "src/services/logic"
import { handleError, handleLoading, handleSuccess } from "src/components/alert/alert"

export default function RegisterIdentity(props) {
    // ** Props
    const router = useRouter();
    const [isRegistered, setIsRegistered] = useState(hasId())

    const handleRegisterButton = async () => {
        handleLoading("Registering anonymous identity", "Please wait")
        const res = await registerIdentity()
        if (res) {
            setIsRegistered(true)
            router.reload()
            handleSuccess("Successful", "Please reload page")
        } else {
            console.log(res)
            handleError("Something went wrong. Check console.")
        }
    }

    return (
        <Fragment>
            {isRegistered ? (
                <Chip label="Anonymously LoggedIn" icon={<CheckCircleIcon color="primary"/>}  color="success" variant="outlined" />
            ) : (
                <Button
                    variant="contained"
                    onClick={handleRegisterButton}
                >
                    Add Anonymous Identity
                </Button>
            )}
        </Fragment>
    )
}

