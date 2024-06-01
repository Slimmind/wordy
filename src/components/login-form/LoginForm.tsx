import { Link } from "@tanstack/react-router"
import Input from "../input"
import InternalWindow from "../internal-window"
import { Button } from "../button/Button"

export const LoginForm = () => {
  function handleAuth() {
    console.log('Auth');
  }

  return <InternalWindow>
    <form onSubmit={handleAuth}>
      <h2>Login</h2>
      <Input type="email" name="email" label="Email" />
      <Input type="password" name="password" label="Password" />
      <p><Link to="/register">Create a new account</Link></p>
      <Button type="submit">Submit</Button>
    </form>
  </InternalWindow>
}