// // ** Reactstrap Imports
import { CircularProgress } from "@mui/material"

// ** Third Party Components
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"

const MySwal = Swal //withReactContent(Swal)

const handleSuccess = (inputTitle, inputText) => {
    return MySwal.fire({
        title: inputTitle,
        text: inputText,
        icon: "success",
        confirmButtonText: "Close",
        // customClass: {
        //     confirmButton: "btn btn-primary"
        // },
        // buttonsStyling: false
    })
}

const handleInfo = (inputTitle, inputText) => {
    return MySwal.fire({
        title: inputTitle,
        text: inputText,
        icon: "info",
        confirmButtonText:"Close",
        // customClass: {
        //     confirmButton: "btn btn-primary"
        // },
        // buttonsStyling: false
    })
}

const handleWarning = (inputTitle, inputText) => {
    return MySwal.fire({
        title: inputTitle,
        text: inputText,
        icon: "warning",
        confirmButtonText: "Close",
        // customClass: {
        //     confirmButton: "btn btn-primary"
        // },
        // buttonsStyling: false
    })
}

const handleError = (inputTitle, inputText) => {
    return MySwal.fire({
        title: inputTitle,
        text: inputText,
        icon: "error",
        confirmButtonText: "Close",
        // customClass: {
        //     confirmButton: "btn btn-primary"
        // },
        // buttonsStyling: false
    })
}

const handleLoading = (inputTitle, inputText) => {
    return MySwal.fire({
        titleText: inputTitle,
        title: '<p>Loading...</p>',
        text: inputText,
        // iconHtml: <CircularProgress />,
        confirmButtonText: "Close",
        // customClass: {
        //     confirmButton: "btn btn-primary"
        // },
        // buttonsStyling: false
    })
}

export { handleSuccess, handleInfo, handleWarning, handleError, handleLoading }
