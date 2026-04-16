import { useTheme } from '../contexts/ThemeContext'

export default function SunZi() {

const {theme, toggleTheme} = useTheme()

  return (
    <div>
    孙子组件：{theme} 
    <button onClick={toggleTheme} style={{ marginLeft: '10px' }}>切换主题</button>
    </div>
  )
}
