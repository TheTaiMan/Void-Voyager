/**
 * Renders the login/register screen and delegates form submission
 * to the LoginController via callback. No auth logic lives here.
 */

type LoginSubmitCallback = (pilotName: string, password: string, isNewAccount: boolean) => void

export default class LoginView {
    #onSubmit: LoginSubmitCallback
    #errorEl!: HTMLElement
    #submitBtn!: HTMLButtonElement

    constructor(onSubmit: LoginSubmitCallback) {
        this.#onSubmit = onSubmit
        this.#render()
    }

    #render() {
        const app = document.querySelector<HTMLDivElement>('#app')!
        app.innerHTML = ''

        const screen = document.createElement('div')
        screen.className = 'login-screen'

        const card = document.createElement('div')
        card.className = 'login-card'

        const title = document.createElement('h1')
        title.className = 'login-title'
        title.textContent = 'Void Voyager'

        const subtitle = document.createElement('p')
        subtitle.className = 'login-subtitle'
        subtitle.textContent = 'Pilot Authentication'

        const pilotField = this.#createField('pilot-name', 'Pilot Name', 'text', 'e.g. nova_hawk')
        const passwordField = this.#createField('password', 'Password', 'password', '••••••••')

        this.#errorEl = document.createElement('p')
        this.#errorEl.className = 'login-error'
        this.#errorEl.setAttribute('aria-live', 'polite')

        const actions = document.createElement('div')
        actions.className = 'login-actions'

        this.#submitBtn = document.createElement('button')
        this.#submitBtn.className = 'btn-primary'
        this.#submitBtn.textContent = 'Launch'
        this.#submitBtn.addEventListener('click', () => {
            const pilotName = (pilotField.querySelector('input') as HTMLInputElement).value.trim()
            const password  = (passwordField.querySelector('input') as HTMLInputElement).value
            this.#onSubmit(pilotName, password, false)
        })

        const registerBtn = document.createElement('button')
        registerBtn.className = 'btn-secondary'
        registerBtn.textContent = 'Register'
        registerBtn.addEventListener('click', () => {
            const pilotName = (pilotField.querySelector('input') as HTMLInputElement).value.trim()
            const password  = (passwordField.querySelector('input') as HTMLInputElement).value
            this.#onSubmit(pilotName, password, true)
        })

        actions.append(this.#submitBtn, registerBtn)
        card.append(title, subtitle, pilotField, passwordField, this.#errorEl, actions)
        screen.appendChild(card)
        app.appendChild(screen)

        // Auto-focus the first input
        ;(pilotField.querySelector('input') as HTMLInputElement).focus()
    }

    #createField(id: string, labelText: string, type: string, placeholder: string): HTMLElement {
        const wrapper = document.createElement('div')
        wrapper.className = 'login-field'

        const label = document.createElement('label')
        label.htmlFor = id
        label.textContent = labelText

        const input = document.createElement('input')
        input.id = id
        input.type = type
        input.placeholder = placeholder

        wrapper.append(label, input)
        return wrapper
    }

    showError(message: string) {
        this.#errorEl.textContent = message
        this.#setLoading(false)
    }

    setLoading(loading: boolean) {
        this.#setLoading(loading)
    }

    #setLoading(loading: boolean) {
        this.#submitBtn.disabled = loading
        this.#submitBtn.textContent = loading ? 'Launching...' : 'Launch'
    }

    destroy() {
        document.querySelector<HTMLDivElement>('#app')!.innerHTML = ''
    }
}
