import React, { useState, useEffect } from "react"
import { useMutation } from "@blitzjs/rpc"

import logout from "app/auth/mutations/logout"
import updateUser from "app/users/mutations/updateUser"

import moment from "moment"
import { FaUserCircle, FaSearch } from "react-icons/fa"
import { BsFillPencilFill } from "react-icons/bs"
import { notification, Modal, Progress, Tooltip } from "antd"

import { Formtasy, FormtasyConfig } from "formtasy"
import { useFormik, FormikProvider, FormikProps, Form } from "formik"

import { area_data, cities_data, MEMBER_LEVEL } from "constants"
import { schema } from "app/users/components/config"
import { whiteList } from "app/configs/whiteList"

import numberToCurrency from "app/utils/numberToCurrency"

import isNull from "lodash/isNull"
import * as yup from "yup"

const UserInfoForm = ({ userInfo }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [city, setCity] = useState(cities_data[0])
  const [secondCity, setSecondCity] = useState(area_data[city]?.[0])
  const [level, setLevel] = useState({})

  const [api, contextHolder] = notification.useNotification()

  const [updateUserMutation] = useMutation(updateUser)
  const [logoutMutation] = useMutation(logout)

  const handleOnSubmit = async (values) => {
    console.log(values, "value")
    const result = await updateUserMutation({ id: userInfo.id, email: userInfo.email, ...values })
    api.open({
      message: "會員資料更新成功",
      duration: 0,
    })
  }

  const handleProvinceChange = (value) => {
    setCity(value)
    setSecondCity(area_data?.[value]?.[0])
    void formBlock.setFieldValue("city", value)
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
  }

  const validationSchema = yup.object().shape({
    name: yup.string().required("請輸入姓名"),
    phone: yup
      .string()
      .nullable("請輸入電話號碼")
      .required("請輸入電話號碼")
      .test("phone", "請輸入正確電話號碼格式", (value) => {
        if (value?.match(/^(0)([2-8]{1})([-]?)([0-9]{6,8})$/)) return true
        return false
      }),
    cellphone: yup
      .string()
      .nullable()
      .optional()
      .test("cellphone", "請輸入正確手機格式", (value) => {
        if (value === "") return true
        if (!value) return true
        if (value?.match(/09\d{8}/)) return true
        return false
      }),
    companyName: yup
      .string()
      .nullable("請輸入公司名稱")
      .required("請輸入公司名稱")
      .test("companyName", "請輸入中文/半型英文數字", (value) => {
        {
          if (value?.match(/^[\u4e00-\u9fa5a-zA-Z0-9]+$/)) return true
          return false
        }
      }),
    taxId: yup
      .string()
      .nullable("請輸入統一編號")
      .required("請輸入統一編號")
      .test("taxId", "請輸入正確統一編號格式", (value) => value?.match(/^[0-9]{8}$/)),
    address: yup
      .string()
      .nullable("請輸入地址")
      .required("請輸入地址")
      .test("companyName", "請輸入中文/半型英文數字", (value) => {
        {
          if (value?.match(/^[\u4e00-\u9fa5a-zA-Z0-9]+$/)) return true
          return false
        }
      }),
  })

  const formtasyConfig = { whiteList }

  const formBlock = useFormik({
    enableReinitialize: true,
    initialValues: {
      ...userInfo,
      birth: userInfo?.birth ? moment(userInfo?.birth, "YYYY-MM-DD") : null,
      city: userInfo?.city ? userInfo?.city : city,
      county: userInfo?.county ? userInfo?.county : secondCity,
    },
    validationSchema,
    onSubmit: handleOnSubmit,
  })

  useEffect(() => {
    if (userInfo?.city && userInfo?.county) {
      setCity(userInfo?.city)
      setSecondCity(userInfo?.county)
    }

    if (
      userInfo &&
      (!userInfo?.address || !userInfo?.companyName || !userInfo?.phone || !userInfo?.taxId)
    ) {
      Modal.info({
        title: "系統提醒",
        content: "請填寫完成會員資料且通過審核後才可進行購買！",
      })
    }

    const memberLevel =
      MEMBER_LEVEL.find((item) => {
        if (userInfo?.price < item?.price) return item
      }) || MEMBER_LEVEL[MEMBER_LEVEL.length - 1]

    setLevel(memberLevel)
  }, [userInfo])
  return (
    <div>
      <div className="flex flex-col md:flex-row items-start justify-between">
        <div className="w-full md:w-1/2">
          <div className="flex items-center justify-start font-semibold text-lg">
            <FaUserCircle />
            <p className="!m-2">
              {userInfo?.name}
              <span className="text-red-500 mx-2 text-xs">
                {!userInfo?.review && "尚未通過審核"}
              </span>
            </p>
          </div>
          <p>升級至 VIP 會員，享購物 9 折 12個月內累積消費 NT $5000 即可升級</p>
          <div className="flex items-center justify-start font-semibold text-lg mt-10">
            <BsFillPencilFill />
            <p className="!m-2">編輯會員資料</p>
          </div>
        </div>
        <div className="w-full mb-10 md:w-1/3 md:mb-0">
          <p>
            12 個月內累積消費金額:{" "}
            <span className="font-semibold text-lg">$ {numberToCurrency(userInfo?.price)}</span>
          </p>
          {console.log(level, "price")}
          {console.log(userInfo?.price, "userinfo")}
          <Tooltip
            title={
              level.name === MEMBER_LEVEL[MEMBER_LEVEL.length - 1].name
                ? "已是最高等級"
                : `距離升級還差$ ${numberToCurrency(level?.price - userInfo?.price)}`
            }
          >
            <Progress percent={(userInfo?.price / level?.price) * 100} />
          </Tooltip>
        </div>
      </div>
      <FormikProvider value={formBlock}>
        <FormtasyConfig value={formtasyConfig}>
          <Form>
            <Formtasy schema={schema} fsInject={fsInject} />
          </Form>
        </FormtasyConfig>
      </FormikProvider>
      {contextHolder}
    </div>
  )
}

export default UserInfoForm
