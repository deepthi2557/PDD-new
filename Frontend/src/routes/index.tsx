import { createFileRoute } from '@tanstack/react-router';
import Login from './login';

export const Route = createFileRoute('/')({
  component: IndexComponent,
});

function IndexComponent() {
  return <Login />;
}

export default IndexComponent;
