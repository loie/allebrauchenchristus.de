import { createSignal, For, Switch, Match } from 'solid-js'
import { useState } from '../providers/State'
import locations from '../providers/plz.min.json'

function Location () {
    const [state, { goToNext, answerForHumans, answer }] = useState()
    const [input, setInput] = createSignal(
        state.currentNode.answer
            ? state.currentNode.answer.location.plz.toString(10)
            : ''
    )
    const [isNextPressed, setIsNextPressed] = createSignal(false)
    const [isInputChanged, setIsInputChanged] = createSignal(false)

    const from = {
        lat: 53.1092458401054,
        lng: 9.24979942990108
    }

    const R = 6371e3 // metresd
    const φ1 = (from.lat * Math.PI) / 180 // φ, λ in radians

    const to = () => {
        return location()
            ? { lat: location().lat, lng: location().lng }
            : { lat: 0, lng: 0 }
    }

    const φ2 = () => (to().lat * Math.PI) / 180
    const Δφ = () => ((to().lat - from.lat) * Math.PI) / 180
    const Δλ = () => ((to().lng - from.lng) * Math.PI) / 180

    const a = () =>
        Math.sin(Δφ() / 2) * Math.sin(Δφ() / 2) +
    Math.cos(φ1) * Math.cos(φ2()) * Math.sin(Δλ() / 2) * Math.sin(Δλ() / 2)
    const c = () => 2 * Math.atan2(Math.sqrt(a()), Math.sqrt(1 - a()))

    const d = () => R * c() // in metres
    const dkm = () => Math.round(d() / 1000)

    const viewState = () => {
    // console.log("view state", input(), location())
        const isError = isNextPressed()
            ? input().length === 0 || !location()
            : isInputChanged()
                ? input().length === 0 || !location()
                : false
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
        if (viewState().input === 'error') {
            return 'border-l-red-600 outline-red-600'
        }
        if (viewState().input === 'valid') {
            return 'border-l-green-600 outline-green-600'
        }
        return 'border-l-neutral-400'
    }

    const handleInput = (event) => {
        setIsInputChanged(true)
        if (event.target.value !== input()) {
            setInput(event.target.value)
        }
    }

    const location = () => {
        return locations.find((location) => {
            return (
                location.plz.toString(10) === input() ||
        location.name.toLowerCase() === input().toLowerCase()
            )
        })
    }

    const handleNext = () => {
        if (location()) {
            answer({
                location: location(),
                distance: dkm()
            })
            answerForHumans(
                `${location().plz} ${
                    location().name
                }: Luftlinie ${dkm()} km, Fahrstrecke geschätzt: ${dkm() * 1.25} km`
            )
            goToNext(state.next)
        } else {
            setIsNextPressed(true)
        }
    }

    return (
        <>
            <div>
                <input
                    onKeyUp={handleInput}
                    onChange={handleInput}
                    class="i-t"
                    className={inputStyle()}
                    type="text"
                    list="joh316"
                    placeholder="Bitte geben Sie den Namen oder PLZ an..."
                    value={input()}
                />
                <datalist id="joh316">
                    <For each={locations}>
                        {(location) => (
                            <option value={location.plz}>{location.name}</option>
                        )}
                    </For>
                </datalist>
            </div>
            <Switch>
                <Match when={viewState().input === 'valid'}>
                    <div class="mt-2 text-sm text-green-800">
                        <p>✓ Ort gefunden: {location().name}</p>
                    </div>
                </Match>
                <Match when={viewState().input === 'error'}>
                    <p class="mt-2 text-sm text-red-500">
            Keinen Ort mit dieser Postleitzahl oder diesem Namen gefunden
                    </p>
                </Match>
            </Switch>
            <button
                disabled={state.isFinal ?? null}
                class="btn primary mt-6"
                onClick={handleNext}
            >
        Weiter
            </button>
        </>
    )
}

export default Location
