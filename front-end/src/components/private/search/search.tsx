import { useInView } from "motion/react";
import { useEffect, useRef } from "react";

const Search = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: "all", once: true });
  useEffect(() => {
    if (isInView) {
      console.log("it's on inview!");
    }
  }, [isInView]);
  return (
    <div>
      <div ref={ref}>SearchPage</div>
    </div>
  );
};

export default Search;
