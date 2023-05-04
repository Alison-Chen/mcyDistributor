import { Input, DatePicker, Radio, Select, Image, InputNumber } from "antd"
import SubmitButton from "models/components/Button"
import CustomImage from "models/components/Image"
import Repeater from "models/components/Repeater"
import Block from "models/components/Block"
import Upload from "models/components/Upload"
import NumberInput from "models/components/NumberInput"

import { withField } from "formtasy"

const whiteList = {
  Input: withField(Input),
  Radio: withField(Radio.Group),
  Button: withField(SubmitButton),
  DatePicker: withField(DatePicker),
  Select: withField(Select),
  Image: withField(CustomImage),
  Block: withField(Block),
  InputNumber: withField(InputNumber),
  TextArea: withField(Input.TextArea),
  Repeater: withField(Repeater),
  Upload: withField(Upload),
  NumberInput: withField(NumberInput),
}

export { whiteList }
