import { useEffect } from 'react';
import Router from 'next/router';
import Handelrequest from '../../hooks/request'
const signout= () => {
  const { DoReq } = Handelrequest({
    url: '/api/users/signout',
    method: 'post',
    body: {},
    OnSuccess: () => Router.push('/')
  });

  useEffect(() => {
    DoReq();
  }, []);

  return <div>Signing you out...</div>;
};

export default signout;