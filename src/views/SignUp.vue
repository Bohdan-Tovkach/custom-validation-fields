<template>
  <div>
    <h1>Sign up</h1>
		<v-form>
			<v-container>
				<v-row class="justify-center">
					<v-col cols="4">
						<v-text-field
							label="Name"
							dense
							outlined
							v-model="name"
							id="name"
							:error-messages="nameErrors"
							@input="$v.name.$touch()"
							@blur="$v.name.$touch()"
						>
						</v-text-field>
						<v-text-field
							label="name (Mask)"
							dense
							outlined
							v-model="nameMask"
							maxlength="128"
							id="name-mask"
							:error-messages="nameMaskErrors"
							@input="
								$v.nameMask.$touch(),
								replaceCharacters('name-mask'),
								replaceSpaces('name-mask')
								"
							@blur="
								$v.nameMask.$touch(), 
								trimSpaces('name-mask'), 
								replaceSpaces('name-mask'), 
								replaceCharacters('name-mask'),
								toUpperCase('name-mask')
								"
						>
						</v-text-field>
						<v-text-field
							label="Email"
							dense
							outlined
							v-model="emailRFC"
							:error-messages="emailRFCErrors"
							@blur="$v.emailRFC.$touch()"
						>
						</v-text-field>
						<v-text-field
							dense
							label="+38 (0##) ###-##-##"
							outlined
							@paste="pasteEvent = true"
							@input="applyMask($event)"
							v-model="numberMask"
							id="number"
						>
						</v-text-field>
					</v-col>
				</v-row>
			</v-container>
		</v-form>
  </div>
</template>

<script>
import { validationMixin } from 'vuelidate'
import {
	nameMnLen,
	onlyOneSpace,
	nameMxLen,
	onlyLatinLetter,
	onlyOneUpper,
	withUpperCase,
	vEmailRFC,
	emailLocal,
	emailDomain
} from '../validate.js'

export default {
	mixins: [validationMixin],
	data: () => ({
		name: null,
		nameMask: null,
		emailRFC: null,
		numberMask: null,
		pasteEvent: false,
	}),
	computed: {
		nameErrors() {
			const errors = []
			if(!this.$v.name.$dirty) return errors
			!this.$v.name.nameMnLen && errors.push('Minimum length 2 character')
			!this.$v.name.nameMxLen && errors.push('Maximum length 128 character')
			!this.$v.name.onlyOneSpace && errors.push('Only one space allowed (between words)')
			!this.$v.name.onlyLatinLetter && errors.push('Only latin letter')
			!this.$v.name.onlyOneUpper && errors.push('Only one uppercase per word')
			!this.$v.name.withUpperCase && errors.push('First letter should start with upper case')
			return errors
		},
		nameMaskErrors() {
			const errors = []
			if(!this.$v.nameMask.$dirty) return errors
				!this.$v.nameMask.nameMnLen && errors.push('Minimum length 2 characters')
			return errors
		},
		emailRFCErrors() {
			const errors = []
			if(!this.$v.emailRFC.$dirty) return errors
			!this.$v.emailRFC.vEmailRFC && errors.push('Not valid Email')
			!this.$v.emailRFC.emailLocal && errors.push('Local part of email should contain maximum 64 characters')
			!this.$v.emailRFC.emailDomain && errors.push('Domain part of email should contain maximum 189 character')
			return errors
		}
	}, 
	methods: {
		trimSpaces(id) {
			const event = new Event('input', {bubbles: true})
			const el = document.getElementById(id)
			el.value = el.value.trim()
			el.dispatchEvent(event)
		},
		replaceSpaces(id) {
			const event = new Event('input', {bubbles: true})
			const el = document.getElementById(id)
			const re = /\s{2,}/g
			new Promise((resolve) => {
				resolve(re.test(el.value))
			}).then(val => {
				if(val) {
					el.value = el.value.replace(re, ' ')
					el.dispatchEvent(event)
				}
			})
		},
		replaceCharacters(id) {
			const event = new Event('input', {bubbles: true})
			const el = document.getElementById(id)
			const re = /[\u0250-\ue0070-9-!$%^&*()_+|~=`{}[\]:";'<>?,./]/g
			new Promise((resolve) => {
				resolve(re.test(el.value))
			}).then(val => {
				if(val) {
					el.value = el.value.replace(re, '')
					el.dispatchEvent(event)
				}
			})
		},
		toUpperCase(id) {
			const el = document.getElementById(id)
			let value = el.value
			const event = new Event('input', {bubbles: true})
			const re = /\s/gm
			new Promise((resolve) => {
				resolve(re.test(value))
			}).then(val => {
				if(val) {
					if(/\s\w/gm.test(value)) {
						let arr = value.split(' ')
						let temp = arr.map(val => {
							return val.charAt(0).toUpperCase() + val.slice(1)
						})
						el.value = temp.join(' ')
						el.dispatchEvent(event)
					}
				} else {
					el.value = value.charAt(0).toUpperCase() + value.slice(1)
					el.dispatchEvent(event)
				}
			})
		},
		applyMask() {
			const el = document.getElementById('number')
			const event = new Event('input', {bubbles: true})

			// '#' - is place where the real sign (number character) will be substituted
			// You can add any other characters between first and last '#' below (exclude numbers)
			// Also you can edit quantity of '#'
			const mask = '+38 (0##) - ### - ## - ##'
			const sign = '#'

			const numLengthRe = /[^#\d+]/g
			const notDigit = /[^\d]/g

			const firstIndex = mask.indexOf(sign)
			const countryCode = mask.slice(0, firstIndex)
			const numLength = mask.slice(firstIndex).replace(numLengthRe, '').length
			const number = this.numberMask.replace(countryCode, '').replace(numLengthRe, '')
			const cCpresent = this.numberMask.indexOf(countryCode)

			let splitMask = mask.split('')
			let indexes = []

			splitMask.forEach((val, i) => {
				val === sign ? indexes.push(i) : false
			})
			let fillMask = (val) => {
				val.split('').forEach((val, i) => {
						indexes[i] ? splitMask[indexes[i]] = val : false
				})
			}
			if(number.length >= numLength && cCpresent !== -1 && this.pasteEvent) {
				fillMask(
					this.numberMask
						.replace(countryCode, '')
						.replace(numLengthRe, '')
						.slice(number.length - numLength)
				)
			} else if(number.length >= numLength && cCpresent === -1) {
				fillMask(
					this.numberMask
						.replace(numLengthRe, '')
						.slice(number.length - numLength)
				)
			} else if (this.numberMask.length > 1){
				fillMask(
					this.numberMask
						.slice(firstIndex)
						.replace(notDigit, '')
				)
			} else if (this.numberMask.length <= 1) {
				fillMask(
					this.numberMask
						.replace(notDigit, '')
				)
			}

			const joinMask = splitMask.join('').replace(/[^\d]+$/, '')

			if(el.value !== joinMask) {
				el.value = joinMask
				el.setSelectionRange(splitMask.indexOf(sign), splitMask.indexOf(sign))
				el.dispatchEvent(event)
			}
			
			this.pasteEvent = false
		}
	},
	validations: {
		name: {
			nameMnLen,
			nameMxLen,
			onlyOneSpace,
			onlyLatinLetter,
			onlyOneUpper,
			withUpperCase
		},
		nameMask: {
			nameMnLen,
		},
		emailRFC: {
			vEmailRFC,
			emailLocal,
			emailDomain,
		},
		numberMask: {

		}
	}
}
</script>
