import { useState, useEffect, useRef, useCallback } from 'react'
import { setInterval, setTimeout, clearInterval } from 'requestanimationframe-timer'

import { randomItem, nextItem } from 'utils/arrays'

const symbols: string[] = '!<>-_\\/[]{}—=+*^?#'.split('')

export type ScrambleText = string[]

export type ScrambleTexts = ScrambleText[]

export type TextScrambleProps = {
  texts: ScrambleTexts
  className?: string
  letterSpeed?: number
  nextLetterSpeed?: number
  paused?: boolean
  pauseTime?: number
  dudClassName?: string
  lineClassName?: string
  lineDelay?: number
  parallel?: boolean
  loop?: boolean
}

function TextScramble({
  texts,
  className,
  letterSpeed = 5,
  nextLetterSpeed = 100,
  paused = false,
  pauseTime = 1500,
  dudClassName = 'dud',
  lineClassName = 'text-scramble-line',
  parallel = true,
  lineDelay = 0,
  loop = true
}: TextScrambleProps) {
  const [currentText, setCurrentText] = useState<string[]>(texts[0])
  const [stopped, stop] = useState<boolean>(false)
  const [playing, play] = useState<boolean>(false)
  const bakeLetterInterval = useRef<number | null>()
  const bakeTextInterval = useRef<number | null>()

  const initSymbols: string[] = Array(currentText.length)
    .fill(0)
    .map(() => randomItem(symbols)) as string[]

  const [displayedText, setDisplayedText] = useState<(string | JSX.Element)[]>(initSymbols)

  const leftIndexes: number[][] = []

  const setDefaultLeftIndexes = useCallback(() => {
    for (let index = 0; index < currentText.length; index++) {
      const line = currentText[index]
      line.split('').forEach((char: string, i: number) => {
        if (i === 0) {
          leftIndexes[index] = []
        }
        leftIndexes[index].push(i)
      })
    }
  }, [currentText, leftIndexes])

  const bakeLetter = useCallback(() => {
    bakeLetterInterval.current = setInterval(() => {
      if (!paused) {
        const updatedText: (string | JSX.Element)[] = []
        const innerChars: (string | JSX.Element)[][] = []

        for (let index = 0; index < currentText.length; index++) {
          // Handle chars
          innerChars[index] = currentText[index].split('').map((char: string, i: number) => {
            if (!leftIndexes[index].includes(i)) {
              return char
            }
            return (
              <span key={i} className={dudClassName}>
                {randomItem(symbols)}
              </span>
            )
          })

          // Wrap the line
          const line: JSX.Element = (
            <div key={index} className={lineClassName}>
              {innerChars[index]}
            </div>
          )

          updatedText[index] = line
        }

        setDisplayedText(updatedText)
      }
    }, letterSpeed)
  }, [letterSpeed, paused, currentText, lineClassName, leftIndexes, dudClassName])

  const bakeText = useCallback(() => {
    setDefaultLeftIndexes()
    bakeLetter()

    bakeTextInterval.current = setInterval(() => {
      if (!paused) {
        const leftIndexesLength = leftIndexes.reduce((prev, curr) => prev + curr.length, 0)

        if (leftIndexesLength === 0) {
          bakeLetterInterval.current !== null && clearInterval(bakeLetterInterval.current)
          bakeTextInterval.current !== null && clearInterval(bakeTextInterval.current)

          setTimeout(() => {
            setCurrentText(nextItem(texts, currentText))
            setDefaultLeftIndexes()
          }, pauseTime)
        }

        if (parallel) {
          for (let index = 0; index < leftIndexes.length; index++) {
            const indexes = leftIndexes[index]
            setTimeout(() => {
              indexes.shift()
            }, lineDelay * index)
          }
        } else {
          // Sequential mode
          const currentIndex = leftIndexes.findIndex((indexes) => indexes.length > 0)
          if (currentIndex > -1) {
            leftIndexes[currentIndex].shift()
          }
        }
      }
    }, nextLetterSpeed)
  }, [currentText, texts, paused, pauseTime, leftIndexes])

  useEffect(() => {
    if (playing && !loop && currentText[0] === texts[0][0]) {
      stop(true)
      return
    } else {
      play(true)
    }

    if (!paused && !stopped) {
      bakeText()
    }
  }, [currentText, paused])

  useEffect(() => play(true), [])

  return <div className={className}>{displayedText}</div>
}

export default TextScramble
