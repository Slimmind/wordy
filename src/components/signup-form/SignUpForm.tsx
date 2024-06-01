import Input from "../input"
import InternalWindow from "../internal-window"
import { Button } from "../button/Button";
import { Link } from "@tanstack/react-router";
import { useAuth } from "../../contexts/auth.context";
import { FormEvent, useRef, useState } from "react";

export const SignUpForm = () => {
  const { signup } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const emailRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);
  const passwordRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);
  const passwordConfirmationRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);
  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (passwordRef.current?.value !== passwordConfirmationRef.current?.value) {
      return setError('Passwords do not match');
    }

    if (emailRef.current?.value && passwordRef.current?.value) {
      try {
        setError('');
        setLoading(true);
        await signup(emailRef.current?.value, passwordRef.current?.value);
      } catch {
        setError('Failed to crete an account');
      }
      setLoading(false);
    }
  }

  return <InternalWindow>
    <form onSubmit={handleSubmit}>
      <h2>Sign Up</h2>
      {error && <h4 style={{color: 'red'}}>{error}</h4>}
      <Input type="email" id="email" label="Email" ref={emailRef} required />
      <Input type="password" id="password" label="Password" ref={passwordRef} required />
      <Input type="password" id="passwordConfirmation" label="Password Confirmation" ref={passwordConfirmationRef} required />
      <p><Link to="/login">Already have an account</Link></p>
      <Button type="submit" disabled={loading}>Sign Up</Button>
    </form>
  </InternalWindow>
}