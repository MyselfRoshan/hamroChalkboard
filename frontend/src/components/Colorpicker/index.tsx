import { Label } from "@radix-ui/react-label"
import ColorPicker, { Color, ColorBlock } from "@rc-component/color-picker"
import Trigger from "@rc-component/trigger"
import { Input } from "components/ui/input"
import { useMemo } from "react"
import "./main.css"
import builtinPlacements from "./placement"

type ClrPickerProps = {
    color: Color
    setColor: (color: Color) => void
}

export default function ClrPicker({ color, setColor }: ClrPickerProps) {
    const prefixCls = "rc-color-picker"

    const colorFormats = useMemo(
        () => [
            {
                id: "hex",
                label: "HEX:",
                value: color.toHexString(),
                handler: (value: string) =>
                    setColor(new Color(toHexFormat(value))),
            },
            {
                id: "rgb",
                label: "RGB:",
                value: color.toRgbString(),
                handler: (value: string) =>
                    setColor(new Color(toRgbFormat(value))),
            },
            {
                id: "hsl",
                label: "HSL:",
                value: color.toHslString(),
                handler: (value: string) =>
                    setColor(new Color(toHslFormat(value))),
            },
        ],
        [color, setColor],
    )

    const colorInputs = colorFormats.map(({ id, label, value, handler }) => (
        <div key={id} className="flex items-center mb-2">
            <Label htmlFor={id}>{label}</Label>
            <Input
                id={id}
                value={value}
                onChange={e => handler(e.target.value)}
            />
        </div>
    ))
    return (
        <Trigger
            action={["click"]}
            prefixCls={prefixCls}
            popupPlacement="bottomLeft"
            builtinPlacements={builtinPlacements}
            popup={
                <ColorPicker
                    value={color}
                    onChange={setColor}
                    panelRender={panel => (
                        <>
                            {panel}
                            <div className="flex flex-col items-start p-2">
                                {colorInputs}
                            </div>
                        </>
                    )}
                />
            }
        >
            <ColorBlock color={color.toString()} prefixCls={prefixCls} />
        </Trigger>
    )
}

const toHexFormat = (value?: string) =>
    value?.replace(/[^0-9a-fA-F#]/g, "").slice(0, 9) || ""

const toHslFormat = (value?: string): string => {
    if (!value) return "hsl(0, 100%, 50%)" // Default value

    const result = /^hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)$/.exec(value)
    if (result) {
        const h = Math.min(Math.max(parseInt(result[1], 10), 0), 360)
        const s = Math.min(Math.max(parseInt(result[2], 10), 0), 100)
        const l = Math.min(Math.max(parseInt(result[3], 10), 0), 100)
        return `hsl(${h}, ${s}%, ${l}%)`
    }

    return "hsl(0, 100%, 50%)" // Default value for invalid input
}

const toRgbFormat = (value?: string): string => {
    if (!value) return "rgb(255, 255, 255)" // Default value

    const result = /^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/.exec(value)
    if (result) {
        const r = Math.min(Math.max(parseInt(result[1], 10), 0), 255)
        const g = Math.min(Math.max(parseInt(result[2], 10), 0), 255)
        const b = Math.min(Math.max(parseInt(result[3], 10), 0), 255)
        return `rgb(${r}, ${g}, ${b})`
    }

    return "rgb(255, 255, 255)" // Default value for invalid input
}
