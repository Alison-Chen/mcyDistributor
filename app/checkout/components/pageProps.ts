export const schema = [
  {
    type: "Input",
    properties: {
      label: "顧客名稱",
      name: "name",
      id: "name",
      placeholder: "輸入顧客名稱",
    },
  },
  {
    type: "Input",
    properties: {
      label: "統編",
      name: "taxId",
      id: "taxId",
      maxLength: 8,
      placeholder: "輸入統編",
    },
  },
  {
    type: "Input",
    properties: {
      label: "手機號碼",
      name: "cellphone",
      id: "cellphone",
      maxLength: 10,
      placeholder: "輸入手機號碼",
    },
  },
  {
    type: "Input",
    properties: {
      label: "電子信箱",
      name: "email",
      id: "email",
      className: "w-full",
    },
  },
  {
    type: "Select",
    properties: {
      label: "縣市",
      name: "city",
      id: "city",
      className: "w-full",
    },
  },
  {
    type: "Select",
    properties: {
      label: "鄉鎮市區",
      name: "county",
      id: "county",
      className: "w-full",
    },
  },
  {
    type: "Input",
    properties: {
      label: "街道門號",
      name: "address",
      id: "address",
      placeholder: "輸入街道門號",
    },
  },
  {
    type: "TextArea",
    properties: {
      label: "備註",
      name: "mark",
      id: "mark",
      placeholder: "請輸入備註",
      maxLength: 50,
    },
  },
  {
    type: "Block",
    properties: {
      className: "w-1/2",
      fields: [
        {
          type: "Button",
          properties: {
            text: "上一步",
            htmlType: "button",
            type: "outline",
            id: "steps",
            name: "steps",
            size: "middle",
            block: true,
          },
        },
        {
          type: "Button",
          properties: {
            text: "送出",
            htmlType: "submit",
            type: "primary",
            className: "w-full",
            size: "middle",
            block: true,
            danger: true,
          },
        },
      ],
    },
  },
]
