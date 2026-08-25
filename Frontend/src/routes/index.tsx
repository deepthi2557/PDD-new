import { createFileRoute } from '../lib/router-bridge';
import Login from './login';

export const Route = createFileRoute('/')({
  component: Login,
});

export default Login;
