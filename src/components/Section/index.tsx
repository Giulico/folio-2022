import type { RootState, Dispatch } from "store";

import { connect } from "react-redux";
import { useEffect, useRef } from "react";
import { useInView } from "react-hook-inview";

const mapState = (state: RootState) => ({
  section: state.section,
});

const mapDispatch = (dispatch: Dispatch) => ({
  updateSection: dispatch.section.update,
});

type StateProps = ReturnType<typeof mapState>;
type DispatchProps = ReturnType<typeof mapDispatch>;
type Props = StateProps &
  DispatchProps & {
    children: string;
  };

function Section({ children, updateSection }: Props) {
  const isActive = useRef<boolean>(false);

  const [ref, isVisible] = useInView({
    threshold: 0.7,
  });

  useEffect(() => {
    if (isVisible && !isActive.current) {
      updateSection(children.toLowerCase());
      isActive.current = true;
    }
    if (!isVisible && isActive.current) {
      isActive.current = false;
    }
  }, [isVisible]);

  return (
    <div ref={ref} className={`section ${isVisible ? "section-visible" : ""}`}>
      <h1>{children}</h1>
    </div>
  );
}

export default connect(mapState, mapDispatch)(Section);
