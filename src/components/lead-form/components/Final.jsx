import { useState } from "../providers/State"

function Final() {
	const [state, {goToNext, answerForHumans, answer}] = useState()

	return (
		<>
			<h3 class="mb-2 text-neutral-600 text-4xl font-bold">{ state.currentNode.title }</h3>
			<p>{ state.currentNode.description }</p>
		</>
	)
}

export default Final
