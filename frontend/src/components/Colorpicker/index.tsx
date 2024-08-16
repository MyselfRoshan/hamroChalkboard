import type { Color } from "@rc-component/color-picker"
import ColorPicker, { ColorBlock } from "@rc-component/color-picker"
import Trigger from "@rc-component/trigger"
import React, { useMemo, useState } from "react"
// import "../../assets/index.less"
import "./main.css"
// import "./main.less"
import builtinPlacements from "./placement"

type ClrPickerProps = {
    color: Color | string
    setColor: (color: Color | string) => void
}
export default function ClrPicker({ color, setColor }: ClrPickerProps) {
    // const [value, setValue] = useState<Color | string>("#1677ff")
    const prefixCls = "rc-color-picker"
    const colorI = useMemo(
        () => (typeof color === "string" ? color : color.toRgbString()),
        [color],
    )
    return (
        <Trigger
            action={["click"]}
            prefixCls={prefixCls}
            popupPlacement="bottomLeft"
            builtinPlacements={builtinPlacements}
            popup={<ColorPicker value={color} onChange={setColor} />}
        >
            <ColorBlock color={color} prefixCls={prefixCls} />
        </Trigger>
    )
}
