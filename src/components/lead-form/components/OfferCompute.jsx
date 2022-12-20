import { createSignal, Switch, Match } from "solid-js"
import { useState } from "../providers/State"


function OfferCompute() {
	const [state, {goToNext, answerForHumans, answer}] = useState()
	const areaPrice = state.nodes.area.answer * 40
	const distance = state.nodes.location.answer.distance * 1.25
	const distancePrice = distance < 50 ? 50 : (distance < 200 ? 100 : undefined)

	const [computed, setComputed] = createSignal(false)

	setTimeout(() => {
		setComputed(true)
	}, 1200)

	const handleNext = (event) => {
		goToNext(state.next)
	}

	/*Für – qm-- fräsen, verlegen Mehrschichtverbundrohr 16x2mm, 
	  Versiegeln der Fläche, Ausführungsort: –Ort--
	  Summe = --qm-- x 40€ +     (wenn Ort < 50 km von Bremen 50€ +, 
	  Wenn –Ort-- 200>50km von Bremen entfernt dann 100€ +,wenn 
	  --Ort-- >200 km, bitte kontaktieren Sie uns. */

	return (
		<Switch>
			<Match when={ !computed() }>
				<div class="flex flex-col items-center content-center">
					<svg xmlns="http://www.w3.org/2000/svg" class="image w-32 h-32 my-8 animate-spin-slow" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
					</svg>
					<h3 class="font-bold text-xl">Einen Moment bitte&hellip;</h3>
					<div>Die Informationen werden verarbeitet.</div>
				</div>
			</Match>
			<Match when={ computed() }>
				<h3 class="mb-2 text-neutral-600 text-4xl font-bold">{ state.currentNode.title }</h3>
				<p>{ state.currentNode.description }</p>
				<p class="mt-4"><strong>Unverbindlichen Kosten&shy;schätzung für:</strong></p>
				<ul class="list-disc list-inside mb-4">
					<li>Fräsen der Kanäle</li>
					<li>Verlegen von Mehrschicht&shy;verbundrohr cosmo 16 × 2mm</li>
					<li>Versiegeln der Flächen</li>
				</ul>
				<p class="mt-4">in <strong>{state.nodes.location.answer.location.plz} {state.nodes.location.answer.location.name}</strong></p>
				<p class="my-4">Ihre <strong>Investition</strong> für behagliche Wärme beträgt etwa <br /> von <strong>{areaPrice},- € bis {areaPrice * 1.2},- €.</strong></p> 
				<Switch>
					<Match when={distance <= 200}>
						<p class="mb-4">Die Anfahrtpauschale beträgt <strong>{distancePrice},- €.</strong></p> 
					</Match>
					<Match when={distance > 200}>
						<p class="mb-4">Aufgrund der größeren Entfernung bitten wir Sie, uns persönlich zu kontaktieren.</p>
					</Match>
				</Switch>
				<button class="btn primary" onClick={handleNext}>Kontakt aufnehmen</button>
			</Match>
		</Switch>
	)
}
export default OfferCompute
