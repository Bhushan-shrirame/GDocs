import { useRef, useState } from "react";
import { FaCaretDown } from "react-icons/fa";
import { useStorage, useMutation } from "@liveblocks/react";
import { RIGHT_MARGIN_DEFAULT, LEFT_MARGIN_DEFAULT } from "@/constants/margin";

const markers = Array.from({ length: 83 }, (_, i) => i);

export const Ruler = () => {
  const leftMargin = useStorage((root) => root.leftMargin) ?? LEFT_MARGIN_DEFAULT
  const rightMargin = useStorage((root) => root.rightMargin) ?? RIGHT_MARGIN_DEFAULT
  const setLeftMargin = useMutation(({storage},postion:number) => {
    storage.set("leftMargin" ,postion)
  },[])
  const setRightMargin = useMutation(({storage},postion:number) => {
    storage.set("rightMargin" ,postion)
  },[])
  const [isDraggingLeft , setIsDraggingLeft] = useState(false)
  const [isDraggingRight , setIsDraggingRight] = useState(false)
  const rulerRef = useRef<HTMLDivElement>(null);

  const handleLeftMouseDown = () => {
    setIsDraggingLeft(true);
  }

  const handleRightMouseDown = () => {
    setIsDraggingRight(true);
  }

  const handleMouseMove = (e:React.MouseEvent) => {
    if((isDraggingLeft || isDraggingRight) && rulerRef.current){
      const container = rulerRef.current.querySelector("#ruler-container")
      if (container) {
        const containerRect  = container.getBoundingClientRect();
        const relativeX = e.clientX - containerRect.left
        const rawPosition = Math.max(0, Math.min(816,relativeX))

        if(isDraggingLeft){
          const maxLeftPosition = 816 - rightMargin - 100;
          const newLeftPostion = Math.min(rawPosition , maxLeftPosition)
          setLeftMargin(newLeftPostion); // TODO: Make collaborative
        }
        else if(isDraggingRight){
          const maxRightPosition = 816 - (leftMargin + 100)
          const newRightPostion = Math.max(816 - rawPosition , 0)
          const constrainedRightPostion = Math.min(newRightPostion , maxRightPosition)
          setRightMargin(constrainedRightPostion);
        }
      }
    }
  }

  const handleMouseUp = () => {
    setIsDraggingLeft(false)
    setIsDraggingRight(false)
  }
  const handleLeftDoubleClick = () => {
    setLeftMargin(LEFT_MARGIN_DEFAULT);
  }
  const handleRightDoubleClick = () => {
    setRightMargin(RIGHT_MARGIN_DEFAULT);
  }

  return (
    <div 
      ref ={rulerRef}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      className="w-[816px] mx-auto h-6 border-b border-gray-300 flex items-end relative select-none print:hidden">
      <div
        id="ruler-container"
        className=" w-full h-full relative"
      >
        <Marker
          postion={leftMargin}
          isLeft={true}
          isDragging={isDraggingLeft}
          onMouseDown={handleLeftMouseDown}
          onDoubleClick={handleLeftDoubleClick}
        />
        <Marker
          postion={rightMargin}
          isLeft={false}
          isDragging={isDraggingRight}
          onMouseDown={handleRightMouseDown}
          onDoubleClick={handleRightDoubleClick}
        />
        <div className="absolute inset-x-0 bottom-0 h-full">
          <div className="relative h-full w-[816px]">
            {markers.map((marker) => {
              const position = (marker * 816) / 82;
              return (
                <div
                  key={marker}
                  className="absolute bottom-0"
                  style={{ left: `${position}px` }}
                >
                  {marker % 10 === 0 && (
                    <>
                      <div className="absolute bottom-0 w-[1px] h-2 bg-neutral-500"></div>
                      <span className="absolute bottom-2 text-[10px] text-neutral-500 transform -translate-x-1/2">
                        {marker / 10 + 1}
                      </span>
                    </>
                  )}
                  {marker % 5 === 0 && marker % 10 !== 0 && (
                    <div className="absolute bottom-0 w-[1px] h-1.5 bg-neutral-500"></div>
                  )}
                  {marker % 5 !== 0 && (
                    <div className="absolute bottom-0 w-[1px] h-1 bg-neutral-500"></div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

interface MarkerProps {
  postion: number;
  isLeft: boolean;
  isDragging: boolean;
  onMouseDown: () => void;
  onDoubleClick: () => void;
}

const Marker = ({
  postion,
  isLeft,
  isDragging,
  onMouseDown,
  onDoubleClick,
}: MarkerProps) => {
  return (
    <div
      className="absolute top-0 w-4 h-full cursor-ew-resize z-[5] group -ml-2"
      style={{ [isLeft ? "left" : "right"]: `${postion}px` }}
      onMouseDown={onMouseDown}
      onDoubleClick={onDoubleClick}
    >
      <FaCaretDown className="absolute left-1/2 top-0 h-full fill-blue-500 transform -translate-x-1/2 " />
      <div
        className="absolute left-1/2 top-4 transform -translate-x-1/2 "
        style={{
          height:"100vh",
          width: "1px",
          transform:"scaleX(0.5)",
          backgroundColor: "#3b72f6",
          display: isDragging ? "block": "none",
        }}
      ></div>
    </div>
  );
};
