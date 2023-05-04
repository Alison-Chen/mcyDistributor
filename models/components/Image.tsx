import React from "react"
import { Image } from "antd"

const CustomImage = ({ className, name, image, width = "100%", price, preview = true }) => {
  return (
    <div className={className}>
      <Image alt={name} src={image} preview={preview} width={width} />
      <p className="text-2xl">{name}</p>
      <p>NT$ {price}</p>
    </div>
  )
}

export default CustomImage
