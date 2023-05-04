import React, { useState, useRef, useEffect, forwardRef } from "react"
import { AiFillMinusCircle, AiFillPlusCircle } from "react-icons/ai"

interface NumberInputProps {
  onChange?: (x?: number) => void
  min?: number
  max?: number
  step?: number
  value?: number
}
const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>((props, ref) => {
  const { onChange, min = 0, max = 99, step = 1, value = 0 }: NumberInputProps = props
  // const [values, setValues] = useState(value)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    onChange && onChange(value)
  }, [value])

  const handleOnChange = (e: any) => {
    onChange(e.target.value)
    // setValues(Number(e.target.value))
  }

  const hanldeChangeCount = (type: "plus" | "minus") => {
    if (type === "minus" && value === min) return (value = min)
    if (type === "plus" && value === max) return (value = max)

    if (value >= min && value <= max) {
      // setValues((prev) => (type === "plus" ? prev + step : prev - step))
      type === "plus" ? onChange(value + step) : onChange(value - step)
    }
  }

  const focusInput = () => {
    if (inputRef.current) {
      inputRef.current.click()
    }
  }

  return (
    <div className="flex items-center relative">
      <div
        className="number-input-button cursor-pointer"
        onClick={() => hanldeChangeCount("minus")}
        disabled={value <= min}
      >
        <AiFillMinusCircle className="text-2xl" />
      </div>
      <div className="relative min-w-[40px] text-center flex items-center flex-initial justify-center text-AAA font-semibold">
        <input
          contentEditable
          ref={ref}
          className=" text-xl z-2 text-right"
          type="number"
          value={value}
          onChange={handleOnChange}
          style={{ width: `${value?.toString()?.length * 12 + 24}px` }}
          min={min}
          max={max}
          onPaste={() => {
            return false
          }}
        />
      </div>
      <div
        className="number-input-button cursor-pointer"
        onClick={() => hanldeChangeCount("plus")}
        disabled={value >= max}
      >
        <AiFillPlusCircle className="text-2xl" />
      </div>
    </div>
  )
})

export default NumberInput
