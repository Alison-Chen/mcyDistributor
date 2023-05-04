import React from "react"
import { getField, useFsInject } from "formtasy"

const Block = ({ title, fields, className }) => {
  return (
    <div className={`flex flex-row flex-wrap w-full min-h-[50px] bg-white rounded mb-2.5`}>
      {title && <h2 className="m-0 text-base">{title}</h2>}

      {fields?.map?.((field, index) => {
        const type = field?.type
        const properties = field?.properties
        const name = properties?.name
        const span = properties?.span

        const combinedProperties = {
          ...properties,
          // ...fsInject?.[name]?.properties,
        }

        const Field = getField(type)

        if (!Field) {
          console.error(`missing [${type}] type`)
          return null
        }

        return (
          <div className={`py-3 pr-2 pl-1 ${className}`} key={`item-${type}-${index}`} span={span}>
            <Field properties={combinedProperties} />
          </div>
        )
      })}
    </div>
  )
}

export default Block
