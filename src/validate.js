// name - validations
export const nameMnLen = (val) => {
	return new Promise((resolve) => {
		if(val !== null) {
			resolve(val.length >= 2)
		}
	})
}
export const nameMxLen = (val) => {
	return new Promise((resolve) => {
		if(val !== null) {
			resolve(val.length <= 128)
		}
	})
}
export const withUpperCase = (val) => {
	let v = /^[a-z]|\s[a-z]/gm.test(val)
	return v = !v
}
export const onlyLatinLetter = (val) => {
	let v = /[0-9-!$%^&*()_+|~=`{}[\]:";'<>?,./а-яА-Я]/g.test(val)
	return v = !v
}
export const onlyOneUpper = (val) => {
	let v = /[A-Z]{2,}/.test(val)
	return v = !v
}

// common validations
export const onlyOneSpace = (val) => {
	let v = /\s{2,}/g.test(val)
	return v = !v
}

// min/max - length (6, 254)
// 1 - 64 symbols before @
// local part can contain ! # $ % & ‘ * + – / = ?  ^ _ ` . { | } ~ Any special characters that are not listed above should be used in the quotes, which are either double quote (“”) or backslash (\)
// domain partuppercase and lowercase Latin letters a to z; Number digits 0-9, with the condition of top-level domains cannot be all numeric; The hypen symbol(-), provided that it should not be the first or the last character.
// eslint-disable-next-line no-useless-escape
export const vEmailRFC = (val) => /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*){1,64}|(".+")){1,64}@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(val)
export const emailLocal = (val) => /^\S{1,64}@/.test(val)
export const emailDomain = (val) => /@\S{0,190}$/.test(val)

export const numCharLength = (val) => {
	return new Promise((resolve) => {
		let length = 12
		if(val !== null) {
			resolve(val.replace(/[^\d]/g, '').length === length)
		}
	}).then(v => {return v})
}