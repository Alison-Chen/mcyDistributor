import React, { useState, useEffect } from "react"
import { Upload, Typography, message } from "antd"
import PlusIcon from "@ant-design/icons/PlusOutlined"
import LoadingIcon from "@ant-design/icons/LoadingOutlined"
import UploadIcon from "@ant-design/icons/UploadOutlined"
import { useFormikContext } from "formik"
import { map, isEmpty, merge, isFunction } from "lodash"
import useInitialize from "app/backstages/hooks/useInitialize"
import firebase from "firebase/app"
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage"
// import {
//   uploadToS3,
//   fileSizeParser,
//   checkImageWidthAndHeight,
//   isSuperadmin,
// } from "models/share/utils"

const { Text } = Typography

const FormUpload = ({
  value,
  name,
  uploadHost,
  uploadPath,
  accept = "image",
  injectUploadType = {},
  maxCount = 1,
  fileNameCount,
  sizeLimit,
  maxWidth,
  maxHeight,
  onSuccess,
  onError,
  uploaderBtnText,
  disabled = false,
  isChineseAllowed = false,
  handlePreview,
  customUpload,
  customRequestParams,
  fileList: controlFileList,
  beforeUpload,
}) => {
  const [fileList, setFileList] = useState<any[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [imageAsUrl, setImageAsUrl] = useState("")
  const { setFieldValue } = useFormikContext()

  const { firebase } = useInitialize()
  const storage = getStorage(firebase)

  const key = accept === "image" ? "url" : "name"

  const uploadType = {
    image: {
      accept: "image/*",
      listType: "picture-card",
      text: "圖片",
      unit: "張",
      uploadBtn: (
        <div
          className={`flex flex-col items-center cursor-pointer ${
            disabled ? "bg-gray-100 cursor-not-allowed" : ""
          }`}
        >
          {isUploading && <LoadingIcon />}
          {!isUploading && <PlusIcon />}
          <Text>
            {isUploading && "上傳中..."}
            {!isUploading && (uploaderBtnText || "上傳圖片")}
          </Text>
        </div>
      ),
    },
    pdf: {
      accept: "application/pdf",
      listType: "text",
      text: "檔案",
      unit: "張",
      uploadBtn: (
        <div
          className={`flex justify-center items-center space-x-2 border p-1.5 px-3 leading-none border-gray-200 text-[14px] cursor-pointer ${
            disabled ? "bg-gray-100 cursor-not-allowed" : ""
          }`}
        >
          <UploadIcon />
          <Text>
            {isUploading && "上傳中..."}
            {!isUploading && (uploaderBtnText || "上傳檔案")}
          </Text>
        </div>
      ),
    },
    excel: {
      accept: ".xlsx, .xls, .csv",
      listType: "text",
      text: "文件",
      unit: "個",
      uploadBtn: (
        <div
          className={`flex justify-center items-center space-x-2 border p-1.5 px-3 leading-none border-gray-200 text-[14px] cursor-pointer ${
            disabled ? "bg-gray-100 cursor-not-allowed" : ""
          }`}
        >
          <UploadIcon />
          <Text>
            {isUploading && "上傳中..."}
            {!isUploading && (uploaderBtnText || "上傳文件")}
          </Text>
        </div>
      ),
    },
  }

  const uploadItem =
    merge(uploadType[accept], injectUploadType) || merge(uploadType.image, injectUploadType)

  useEffect(() => {
    if (controlFileList) {
      setFileList(controlFileList)
      return
    }
    if (maxCount === 1 && key !== "url") {
      setFileList(value ? [{ [key]: value }] : [])
      return
    }
    setFileList(map(value, (el) => ({ [key]: el })))
  }, [value])

  useEffect(() => {
    if (controlFileList) {
      setFileList(controlFileList)
    }
  }, [controlFileList])

  const uploadToFirebaseWithProps = async (context) => {
    const { file, onSuccess, onError } = context
    const storageRef = ref(storage, `/files/${file.name}`)
    const uploadTask = uploadBytesResumable(storageRef, file)
    uploadTask.on(
      "state_changed",
      (snapShot) => {
        //takes a snap shot of the process as it is happening
        console.log(snapShot)
      },
      (err) => {
        //catches the errors
        onError(err)
        console.log(err)
      },
      () => {
        void getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          onSuccess({ url: url })
        })
      }
    )
  }

  const handleChange = (info) => {
    const status = info?.file?.status
    setIsUploading(status === "uploading")

    if (status === "removed" || status === "uploading") {
      setFileList(info.fileList.slice())
      return
    }

    const data = value ?? []
    if (status === "done") {
      console.log("done")
      const file = info?.file.response
      if (!uploadHost && accept === "image") {
        console.log(info?.file, "infofile")
        const res = maxCount === 1 ? [file.url] : [...data, file.url]
        setFieldValue(name, res)
      } else {
        setFileList(data)
      }
      onSuccess?.(file)
    }

    if (status === "error") {
      setFileList(data)
      if (info?.file?.error) return message.error("上傳失敗，檔案尺寸過大")
      onError?.()
    }
  }

  const handleRemove = (info) => {
    const newValue = value.filter((el) => el !== info[key].toString())
    setFieldValue(name, newValue)
  }

  // const handleBeforeUpload = async (file) => {
  //   const REGEX_CHINESE =
  //     /[\u4e00-\u9fff]|[\u3400-\u4dbf]|[\u{20000}-\u{2a6df}]|[\u{2a700}-\u{2b73f}]|[\u{2b740}-\u{2b81f}]|[\u{2b820}-\u{2ceaf}]|[\uf900-\ufaff]|[\u3300-\u33ff]|[\ufe30-\ufe4f]|[\uf900-\ufaff]|[\u{2f800}-\u{2fa1f}]/u

  //   if (!isChineseAllowed && REGEX_CHINESE.test(file?.name)) {
  //     void message.error("檔案名稱不可包含中文")
  //     return Upload.LIST_IGNORE
  //   }
  //   if (maxCount > 1 && fileList.length >= maxCount) {
  //     void message.warn(`最多上傳 ${maxCount} ${uploadItem.unit}${uploadItem.text}`)
  //     return Upload.LIST_IGNORE
  //   }
  //   if (sizeLimit && file.size > sizeLimit) {
  //     void message.error(`${uploadItem.text}大小不可超過 ${fileSizeParser(sizeLimit)}`)
  //     return Upload.LIST_IGNORE
  //   }
  //   if (maxWidth || maxHeight) {
  //     const res = await checkImageWidthAndHeight({ file, maxWidth, maxHeight })
  //     if (!res) return Upload.LIST_IGNORE
  //   }
  //   if (fileNameCount && file?.name?.length > fileNameCount) {
  //     void message.error(`檔案名稱過長，請小於 ${fileNameCount} 字`)
  //     return Upload.LIST_IGNORE
  //   }
  //   if (!uploadItem?.accept.includes(file?.type)) {
  //     if (file?.type.includes("image")) {
  //       if (!uploadItem?.accept.includes("image/*") && !uploadItem?.accept.includes(file?.type)) {
  //         void message.error(`檔案格式錯誤`)
  //         return Upload.LIST_IGNORE
  //       }
  //     } else {
  //       void message.error(`檔案格式錯誤`)
  //       return Upload.LIST_IGNORE
  //     }
  //   }
  //   if (isEmpty(file?.type)) {
  //     void message.error(`檔案格式錯誤`)
  //     return Upload.LIST_IGNORE
  //   }
  //   return true
  // }

  return (
    <>
      <Upload
        maxCount={maxCount}
        accept={uploadItem.accept}
        listType={uploadItem.listType}
        disabled={disabled || isUploading}
        {...{ fileList, onChange: handleChange }}
        // beforeUpload={handleBeforeUpload}
        {...{
          customRequest: uploadToFirebaseWithProps,
          fileList,
          onChange: handleChange,
          onRemove: handleRemove,
          onPreview: handlePreview,
        }}
      >
        {uploadItem.uploadBtn}
      </Upload>
    </>
  )
}

export default FormUpload
