import { createSignal, createEffect, Switch, Match, For, Show } from 'solid-js'
import { useState } from '../providers/State'

function SingleSelectCustom() {
    const [state, { goToNext, answerForHumans, answer }] = useState()
    const [input, setInput] = createSignal('')
    const [isNextPressed, setIsNextPressed] = createSignal(false)

    const viewState = () => {
        const isError = isNextPressed() ? input().length === 0 : false
        const isValid = input().length > 0
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

    const handleChoice = (choice, e) => {
        e.preventDefault()
        answer(choice.label)
        answerForHumans(choice.label)
        goToNext(choice.next)
    }

    const handleInput = (event) => {
        if (event.target.value !== input()) {
            setInput(event.target.value)
        }
    }

    const handleNext = () => {
        if (viewState().input === 'valid') {
            answer(input())
            answerForHumans(input())
            goToNext(state.currentNode.custom.next)
        } else {
            setIsNextPressed(true)
        }
    }

    return (
        <>
            <div class="mt-4 grid gap-4 mb-4 md:gap-x-8"
				 classList={{
					 'grid-cols-2 md:grid-cols-3': state.currentNode.useThreeColumns,
					 'grid-cols-2': !state.currentNode.useThreeColumns
				 }}>

                <For each={state.currentNode.options}>{(option) =>
                    <a
                        href="#"
                        onClick={[handleChoice, option, e]}
                        class="choice btn flex flex-col rounded text-yellow-800">
                        <Show when={option.image}>
                            <img
                                class="block pointer-events-none"
                                src={`src/assets/images/${option.image}`}
                                alt="{option.label}" />
                        </Show>
                        <span class="block font-bold text-center pointer-events-none"
							  classList={{ 'mt-2': option.image !== undefined }}>{ option.label }</span>
                    </a>
                }</For>
            </div>
            <hr class="my-6"/>
            <div class="flex flex-col">
                <h4 class="text-md mb-2">{state.currentNode.custom.label}</h4>
                <input onKeyUp={handleInput}
					   onChange={handleInput}
					   class="i-t"
					   className={inputStyle()}
					   type={state.currentNode.custom.type}
					   placeholder={state.currentNode.custom.placeholder}
					   value={input()} />
                <Switch>
                    <Match when={viewState().input === 'valid'}>
                        <div class="mt-2 text-sm text-green-800">
                            <p>✓ In Ordnung</p>
                        </div>
                    </Match>
                    <Match when={viewState().input === 'error'}>
                        <p class="mt-2 text-sm text-red-500">Bitte wählen Sie oben {state.currentNode.custom.errorLabel} oder geben Sie hier {state.currentNode.custom.errorLabel} ein.</p>
                    </Match>
                </Switch>

                <button disabled={state.isFinal ?? null }
                    class="btn primary mt-6 w-fit"
                    onClick={handleNext}>Weiter</button>
            </div>
        </>
    )
}

export default SingleSelectCustom
