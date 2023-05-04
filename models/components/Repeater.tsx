import React, { useState, useEffect } from "react"
import map from "lodash/map"
import isEmpty from "lodash/isEmpty"
import { Button } from "antd"
import { PlusOutlined } from "@ant-design/icons"
import { useFormikContext } from "formik"
import { withField } from "formtasy"
import { whiteList } from "app/configs/whiteList"

const Repeater = ({
  addBy = "Input",
  addBtnText = "Add",
  onChange,
  name,
  label,
  value,
  defaultValue,
  checked,
  btnDisabled = false,
  ...res
}) => {
  const [schemaData, setSchemaData] = useState([]) as any
  const Element = whiteList?.[addBy]
  const Upload = whiteList?.Upload
  const { setTouched, touched, validateForm, values = {} as any } = useFormikContext()
  const data = values?.[name] || defaultValue

  useEffect(() => {
    if (!isEmpty(data)) {
      const next = [] as any
      map(data, (x, index) => next.push(initItem(index)))
      setSchemaData(next)
    }
  }, [data])

  const handleChange = (index, tag) => (e) => {
    const value = e?.target?.value
    const next = [...data]
    next[index][tag] = value
    onChange(next)
  }

  const initItem = (index) =>
    Object.assign({}, res, {
      onChange: handleChange,
      name: `${name}`,
    })

  const handleAdd = async (index) => {
    const { isValidate = false } = res
    if (isValidate) {
      const check = await checkValidForm()
      if (!check) return
    }
    setSchemaData([...schemaData, initItem(index)])
    onChange([...data, {}])
  }

  const handleRemove = (index) => {
    const next = [...schemaData]
    const value = [...data]
    next.splice(index, 1)
    value.splice(index, 1)
    setSchemaData(next)
    onChange(value)
  }

  const checkValidForm = () =>
    new Promise(async (resolve) => {
      await validateForm(values)
        .then((errors) => setTouched({ ...touched, ...errors }))
        .then((errorField) => {
          if (isEmpty(errorField)) {
            resolve(true)
          } else {
            resolve(false)
          }
        })
    })

  return (
    <div className="w-full flex space-x-2">
      <div className="w-full flex flex-col space-y-4">
        {map(schemaData, (x, index) => {
          return (
            <div className="w-full flex flex-row items-start space-x-4">
              {Element && (
                <>
                  <Upload
                    key={`${x.id}.imgUrl` || index}
                    properties={Object.assign({}, x, {
                      name: `${name}.${index}.imgUrl`,
                      ...res,
                    })}
                  />
                  <Element
                    key={`${x.id}.label` || index}
                    properties={Object.assign({}, x, {
                      onChange: handleChange(index, "label"),
                      name: `${name}.${index}.label`,
                      label: "顏色名稱",
                      ...res,
                    })}
                  />
                  <Element
                    key={`${x.id}.amount` || index}
                    properties={Object.assign({}, x, {
                      onChange: handleChange(index, "amount"),
                      name: `${name}.${index}.amount`,
                      label: "剩餘數量",
                      ...res,
                    })}
                  />
                </>
              )}
              <Button
                type="dashed"
                danger
                onClick={() => handleRemove(index)}
                style={{
                  marginTop: "24px",
                }}
              >
                刪除
              </Button>
            </div>
          )
        })}
        <Button
          type="dashed"
          className="w-fit"
          icon={<PlusOutlined />}
          onClick={() => handleAdd(schemaData?.length - 1)}
          disabled={btnDisabled}
        >
          {addBtnText || "Add field"}
        </Button>
      </div>
    </div>
  )
}

export default Repeater
