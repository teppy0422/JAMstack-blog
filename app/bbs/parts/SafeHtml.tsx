import React, { useEffect, useRef } from "react";

type Props = {
  html: string;
};

const SafeHtml: React.FC<Props> = ({ html }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const links =
      ref.current?.querySelectorAll<HTMLAnchorElement>(".external-link");
    if (links) {
      links.forEach((link) => {
        link.onclick = (e) => {
          e.preventDefault();
          window.open(link.href, "_blank");
        };
      });
    }
  }, [html]);

  return <div ref={ref} dangerouslySetInnerHTML={{ __html: html }} />;
};

export default SafeHtml;
