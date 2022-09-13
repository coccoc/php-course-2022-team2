import DoctorHome from '../Home/DoctorHome'
import UserHome from '../Home/UserHome'
import { loginState } from '../../recoil/loginState'
import { useRecoilState } from 'recoil'

function LandingPage() {
  const [isLogin, setLogin] = useRecoilState(loginState)

  return isLogin.login ? <DoctorHome /> : <UserHome />
}

export default LandingPage
