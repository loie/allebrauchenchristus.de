import { createSignal, Switch, Match, For } from 'solid-js'
import { createStore } from 'solid-js/store'
import { useState } from '../providers/State'

const riddles = [
    { question: '0 + 1', answer: '1' },
    { question: '1 + 1', answer: '2' },
    { question: '3 + 0', answer: '3' },
    { question: '3 + 1', answer: '4' },
    { question: '2 + 3', answer: '5' },
    { question: '4 + 2', answer: '6' },
    { question: '6 + 1', answer: '7' },
    { question: '3 + 5', answer: '8' },
    { question: '7 + 2', answer: '9' }
]

const randomRiddle = Math.floor(Math.random() * riddles.length)
const q = riddles[randomRiddle].question
const a = riddles[randomRiddle].answer

function Form() {
    const [state, { goToNext, answerForHumans, answer }] = useState()

    const [isInputChanged, setIsInputChanged] = createStore({})
    const [isNextPressed, setIsNextPressed] = createSignal(state.currentNode.answer !== undefined)
    const [input, setInput] = createStore(state.currentNode.answer ?? {})

    const fieldNames = () => {
        return state.currentNode.fields.map(f => f.name.toString())
    }

    const viewState = () => {
        return fieldNames().reduce((acc, fName) => {
            const value = input[fName] ? input[fName].value : ''
            const isError = (isInputChanged[fName] || isNextPressed()) && !value
            const isValid = (isInputChanged[fName] || isNextPressed()) && value
            if (isError) {
                acc[fName] = 'error'
            } else if (isValid) {
                acc[fName] = 'valid'
            } else {
                acc[fName] = 'initial'
            }
            return acc
        }, {})
    }

    const inputStyle = () => {
        return fieldNames().reduce((acc, fName) => {
            if (viewState()[fName] === 'error') {
                acc[fName] = {
                    field: 'border-l-red-600 outline-red-600'
                }
                const currentField = state.currentNode.fields.find(f => f.name === fName)
                if (currentField.type === 'checkbox') {
                    acc[fName].label = 'text-red-700'
                }
            } else if (viewState()[fName] === 'valid') {
                acc[fName] = {
                    field: 'border-l-green-600 outline-green-600'
                }
            } else {
                acc[fName] = {
                    field: 'border-l-neutral-400'
                }
            }
            return acc
        }, {})
    }

    const handleInput = (field, event) => {
        setIsInputChanged(field.name, true)
        const value = field.type === 'checkbox' ? event.target.checked === true : event.target.value
        setInput(field.name, { value, label: field.label })
        if (field.type === 'security') {
            setInput('x', { value: a })
        }
    }

    const handleNext = () => {
        setIsNextPressed(true)
        const hasErrors = Object.keys(viewState()).some(vs => viewState()[vs] === 'error')
        if (!hasErrors) {
            answer(input)
            const asString = Object
				  .keys(input)
				  .filter(key => key !== 'x')
				  .filter(key => key !== 'security')
				  .map(key => {
					  return `${input[key].label}: ${input[key].value}`
				  })
				  .join(', ')
            answerForHumans(asString)
            setIsNextPressed(false)
            goToNext(state.next)
        }
    }

    return (
        <>
            <div class="">
                <For each={state.currentNode.fields}>{(field) =>
                    <Switch>
                        <Match when={field.type === 'text' || field.type === 'email' || field.type === 'tel' || field.type === 'number'}>
                            <label class="font-bold" for={field.name}>{ field.label }</label>
                            <input id={field.name}
								   type={field.type}
								   placeholder={ field.placeholder }
								   class="i-t mt-4 mb-8"
								   className={ inputStyle()[field.name].field }
								   value={ state.currentNode.answer ? state.currentNode.answer[field.name]?.value : '' }
								   onChange={[handleInput, field]}
								   onKeyUp={[handleInput, field]}/>
                        </Match>
                        <Match when={field.type === 'checkbox'}>
                            <input id={field.name}
								   type={field.type}
								   placeholder={ field.placeholder }
								   class="mb-8 my-2 inline-block"
								   className={ inputStyle()[field.name].field }
								   checked={ state.currentNode.answer ? state.currentNode.answer[field.name]?.value : '' }
								   onChange={[handleInput, field]}
								   onKeyUp={[handleInput, field]}/>
                            <label class="font-bold" for={field.name} className={ inputStyle()[field.name].label }>{ field.label }</label>
                        </Match>
                        <Match when={field.type === 'security'}>
                            <div class="security">
                                <div class="font-bold">{ field.label }</div>
                                <div>Was ergibt { q }?</div>
                                <input type="text"
									   class="mt-4 mb-8 i-t"
									   value={ state.currentNode.answer ? state.currentNode.answer[field.name].value : '' }
									   className={ inputStyle()[field.name].field }
									   onChange={ [handleInput, field] }
									   onKeyUp={ [handleInput, field] }
									   placeholder={ field.advice}/>
                            </div>
                        </Match>
                    </Switch>
                }</For>
            </div>

            <button disabled={state.isFinal ?? null }class="btn primary mt-6 font-display" onClick={handleNext}>Weiter</button>
        </>
    )
}

export default Form
