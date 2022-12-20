import { createContext, useContext } from 'solid-js'
import { createStore } from 'solid-js/store'

/*
nodes: Map<string, Node>

type Node {
  type: string
  question: string
  next: string
}

type Location extends Node {
  title: string
}

type SingleSelect extends Node {
  useThreeColumns: boolean
  options: SingleSelectOption[]
}

type SingleSelectOption {
  label: string
  next: string
}

type Dimension {
  dimension: string
  title: string
}

type: Final {
  title: string
  descirption: string
   // no next
}

type singeSelectCustom extends SingleSelect {
 custom {
    type: string
    label: 'Ein anderer Estrich, und zwar:',
    placeholder: 'Geben Sie hier die Art des Estrich an',
    errorLabel: 'die Art des Estrich',
    next: 'success'
  }
}

type Upload {
  title:
  buttonLabel:
  images
}

type MultiSelect {

}
*/

const StateContext = createContext()

const nodes = {
    upload: {
        type: 'upload',
        question: 'Sammlung verkaufen',
        title: 'Laden Sie hier Bilder Ihrer Sammlung hoch.<br />Sollten Sie eine Auflistung (Word, Excel) haben, können Sie diese auch hier hochladen',
        buttonLabel: 'Bilder oder Listen auswählen',
        images: [
            'weisser-fiat-modellauto.webp',
            'modellauto-sammlung-in-vitrine.webp',
            'buecker-bu-modellflugzeug.webp'
        ],
        next: 'overview'
    },
    overview: {
        type: 'form',
        question: 'Wieviele Modelle sind es insgesamt?',
        fields: [
            {
                name: 'amount',
                label: 'Gesamtanzahl der Modelle',
                placeholder: 'Ein ungefährer Wert reicht uns aus    ',
                type: 'number'
            }
        ],
        next: 'details'
    },
    details: {
        type: 'form',
        question: 'Mehr Details zu den Modellen',
        title: 'Werfen Sie doch mal einen Blick unter die Modelle',
        fields: [
            {
                name: 'manufactorer',
                label: 'Fallen Ihnen bestimmte Hersteller auf, die häufiger vorkommen?',
                placeholder: 'z.B. hepa, Siku',
                type: 'text',
                optional: true
            },
            {
                name: 'sizes',
                label: 'Welche Maßstäbe kommen häufiger vor und wie oft?',
                placeholder: 'z.B. "15x 1:18, etwa 30x 1:43 und der Rest 1:50"',
                type: 'text',
                optional: true
            }
        ],
        next: 'contact'
    },
    contact: {
        type: 'form',
        question: 'Ihre Kontaktdaten',
        fields: [
            {
                label: 'Ihr Vor- und Nachname',
                placeholder: 'Ihr vollständiger Name',
                name: 'name',
                type: 'text'
            },
            {
                label: 'Ihre Telefonnummer',
                placeholder: 'Ihre Telefonnummer',
                name: 'phone',
                type: 'tel'
            },
            {
                label: 'Ihre E-Mail-Adresse',
                placeholder: 'Ihre E-Mail-Adresse',
                name: 'email',
                type: 'email'
            },
            {
                label: 'Ich habe die Datenschutzerklärung gelesen und akzeptiert',
                type: 'checkbox',
                name: 'privacy'
            },
            {
                label: 'Sicherheitsabfrage',
                advice: 'Geben Sie ihre Antwort als Zahl an, z.B.: 12',
                placeholder: 'Ihre Antwort als Zahl',
                name: 'security',
                type: 'security'
            }
        ],
        next: 'thankyou'
    },
    thankyou: {
        type: 'sending'
    }
}

const initState = {
    path: ['upload'],
    nodes,
    get currentNodeName() {
        return this.path.at(-1)
    },
    get currentNode() {
        return this.nodes[this.currentNodeName]
    },
    get next() {
        if (this.currentNode.next) {
            return this.currentNode.next
        }
        if (Array.isArray(this.currentNode.options) && this.currentNode.options.length > 0) {
            return this.currentNode.options.at(0).next
        }
        return null
    },
    get isFinal() {
        return this.currentNode.type === 'final' || this.next === null
    },
    get isFirst() {
        return this.path.length === 1
    }
}

export function StateProvider(props) {
    const [state, setState] = createStore(initState)
    const slice = [
        state,
        {
            goToNext(next) {
                setState('path', (path) => path.concat(next))
                console.log('next', state)
            },
            goToPrevious() {
                setState('path', (path) => path.slice(0, path.length - 1))
            },
            answerForHumans(response) {
                setState(
                    'nodes',
                    state.currentNodeName,
                    'answerForHumans',
                    (_answerForHumans) => response
                )
                console.log('humans', state)
            },
            answer(response) {
                setState(
                    'nodes',
                    state.currentNodeName,
                    'answer',
                    (_answer) => response
                )
                console.log('answer', state)
            }
        }
    ]

    return (
        <StateContext.Provider value={slice}>
            {props.children}
        </StateContext.Provider>
    )
}

export function useState() {
    return useContext(StateContext)
}
