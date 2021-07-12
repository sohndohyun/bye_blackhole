import gamer_boy from './gamer_boy.png'
import gamer_girl from './gamer_girl.png'
import gamer_keyboard from './gamer_keyboard.png'
import gamer_woman from './gamer_woman.png'
import man_icon from './man_icon.png'
import woman_icon from './woman_icon.png'

export const findImg = (icon_name:string) => {
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

export const allImages = [
	{value: 'gamer_keyboard', src: gamer_keyboard},
	{value: 'gamer_woman', src: gamer_woman},
	{value: 'gamer_boy', src: gamer_boy},
	{value: 'gamer_girl', src: gamer_girl},
	{value: 'man_icon', src: man_icon},
	{value: 'woman_icon', src: woman_icon},
]