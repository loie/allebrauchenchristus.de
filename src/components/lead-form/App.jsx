import { Show, Switch, Match } from 'solid-js'
import { useState } from './providers/State'
import Location from './components/Location'
import SingleSelect from './components/SingleSelect'
import SingleSelectCustom from './components/SingleSelectCustom'
import Upload from './components/Upload'
import Dimension from './components/Dimension'
import Form from './Components/Form'
import OfferCompute from './components/OfferCompute'
import Sending from './Components/Sending'
import Final from './components/Final'

function App() {
    const [state, { goToPrevious }] = useState()

    // const state = { currentNode: {} }
    // const goToPrevious = () => {}

    return (
        <div class="app relative container mx-auto px-8 py-16
            md:max-w-screen-sm md:px-0
            lg:max-w-screen-md
            xl:max-w-screen-lg
            2xl:max-w-screen-xl">

            <Show when={state.isFirst === false}>
                <button
                    class="btn absolute top-8 text-sm font-display"
                    disabled={state.isFirst ?? null}
                    onClick={goToPrevious}
                >
                    <span class="text-sm inline-block mr-2 font-">←</span>
          Zurück
                </button>
            </Show>
            <Show when={state.currentNode.question}>
                <h3 class="font-display text-3xl pb-4 text-center
                    sm:text-left sm:text-xl
                    md:text-4xl"
                classList={{
                    'pb-8': state.currentNode.question,
                    'pt-16': state.isFirst === false
                }}>{state.currentNode.question}</h3>
            </Show>
            <Switch fallback={<p>...</p>}>
                <Match when={state.currentNode.type === 'upload'}>
                    <Upload />
                </Match>
                <Match when={state.currentNode.type === 'location'}>
                    <Location />
                </Match>
                <Match when={state.currentNode.type === 'singleselect'}>
                    <SingleSelect />
                </Match>
                <Match when={state.currentNode.type === 'dimension'}>
                    <Dimension />
                </Match>
                <Match when={state.currentNode.type === 'singleselect-custom'}>
                    <SingleSelectCustom />
                </Match>
                <Match when={state.currentNode.type === 'offer-compute'}>
                    <OfferCompute />
                </Match>
                <Match when={state.currentNode.type === 'form'}>
                    <Form />
                </Match>
                <Match when={state.currentNode.type === 'sending'}>
                    <Sending />
                </Match>
                <Match when={state.currentNode.type === 'final'}>
                    <Final />
                </Match>
            </Switch>
        </div>
    )
}

export default App
