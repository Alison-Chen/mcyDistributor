import React, { useState, useEffect } from "react"
import { useMutation, useQuery } from "@blitzjs/rpc"
import { useRouter } from "next/router"
import { Routes } from "@blitzjs/next"

import logout from "app/auth/mutations/logout"
import updateUser from "app/users/mutations/updateUser"

import moment from "moment"
import { FaUserCircle, FaSearch } from "react-icons/fa"
import { BsFillPencilFill } from "react-icons/bs"
import { notification, Modal, Progress, Tooltip } from "antd"

import { Formtasy, FormtasyConfig } from "formtasy"
import { useFormik, FormikProvider, FormikProps, Form } from "formik"

import getUserInfo from "app/users/queries/getUserInfo"

import { area_data, cities_data, MEMBER_LEVEL } from "constants"
import { schema } from "app/users/components/config"
import { whiteList } from "app/configs/whiteList"

import numberToCurrency from "app/utils/numberToCurrency"

import isNull from "lodash/isNull"
import * as yup from "yup"

const NotReview = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [city, setCity] = useState(cities_data[0])
  const [secondCity, setSecondCity] = useState(area_data[city]?.[0])
  const [level, setLevel] = useState({})

  const [api, contextHolder] = notification.useNotification()

  const [updateUserMutation] = useMutation(updateUser)
  const [logoutMutation] = useMutation(logout)

  const router = useRouter()

  const [userInfo] = useQuery(getUserInfo)

  useEffect(() => {
    console.log(userInfo?.review)
    if (userInfo?.review) void router.push(Routes.Home())
  }, [router, userInfo?.review])

  const handleOnSubmit = async (values) => {
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

    const memberLevel = MEMBER_LEVEL.find((item) => {
      if (userInfo?.price < item?.price) return item
    })
    setLevel(memberLevel)
  }, [userInfo])
  return (
    <div className="max-w-[500px] w-full mx-auto">
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
          <div className="flex items-center justify-start font-semibold text-lg mt-4">
            <BsFillPencilFill />
            <p className="!m-2">編輯會員資料</p>
          </div>
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

export default NotReview
