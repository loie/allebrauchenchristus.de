import { createSignal, createEffect, Switch, Match, onMount } from "solid-js"
import { useState } from "../providers/State"

function Number() {
	const [state, {goToNext, answerForHumans, answer}] = useState()
	const [input, setInput] = createSignal(state.currentNode.answer ?
										   state.currentNode.answer.location.plz.toString(10) : "")
	const [isNextPressed, setIsNextPressed] = createSignal(false)


	const viewState = () => {
		const isError = isNextPressed() ?
			  input().length !== 5 || !location() : 
			  input().length === 5 && !location()
		const isValid = location()
		if (isError) {
			return { input: 'error' }
		}
		if (isValid) {
			return { input: 'valid' }
		}
		return { input: 'initial' }
	}

	const inputStyle = () => {
		if (viewState().input === 'error') return 'border-l-red-600 outline-red-600'
		if (viewState().input === 'valid') return 'border-l-green-600 outline-green-600'
		return 'border-l-neutral-400'
	}
	
	const handleInput = (event) => {
		setIsNextPressed(false)
		if (event.target.value !== input()) {
			setInput(event.target.value)
		}
	}

	const location = () => {
		return locations.find(location => location.plz.toString(10) === input())
	}

	const handleNext = () => {
		if (location()) {
			answer({
				location: location(),
				distance: dkm()
			})
			answerForHumans(`${location().plz} ${location().name}. Luftlinie: ${dkm()} km, Fahrstrecke geschätzt: ${dkm() * 1.25} km`)
			goToNext(state.next)
		}
		else {
			setIsNextPressed(true)
		}
	}
	
	return (
		<>
			<div>
				<p class="mb-2 text-neutral-600 text-sm">{ state.currentNode.title }</p>
				<input onKeyUp={handleInput}
					   onChange={handleInput}
					   class="i-t"
					   className={inputStyle()}
					   type="text"
					   placeholder="Bitte geben Sie Ihre PLZ an..."
					   value={input()}/>
			</div>
			<Switch>
				<Match when={viewState().input === 'valid'}>
					<div class="mt-2 text-sm text-green-800">
						<p>✓ Ort gefunden: {location().name}</p>
					</div>
				</Match>
				<Match when={viewState().input === 'error'}>
					<p class="mt-2 text-sm text-red-500">Keinen Ort mit dieser Postleitzahl gefunden</p>
				</Match>
			</Switch>
			<button disabled={state.isFinal ?? null }class="btn primary mt-6" onClick={handleNext}>Weiter</button>
		</>
	)
}

export default Number
