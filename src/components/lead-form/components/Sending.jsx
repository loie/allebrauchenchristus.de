import { createSignal, onMount, Switch, Match } from 'solid-js'
import { useState } from '../providers/State'

function Loading() {
    return (
        <div class="flex flex-col items-center content-center">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                class="image w-32 h-32 my-8 animate-spin-slow"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
            </svg>
            <h3 class="font-bold text-xl">Einen Moment bitte&hellip;</h3>
            <div>Die Informationen werden gesendet.</div>
        </div>
    )
}

function Sending() {
    const [state] = useState()
    const [root, setRoot] = createSignal('https://www.filacars.de')
    const [sent, setSent] = createSignal(false)

    onMount(async () => {
        setRoot(window.badetier_root)
    })

    const sendable = state.path
        .filter((name) => state.nodes[name].answer !== undefined)
        .map((nodeName) => {
            const node = state.nodes[nodeName]
            return {
                name: nodeName,
                type: node.type,
                question: node.question,
                answerForHumans: node.answerForHumans,
                answer: node.answer
            }
        })
        .reduce(
            (request, node) => {
                const extended = request.data.concat({
                    name: node.name,
                    type: node.type,
                    question: node.question,
                    answerForHumans: node.answerForHumans,
                    answer: node.answer
                })
                if (node.type === 'form') {
                    if (node.answer.security && node.answer.x) {
                        const answerKeys = Object.keys(node.answer).filter(
                            (name) => name !== 'security' && name !== 'x'
                        )

                        const newData = answerKeys
                            .filter(key => {
                                return request.data.every(d => d.name !== key)
                            })
                            .map((key) => {
                                return {
                                    type: node.answer[key].type,
                                    name: key,
                                    question: node.answer[key].label,
                                    answer: node.answer[key].value,
                                    answerForHumans: node.answer[key].value
                                }
                            })

                        return {
                            answer: node.answer.security.value,
                            check: node.answer.x.value,
                            data: request.data.concat(newData)
                        }
                    }
                }
                return {
                    ...request,
                    data: extended
                }
            },
            { answer: null, check: null, data: [] }
        )

    const minWait = new Promise((resolve) => {
        setTimeout(resolve, 1500)
    })
    const fetchWait = fetch(`${root()}/services/mail/notify.php`, {
        method: 'POST',
        mode: 'cors',
        body: JSON.stringify(sendable)
    })

    Promise.all([minWait, fetchWait]).then((_result) => {
        setSent(true)
    })

    return (
        <Switch>
            <Match when={!sent()}>
                <Loading />
            </Match>
            <Match when={sent()}>
                <div class="flex flex-col items-center content-center">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="block w-32 h-32 my-8 spin-slow"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                    <h3 class="font-bold text-xl text-center">
                        Vielen Dank für Ihre Kontaktaufnahme!
                    </h3>
                    <p>Wir melden uns zeitnah bei Ihnen.</p>
                </div>
            </Match>
        </Switch>
    )
}

export default Sending
