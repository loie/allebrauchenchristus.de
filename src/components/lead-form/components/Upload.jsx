/* eslint-disable solid/no-innerhtml */
import { createSignal, onMount, Show, For } from 'solid-js'
import { useState } from '../providers/State'
import { md5 } from '../providers/helpers'

function Upload() {
    const [state, { goToNext, answer, answerForHumans }] = useState()
    const [setIsNextPressed] = createSignal(false)
    const [root, setRoot] = createSignal('')
    const [files, setFiles] = createSignal([])
    const [uploadedFiles, setUploadedFiles] = createSignal([])

    onMount(async () => {
        setRoot(window.badetier_root)
    })

    const hasSelectedFiles = () => {
        return files().length > 0
    }

    const hasUploadedFiles = () => {
        return uploadedFiles().length > 0
    }

    function handleDropAreaClick(e) {
        e.preventDefault()
        const event = new MouseEvent('click')
        document.getElementById('file-upload').dispatchEvent(event)
    }

    function handleDrop(e) {
        e.preventDefault()
        document.querySelector('.upload-area').classList.remove('active')
        setFiles(e.dataTransfer.files)
    }

    function handleDragOver(e) {
        e.preventDefault()
        document.querySelector('.upload-area').classList.add('active')
    }

    function handleChange(e) {
        e.preventDefault()
        console.log(files())
        console.log(Array.from(e.target.files))
        setFiles(Array.from(e.target.files))
    }

    async function doUpload(files) {
        const headers = {}
        const tknName = Math.random().toString(26).substring(2, 10)
        headers['tk-name'] = tknName
        headers[tknName] = md5(tknName)

        const data = new FormData()
        for (const file of files) { data.append('files[]', file, file.name) }

        const response = await fetch(
            '/services/file-uploads/upload-file.php',
            {
                headers,
                method: 'POST',
                body: data
            }
        )
        return response
    }

    async function handleUploadAndNext(e) {
        e.preventDefault()
        const response = await doUpload(files())
        let content = { uncool: 'yes', files: ['2022-12-33/asdf/hukhuk.jpg'] }
        try {
            content = await response.json()
        } catch (e) {
            console.warn('something went wrong', e)
        }
        if (content.cool) {
            setUploadedFiles(content.files.map(name => 'https://www.filacars.de/uploads/' + encodeURI(name)))
            answer(uploadedFiles())
            answerForHumans(uploadedFiles().reduce((acc, entry) => acc + ', ' + entry, ''))
            setIsNextPressed(true)
            goToNext(state.next)
        }
    }

    /*
        const allFiles = Array.from(files())
        allFiles.forEach(file => {
            doUpload(file).then(response => {
                response.text().then(text => {
                    console.log('response', text)
                })
            })
        })
    }
    */

    const handleNext = () => {
        setIsNextPressed(true)
        answer([])
        answerForHumans('')

        goToNext(state.next)
    }

    // const [input, setInput] = createSignal(state.currentNode.answer ?? 50)

    return (
        <section class="upload relative container mx-auto">
            <h4 class="font-body text-xl" innerHTML={state.currentNode.title} />
            <div class="feature-content grid grid-cols-1 gap-y-8" />

            <form
                id="upload-form"
                class=""
                method="post"
                action=""
                encType="multipart/form-data"
            >
                <div
                    class="upload-area flex flex-col mt-8 p-8 border-dashed border-4 border-white w-full rounded-3xl bg-neutral-700
                        sm:flex-row sm:gap-x-8 sm:items-center sm:justify-evenly
                        lg:py-16
                        xl:justify-start"
                    onClick={handleDropAreaClick}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                >
                    <Show when={files().length === 0}>
                        <div class="images relative h-40
                            sm:w-1/2">
                            <img
                                class="image image-rotate-none absolute left-1/2 -ml-20 -rotate-[5deg] rounded-sm w-2/5 shadow-md transition-transform duration-150 ease-in-out
                                    sm:w-2/5
                                    lg:w-2/6
                                    xl:w-1/5"
                                src={`${root()}/images/lead-form/${state.currentNode.images.at(1)}`}
                            />
                            <img
                                class="image image-rotate-ccw absolute left-1/4 -ml-10 -rotate-[15deg] rounded-sm w-2/5 shadow-md transition-transform duration-150 ease-in-out
                                    sm:w-2/5
                                    lg:w-2/6
                                    xl:w-1/5"
                                src={`${root()}/images/lead-form/${state.currentNode.images.at(2)}`}
                            />
                            <img
                                class="image image-rotate-cw absolute left-1/2 rotate-[15deg] rounded-sm w-2/5 shadow-md transition-transform duration-150 ease-in-out
                                    sm:w-2/5
                                    lg:w-2/6
                                    xl:w-1/5"
                                src={`${root()}/images/lead-form/${state.currentNode.images.at(0)}`}
                            />
                        </div>
                    </Show>
                    <Show when={files().length > 0}>
                        <span class="font-display text-xl mt-16 mb-4 w-full text-center
                            md:my-0">{files().length} Dateien ausgewählt</span>
                        <div class="flex flex-col gap-4">
                            <For each={files()}>
                                {(file) => (
                                    <div class="font-body text-base text-center">{file.name}</div>
                                )}
                            </For>
                        </div>
                    </Show>

                    <input
                        id="file-upload"
                        name="files[]"
                        type="file"
                        class="hidden btn font-display mt-8 w-full"
                        accept=".doc,.docx,.odt,.ods,.pdf,.jpg,.jpeg,.png,.gif"
                        onChange={handleChange}
                        multiple
                    />
                    <label
                        for="file-upload"
                        class="btn font-display mt-8 w-full text-center
                            sm:w-fit sm:h-fit sm:mt-0
                            xl:text-xl
                            2xl:text-2xl"
                        onClick={() => {}}
                    >
                        {state.currentNode.buttonLabel}
                    </label>
                </div>
            </form>
            {hasSelectedFiles() &&
                <button class="btn primary font-display mt-8 w-full
                    md:w-fit
                    lg:text-lg
                    xl:text-xl" onClick={handleUploadAndNext}>
                        Hochladen und weiter
                </button>
            }
            {!hasSelectedFiles() &&
                <button class="btn secondary font-display mt-8 w-full
                    md:w-fit
                    lg:text-lg
                    xl:text-xl" onClick={handleNext}>
                Weiter ohne hochladen
                </button>
            }
        </section>
    )
}

export default Upload
