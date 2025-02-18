import React, { useState, useRef } from "react";

const ProfileEdit = ({
  initialName,
  initialBio,
  initialImage,
  initialPrivateProfile,
  onSave,
  onClose,
}) => {
  const [name, setName] = useState(initialName || "");
  const [bio, setBio] = useState(initialBio || "");
  const [privateProfile, setPrivateProfile] = useState(initialPrivateProfile || false);
  const [profileImage, setProfileImage] = useState(initialImage || "https://via.placeholder.com/150");
  const [errorMessage, setErrorMessage] = useState("");

  const fileInputRef = useRef(null);

  const handleConfirmChanges = () => {
    setErrorMessage("");
    onSave({ name, bio, privateProfile, profileImage });
  };

  const handleEditImage = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
    }
  };

  return (
    <div className="popup-overlay">
      <div className="popup-container">
        <button className="popup-close" aria-label="Close" onClick={onClose}>
          x
        </button>

        <div className="popup-profile">
          <div className="profile-image">
            <img src={profileImage} alt="Profile" className="image" />
          </div>
          <div className="profile-actions">
            <button className="edit-button" onClick={handleEditImage}>
              Edit Image
            </button>
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: "none" }}
              accept="image/*"
              onChange={handleImageChange}
            />
            <button
              className="delete-button"
              onClick={() => setProfileImage("https://via.placeholder.com/150")}
            >
              Delete Image
            </button>
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
          <textarea value={bio} onChange={(e) => setBio(e.target.value)} />
        </div>

        <div className="input-group toggle-group">
          <label>Private Profile</label>
          <div
            className={`toggle ${privateProfile ? "active" : ""}`}
            onClick={() => setPrivateProfile(!privateProfile)}
          >
            <div className="toggle-thumb"></div>
          </div>
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
          background: #7CB9E8;
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
          width: 95%;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 8px;
          font-size: 14px;
          color: #333;
          background: #fff;
        }
        .toggle-group {
          display: flex;
          align-items: center;
          gap: 100px;
        }

        .toggle {
          width: 50px;
          height: 25px;
          border-radius: 50px;
          background-color: #ccc;
          position: relative;
          cursor: pointer;
          transition: background-color 0.3s ease;
          margin-left: auto;
        }

        .toggle.active {
          background-color:#7CB9E8;
        }

        .toggle-thumb {
          width: 20px;
          height: 20px;
          background-color: white;
          border-radius: 50%;
          position: absolute;
          top: 2.5px;
          left: 2.5px;
          transition: left 0.3s ease;
        }

        .toggle.active .toggle-thumb {
          left: 27.5px;
        }

        .error-message {
          color: red;
          font-size: 14px;
          margin-bottom: 15px;
        }
        .confirm-button {
          width: 100%;
          padding: 10px;
          background: #7CB9E8;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          cursor: pointer;
          transition: background 0.3s;
        }
        .confirm-button:hover {
          background: #7CB9E8;
        }
      `}</style>
    </div>
  );
};

export default ProfileEdit;

  