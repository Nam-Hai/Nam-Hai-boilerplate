export function useStreamingText(text: string, speedInt: number = 3) {

    const streamedText = ref('')
    const delay = useDelay(20, streamText)
    const percentage = ref(0)

    function streamText() {
        percentage.value = streamedText.value.length / text.length
        if (streamedText.value.length == text.length) {
            // might need to add raw html swap for links
            // steamedText.value = ''
            // rawStaticText.value = rawHTMLText

            return
        }
        streamedText.value = text.slice(0, streamedText.value.length + speedInt)

        delay.run()
    }

    function reset() {
        streamedText.value = ''
        percentage.value = 0
        delay.stop()
    }

    return { streamedText, start: streamText, reset, percentage }
}