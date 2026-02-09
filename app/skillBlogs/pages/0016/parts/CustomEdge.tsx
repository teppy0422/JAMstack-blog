import { EdgeProps, getSmoothStepPath } from "reactflow";

const CustomEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  style = {},
  markerEnd,
  label,
}: EdgeProps) => {
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  return (
    <>
      <path
        id={id}
        style={style}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd={markerEnd}
      />
      <foreignObject
        width={160}
        height={60}
        x={labelX - 80}
        y={labelY - 30}
        style={{ overflow: "visible" }}
      >
        <div
          {...({
            xmlns: "http://www.w3.org/1999/xhtml",
          } as React.HTMLAttributes<HTMLDivElement>)}
        >
          {label}
        </div>
      </foreignObject>
    </>
  );
};

export default CustomEdge;
