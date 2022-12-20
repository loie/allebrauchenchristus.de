import { createSignal, onMount, For, Show } from 'solid-js'
import { useState } from '../providers/State'

function SingleSelect() {
    const [state, { goToNext, answerForHumans, answer }] = useState()
    const [root, setRoot] = createSignal('/')
    onMount(async () => {
        setRoot(window.badetier_root)
    })

    const handleChoice = (choice, e) => {
        e.preventDefault()
        answer(choice.label)
        answerForHumans(choice.label)
        goToNext(choice.next)
    }

    return (
        <>
            <div
                class="mt-4 grid gap-4 mb-4 md:gap-x-8"
                classList={{
                    'grid-cols-1 sm:grid-cols-3 md:grid-cols-3':
            state.currentNode.useThreeColumns,
                    'grid-cols-2': !state.currentNode.useThreeColumns
                }}
            >
                <For each={state.currentNode.options}>
                    {(option) => (
                        <a
                            href="#"
                            onClick={[handleChoice, option, e]}
                            class="choice btn grid grid-cols-[4rem_1fr] rounded text-yellow-800 items-center"
                        >
                            <Show when={option.image}>
                                <img
                                    class="block pointer-events-none h-12"
                                    src={`${root()}/static/assets/images/${option.image}`}
                                    alt={option.label}
                                />
                            </Show>
                            <span class="block font-bold pointer-events-none">
                                {option.label}
                            </span>
                        </a>
                    )}
                </For>
            </div>
        </>
    )
}

export default SingleSelect
