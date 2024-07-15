import React, { useEffect, useRef, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Manager = () => {
  const ref = useRef();
  const passwordRef = useRef();
  const [form, setForm] = useState({ site: '', username: '', password: '' });
  const [passwordArray, setPasswordArray] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newSite, setNewSite] = useState('');
  const [clipboardMessage, setClipboardMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [registeredUsers, setRegisteredUsers] = useState([]);

  useEffect(() => {
    const savedPasswords = localStorage.getItem('passwords');
    const savedUsers = localStorage.getItem('registeredUsers');

    if (savedPasswords) {
      setPasswordArray(JSON.parse(savedPasswords));
    }

    if (savedUsers) {
      setRegisteredUsers(JSON.parse(savedUsers));
    }

    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }, []);

  const showPassword = () => {
    passwordRef.current.type = 'text';
    if (ref.current.src.includes('icons/cross.jpeg')) {
      passwordRef.current.type = 'password';
      ref.current.src = 'icons/view.jpeg';
    } else {
      ref.current.src = 'icons/cross.jpeg';
      passwordRef.current.type = 'text';
    }
  };

  const savePassword = () => {
    if (!form.site || !form.username || !form.password) {
      alert('Please fill in all fields to add a password!');
      return;
    }

    const newPasswordArray = [...passwordArray, form];
    setPasswordArray(newPasswordArray);
    localStorage.setItem('passwords', JSON.stringify(newPasswordArray));
    setForm({ site: '', username: '', password: '' });
    toast.success('Password details saved successfully!');
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const copyToClipboard = (text, clipword) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success(`Copied ${clipword} to clipboard!`, {
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
    setNewPassword(passwordArray[index].password);
  };

  const saveEditedPassword = (index) => {
    const updatedPasswords = [...passwordArray];
    updatedPasswords[index].site = newSite;
    updatedPasswords[index].username = newUsername;
    updatedPasswords[index].password = newPassword;
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

  const handleLogin = () => {
    const user = registeredUsers.find(
      (user) => user.username === form.username && user.password === form.password
    );

    if (user) {
      setLoggedInUser(user);
      toast.success('Logged in successfully!');
    } else {
      toast.error('Invalid username or password. Please try again.');
    }
  };

  const handleLogout = () => {
    setLoggedInUser(null);
    toast.success('Logged out successfully!');
  };

  const handleRegister = () => {
    if (!form.username || !form.password) {
      toast.error('Please enter both username and password to register.');
      return;
    }

    const existingUser = registeredUsers.find((user) => user.username === form.username);
    if (existingUser) {
      toast.error('Username already exists. Please choose a different username.');
      return;
    }

    const newUser = { username: form.username, password: form.password };
    setRegisteredUsers([...registeredUsers, newUser]);
    localStorage.setItem('registeredUsers', JSON.stringify([...registeredUsers, newUser]));
    toast.success('Registered successfully!');
    setForm({ site: '', username: '', password: '' });
  };

  if (loading) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <div aria-label='Loading...' role='status' className='flex items-center space-x-2'>
          <svg className='h-20 w-20 animate-spin stroke-gray-500' viewBox='0 0 256 256'>
            <line
              x1='128'
              y1='32'
              x2='128'
              y2='64'
              stroke-linecap='round'
              stroke-linejoin='round'
              stroke-width='24'
            ></line>
            <line
              x1='195.9'
              y1='60.1'
              x2='173.3'
              y2='82.7'
              stroke-linecap='round'
              stroke-linejoin='round'
              stroke-width='24'
            ></line>
            <line
              x1='224'
              y1='128'
              x2='192'
              y2='128'
              stroke-linecap='round'
              stroke-linejoin='round'
              stroke-width='24'
            ></line>
            <line
              x1='195.9'
              y1='195.9'
              x2='173.3'
              y2='173.3'
              stroke-linecap='round'
              stroke-linejoin='round'
              stroke-width='24'
            ></line>
            <line
              x1='128'
              y1='224'
              x2='128'
              y2='192'
              stroke-linecap='round'
              stroke-linejoin='round'
              stroke-width='24'
            ></line>
            <line
              x1='60.1'
              y1='195.9'
              x2='82.7'
              y2='173.3'
              stroke-linecap='round'
              stroke-linejoin='round'
              stroke-width='24'
            ></line>
            <line
              x1='32'
              y1='128'
              x2='64'
              y2='128'
              stroke-linecap='round'
              stroke-linejoin='round'
              stroke-width='24'
            ></line>
            <line
              x1='60.1'
              y1='60.1'
              x2='82.7'
              y2='82.7'
              stroke-linecap='round'
              stroke-linejoin='round'
              stroke-width='24'
            ></line>
          </svg>
          <span className='text-4xl font-medium text-gray-500'>Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <ToastContainer
        position='top-right'
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme='dark'
      />

      <div className='absolute inset-0 z-[-10] h-full w-full bg-white bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]'>
        <div className='absolute left-0 right-0 top-0 z-[-10] m-auto h-[310px] w-[310px] rounded-full bg-green-400 opacity-20 blur-[100px]'></div>
      </div>

      <div className='mycontainer'>
        <h1 className='text-4xl font-bold text-center'>
          <span className='text-green-700'>&lt;</span>
          <span>Dozz</span>
          <span className='text-green-700'>Password/ &gt;</span>
        </h1>
        <p className='text-green-900 text-lg text-center'>Your own Password Manager</p>

        {!loggedInUser ? (
          <div className='flex flex-col p-4 text-black gap-8 items-center'>
            <input
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              placeholder='Enter Username'
              className='rounded-full border border-green-600 w-full p-4 py-1'
              type='text'
              name='username'
            />
            <input
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder='Enter Password'
              className='rounded-full border border-green-600 w-full p-4 py-1'
              type='password'
              name='password'
            />
            <div className='flex w-full justify-between gap-8'>
              <button
                onClick={handleLogin}
                className='flex justify-between items-center gap-2 bg-green-400 rounded-full hover:bg-green-300 px-8 py-2 w-fit border-2 border-green-900'
              >
                <lord-icon
                  src='https://cdn.lordicon.com/jgnvfzqg.json'
                  trigger='hover'
                ></lord-icon>
                Login
              </button>
              <button
                onClick={handleRegister}
                className='flex justify-between items-center gap-2 bg-green-400 rounded-full hover:bg-green-300 px-8 py-2 w-fit border-2 border-green-900'
              >
                <lord-icon
                  src='https://cdn.lordicon.com/jgnvfzqg.json'
                  trigger='hover'
                ></lord-icon>
                Register
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className='flex justify-end'>
              <button
                onClick={handleLogout}
                className='bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600'
              >
                Logout
              </button>
            </div>

            <div className='flex flex-col p-4 text-black gap-8 items-center'>
              <input
                value={form.site}
                onChange={(e) => setForm({ ...form, site: e.target.value })}
                placeholder='Enter website URL'
                className='rounded-full border border-green-600 w-full p-4 py-1'
                type='text'
                name='site'
              />
              <div className='flex w-full justify-between gap-8'>
                <input
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                  placeholder='Enter Username'
                  className='rounded-full border border-green-600 w-full p-4 py-1'
                  type='text'
                  name='username'
                />
                <div className='relative'>
                  <input
                    ref={passwordRef}
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    placeholder='Enter Password'
                    className='rounded-full border border-green-600 w-full p-4 py-1'
                    type='password'
                    name='password'
                  />
                  <span className='absolute right-[3px] top-[4px] cursor-pointer' onClick={showPassword}>
                    <img ref={ref} className='p-1' width={26} src='icons/view.jpeg' alt='eye' />
                  </span>
                </div>
              </div>
              <button
                onClick={savePassword}
                className='flex justify-between items-center gap-2 bg-green-400 rounded-full hover:bg-green-300 px-8 py-2 w-fit border-2 border-green-900'
              >
                <lord-icon
                  src='https://cdn.lordicon.com/jgnvfzqg.json'
                  trigger='hover'
                ></lord-icon>
                Save
              </button>
            </div>

            <div className='passwords'>
              <h2 className='font-bold text-2xl py-4'>Your Passwords</h2>
              {passwordArray.length === 0 && <div>No Passwords To Show</div>}
              {passwordArray.length !== 0 && (
                <table className='table-auto w-full rounded-md overflow-hidden'>
                  <thead className='bg-green-800 text-white'>
                    <tr>
                      <th className='py-2'>Website URL</th>
                      <th className='py-2'>Username</th>
                      <th className='py-2'>Password</th>
                      <th className='py-2'>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {passwordArray.map((password, index) => (
                      <tr key={index} className='bg-white border border-white'>
                        <td className='py-2 border border-white text-center w-48'>
                          {editingIndex === index ? (
                            <input
                              value={newSite}
                              onChange={(e) => setNewSite(e.target.value)}
                              className='rounded-full border border-green-600 w-full p-2'
                              type='text'
                            />
                          ) : (
                            password.site
                          )}
                          <img
                            src='https://cdn-icons-png.flaticon.com/128/3214/3214746.png'
                            alt='copy icon'
                            width={16}
                            className='inline-block ml-2 cursor-pointer'
                            onClick={() => copyToClipboard(password.site, 'Website URL')}
                          />
                        </td>
                        <td className='py-2 border border-white text-center w-32'>
                          {editingIndex === index ? (
                            <input
                              value={newUsername}
                              onChange={(e) => setNewUsername(e.target.value)}
                              className='rounded-full border border-green-600 w-full p-2'
                              type='text'
                            />
                          ) : (
                            password.username
                          )}
                          <img
                            src='https://cdn-icons-png.flaticon.com/128/3214/3214746.png'
                            alt='copy icon'
                            width={16}
                            className='inline-block ml-2 cursor-pointer'
                            onClick={() => copyToClipboard(password.username, 'Username')}
                          />
                        </td>
                        <td className='py-2 border border-white text-center w-32'>
                          {editingIndex === index ? (
                            <input
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                              className='rounded-full border border-green-600 w-full p-2'
                              type='password'
                            />
                          ) : (
                            password.password
                          )}
                          <img
                            src='https://cdn-icons-png.flaticon.com/128/3214/3214746.png'
                            alt='copy icon'
                            width={16}
                            className='inline-block ml-2 cursor-pointer'
                            onClick={() => copyToClipboard(password.password, 'Password')}
                          />
                        </td>
                        <td className='py-2 border border-white text-center w-16'>
                          {editingIndex === index ? (
                            <button
                              onClick={() => saveEditedPassword(index)}
                              className='bg-green-400 p-1 rounded-full hover:bg-green-300'
                            >
                              Save
                            </button>
                          ) : (
                            <>
                              <img
                                src='https://cdn-icons-png.flaticon.com/128/13170/13170070.png'
                                alt='edit icon'
                                width={16}
                                className='inline-block mx-2 cursor-pointer'
                                onClick={() => startEditing(index)}
                              />
                              <img
                                src='https://cdn-icons-png.flaticon.com/128/6861/6861362.png'
                                alt='delete icon'
                                width={16}
                                className='inline-block mx-2 cursor-pointer'
                                onClick={() => {
                                  deletePassword(index);
                                }}
                              />
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Manager;
