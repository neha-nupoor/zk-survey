import { useState } from "react"
import { useFormik, Form, Field,  FormikProvider } from "formik"
import { Row, Col, Input, Label,  FormFeedback, FormGroup, Button } from "reactstrap"
import Flatpickr from "react-flatpickr"
import * as Yup from "yup"

import { handleSuccess, handleError, handleLoading } from "../utility/alert"

import { addPoll } from "../services/logic"

// ----------------------------------------------------------------------

// ** Styles
import "@styles/react/libs/flatpickr/flatpickr.scss"

const optionsArr = [
    {
        option: "1"
    },
    {
        option: "2"
    },
    {
        option: "3"
    },
    {
        option: "4"
    },
    {
        option: "5"
    },
    {
        option: "6"
    },
    {
        option: "7"
    },
    {
        option: "8"
    },
    {
        option: "9"
    },
    {
        option: "10"
    }
]

export default function CreatePoll(props) {
    // ** Props

    const date = new Date()
    date.setDate(date.getDate() + 10)

    const { setShow } = props
    const [expiry, setExpiry] = useState(date)
    
    const formik = useFormik({
        initialValues: {
            title: "",
            description: "On a scale of 1(not likely at all) to 10(most likely), how likely are you to invite users to join our DAO.",
            expiry: date,
            npsscore: "",
            options: optionsArr
        },
        //validationSchema: RegisterSchema,
        onSubmit: async (data) => {
            handleLoading('Creating a new survey in 3..2..1..')
            const isSuccess = await addPoll(data)
            setShow(false)
            if (isSuccess) {
                handleSuccess(
                    "Transaction Successful",
                    "Click the below button to return home"
                )
                getNewPollList()
            } else {
                handleError(
                    "Transaction Failed!",
                    "Click the below button to return home"
                )
            }
        }
    })

    const {
        errors,
        //touched,
        handleSubmit,
        //isSubmitting,
        getFieldProps,
        setFieldValue
    } = formik

    return (
        <FormikProvider value={formik}>
            <Form autoComplete='on' noValidate onSubmit={handleSubmit}>
                <Row className='gy-1 pt-75'>
                    <Col md={8} xs={12}>
                        <Label className='form-label' for='title'>
                            Product Title
                        </Label>
                        <Input
                            {...getFieldProps("title")}
                            id='title'
                            placeholder='Would you invite your friends to join our DAO - DAO Name?'
                            // value={'Would you invite your friends to join our DAO?'}
                            invalid={errors.title && true}
                        />
                        {errors.title && (
                            <FormFeedback>
                                Please enter a valid title
                            </FormFeedback>
                        )}
                    </Col>
                    <Col md={4} xs={12}>
                        <Label className='form-label' for='expiry'>
                            Survey Expiry
                        </Label>
                        <Flatpickr
                            className='form-control'
                            value={expiry}
                            onChange={(newValue) => {
                                setExpiry(newValue[0])
                                setFieldValue(
                                    "expiry",
                                    newValue[0].toUTCString()
                                )
                            }}
                            id='default-picker'
                        />
                    </Col>
                    <Col md={12} xs={12}>
                        <Label className='form-label' for='description'>
                            Description
                        </Label>
                        <Input
                            {...getFieldProps("description")}
                            type='textarea'
                            id='description'
                            placeholder='Enter the description of the survey'
                            invalid={errors.description && true}
                            value={'On a scale of 1(not likely at all) to 10(most likely), how likely are you to invite users to join our DAO.'}
                        />
                        {errors.description && (
                            <FormFeedback>
                                Please enter a valid description
                            </FormFeedback>
                        )}
                    </Col>
                    <Col md={12} xs={12} className="radio-flex">
                        {
                            optionsArr.forEach((el, i) => {
                                return (<Col>
                                    <FormGroup check>
                                        <Field
                                            {...getFieldProps(el)}
                                            name="npsscore"
                                            type="radio" 
                                            value={i + 1} 
                                            id={`option${i + 1}`}
                                        />
                                        {' '}
                                        <Label check>
                                            {i + 1}
                                        </Label>
                                    </FormGroup>
                                </Col>)
                            })
                        }
                        <Col>
                            <FormGroup check>
                                <Field
                                    {...getFieldProps("options[0].option")}
                                    name="npsscore"
                                    type="radio" 
                                    value="1" 
                                    id='option1'
                                />
                                {' '}
                                <Label check>
                                    1
                                </Label>
                            </FormGroup>
                        </Col>
                        <Col>
                            <FormGroup check>
                                <Field
                                    {...getFieldProps("options[1].option")}
                                    name="npsscore"
                                    type="radio" 
                                    value="2" 
                                    id='option2'
                                />
                                {' '}
                                <Label check>
                                    2
                                </Label>
                            </FormGroup>
                        </Col>
                        <Col>
                            <FormGroup check>
                                <Field
                                     {...getFieldProps("options[2].option")}
                                    name="npsscore"
                                    type="radio" 
                                    value="3" 
                                    id='option3'
                                />
                                {' '}
                                <Label check>
                                    3
                                </Label>
                            </FormGroup>
                        </Col>
                        <Col>
                            <FormGroup check>
                                <Field
                                     {...getFieldProps("options[3].option")}
                                    name="npsscore"
                                    type="radio" 
                                    value="4" 
                                    id='option4'
                                />
                                {' '}
                                <Label check>
                                    4
                                </Label>
                            </FormGroup>
                        </Col>
                        <Col>
                            <FormGroup check>
                                <Field
                                     {...getFieldProps("options[4].option")}
                                    name="npsscore"
                                    type="radio" 
                                    value="5" 
                                    id='option5'
                                />
                                {' '}
                                <Label check>
                                    5
                                </Label>
                            </FormGroup>
                        </Col>
                        <Col>
                            <FormGroup check>
                                <Field
                                     {...getFieldProps("options[5].option")}
                                    name="npsscore"
                                    type="radio" 
                                    value="6" 
                                    id='option6'
                                />
                                {' '}
                                <Label check>
                                    6
                                </Label>
                            </FormGroup>
                        </Col>
                        <Col>
                            <FormGroup check>
                                <Field
                                     {...getFieldProps("options[6].option")}
                                    name="npsscore"
                                    type="radio" 
                                    value="7" 
                                    id='option7'
                                />
                                {' '}
                                <Label check>
                                    7
                                </Label>
                            </FormGroup>
                        </Col>
                        <Col>
                            <FormGroup check>
                                <Field
                                     {...getFieldProps("options[7].option")}
                                    name="npsscore"
                                    type="radio" 
                                    value="8" 
                                    id='option8'
                                />
                                {' '}
                                <Label check>
                                    8
                                </Label>
                            </FormGroup>
                        </Col>
                        <Col>
                            <FormGroup check>
                                <Field
                                     {...getFieldProps("options[8].option")}
                                    name="npsscore"
                                    type="radio" 
                                    value="9" 
                                    id='option9'
                                />
                                {' '}
                                <Label check>
                                    9
                                </Label>
                            </FormGroup>
                        </Col>
                        <Col>
                            <FormGroup check>
                                <Field
                                    {...getFieldProps("options[9].option")}
                                    name="npsscore"
                                    type="radio" 
                                    value="10" 
                                    id='option10'
                                />
                                {' 10 '}
                                <Label check>
                                    10
                                </Label>
                            </FormGroup>
                        </Col>
                    </Col>
                        
                    <Col xs={12} className='text-center mt-2 pt-50'>
                        <Button type='submit' className='me-1' color='primary'>
                            Submit
                        </Button>
                        <Button
                            type='reset'
                            color='secondary'
                            outline
                            onClick={() => setShow(false)}
                        >
                            Discard
                        </Button>
                    </Col>
                </Row>
            </Form>
        </FormikProvider>
    )
}
