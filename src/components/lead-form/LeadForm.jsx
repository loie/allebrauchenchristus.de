import App from './App'
import { StateProvider } from './providers/State'

function LeadForm() {
    return (
        <StateProvider>
            <div id="badetier-leadform" class="font-body text-neutral-100">
                <App />
            </div>
        </StateProvider>
    )
}

export default LeadForm
