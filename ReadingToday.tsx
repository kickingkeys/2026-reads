// Framer Code Component — Reading Today Sticky Note (tldraw style)
// Paste this into Framer's Code Editor (Assets → Code → New Component)

import { addPropertyControls, ControlType } from "framer"
import { useEffect, useState, useRef } from "react"
import { motion, useInView } from "framer-motion"

const ENDPOINT = "https://kickingkeys.github.io/2026-reads/today.json"

const FONT_URL =
    "https://fonts.googleapis.com/css2?family=Caveat:wght@400;500;600&display=swap"

interface Item {
    t: string
    u: string
}

interface Props {
    noteColor: string
    tilt: number
    width: number
    height: number
    url: string
    font: string
}

export default function ReadingToday(props: Props) {
    const {
        noteColor = "#FCE19C",
        tilt = -1.5,
        width = 220,
        height = 240,
        url = "https://kickingkeys.github.io/2026-reads/",
        font = "Caveat",
    } = props

    const [items, setItems] = useState<Item[]>([])
    const [loaded, setLoaded] = useState(false)
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, margin: "-60px 0px" })

    // Load handwritten font
    useEffect(() => {
        if (document.querySelector(`link[href*="Caveat"]`)) return
        const link = document.createElement("link")
        link.rel = "stylesheet"
        link.href = FONT_URL
        document.head.appendChild(link)
    }, [])

    useEffect(() => {
        fetch(ENDPOINT)
            .then((r) => r.json())
            .then((data) => {
                setItems(data.items || [])
                setLoaded(true)
            })
            .catch(() => {
                setItems([
                    { t: "Screens Within Screens", u: "#" },
                    { t: "Simulation: The Next Frontier", u: "#" },
                    { t: "SoMe: A Realistic Benchmark", u: "#" },
                ])
                setLoaded(true)
            })
    }, [])

    const visibleCount = isInView ? Math.min(3, items.length) : Math.min(2, items.length)

    const fontFamily = `'${font}', 'Caveat', cursive`

    return (
        <motion.a
            ref={ref}
            href={url}
            target="_blank"
            rel="noopener"
            style={{
                position: "relative",
                display: "flex",
                flexDirection: "column",
                width,
                height: "auto",
                padding: "22px 20px 18px",
                background: noteColor,
                borderRadius: 1,
                boxShadow: [
                    "-3px 4px 6px -2px rgba(15,23,31,0.15)",
                    "-8px 12px 20px -6px rgba(15,23,31,0.10)",
                    "0px 48px 10px -10px inset rgba(15,23,44,0.025)",
                ].join(", "),
                transform: `rotate(${tilt}deg)`,
                textDecoration: "none",
                cursor: "pointer",
                overflow: "hidden",
                fontFamily,
            }}
            whileHover={{
                scale: 1.04,
                rotate: 0,
                boxShadow: [
                    "-4px 6px 8px -2px rgba(15,23,31,0.12)",
                    "-10px 16px 28px -6px rgba(15,23,31,0.08)",
                    "0px 48px 10px -10px inset rgba(15,23,44,0.025)",
                ].join(", "),
            }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
        >
            {/* Header */}
            <div
                style={{
                    fontSize: 22,
                    fontWeight: 600,
                    color: "rgba(0,0,0,0.75)",
                    lineHeight: 1.1,
                    marginBottom: 8,
                    fontFamily,
                }}
            >
                Reading Today
            </div>

            {/* Divider — hand-drawn feel */}
            <div
                style={{
                    height: 1.5,
                    background: "rgba(0,0,0,0.12)",
                    marginBottom: 12,
                    borderRadius: 1,
                }}
            />

            {/* Items */}
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 10,
                }}
            >
                {items.slice(0, visibleCount).map((item, i) => (
                    <motion.div
                        key={item.t}
                        style={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: 8,
                        }}
                        initial={i >= 2 ? { opacity: 0, y: 8 } : false}
                        animate={
                            i >= 2 && isInView
                                ? { opacity: 1, y: 0 }
                                : undefined
                        }
                        transition={{
                            duration: 0.5,
                            delay: i >= 2 ? 0.3 : 0,
                            ease: "easeOut",
                        }}
                    >
                        <span
                            style={{
                                color: "rgba(0,0,0,0.3)",
                                fontSize: 16,
                                lineHeight: "1.3",
                                flexShrink: 0,
                                fontFamily,
                            }}
                        >
                            &bull;
                        </span>
                        <span
                            style={{
                                fontSize: 16,
                                lineHeight: 1.35,
                                color: "rgba(0,0,0,0.68)",
                                fontWeight: 400,
                                fontFamily,
                            }}
                        >
                            {item.t}
                        </span>
                    </motion.div>
                ))}
            </div>

        </motion.a>
    )
}

// --- PROPERTY CONTROLS ---

addPropertyControls(ReadingToday, {
    noteColor: {
        type: ControlType.Color,
        title: "Note Color",
        defaultValue: "#FCE19C",
    },
    tilt: {
        type: ControlType.Number,
        title: "Tilt",
        defaultValue: -1.5,
        min: -6,
        max: 6,
        step: 0.5,
        unit: "°",
    },
    font: {
        type: ControlType.String,
        title: "Font",
        defaultValue: "Caveat",
    },
    url: {
        type: ControlType.String,
        title: "Link URL",
        defaultValue: "https://kickingkeys.github.io/2026-reads/",
    },
})
