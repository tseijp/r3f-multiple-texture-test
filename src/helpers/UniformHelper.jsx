import { useRef } from "react";
import { addOnBeforeCompile, group2material } from "./utils";
import { useUniformControls } from "./hooks";

export const UniformHelper = (props) => {
  /**
   * useRef instead of useEffect since it is not executed in HMR.
   */
  const ref = useRef((group) => {
    if (!group) return;
    ref.current = group;

    const mat = group2material(ref.current);
    if (!mat) return;
    if (!mat.uniforms) mat.uniforms = {};

    Object.assign(mat.uniforms, uniforms);
    addOnBeforeCompile(mat, (shader) => {
      Object.assign(shader.uniforms, uniforms);
    });
  }).current;

  const uniforms = useUniformControls(props, ref);

  return <group ref={ref} />;
};
