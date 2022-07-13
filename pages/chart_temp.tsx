import type { NextPage } from "next";
import dynamic from "next/dynamic";

const SankeyChart: NextPage = () => {
  const Sankey = dynamic(() => import("../components/typing/test"));
  return <Sankey />;
};

export default SankeyChart;
