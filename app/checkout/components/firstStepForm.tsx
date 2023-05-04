import React, { useState, useEffect } from "react"
import { Steps, Button, Card, Space } from "antd"
import { area_data, cities_data } from "constants"
import { Formtasy, FormtasyConfig } from "formtasy"
import { schema } from "app/checkout/components/pageProps"
import { whiteList } from "app/configs/whiteList"
import { useFormik, FormikProvider, FormikProps, Form } from "formik"
import * as yup from "yup"

const FirstStepForm = ({ current, setCurrent, shoplist, setShoplist, user, handleOnSubmit }) => {
  const [city, setCity] = useState(cities_data[0])
  const [secondCity, setSecondCity] = useState(area_data[city][0])

  useEffect(() => {
    if (user) {
      setCity(user?.city)
      setSecondCity(user.county)
    }
  }, [user])

  const formtasyConfig = { whiteList }

  const validationSchema = yup.object().shape({
    name: yup
      .string()
      .required("請輸入姓名")
      .test("name", "請輸入半形中 / 英文", (value) => value?.match(/^[\u4e00-\u9fa5a-zA-Z]+$/)),
    email: yup
      .string()
      .nullable("請輸入電子信箱")
      .required("請輸入電子信箱")
      .test("phone", "請輸入正確電子信箱格式", (value) => {
        if (value?.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)) return true
        return false
      }),
    cellphone: yup
      .string()
      .required("請輸入手機號碼")
      .test("cellphone", "請輸入正確手機格式", (value) => {
        if (value?.match(/09\d{8}/)) return true
        return false
      }),
    taxId: yup
      .string()
      .required("請輸入統一編號")
      .test("taxId", "請輸入正確統一編號格式", (value) => value?.match(/^[0-9]{8}$/)),
    address: yup
      .string()
      .required("請輸入地址")
      .test("companyName", "請輸入中文/半型英文數字", (value) => {
        {
          if (value?.match(/^[\u4e00-\u9fa5a-zA-Z0-9]+$/)) return true
          return false
        }
      }),
    mark: yup.string().test("mark", "請輸入中文/半型英文數字", (value) => {
      {
        if (value?.match(/^[\u4e00-\u9fa5a-zA-Z0-9]+$/)) return true
        return false
      }
    }),
  })

  const formBlock = useFormik({
    enableReinitialize: true,
    initialValues: user,
    validationSchema,
    onSubmit: handleOnSubmit,
  })

  const handleSteps = () => {
    current < 1 ? setCurrent(current + 1) : setCurrent(current - 1)
  }

  const handleProvinceChange = (value) => {
    setCity(value)
    setSecondCity(area_data?.[value]?.[0])
  }

  const handleSecondCityChange = (value) => {
    setSecondCity(value)
  }

  const fsInject = {
    city: {
      properties: {
        options: cities_data.map((province) => ({ label: province, value: province })),
        onChange: (value) => handleProvinceChange(value),
        value: city,
      },
    },
    county: {
      properties: {
        options: area_data?.[city]?.map((city) => ({ label: city, value: city })),
        onChange: (value) => handleSecondCityChange(value),
        value: secondCity,
      },
    },
    steps: {
      properties: {
        onClick: handleSteps,
      },
    },
  }

  return (
    <div className="mt-10 lg:mt-0">
      <FormikProvider value={formBlock}>
        <FormtasyConfig value={formtasyConfig}>
          <Form>
            <Formtasy schema={schema} fsInject={fsInject} />
          </Form>
        </FormtasyConfig>
      </FormikProvider>
    </div>
  )
}

export default FirstStepForm
