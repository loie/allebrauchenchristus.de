import { createSignal, createEffect, Switch, Match, onMount } from "solid-js"
import { useState } from "../providers/State"

function Dimension() {
	const [state, {goToNext, answerForHumans, answer}] = useState()
	const [input, setInput] = createSignal(state.currentNode.answer ?? 50)
	const [isNextPressed, setIsNextPressed] = createSignal(state.currentNode.answer)
	const [isInputChanged, setIsInputChanged] = createSignal(false)

	const viewState = () => {
		const isError = isNextPressed() ?
			  (input() <= 1) || (input() > 10000) :
			  (isInputChanged() ? (input() <= 1) || (input() > 10000) : false)
		const isValid = isNextPressed() ?
			  (input() > 1) && (input() < 10000) :
			  (isInputChanged() ? (input() > 1) && (input() < 10000) : false)
		if (isError) {
			return { input: 'error' }
		}
		if (isValid) {
			return { input: 'valid' }
		}
		return { input: 'initial' }
	}

	const inputStyle = () => {
		if (viewState().input === 'error') return 'border-l-red-800 outline-red-800'
		if (viewState().input === 'valid') return 'border-l-green-800 outline-green-800'
		return 'border-l-neutral-400'
	}
	
	const handleInput = (event) => {
		setIsInputChanged(true)
		const value = event.target.value
		if (value !== input()) {
			setInput(Number.parseInt(value))
		}
	}

	const handleNext = () => {
		setIsNextPressed(true)
		if (viewState().input === 'valid') {
			answer(input())
			answerForHumans(`${input()} ${state.currentNode.dimension}`)
			goToNext(state.next)
		}
	}
	
	return (
		<>
			<p class="mb-2 text-neutral-600 text-sm">{ state.currentNode.title }</p>
			<div class="flex flex-row gap-x-2  items-center">
				<input onKeyUp={handleInput}
					   onChange={handleInput}
					   class="i-t"
					   className={inputStyle()}
					   type="number"
					   placeholder={`Bitte geben Sie eine gültige Anzahl an ${state.currentNode.dimension} an`}
					   value={input()} />
				<span>{state.currentNode.dimension}</span>
			</div>
			<Switch>
				<Match when={viewState().input === 'valid'}>
					<div class="mt-2 text-sm text-green-800">
						<p>✓ In Ordnung</p>
					</div>
				</Match>
				<Match when={viewState().input === 'error'}>
					<p class="mt-2 text-sm text-red-500">Bitte geben Sie eine gültige Anzahl von {state.currentNode.dimension} an.</p>
				</Match>
			</Switch>
			<button disabled={state.isFinal ?? null }class="btn primary mt-6" onClick={handleNext}>Weiter</button>
		</>
	)
}

export default Dimension
