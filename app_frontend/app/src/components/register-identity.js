// ** React Imports
import React, { useState, useEffect, Fragment } from "react"
import { Button, Chip } from '@mui/material';
import { CheckCircle as CheckCircleIcon } from '../icons/check-circle';
import { hasId } from "src/utils/storage"
import { registerIdentity } from "src/services/logic"

export default function RegisterIdentity(props) {
    // ** Props
    // const { breadCrumbTitle, breadCrumbParent, setShow } = props

    const [isRegistered, setIsRegistered] = useState(hasId())

    const handleRegisterButton = async () => {
        const res = await registerIdentity()
        if (res) {
            setIsRegistered(true)
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

