import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function LogIn() {
    const initialValues = {
        username: "",
        password: "",
    };
    const [formValues, setFormValues] = useState(initialValues);
    const [formErrors, setFormErrors] = useState({});
    const [isSubmit, setIsSubmit] = useState(false);
    const [loginResult, setLoginResult] = useState(""); // State to store login result
    const [selectedCase, setSelectedCase] = useState(null);

    const navigate = useNavigate();

    // Function to determine selected case based on level one features
    const determineSelectedCase = (features) => {
        const { timeline, connection_type } = features;
        
        if (timeline === 1 && connection_type === 1) return 1;
        if (timeline === 1 && connection_type === 2) return 2;
        if (timeline === 2 && connection_type === 1) return 3;
        if (timeline === 2 && connection_type === 2) return 4;
        
        return null; // Default case if no match
    };

    // Fetch level one features when component mounts
    useEffect(() => {
        const fetchLevelOneFeatures = async () => {
            try {
                const response = await fetch('http://localhost:3001/api/features/lvl/one/');
                if (response.ok) {
                    const data = await response.json();
                    const caseNumber = determineSelectedCase(data);
                    setSelectedCase(caseNumber);
                    localStorage.setItem("selectedCase", caseNumber);
                } else {
                    console.error('Failed to fetch level one features');
                }
            } catch (error) {
                console.error('Error fetching level one features:', error);
            }
        };

        fetchLevelOneFeatures();
    }, []);

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errors = validate(formValues);
        setFormErrors(errors);
    
        if (Object.keys(errors).length === 0) {
            setIsSubmit(true);
            try {
                const response = await fetch(
                    `http://localhost:3001/api/user/${formValues.username}/${formValues.password}`
                );
                if (response.ok) {
                    const data = await response.json();
                    if (data) {
                        localStorage.setItem("userID", data);
    
                        // Send the userID to backend API
                        await fetch("http://localhost:3001/api/user/update/login", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({ user_id: data }), // Send user ID
                        });
    
                        // Navigate based on the selected case
                        if (selectedCase !== 3) {
                            navigate(`/case/${selectedCase}`);
                        } else {
                            navigate(`/dms`);
                        }
                        setLoginResult(`Welcome user ${data}`);
                    } else {
                        setLoginResult("Invalid credentials.");
                    }
                } else {
                    setLoginResult("An error occurred while logging in.");
                }
            } catch (error) {
                setLoginResult(`Error: ${error.message}`);
            }
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
                        {loginResult && <p>{loginResult}</p>}
                    </div>
                </form>
            </div>
        </>
    );
}

export default LogIn;
