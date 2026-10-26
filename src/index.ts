export type MatcherOptions = {
  /** perform a case-insensitive match */
  nocase?: boolean
  /** do not treat strings starting with `.` specially */
  dot?: boolean
  /** do not match extglobs (treat them as normal strings) */
  noext?: boolean
}

export class Matcher {
  pattern: string
  options: MatcherOptions
  constructor(pattern: string, options: MatcherOptions = {}) {
    this.pattern = pattern
    this.options = options
    // TODO: assemble the state machine
  }

  test(s: string): boolean {
    // TODO pass the string through the test methods
    // return true if it is a match
    return false
  }
}
