export const schema = [
  {
    type: "Input",
    properties: {
      label: "姓名",
      name: "name",
      id: "name",
      disabled: true,
      placeholder: "輸入姓名",
    },
  },
  {
    type: "Input",
    properties: {
      label: "電話",
      name: "phone",
      id: "phone",
      placeholder: "請輸入電話號碼 ex: 02-1234567",
      type: "tel",
    },
  },
  {
    type: "Input",
    properties: {
      label: "手機號碼 ( 選填 )",
      name: "cellphone",
      id: "cellphone",
      placeholder: "輸入手機號碼",
      type: "tel",
    },
  },
  {
    type: "DatePicker",
    properties: {
      label: "生日 ( 選填 )",
      name: "birth",
      id: "birth",
      className: "w-full",
    },
  },
  {
    type: "Input",
    properties: {
      label: "公司名稱",
      name: "companyName",
      id: "companyName",
      placeholder: "輸入公司名稱",
    },
  },
  {
    type: "Input",
    properties: {
      label: "公司統編",
      name: "taxId",
      id: "taxId",
      placeholder: "輸入公司統編",
    },
  },
  {
    type: "Select",
    properties: {
      label: "公司地址",
      name: "city",
      id: "city",
      className: "w-full",
    },
  },
  {
    type: "Select",
    properties: {
      name: "county",
      id: "county",
      className: "w-full",
    },
  },
  {
    type: "Input",
    properties: {
      name: "address",
      id: "address",
      placeholder: "輸入街道門號",
    },
  },
  {
    type: "Button",
    properties: {
      text: "確認",
      htmlType: "submit",
      type: "primary",
    },
  },
]
