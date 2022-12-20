import { createSignal, createEffect } from "solid-js"
import { useState } from "../providers/State"


const riddles = [
    {
		question: "0 + 1",
		answer: "1"	
    },
    {
		question: "1 + 1",
		answer: "2"	
    },
    {
		question: "3 + 0",
		answer: "3"	
    },
    {
		question: "3 + 1",
		answer: "4"	
    },
    {
		question: "2 + 3",
		answer: "5"
    },
    {
		question: "4 + 2",
		answer: "6"	
    },
    {
		question: "6 + 1",
		answer: "7"	
    },
    {
		question: "3 + 5",
		answer: "8"	
    },
    {
		question: "7 + 2",
		answer: "9"	
    }
]

const randomRiddle = Math.floor(Math.random() * riddles.length)
const q = riddles[randomRiddle].question
const a = riddles[randomRiddle].answer



function Security() {
	const [state, {answerForHumans, answer}] = useState()
	const [input, setInput] = createSignal(state.currentNode.answer?.security?.value ?? "")
	const [isNextPressed, setIsNextPressed] = createSignal(false)
	const [isInputChanged, setIsInputChanged] = createSignal(false)

	const currentField = () => {
		return state.currentNode.fields.find(f => f.type === 'security')
	}

	const handleInput = (choice, e) => {
		e.preventDefault()
		
		//answer(choice.label)
		//answerForHumans(choice.label)
		//goToNext(choice.next)
	}
	
	return (
		<div class="security">
			<div class="font-bold">{ currentField().label }</div>
			<div>Was ergibt { q }?</div>
			<input type="text" onChange={ handleInput } onKeyup={ handleInput } placeholder={ currentField().advice}/>
			<input type="hidden" name="x" value={ a } />
		</div>
	)
}

export default Security
