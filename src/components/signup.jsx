import React, { useState } from 'react';
import '../styles/globals.css'
import '../styles/signup.css'

const Signup = () => {

    const [firstName, setFirstName] = useState("");

    const [lastName, setLastName] = useState("");

    const [email, setEmail] = useState("");

    const [date, setDate] = useState("");

    function processSignUp (event) {

        event.preventDefault();

        console.log("submitted");


    }

    const userFields = [

        {
            label:"First Name",
            id : "firstName",
            type : "text",
            placeholder:'Your First Name',
            value : firstName,
            onChange: setFirstName
        },

        {
            label: "Last Name",
            id : "lastName",
            type : "text",
            placeholder:'Your Last Name',
            value : lastName,
            onChange: setLastName
        },

        {
            label: "Email",
            id : "email",
            type : "text",
            placeholder:'Your Email',
            value : email,
            onChange: setEmail

        },

        {
            label: "Birth Date",
            id: "dateOfBirth",
            type: "date",
            value: date,
            onChange: setDate
        }
    ]

    return (

        <div className='form-container'>

            <h3 className='appLogo'>
                PAYNOV8
            </h3>
            
            <h2 className='newAccountText'>
                Create A New Account 
            </h2>

            <p className='alreadyRegistered'> Already Registered? Log in</p>

            <form className="signUpForm" onSubmit = {processSignUp}>

                {userFields.map(eachField => (
                   
                   <>
                    <label> {eachField.label.toUpperCase()}   </label>

                        <input
                                className= {eachField.id}
                                id = {eachField.id}
                                key = {eachField.id}
                                type = {eachField.type}
                                placeholder= {eachField.placeholder}
                                value = {eachField.value}
                                onChange={event => eachField.onChange(event.target.value)}
                        />
                    </>
                        )
                )}
                
            <button className='submitBtn' type = "submit"> Get Started </button>
            </form>
        </div>
        
    )

}

export default Signup