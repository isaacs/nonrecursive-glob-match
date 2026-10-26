// translate the various posix character classes into unicode properties
// this works across all unicode locales

// { <posix class>: [<translation>, /u flag required, negated]
const posixClasses: { [k: string]: [e: string, u: boolean, n?: boolean] } =
  {
    '[:alnum:]': ['\\p{L}\\p{Nl}\\p{Nd}', true],
    '[:alpha:]': ['\\p{L}\\p{Nl}', true],
    '[:ascii:]': ['\\x' + '00-\\x' + '7f', false],
    '[:blank:]': ['\\p{Zs}\\t', true],
    '[:cntrl:]': ['\\p{Cc}', true],
    '[:digit:]': ['\\p{Nd}', true],
    '[:graph:]': ['\\p{Z}\\p{C}', true, true],
    '[:lower:]': ['\\p{Ll}', true],
    '[:print:]': ['\\p{C}', true],
    '[:punct:]': ['\\p{P}', true],
    '[:space:]': ['\\p{Z}\\t\\r\\n\\v\\f', true],
    '[:upper:]': ['\\p{Lu}', true],
    '[:word:]': ['\\p{L}\\p{Nl}\\p{Nd}\\p{Pc}', true],
    '[:xdigit:]': ['A-Fa-f0-9', false],
  }

// only need to escape a few things inside of brace expressions
// escapes: [ \ ] -
const braceEscape = (s: string) => s.replace(/[[\]\\-]/g, '\\$&')

export type ParseClassResult = [re: RegExp, consumed: number]

const noMatch = /$./

// Takes a glob string at a posix brace expression. Returns a RegExp
// that tests one character, and the number of glob chars consumed.
// If the class is not closed, consumed is 0, and the `[` must be
// treated as a literal character.
// Out of order ranges are removed. If nothing is left, the RegExp
// is `/$./`, and the rest of the glob is consumed, so that the
// whole glob cannot match.
export const parseClass = (
  glob: string,
  position: number,
  nocase: boolean = false,
): ParseClassResult => {
  const pos = position
  /* c8 ignore start */
  if (glob.charAt(pos) !== '[') {
    throw new Error('not in a brace expression')
  }
  /* c8 ignore stop */
  const ranges: string[] = []
  const negs: string[] = []

  let i = pos + 1
  let sawStart = false
  let uflag = false
  let escaping = false
  let negate = false
  let endPos = pos
  let rangeStart = ''
  WHILE: while (i < glob.length) {
    const c = glob.charAt(i)
    if ((c === '!' || c === '^') && i === pos + 1) {
      negate = true
      i++
      continue
    }

    if (c === ']' && sawStart && !escaping) {
      endPos = i + 1
      break
    }

    sawStart = true
    if (c === '\\') {
      if (!escaping) {
        escaping = true
        i++
        continue
      }
      // escaped \ char, fall through and treat like normal char
    }
    if (c === '[' && !escaping) {
      // either a posix class, a collation equivalent, or just a [
      for (const [cls, [unip, u, neg]] of Object.entries(posixClasses)) {
        if (glob.startsWith(cls, i)) {
          // invalid, [a-[] is fine, but not [a-[:alpha]]
          if (rangeStart) {
            return [noMatch, glob.length - pos]
          }
          i += cls.length
          if (neg) negs.push(unip)
          else ranges.push(unip)
          uflag = uflag || u
          continue WHILE
        }
      }
    }

    // now it's just a normal character, effectively
    escaping = false
    if (rangeStart) {
      // throw this range away if it's not valid, but others
      // can still match.
      if (c > rangeStart) {
        ranges.push(braceEscape(rangeStart) + '-' + braceEscape(c))
      } else if (c === rangeStart) {
        ranges.push(braceEscape(c))
      }
      rangeStart = ''
      i++
      continue
    }

    // now might be the start of a range.
    // can be either c-d or c-] or c<more...>] or c] at this point
    if (glob.startsWith('-]', i + 1)) {
      ranges.push(braceEscape(c + '-'))
      i += 2
      continue
    }
    if (glob.startsWith('-', i + 1)) {
      rangeStart = c
      i += 2
      continue
    }

    // not the start of a range, just a single character
    ranges.push(braceEscape(c))
    i++
  }

  if (endPos < i) {
    // didn't see the end of the class, not a valid class,
    // but might still be valid as a literal match.
    return [noMatch, 0]
  }

  // if we got no ranges and no negates, then we have a range that
  // cannot possibly match anything, and that poisons the whole glob
  if (!ranges.length && !negs.length) {
    return [noMatch, glob.length - pos]
  }

  const sranges = '[' + (negate ? '^' : '') + ranges.join('') + ']'
  const snegs = '[' + (negate ? '' : '^') + negs.join('') + ']'
  const comb =
    '^' +
    (ranges.length && negs.length ? '(' + sranges + '|' + snegs + ')'
    : ranges.length ? sranges
    : snegs)

  const flags = `${uflag ? 'u' : ''}${nocase ? 'i' : ''}`
  return [new RegExp(comb, flags), endPos - pos]
}
