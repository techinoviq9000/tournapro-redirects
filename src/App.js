import React, { useState } from "react"
import "./App.css"
import TournaPro_Icon from "./images/TournaPro_Icon.png"
import { useChangePassword, useUserEmail } from "@nhost/react"
import { nhost } from "./nhostClient"

const App = () => {
  const userEmail = useUserEmail()
  const changePassword = useChangePassword()
  const [newPassword, setNewPassword] = useState("")
  const [confirmNewPassword, setConfirmNewPassword] = useState("")
  const [inputFocused, setInputFocused] = useState(false)
  const [screenChange, setScreenChange] = useState(true)
  const [passwordChanged, setPasswordChanged] = useState(false)

  const isPasswordResetPage = window.location.href.includes("loc")

  const isResetButtonDisabled = !newPassword || !confirmNewPassword

  const handlePasswordReset = () => {
    // Check if new password and confirm new password match
    if (newPassword !== confirmNewPassword) {
      alert("Passwords do not match. Please try again.")
      return // Prevent further execution
    } else {
      const res = nhost.auth.changePassword(newPassword)
      if (res.error == null) {
        setPasswordChanged(true)
      } else {
        setPasswordChanged(false)
      }
      setScreenChange(true)
    }

    // Add your password reset logic here
    console.log("Password reset logic goes here")
  }

  return (
    <>
      <center>
        {isPasswordResetPage ? (
          !screenChange ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center"
              }}
            >
              <img
                style={{ width: "150px", height: "150px" }}
                src={TournaPro_Icon}
                alt="logo"
              />

              <div
                style={{
                  boxSizing: "border-box",
                  backgroundColor: "#f4f4f4",
                  width: "50%",
                  padding: "10px",
                  borderRadius: "10px",
                  boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
                  margin: "auto",
                  marginTop: "20px",
                  textAlign: "center",
                  backgroundImage:
                    "linear-gradient(to bottom, #ffffff, #dce5e5)"
                }}
              >
                <h1
                  style={{
                    color: "black",
                    marginBottom: "20px",
                    fontSize: "28px"
                  }}
                >
                  Reset Your Password
                </h1>
                <div
                  style={{
                    marginBottom: "20px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  <label
                    style={{
                      fontStyle: "italic",
                      fontWeight: "bold",
                      fontSize: "15px",
                      color: "#555"
                    }}
                  >
                    New Password
                  </label>
                  <input
                    style={{
                      outline: "none",
                      width: "30%",
                      padding: "5px",
                      fontSize: "16px",
                      borderRadius: "5px",
                      border: `3px solid ${inputFocused ? "#80bdff" : "#ccc"}`,
                      margin: "10px 0",
                      boxSizing: "border-box",
                      transition: "border-color 0.3s"
                    }}
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    onFocus={() => setInputFocused(true)}
                    onBlur={() => setInputFocused(false)}
                  />
                </div>
                <div
                  style={{
                    marginBottom: "20px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  <label
                    style={{
                      fontStyle: "italic",
                      fontWeight: "bold",
                      fontSize: "15px",
                      color: "#555"
                    }}
                  >
                    Confirm New Password:
                  </label>
                  <input
                    style={{
                      outline: "none",
                      width: "30%",
                      padding: "5px",
                      fontSize: "16px",
                      borderRadius: "5px",
                      border: `3px solid ${inputFocused ? "#80bdff" : "#ccc"}`,
                      margin: "10px 0",
                      boxSizing: "border-box",
                      transition: "border-color 0.3s"
                    }}
                    type="password"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    onFocus={() => setInputFocused(true)}
                    onBlur={() => setInputFocused(false)}
                  />
                </div>
                <button
                  style={{
                    background: isResetButtonDisabled ? "#ccc" : "#007BFF",
                    color: "#fff",
                    padding: "10px 20px",
                    fontSize: "18px",
                    borderRadius: "5px",
                    cursor: isResetButtonDisabled ? "not-allowed" : "pointer",
                    border: "none"
                  }}
                  onClick={handlePasswordReset}
                  disabled={isResetButtonDisabled}
                >
                  Reset Password
                </button>
              </div>
            </div>
          ) : (
            <div className="container">
              <img
                style={{ width: "200px", height: "200px" }}
                src={TournaPro_Icon}
                alt="logo"
              />
              {passwordChanged && <h1>Congratulations!</h1>}
              <div>
                <h2>
                  {passwordChanged
                    ? "Your Password has been reset successfully"
                    : "There was an error while reseting your password"}
                </h2>
              </div>
              <p>
                {passwordChanged
                  ? "You may close the window and login from the TournaPro mobile app."
                  : "Please try again by clicking on forget password on the TournaPro mobile app"}
              </p>
            </div>
          )
        ) : (
          <div className="container">
            <img
              style={{ width: "200px", height: "200px" }}
              src={TournaPro_Icon}
              alt="logo"
            />
            <h1>Congratulations!</h1>
            <div>
              <h2>You have been registered.</h2>
            </div>
            <p>
              You may close the window and login from the TournaPro mobile app.
            </p>
          </div>
        )}
      </center>
    </>
  )
}

export default App
