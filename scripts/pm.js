import fs from 'fs'
import buildDistFile from './build'

async function buildPlugin(pluginName) {
    global.validPlugin = (func) => func.pluginName == pluginName;
    return Promise.all([
        buildDistFile('base'),
        buildDistFile('components'),
        buildDistFile('utilities'),
        buildDistFile('tailwind'),
    ]);
}

let plugins = [
    "preflight",
    "container",
    "space",
    "divideWidth",
    "divideColor",
    "divideOpacity",
    "accessibility",
    "appearance",
    "backgroundAttachment",
    "backgroundClip",
    "backgroundColor",
    "backgroundOpacity",
    "backgroundPosition",
    "backgroundRepeat",
    "backgroundSize",
    "borderCollapse",
    "borderColor",
    "borderOpacity",
    "borderRadius",
    "borderStyle",
    "borderWidth",
    "boxSizing",
    "cursor",
    "display",
    "flexDirection",
    "flexWrap",
    "alignItems",
    "alignSelf",
    "justifyContent",
    "alignContent",
    "flex",
    "flexGrow",
    "flexShrink",
    "order",
    "float",
    "clear",
    "fontFamily",
    "fontWeight",
    "height",
    "fontSize",
    "lineHeight",
    "listStylePosition",
    "listStyleType",
    "margin",
    "maxHeight",
    "maxWidth",
    "minHeight",
    "minWidth",
    "objectFit",
    "objectPosition",
    "opacity",
    "outline",
    "overflow",
    "overscrollBehavior",
    "padding",
    "placeholderColor",
    "placeholderOpacity",
    "pointerEvents",
    "position",
    "inset",
    "resize",
    "boxShadow",
    "fill",
    "stroke",
    "strokeWidth",
    "tableLayout",
    "textAlign",
    "textColor",
    "textOpacity",
    "fontStyle",
    "textTransform",
    "textDecoration",
    "fontSmoothing",
    "letterSpacing",
    "userSelect",
    "verticalAlign",
    "visibility",
    "whitespace",
    "wordBreak",
    "width",
    "zIndex",
    "gap",
    "gridAutoFlow",
    "gridTemplateColumns",
    "gridColumn",
    "gridColumnStart",
    "gridColumnEnd",
    "gridTemplateRows",
    "gridRow",
    "gridRowStart",
    "gridRowEnd",
    "transform",
    "transformOrigin",
    "scale",
    "rotate",
    "translate",
    "skew",
    "transitionProperty",
    "transitionTimingFunction",
    "transitionDuration",
    "transitionDelay",
    "animation",
];

async function main() {

    console.info('Building PM Tailwind!')
    for (var t=0; t<plugins.length; t++) {
        let pluginName = plugins[t];
        console.info("Processing plugin " + pluginName);
        await buildPlugin(pluginName);
        var css = fs.readFileSync('./dist/tailwind.css', 'utf8');
        fs.writeFileSync(`./dist/pm_${pluginName}.css`, css);
    }
    console.log('Finished Building Tailwind!')
}


main().then(() => {
    console.log("PM Done");
});