import gamer_boy from '../images/gamer_boy.png'
import gamer_girl from '../images/gamer_girl.png'
import gamer_keyboard from '../images/gamer_keyboard.png'
import gamer_woman from '../images/gamer_woman.png'
import man_icon from '../images/man_icon.png'
import woman_icon from '../images/woman_icon.png'


const images = (icon_name:string) => {
	if ('gamer_boy' == icon_name)
		return (gamer_boy)
	else if('gamer_girl' == icon_name)
		return (gamer_girl)
	else if('gamer_keyboard' == icon_name)
		return (gamer_keyboard)
	else if('gamer_woman' == icon_name)
		return (gamer_woman)
	else if('man_icon' == icon_name)
		return (man_icon)
	else if('woman_icon' == icon_name)
		return (woman_icon)
}
export default images;