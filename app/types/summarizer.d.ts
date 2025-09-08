export {}
declare global {
  /**
   * Chrome Summarizer API — behind a feature flag, Chrome 138+
   */
  interface SummarizerOptions {
    /** The summarization style. */
    type?: 'tldr' | 'teaser' | 'headline' | 'key-points'
    /** Output format. */
    format?: 'plain-text' | 'markdown'
    /** Desired summary length. */
    length?: 'short' | 'medium' | 'long'
    /** Extra context to bias the summary. */
    sharedContext?: string
    /** Download / install monitoring callback. */
    monitor?: (monitor: SummarizerMonitor) => void
  }

  interface SummarizerMonitor extends EventTarget {
    addEventListener(
      type: 'downloadprogress',
      listener: ((ev: SummarizerDownloadProgressEvent) => void),
      options?: boolean | AddEventListenerOptions
    ): void
  }

  interface SummarizerDownloadProgressEvent extends Event {
    loaded: number
    total: number
  }

  interface SummarizeResult {
    output: string
  }

  interface Summarizer {
    /**
     * Generate a summary in one shot.
     */
    summarize(input: string, options?: { context?: string }): Promise<SummarizeResult>

    /**
     * Stream tokens progressively.
     */
    summarizeStreaming(
      input: string,
      options?: { context?: string }
    ): AsyncIterable<SummarizeResult>
  }

  interface SummarizerStatic {
    availability(): Promise<'available' | 'unavailable' | 'after-download'>
    create(options?: SummarizerOptions): Promise<Summarizer>
  }

  var Summarizer: SummarizerStatic
}