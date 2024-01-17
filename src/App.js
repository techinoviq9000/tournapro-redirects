import React, { useState } from "react"
import "./App.css"
import TournaPro_Icon from "./images/TournaPro_Icon.png"
import { useChangePassword, useUserEmail } from "@nhost/react"
import { nhost } from "./nhostClient"
import Spinner from "./components/Spinner"

const App = () => {
  const userEmail = useUserEmail()
  // const changePassword = useChangePassword()
  const [newPassword, setNewPassword] = useState("")
  const [confirmNewPassword, setConfirmNewPassword] = useState("")
  const [inputFocused, setInputFocused] = useState(false)
  const [screenChange, setScreenChange] = useState(false)
  const [passwordChanged, setPasswordChanged] = useState()
  const [error, setError] = useState("")
  const isPasswordResetPage = window.location.href.includes("password")

  const isResetButtonDisabled = !newPassword || !confirmNewPassword

  const handlePasswordReset = async (e) => {
    e.preventDefault()
    // Check if new password and confirm new password match
    if (newPassword !== confirmNewPassword) {
      setError("Password does not match")
      return // Prevent further execution
    }
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters")
      return
    }
    const res = await nhost.auth.changePassword({ newPassword })
    console.log(res)
    if (res.error == null) {
      setPasswordChanged(true)
    } else {
      setPasswordChanged(false)
      setError(res.error?.message)
      return
    }
    setScreenChange(true)

    // Add your password reset logic here
    console.log("Password reset logic goes here")
  }

  return (
    <div class="bg-gray-50 dark:bg-gray-900 h-screen">
      {isPasswordResetPage ? (
        !screenChange ? (
            <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0 h-screen">
              <>
              <img src="https://wepuirejkqdmeaineqto.storage.ap-south-1.nhost.run/v1/files/51963784-1148-478b-99e9-c711faea0732" className="w-32 pb-10"/>
              {!userEmail ? 
              <div class="w-full p-6 bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md dark:bg-gray-800 dark:border-gray-700 sm:p-8">
                <h2 class="mb-1 text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                  Reset Password
                </h2>
                <form class="mt-4 space-y-4 lg:mt-5 md:space-y-5" action="#">
                  <div>
                    <label
                      for="email"
                      class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Your email
                    </label>
                    <input
                      disabled="true"
                      value={userEmail}
                      type="email"
                      name="email"
                      id="email"
                      class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="name@company.com"
                      required=""
                    />
                  </div>
                  <div>
                    <label
                      for="password"
                      class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      New Password
                    </label>
                    <input
                      onChange={(e) => setNewPassword(e.target.value)}
                      type="password"
                      name="password"
                      id="password"
                      placeholder="Enter New Password"
                      class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      required=""
                    />
                  </div>
                  <div>
                    <label
                      for="confirm-password"
                      class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Confirm password
                    </label>
                    <input
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      type="password"
                      name="confirm-password"
                      id="confirm-password"
                      placeholder="Confirm Password"
                      class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      required=""
                    />
                  </div>
                  <div class="flex justify-center items-center">
                    <button
                      style={{
                        background: isResetButtonDisabled ? "#ccc" : "#007BFF",
                        color: "#fff",
                        padding: "8px 17px",
                        fontSize: "14px",
                        borderRadius: "5px",
                        cursor: isResetButtonDisabled
                          ? "not-allowed"
                          : "pointer",
                        border: "none"
                      }}
                      onClick={handlePasswordReset}
                      disabled={isResetButtonDisabled}
                    >
                      Reset Password
                    </button>
                  </div>

                  {error && (
                    <div
                      class="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400"
                      role="alert"
                    >
                      <span class="font-medium">Error! </span>
                      {error}
                    </div>
                  )}
                </form>
              </div> : <Spinner />}
              </>
            </div>
        ) : (
          <center>
            <div
              style={{
                // marginTop: "80px",
                padding: "20px",
                marginBottom: "10px",
                color: "black"

                // alignItems: "center"
              }}
            >
              <img
                style={{ width: "300px", height: "300px" }}
                src={TournaPro_Icon}
                alt="logo"
              />
              <p style={{ fontSize: 40, fontWeight: "bold" }}>
                Password reset successful
              </p>
              <div></div>
              <p>
                Close this window and continue to login from the TournaPro
                mobile app.
              </p>
            </div>
          </center>
        )
      ) : (
        <center>
          <div
            style={{
              // marginTop: "80px",
              padding: "20px",
              marginBottom: "10px",
              color: "black"

              // alignItems: "center"
            }}
          >
            <img
              style={{ width: "300px", height: "300px" }}
              src={TournaPro_Icon}
              alt="logo"
            />
            <p style={{ fontSize: 40, fontWeight: "bold" }}>Congratulations!</p>
            <div>
              <p style={{ fontSize: 30, fontWeight: "500" }}>
                You have been registered.
              </p>
            </div>
            <p>
              You may close the window and login from the TournaPro mobile app.
            </p>
          </div>
        </center>
      )}
    </div>
  )
}

export default App
