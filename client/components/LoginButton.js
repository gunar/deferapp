import React from 'react';

const LoginButton = () => (
  <div style={{ textAlign: 'center', paddingTop: 20 }}>
    <a href="/auth" className="btn sqrd">
      Login with <i className="mdi mdi-twitter"/>
    </a>
  </div>
);

export default LoginButton;
