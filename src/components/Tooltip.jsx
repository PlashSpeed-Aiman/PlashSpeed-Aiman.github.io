

export default function Tooltip (props){
    return (
        <div style={{top:props.y,left:props.x}} className="really-fade-in tooltip opacity-90 translate-y-2 border w-44 absolute -mx-1 mt-2 h-fit bg-orange-50 px-2 py-1 rounded-md">
            <span className="tooltiptext ">{props.text}</span>
        </div>
    )
}