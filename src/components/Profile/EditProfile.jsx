import React, { useState } from "react";

const ProfileEdit = ({
  initialName,
  initialBio,
  initialEmail,
  initialImage,
  initialPrivateProfile,
  onSave,
}) => {
  const [name, setName] = useState(initialName || "");
  const [bio, setBio] = useState(initialBio || "");
  const [email, setEmail] = useState(initialEmail || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [privateProfile, setPrivateProfile] = useState(
    initialPrivateProfile || false
  );
  const [errorMessage, setErrorMessage] = useState("");

  const handleConfirmChanges = () => {
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    setErrorMessage("");
    onSave({ name, bio, email, privateProfile, password });
  };

  return (
    <div className="popup-overlay">
      <div className="popup-container">
        <button className="popup-close" aria-label="Close">×</button>

        <div className="popup-profile">
          <div className="profile-image">
            <img
              src={initialImage || "https://via.placeholder.com/150"}
              alt="Profile"
              className="image"
            />
          </div>
          <div className="profile-actions">
            <button className="edit-button">Edit Image</button>
            <button className="delete-button">Delete Image</button>
          </div>
        </div>

        <div className="input-group">
          <label>Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label>Bio</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
        </div>

        <div className="input-group checkbox-group">
          <label>Private Profile</label>
          <input
            type="checkbox"
            checked={privateProfile}
            onChange={(e) => setPrivateProfile(e.target.checked)}
          />
        </div>

        <div className="input-group">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label>Confirm Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        {errorMessage && <p className="error-message">{errorMessage}</p>}

        <button className="confirm-button" onClick={handleConfirmChanges}>
          Confirm Changes
        </button>
      </div>

      <style jsx>{`
        .popup-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }
        .popup-container {
          background: white;
          border-radius: 20px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
          padding: 20px;
          width: 100%;
          max-width: 400px;
          position: relative;
        }
        .popup-close {
          position: absolute;
          top: 10px;
          right: 10px;
          background: none;
          border: none;
          font-size: 20px;
          color: gray;
          cursor: pointer;
        }
        .popup-profile {
          text-align: center;
          margin-bottom: 20px;
        }
        .profile-image {
          width: 100px;
          height: 100px;
          background: #f0f0f0;
          border-radius: 50%;
          overflow: hidden;
          margin: 0 auto;
          display: flex;
          justify-content: center;
          align-items: center;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        .image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .profile-actions {
          display: flex;
          justify-content: center;
          gap: 10px;
          margin-top: 10px;
        }
        .edit-button,
        .delete-button {
          padding: 5px 10px;
          font-size: 14px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
        }
        .edit-button {
          background: #007bff;
          color: white;
        }
        .delete-button {
          background: #e0e0e0;
          color: #333;
        }
        .input-group {
          margin-bottom: 15px;
        }
        .input-group label {
          display: block;
          font-size: 14px;
          color: #333;
          margin-bottom: 5px;
        }
        .input-group input,
        .input-group textarea {
          width: 100%;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 8px;
          font-size: 14px;
        }
        .input-group.checkbox-group {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .error-message {
          color: red;
          font-size: 14px;
          margin-bottom: 15px;
        }
        .confirm-button {
          width: 100%;
          padding: 10px;
          background: #007bff;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          cursor: pointer;
          transition: background 0.3s;
        }
        .confirm-button:hover {
          background: #0056b3;
        }
      `}</style>
    </div>
  );
};

export default ProfileEdit;

  