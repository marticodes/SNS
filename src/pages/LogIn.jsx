import { useState } from "react";

function LogIn() {
    const initialValues = {
        username: "",
        password: "",
    };
    const [formValues, setFormValues] = useState(initialValues);
    const [formErrors, setFormErrors] = useState({});
    const [isSubmit, setIsSubmit] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues({ ...formValues, [name]: value });
    };

    const validate = (values) => {
        const errors = {};
        if (!values.username) {
            errors.username = "Username is required";
        }
        if (!values.password) {
            errors.password = "Password is required";
        }
        return errors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const errors = validate(formValues);
        setFormErrors(errors);
        if (Object.keys(errors).length === 0) {
            setIsSubmit(true);
        } else {
            setIsSubmit(false);
        }
    };

    return (
        <>
            <style>{`
                * {
                    box-sizing: border-box;
                }
                body {
                    background-color:rgb(222, 235, 245);
                    height: 100%;
                    margin: 0; /* Remove default margins */
                    display: flex; /* Use flexbox on the body */
                    justify-content: center; /* Horizontally center the container */
                    align-items: center; /* Vertically center the container */
                    height: 100vh; /* Full viewport height */
                }
                .container {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    height: 100vh; /* Full viewport height */
                    max-width: 500px;
                    width: 100%;
                    margin: auto;
                    position: relative; /* Optional for better layout handling */
                }
                .container > form {
                    width: 100%;
                    border: 1px solid #dfdfdf;
                    padding: 20px;
                    border-radius: 5px;
                    background: #fff;
                h1 {
                    text-align: center;
                    margin-bottom: 20px;
                    font-size: 20px;
                    color: #333;
                }
                label {
                    font-size: 14px;
                    font-weight: bold;
                    color: #000; 
                }
                input {
                    padding-top: 10px;
                    padding-bottom: 10px;
                    width: 100%;
                    margin-top: 10px;
                    margin-bottom: 10px;
                    border-radius: 9%;
                    background: #f9f9f9;
                    color: #000;
                    align-items: center;
                }
                pre {
                    width: 70%;
                    color: #fff;
                    font-size: larger;
                }
                button {
                    background: #7CB9E8 !important;
                    padding: 5px;
                    border-radius: 10px;
                    margin-top: 10px;
                    width: 100%;
                }
                p {
                    color: rgb(255, 0, 0);
                }
                .text {
                    margin: 2px;
                    padding: 5px;
                    color: "black";
                }
                span {
                    color: rgb(0, 95, 236);
                    cursor: pointer;
                }
            `}</style>
            <div className="container">
                <form onSubmit={handleSubmit}>
                    <h1>Log In</h1>
                    <div className="ui divider"></div>
                    <div className="ui form">
                        <div className="field">
                            <label>Username</label>
                            <input
                                type="text"
                                name="username"
                                placeholder="Username"
                                value={formValues.username}
                                onChange={handleChange}
                            />
                            {formErrors.username && (
                                <p className="error">{formErrors.username}</p>
                            )}
                        </div>
                        <div className="field">
                            <label>Password</label>
                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                value={formValues.password}
                                onChange={handleChange}
                                autoComplete="current-password"
                            />
                            {formErrors.password && (
                                <p className="error">{formErrors.password}</p>
                            )}
                        </div>
                        <button type="submit" className="fluid ui button blue">
                            Log In
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}

export default LogIn;
