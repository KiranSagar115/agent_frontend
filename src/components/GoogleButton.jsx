// import { GoogleLogin } from '@react-oauth/google';
// import { jwtDecode } from 'jwt-decode';

// import axios from 'axios';
// import { GoogleOAuthProvider } from '@react-oauth/google';

// const GoogleButton = () => {
//   const handleGoogle = async (credentialResponse) => {
//     try {
//       const { credential } = credentialResponse;
//       const decoded = jwtDecode(credential);

//       const res = await axios.post('http://localhost:5000/api/auth/google', {
//         token: credential,
//       });

//       alert(`Google Login: Welcome ${res.data.user.username}`);
//     } catch (err) {
//       alert('Google login failed');
//     }
//   };

//   return (
//     <GoogleOAuthProvider clientId="397467711578-ln3ea7sm4o5l4c2b9rqojt2lh400k62t.apps.googleusercontent.com">
//       <div className="flex justify-center mt-4">
//         <GoogleLogin onSuccess={handleGoogle} onError={() => alert('Error')} />
//       </div>
//     </GoogleOAuthProvider>
//   );
// };

// export default GoogleButton;
