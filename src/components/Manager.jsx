
import React, { useEffect, useRef, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import zxcvbn from 'zxcvbn';
import CryptoJS from 'crypto-js';

// Utility functions
const encryptPassword = (password) => {
  return CryptoJS.AES.encrypt(password, 'your-secret-key').toString();
};

const decryptPassword = (encryptedPassword) => {
  const bytes = CryptoJS.AES.decrypt(encryptedPassword, 'your-secret-key');
  return bytes.toString(CryptoJS.enc.Utf8);
};

const generatePassword = (length = 12) => {
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+[]{}|;:,.<>?";
  let password = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  return password;
};

const getPasswordStrength = (password) => {
  const result = zxcvbn(password);
  return result.score; // Returns a score from 0 to 4
};

const Manager = () => {
  const ref = useRef();
  const passwordRef = useRef();
  const [form, setForm] = useState({ site: '', username: '', password: '' });
  const [passwordArray, setPasswordArray] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newSite, setNewSite] = useState('');
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [registerForm, setRegisterForm] = useState({ username: '', password: '' });
  const [isRegistering, setIsRegistering] = useState(false); // State to toggle between login and register forms

  useEffect(() => {
    const savedUser = localStorage.getItem('loggedInUser');
    if (savedUser) {
      setIsLoggedIn(true);
      const savedPasswords = localStorage.getItem('passwords');
      if (savedPasswords) {
        setPasswordArray(JSON.parse(savedPasswords).map(p => ({ ...p, password: decryptPassword(p.password) })));
      }
    }
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }, []);

  const handleLogin = () => {
    const storedPassword = localStorage.getItem(`user_${loginForm.username}`);
    if (storedPassword && decryptPassword(storedPassword) === loginForm.password) {
      localStorage.setItem('loggedInUser', loginForm.username);
      setIsLoggedIn(true);
      toast.success('Logged in successfully!');
    } else {
      toast.error('Invalid username or password!');
    }
  };

  const handleRegister = () => {
    if (localStorage.getItem(`user_${registerForm.username}`)) {
      toast.error('Username already exists!');
      return;
    }
    const encryptedPassword = encryptPassword(registerForm.password);
    localStorage.setItem(`user_${registerForm.username}`, encryptedPassword);
    toast.success('Registered successfully! You can now log in.');
    setIsRegistering(false); // Switch back to login form after registration
  };

  const handleLogout = () => {
    localStorage.removeItem('loggedInUser');
    setIsLoggedIn(false);
    toast.success('Logged out successfully!');
  };

  const showPassword = () => {
    passwordRef.current.type = passwordRef.current.type === 'password' ? 'text' : 'password';
    ref.current.src = passwordRef.current.type === 'password' ? 'icons/view.jpeg' : 'icons/cross.jpeg';
  };

  const savePassword = () => {
    if (!form.site || !form.username || !form.password) {
      alert('Please fill in all fields to add a password!');
      return;
    }

    const encryptedPassword = encryptPassword(form.password);
    const newPasswordArray = [...passwordArray, { ...form, password: encryptedPassword }];
    setPasswordArray(newPasswordArray);
    localStorage.setItem('passwords', JSON.stringify(newPasswordArray));
    setForm({ site: '', username: '', password: '' });
    toast.success('Password details saved successfully!');
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (e.target.name === 'password') {
      setPasswordStrength(getPasswordStrength(e.target.value));
    }
  };

  const handleLoginChange = (e) => {
    setLoginForm({ ...loginForm, [e.target.name]: e.target.value });
  };

  const handleRegisterChange = (e) => {
    setRegisterForm({ ...registerForm, [e.target.name]: e.target.value });
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success('Copied to clipboard!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'dark',
      });
    });
  };

  const startEditing = (index) => {
    setEditingIndex(index);
    setNewSite(passwordArray[index].site);
    setNewUsername(passwordArray[index].username);
    setNewPassword(decryptPassword(passwordArray[index].password));
  };

  const saveEditedPassword = (index) => {
    const updatedPasswords = [...passwordArray];
    updatedPasswords[index].site = newSite;
    updatedPasswords[index].username = newUsername;
    updatedPasswords[index].password = encryptPassword(newPassword);
    setPasswordArray(updatedPasswords);
    localStorage.setItem('passwords', JSON.stringify(updatedPasswords));
    setEditingIndex(null);
    toast.success('Password details updated successfully!');
  };

  const deletePassword = (index) => {
    if (window.confirm('Are you sure you want to delete this password?')) {
      const updatedPasswords = [...passwordArray];
      updatedPasswords.splice(index, 1);
      setPasswordArray(updatedPasswords);
      localStorage.setItem('passwords', JSON.stringify(updatedPasswords));
      toast.success('Password deleted successfully!');
    }
  };

  const handleGeneratePassword = () => {
    const newPassword = generatePassword();
    setGeneratedPassword(newPassword);
    setForm({ ...form, password: newPassword });
    setPasswordStrength(getPasswordStrength(newPassword));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center w-full h-[100vh] text-gray-900 dark:text-gray-100 dark:bg-gray-950">
        <div>
          <h1 className="text-xl md:text-7xl font-bold flex items-center">
            L
            <svg
              stroke="currentColor"
              fill="currentColor"
              strokeWidth="0"
              viewBox="0 0 24 24"
              className="animate-spin"
              height="1em"
              width="1em"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2ZM13.6695 15.9999H10.3295L8.95053 17.8969L9.5044 19.6031C10.2897 19.8607 11.1286 20 12 20C12.8714 20 13.7103 19.8607 14.4956 19.6031L15.0485 17.8969L13.6695 15.9999ZM5.29354 10.8719L4.00222 11.8095L4 12C4 13.7297 4.54894 15.3312 5.4821 16.6397L7.39254 16.6399L8.71453 14.8199L7.68654 11.6499L5.29354 10.8719ZM18.7055 10.8719L16.3125 11.6499L15.2845 14.8199L16.6065 16.6399L18.5179 16.6397C19.4511 15.3312 20 13.7297 20 12C20 11.8095 19.9978 11.8095 19.7065 10.8719L18.7055 10.8719Z"></path>
            </svg>
            ading...
          </h1>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full p-4 bg-gray-100 dark:bg-gray-900">
      <ToastContainer />
      {!isLoggedIn ? (
        <div className="max-w-md mx-auto p-4 border rounded-lg shadow-md bg-white dark:bg-gray-800 dark:border-gray-700">
          {!isRegistering ? (
            <div>
              <h2 className="text-2xl font-bold mb-4">Login</h2>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleLogin();
                }}
              >
                <input
                  type="text"
                  name="username"
                  value={loginForm.username}
                  onChange={handleLoginChange}
                  placeholder="Username"
                  className="w-full p-2 mb-4 border rounded-lg"
                  required
                />
                <input
                  type="password"
                  name="password"
                  value={loginForm.password}
                  onChange={handleLoginChange}
                  placeholder="Password"
                  className="w-full p-2 mb-4 border rounded-lg"
                  required
                />
                <button
                  type="submit"
                  className="w-full p-2 bg-blue-500 text-white rounded-lg"
                >
                  Login
                </button>
              </form>
              <div className="mt-4 text-center">
                <button
                  onClick={() => setIsRegistering(true)}
                  className="text-blue-500"
                >
                  Don't have an account? Register
                </button>
              </div>
            </div>
          ) : (
            <div>
              <h2 className="text-2xl font-bold mb-4">Register</h2>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleRegister();
                }}
              >
                <input
                  type="text"
                  name="username"
                  value={registerForm.username}
                  onChange={handleRegisterChange}
                  placeholder="Username"
                  className="w-full p-2 mb-4 border rounded-lg"
                  required
                />
                <input
                  type="password"
                  name="password"
                  value={registerForm.password}
                  onChange={handleRegisterChange}
                  placeholder="Password"
                  className="w-full p-2 mb-4 border rounded-lg"
                  required
                />
                <button
                  type="submit"
                  className="w-full p-2 bg-green-500 text-white rounded-lg"
                >
                  Register
                </button>
              </form>
              <div className="mt-4 text-center">
                <button
                  onClick={() => setIsRegistering(false)}
                  className="text-blue-500"
                >
                  Already have an account? Login
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="max-w-4xl mx-auto p-4 border rounded-lg shadow-md bg-white dark:bg-gray-800 dark:border-gray-700">
          <button
            onClick={handleLogout}
            className="mb-4 p-2 bg-red-500 text-white rounded-lg"
          >
            Logout
          </button>
          <h2 className="text-2xl font-bold mb-4">Password Manager</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              savePassword();
            }}
            className="mb-4"
          >
            <input
              type="text"
              name="site"
              value={form.site}
              onChange={handleChange}
              placeholder="Site"
              className="w-full p-2 mb-2 border rounded-lg"
              required
            />
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="Username"
              className="w-full p-2 mb-2 border rounded-lg"
              required
            />
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full p-2 mb-2 border rounded-lg"
              ref={passwordRef}
              required
            />
            <button
              type="button"
              onClick={showPassword}
              className="mb-2 text-blue-500"
            >
              Show/Hide Password
            </button>
            <button
              type="button"
              onClick={handleGeneratePassword}
              className="mb-2 p-2 bg-yellow-500 text-white rounded-lg"
            >
              Generate Password
            </button>
            {generatedPassword && (
              <div className="mb-2 p-2 bg-gray-200 rounded-lg">
                <span>Generated Password: {generatedPassword}</span>
              </div>
            )}
            <button
              type="submit"
              className="w-full p-2 bg-blue-500 text-white rounded-lg"
            >
              Save Password
            </button>
          </form>

          <h3 className="text-xl font-bold mb-2">Stored Passwords</h3>
          {passwordArray.length === 0 ? (
            <p>No passwords stored.</p>
          ) : (
            <ul>
              {passwordArray.map((p, index) => (
                <li key={index} className="mb-2 p-2 border-b">
                  {editingIndex === index ? (
                    <div>
                      <input
                        type="text"
                        value={newSite}
                        onChange={(e) => setNewSite(e.target.value)}
                        placeholder="Site"
                        className="w-full p-2 mb-2 border rounded-lg"
                      />
                      <input
                        type="text"
                        value={newUsername}
                        onChange={(e) => setNewUsername(e.target.value)}
                        placeholder="Username"
                        className="w-full p-2 mb-2 border rounded-lg"
                      />
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Password"
                        className="w-full p-2 mb-2 border rounded-lg"
                      />
                      <button
                        onClick={() => saveEditedPassword(index)}
                        className="mr-2 p-2 bg-green-500 text-white rounded-lg"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingIndex(null)}
                        className="p-2 bg-gray-500 text-white rounded-lg"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div>
                      <p><strong>Site:</strong> {p.site}</p>
                      <p><strong>Username:</strong> {p.username}</p>
                      <p><strong>Password:</strong> {p.password}</p>
                      <button
                        onClick={() => startEditing(index)}
                        className="mr-2 p-2 bg-yellow-500 text-white rounded-lg"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deletePassword(index)}
                        className="p-2 bg-red-500 text-white rounded-lg"
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => copyToClipboard(p.password)}
                        className="ml-2 p-2 bg-blue-500 text-white rounded-lg"
                      >
                        Copy
                      </button>
                    </div>
                  )}
                </li>
              ))}
              
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default Manager;
