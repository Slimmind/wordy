import { useState, lazy } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';
import { logout } from '../../store/auth';
import './profile.styles.css';

const InternalWindow = lazy(() => import('../internal-window'));
const Block = lazy(() => import('../block'));
const Alert = lazy(() => import('../alert'));
const Button = lazy(() => import('../button'));

export const Profile = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [error, setError] = useState<string>('');
  const currentUser = useSelector((state: RootState) => state.auth.currentUser);
  const navigate = useNavigate();

  async function handleLogOut() {
    setError('');
    try {
      await dispatch(logout()).unwrap();
      navigate({ to: '/' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to log out');
    }
  }

  if (error) {
    return (
      <Alert shown={!!error} type='error' title='Error!'>
        {error}
      </Alert>
    );
  }

  return (
    <InternalWindow title='Profile'>
      <Block>
        <strong>Name: </strong>
        {currentUser?.displayName || 'Not specified'}
      </Block>
      <Block>
        <strong>Email: </strong>
        {currentUser?.email}
      </Block>
      <Button mod='bordered wide' onClick={handleLogOut}>
        Log Out
      </Button>
    </InternalWindow>
  );
};