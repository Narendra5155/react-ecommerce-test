import Header from './Header'
import { Outlet } from 'react-router-dom'

function AppLayout() {
  return (
    <div className="app-root">
      <Header />
      <Outlet/>
    </div>
  )
}

export default AppLayout