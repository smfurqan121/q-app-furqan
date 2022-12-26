import { setTheme } from '../../store/actions/themeActions'
import { useDispatch } from 'react-redux'

export default function Header() {
    const dispatch = useDispatch()

    return (
        <div style={{ display: 'flex', width: '20vw', justifyContent: 'space-around', position: 'absolute', top: 10 }}>
            <div onClick={() => dispatch(setTheme('red'))} style={{ background: 'red', width: '50px', height: '50px' }}></div>
            <div onClick={() => dispatch(setTheme('green'))} style={{ background: 'green', width: '50px', height: '50px' }}></div>
            <div onClick={() => dispatch(setTheme('blue'))} style={{ background: 'blue', width: '50px', height: '50px' }}></div>
        </div>
    )
}