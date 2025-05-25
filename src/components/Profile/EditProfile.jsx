import React, { useState, useEffect, useRef } from "react";

const caseId = parseInt(localStorage.getItem("selectedCase"), 10);

const ProfileEdit = ({
  userId,
  initialBio,
  initialImage,
  initialPrivateProfile,
  onSave,
  onClose,
}) => {
  const [bio, setBio] = useState(initialBio || "");
  const [privateProfile, setPrivateProfile] = useState(initialPrivateProfile || 0);
  const [profileImage, setProfileImage] = useState(initialImage || "https://via.placeholder.com/150");
  const [errorMessage, setErrorMessage] = useState("");
  const [interests, setInterests] = useState([]);
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [showInterestPopup, setShowInterestPopup] = useState(false);
  const fileInputRef = useRef(null);

  const possibleInterests = [
    "Animals", "Art & Design", "Automobiles", "DIY & Crafting", "Education", "Fashion",
    "Finance", "Fitness", "Food", "Gaming", "History & Culture", "Lifestyle", "Literature",
    "Movies", "Music", "Nature", "Personal Development", "Photography", "Psychology",
    "Religion", "Social", "Sports", "Technology", "Travel", "Wellness"
  ];

  useEffect(() => {
    const fetchInterests = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/interests/${userId}`);
        const data = await response.json();

        // Split the single string into an array of individual interests
        const interestsArray = data[0] ? data[0].split(" & ") : []; // Handle empty response
        setSelectedInterests(interestsArray);
      } catch (error) {
        console.error("Error fetching user interests:", error);
      }
    };

    fetchInterests();
  }, [userId]);

  const handleConfirmChanges = async () => {
    setErrorMessage("");
    try {
      // Update bio
      await fetch("http://localhost:3001/api/user/update/bio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, user_bio: bio }),
      });

      // Update profile picture
      await fetch("http://localhost:3001/api/user/update/picture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, profile_picture: profileImage }),
      });

      // Update visibility
      await fetch("http://localhost:3001/api/user/update/visibility", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, visibility: privateProfile }),
      });

      // Update interests: no need to join here, backend expects a string
      await fetch("http://localhost:3001/api/interest/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, interest_name: selectedInterests.join(" & ") }), // Join interests to the string
      });

      onSave({ bio, privateProfile, profileImage, selectedInterests: selectedInterests.join(" & ") }); // join interests to the string
      window.location.reload();
    } catch (error) {
      setErrorMessage("Error saving changes. Please try again.");
    }
  };

  const toggleInterest = (interest) => {
    setSelectedInterests((prev) => {
      if (prev.includes(interest)) {
        return prev.filter((i) => i !== interest);
      } else {
        return [...prev, interest];
      }
    });
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
            <button className="edit-button" onClick={() => fileInputRef.current.click()} style={{fontSize: '13px'}}>
              Edit Image
            </button>
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: "none" }}
              accept="image/*"
              onChange={(e) => setProfileImage(URL.createObjectURL(e.target.files[0]))}
            />
            <button
              className="delete-button"
              onClick={() => setProfileImage("https://via.placeholder.com/150")}
              style={{fontSize: '13px'}}
            >
              Delete Image
            </button>
          </div>
        </div>

        <div className="input-group">
          <label>Bio</label>
          <textarea style={{fontSize: '12px'}} value={bio} onChange={(e) => setBio(e.target.value)} />
        </div>

        {[1, 2].includes(caseId) && (
          <div className="input-group toggle-group">
            <label>Private Profile</label>
            <div
              className={`toggle ${privateProfile === 1 ? "active" : "inactive"}`}
              onClick={() => setPrivateProfile(privateProfile === 1 ? 0 : 1)}
            >
              <div className="toggle-thumb"></div>
            </div>
          </div>
        )}

        <button className="edit-interests-button" onClick={() => setShowInterestPopup(true)} style={{fontSize: '13px'}}>
          Change Personal Interests
        </button>

        {showInterestPopup && (
          <div className="interests-popup">
            <div className="popup-container">
              <button className="popup-close" onClick={() => setShowInterestPopup(false)}>
                &times;
              </button>
              <h3 style={{color: 'black'}}>Select Your Interests</h3>
              <div className="interests-grid">
                {possibleInterests.map((interest) => (
                  <div
                    key={interest}
                    className={`interest-item ${selectedInterests.includes(interest) ? 'selected' : ''}`}
                    onClick={() => toggleInterest(interest)}
                  >
                    {interest}
                  </div>
                ))}
              </div>
              <button
                className="confirm-button"
                onClick={() => setShowInterestPopup(false)}
              >
                Confirm Interests
              </button>
            </div>
          </div>
        )}

        {errorMessage && <p className="error-message">{errorMessage}</p>}

        <button className="confirm-button" onClick={handleConfirmChanges} style={{fontSize: '13px'}}>
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
          border-radius: 50%;
          border: 1px solid #7CB9E8;
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
        .edit-interests-button {
          width: 100%;
          padding: 10px;
          background:rgb(188, 220, 244);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          cursor: pointer;
          margin-bottom: 15px;
        }
            .interests-popup {
              position: fixed;
              inset: 0;
              background: rgba(0, 0, 0, 0.5);
              display: flex;
              justify-content: center;
              align-items: center;
              z-index: 1001;
            }

            .interests-popup .popup-container {
              background: white;
              border-radius: 20px;
              padding: 20px;
              width: 90%;
              max-width: 500px;
              max-height: 80vh;
              overflow-y: auto;
            }

            .interests-grid {
              display: flex;
              flex-wrap: wrap;
              gap: 10px;
              justify-content: center;
              margin-bottom: 20px;
            }

            .interest-item {
              background: #f0f0f0;
              border-radius: 50px;
              color: #333; 
              padding: 10px 15px;
              font-size: 14px;
              cursor: pointer;
              transition: all 0.3s ease;
            }

            .interest-item.selected {
              background: #7CB9E8;
              color: white;
            }

            .interests-popup h3 {
              text-align: center;
              margin-bottom: 20px;
            }

            .interests-popup .confirm-button {
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

            .interests-popup .confirm-button:hover {
              background: #5a9fd6;
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

  